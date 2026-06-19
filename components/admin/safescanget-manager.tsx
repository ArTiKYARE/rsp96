"use client";

import { useEffect, useRef, useState } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  Play,
  RefreshCw,
  ExternalLink,
  Search,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SafeScanGetDomain, SafeScanGetScan, SafeScanGetVulnerability } from "@/lib/safescanget";

const severityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

const severityBadge: Record<string, string> = {
  critical: "bg-red-600 text-white hover:bg-red-700",
  high: "bg-orange-500 text-white hover:bg-orange-600",
  medium: "bg-yellow-500 text-white hover:bg-yellow-600",
  low: "bg-blue-500 text-white hover:bg-blue-600",
  info: "bg-slate-500 text-white hover:bg-slate-600",
};

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function SafeScanGetManager() {
  const [domains, setDomains] = useState<SafeScanGetDomain[]>([]);
  const [scans, setScans] = useState<SafeScanGetScan[]>([]);
  const [selectedScan, setSelectedScan] = useState<SafeScanGetScan | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<SafeScanGetVulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanningDomainId, setScanningDomainId] = useState<string | null>(null);
  const [pollingScanId, setPollingScanId] = useState<string | null>(null);
  const [pollingProgress, setPollingProgress] = useState(0);
  const [pollingStatus, setPollingStatus] = useState<string>("");
  const [newDomain, setNewDomain] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollStartRef = useRef<number>(0);

  const fetchData = async () => {
    setError("");
    try {
      const [domainsRes, scansRes] = await Promise.all([
        fetch("/api/safescanget/domains/"),
        fetch("/api/safescanget/scans/"),
      ]);
      const domainsData = await domainsRes.json();
      const scansData = await scansRes.json();
      if (!domainsRes.ok) throw new Error(domainsData.error || "Failed to load domains");
      if (!scansRes.ok) throw new Error(scansData.error || "Failed to load scans");
      setDomains(domainsData);
      setScans(scansData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  const updateScanInList = (scan: SafeScanGetScan) => {
    setScans((prev) => {
      const exists = prev.some((s) => s.id === scan.id);
      if (exists) {
        return prev.map((s) => (s.id === scan.id ? scan : s)).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return [scan, ...prev];
    });
    setSelectedScan((prev) => (prev?.id === scan.id ? scan : prev));
  };

  const loadReport = async (scan: SafeScanGetScan, silent = false) => {
    setSelectedScan(scan);
    if (!silent) setReportLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/safescanget/reports/${scan.id}/`);
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400 && typeof data.error === "string" && data.error.toLowerCase().includes("running")) {
          throw new Error("Отчёт ещё не готов: сканирование выполняется. Дождитесь завершения.");
        }
        throw new Error(data.error || "Failed to load report");
      }
      const vulns = data.report?.vulnerabilities || [];
      vulns.sort(
        (a: SafeScanGetVulnerability, b: SafeScanGetVulnerability) =>
          severityOrder[a.severity] - severityOrder[b.severity]
      );
      setVulnerabilities(vulns);
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : "Ошибка загрузки отчёта");
    } finally {
      if (!silent) setReportLoading(false);
    }
  };

  const pollScanStatus = async (scanId: string) => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
    pollStartRef.current = Date.now();
    setPollingScanId(scanId);
    setPollingProgress(0);
    setPollingStatus("Запуск сканирования...");

    const tick = async () => {
      try {
        const res = await fetch(`/api/safescanget/scans/${scanId}/`);
        const scan = await res.json();
        if (!res.ok) throw new Error(scan.error || "Failed to get scan status");

        updateScanInList(scan);
        setPollingProgress(scan.progress_percentage ?? 0);
        setPollingStatus(scan.current_module || scan.status);

        if (scan.status === "completed") {
          setPollingScanId(null);
          setScanningDomainId(null);
          await loadReport(scan);
          return;
        }

        if (["failed", "cancelled", "error"].includes(scan.status)) {
          setPollingScanId(null);
          setScanningDomainId(null);
          setError(`Сканирование завершилось со статусом: ${scan.status}`);
          return;
        }

        if (Date.now() - pollStartRef.current > POLL_TIMEOUT_MS) {
          setPollingScanId(null);
          setScanningDomainId(null);
          setError("Превышено время ожидания завершения сканирования.");
          return;
        }

        pollTimeoutRef.current = setTimeout(tick, POLL_INTERVAL_MS);
      } catch (err) {
        setPollingScanId(null);
        setScanningDomainId(null);
        setError(err instanceof Error ? err.message : "Ошибка при проверке статуса скана");
      }
    };

    await tick();
  };

  const startScan = async (domainId: string) => {
    setScanningDomainId(domainId);
    setError("");
    try {
      const res = await fetch("/api/safescanget/scans/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          throw new Error("Недостаточно средств на балансе SafeScanGet для запуска скана.");
        }
        throw new Error(data.error || "Failed to start scan");
      }
      updateScanInList(data);
      await pollScanStatus(data.id);
    } catch (err) {
      setScanningDomainId(null);
      setError(err instanceof Error ? err.message : "Ошибка запуска скана");
    }
  };

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/safescanget/domains/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add domain");
      setDomains((prev) => [data, ...prev]);
      setNewDomain("");
      await startScan(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка добавления домена");
    } finally {
      setAdding(false);
    }
  };

  const gradeColor = (grade?: string) => {
    if (grade === "A") return "text-green-600";
    if (grade === "B") return "text-emerald-600";
    if (grade === "C") return "text-yellow-600";
    if (grade === "D") return "text-orange-600";
    return "text-red-600";
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: "В очереди",
      running: "Выполняется",
      completed: "Завершён",
      failed: "Ошибка",
      cancelled: "Отменён",
    };
    return map[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Проверка на уязвимости
        </h1>
        <p className="text-muted-foreground mt-1">
          Интеграция с SafeScanGet — сканируйте сайты на уязвимости.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {pollingScanId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Сканирование выполняется
            </CardTitle>
            <CardDescription>{pollingStatus}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={pollingProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{pollingProgress}%</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Добавить домен</CardTitle>
          <CardDescription>Введите домен для сканирования.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addDomain} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="domain" className="sr-only">
                Домен
              </Label>
              <Input
                id="domain"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="example.com"
                disabled={adding}
              />
            </div>
            <Button type="submit" disabled={adding || !newDomain.trim()}>
              {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Добавить и сканировать
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Домены</CardTitle>
              <CardDescription>Домены в SafeScanGet</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {domains.length === 0 ? (
              <p className="text-muted-foreground text-sm">Доменов пока нет.</p>
            ) : (
              domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                >
                  <span className="font-medium">{domain.domain}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startScan(domain.id)}
                    disabled={scanningDomainId === domain.id || !!pollingScanId}
                  >
                    {scanningDomainId === domain.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Сканировать
                  </Button>
                </div>
              )))
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Сканы</CardTitle>
              <CardDescription>История сканирований</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[400px] overflow-auto">
            {scans.length === 0 ? (
              <p className="text-muted-foreground text-sm">Сканов пока нет.</p>
            ) : (
              scans.map((scan) => (
                <button
                  key={scan.id}
                  type="button"
                  onClick={() => loadReport(scan)}
                  disabled={scan.status !== "completed"}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedScan?.id === scan.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30 hover:bg-muted/50"
                  } ${scan.status !== "completed" ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{scan.domain}</span>
                    <span className={`font-bold ${gradeColor(scan.grade)}`}>{scan.grade || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{statusLabel(scan.status)}</span>
                    {scan.status === "running" && (
                      <>
                        <span>•</span>
                        <span>{scan.progress_percentage ?? 0}%</span>
                      </>
                    )}
                    <span>•</span>
                    <span>findings: {scan.total_findings}</span>
                    <span>•</span>
                    <span>score: {scan.risk_score}</span>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {selectedScan && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {selectedScan.total_findings > 0 ? (
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                )}
                Отчёт: {selectedScan.domain}
              </CardTitle>
              <CardDescription>
                {selectedScan.status === "completed"
                  ? `Найдено уязвимостей: ${selectedScan.total_findings}`
                  : "Сканирование ещё не завершено"}
              </CardDescription>
            </div>
            <a
              href={`https://safescanget.ru/reports/${selectedScan.id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              Открыть в SafeScanGet
              <ExternalLink className="h-4 w-4" />
            </a>
          </CardHeader>
          <CardContent>
            {reportLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : vulnerabilities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ShieldCheck className="h-12 w-12 mb-4 text-green-600" />
                <p>Уязвимостей не найдено.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {["critical", "high", "medium", "low", "info"].map((sev) => {
                    const count = vulnerabilities.filter((v) => v.severity === sev).length;
                    if (!count) return null;
                    return (
                      <Badge key={sev} className={severityBadge[sev]}>
                        {sev}: {count}
                      </Badge>
                    );
                  })}
                </div>

                <div className="space-y-3 max-h-[600px] overflow-auto">
                  {vulnerabilities.map((vuln) => (
                    <div key={vuln.id} className="border border-border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold">{vuln.title}</h3>
                        <Badge className={severityBadge[vuln.severity] || severityBadge.info}>
                          {vuln.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{vuln.description}</p>
                      {vuln.affected && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <span className="font-medium">Затронуто:</span> {vuln.affected}
                        </p>
                      )}
                      {vuln.evidence && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Доказательство:</span> {vuln.evidence}
                        </p>
                      )}
                      {vuln.remediation && (
                        <div className="mt-3 text-sm bg-background p-3 rounded-md border border-border">
                          <span className="font-medium flex items-center gap-1">
                            <Info className="h-4 w-4" />
                            Рекомендации:
                          </span>
                          <p className="text-muted-foreground mt-1">{vuln.remediation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import "server-only";

const API_KEY = process.env.SAFESCANGET_API_KEY;
const API_URL = process.env.SAFESCANGET_API_URL || "https://safescanget.ru/api/v1";

function getHeaders(): Record<string, string> {
  if (!API_KEY) {
    throw new Error("SAFESCANGET_API_KEY is not configured");
  }
  return {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options?.headers || {}),
    },
    // SafeScanGet redirects /foo/ -> /foo, follow redirects
    redirect: "follow",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    const err = new Error(`SafeScanGet API error ${res.status}: ${text}`);
    (err as Error & { statusCode?: number }).statusCode = res.status;
    throw err;
  }

  return res.json() as Promise<T>;
}

export interface SafeScanGetDomain {
  id: string;
  domain: string;
  organization_id: string | null;
  scan_consent_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface SafeScanGetScan {
  id: string;
  domain: string;
  scan_type: string;
  status: string;
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  info_count: number;
  grade: string;
  risk_score: number;
  current_module: string;
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface SafeScanGetReport {
  report: {
    metadata: {
      scan_id: string;
      domain: string;
      scan_date: string;
      scan_duration: string;
      scanner_version: string;
    };
    summary: {
      total_findings: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
      info: number;
      risk_score: number;
      grade: string;
    };
    vulnerabilities: SafeScanGetVulnerability[];
  };
}

export interface SafeScanGetVulnerability {
  id: string;
  title: string;
  module: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  cvss_score: number;
  affected: string;
  description: string;
  evidence: string;
  remediation: string;
}

export async function listDomains(): Promise<SafeScanGetDomain[]> {
  return fetchJson<SafeScanGetDomain[]>("/domains/");
}

export async function createDomain(domain: string): Promise<SafeScanGetDomain> {
  return fetchJson<SafeScanGetDomain>("/domains/", {
    method: "POST",
    body: JSON.stringify({ domain }),
  });
}

export async function listScans(): Promise<SafeScanGetScan[]> {
  return fetchJson<SafeScanGetScan[]>("/scans/");
}

export async function startScan(domainId: string): Promise<SafeScanGetScan> {
  return fetchJson<SafeScanGetScan>("/scans/", {
    method: "POST",
    body: JSON.stringify({
      domain_id: domainId,
      scan_type: "full",
      consent_acknowledged: true,
    }),
  });
}

export async function getScan(scanId: string): Promise<SafeScanGetScan> {
  return fetchJson<SafeScanGetScan>(`/scans/${scanId}/`);
}

export async function getReport(scanId: string): Promise<SafeScanGetReport> {
  return fetchJson<SafeScanGetReport>(`/reports/${scanId}/json`);
}

export async function getAccount() {
  return fetchJson<Record<string, unknown>>("/pro/me/");
}

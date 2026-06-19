"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Copy, Check, AlertTriangle, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { AdminPermission, AdminUser } from "@/lib/models";

const ALL_PERMISSIONS: { value: AdminPermission; label: string }[] = [
  { value: "services", label: "Услуги" },
  { value: "vacancies", label: "Вакансии" },
  { value: "gallery", label: "Галерея" },
  { value: "safescanget", label: "Проверка на уязвимости" },
];

interface SafeUser extends Omit<AdminUser, "passwordHash"> {}

export function UsersManager() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [role, setRole] = useState<"admin" | "manager">("manager");
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [createdUser, setCreatedUser] = useState<{ user: SafeUser; plainPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users/");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load users");
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const togglePermission = (permission: AdminPermission) => {
    setPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
    );
  };

  const handleCreate = async () => {
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, permissions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      setCreatedUser(data);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить пользователя?")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}/`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления");
    }
  };

  const copyCredentials = () => {
    if (!createdUser) return;
    navigator.clipboard.writeText(
      `Логин: ${createdUser.user.username}\nПароль: ${createdUser.plainPassword}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeCreatedDialog = () => {
    setCreatedUser(null);
    setDialogOpen(false);
    setPermissions([]);
    setRole("manager");
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
          <Users className="h-8 w-8 text-primary" />
          Пользователи
        </h1>
        <p className="text-muted-foreground mt-1">
          Управление доступом в админ-панель.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Список пользователей</CardTitle>
            <CardDescription>Все учётные записи админки</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" />Создать пользователя</Button>} />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Новый пользователь</DialogTitle>
                <DialogDescription>
                  Логин и пароль будут сгенерированы автоматически.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Роль</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as "admin" | "manager")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="admin">Администратор</option>
                    <option value="manager">Менеджер</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label>Доступ к разделам</Label>
                  {ALL_PERMISSIONS.map((perm) => (
                    <div key={perm.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={perm.value}
                        checked={permissions.includes(perm.value)}
                        onCheckedChange={() => togglePermission(perm.value)}
                      />
                      <Label htmlFor={perm.value} className="font-normal cursor-pointer">
                        {perm.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleCreate} disabled={creating}>
                  {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Создать
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground text-sm">Пользователей пока нет.</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.username}</span>
                      <Badge variant={user.role === "superadmin" ? "default" : "secondary"}>
                        {user.role === "superadmin" ? "Superadmin" : user.role === "admin" ? "Админ" : "Менеджер"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.permissions.map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {ALL_PERMISSIONS.find((p) => p.value === perm)?.label || perm}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Создан: {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  {user.role !== "superadmin" && (
                    <Button variant="outline" size="sm" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!createdUser} onOpenChange={(open) => !open && closeCreatedDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Пользователь создан
            </DialogTitle>
            <DialogDescription>
              Сохраните логин и пароль. Пароль больше не будет отображаться.
            </DialogDescription>
          </DialogHeader>
          {createdUser && (
            <div className="space-y-3 py-4">
              <div className="p-3 rounded-md bg-muted">
                <p className="text-sm">
                  <span className="font-medium">Логин:</span> {createdUser.user.username}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Пароль:</span> {createdUser.plainPassword}
                </p>
              </div>
              <Button variant="outline" className="w-full" onClick={copyCredentials}>
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Скопировано" : "Копировать логин и пароль"}
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeCreatedDialog}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LangSwitcher } from "@/components/LangSwitcher";
import { api, ApiError } from "@/lib/api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/admin" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate({ to: "/admin" });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) toast.error(t("login.failed"));
      else toast.error(e instanceof Error ? e.message : t("login.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="absolute right-4 top-4"><LangSwitcher /></div>
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center font-display text-2xl font-bold">
          <span className="text-gradient">Portfolio</span>
        </Link>
        <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-elevated">
          <h1 className="mb-1 text-2xl font-bold">{t("login.title")}</h1>
          {!api.hasBackend() && (
            <p className="mb-4 text-xs text-muted-foreground">
              Demo mode: any email + password <code className="rounded bg-secondary px-1">admin</code>
            </p>
          )}
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>{t("login.email")}</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("login.password")}</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
              {loading ? "..." : t("login.submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
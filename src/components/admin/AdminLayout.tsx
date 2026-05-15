import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  LayoutDashboard, Briefcase, FolderKanban, Sparkles, GraduationCap,
  Mail, Settings as SettingsIcon, LogOut, ExternalLink,
} from "lucide-react";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children?: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const items = [
    { to: "/admin", label: t("admin.dashboard"), icon: LayoutDashboard, exact: true },
    { to: "/admin/experience", label: t("admin.experience"), icon: Briefcase },
    { to: "/admin/projects", label: t("admin.projects"), icon: FolderKanban },
    { to: "/admin/skills", label: t("admin.skills"), icon: Sparkles },
    { to: "/admin/education", label: t("admin.education"), icon: GraduationCap },
    { to: "/admin/messages", label: t("admin.messages"), icon: Mail },
    { to: "/admin/settings", label: t("admin.settings"), icon: SettingsIcon },
  ];

  const isActive = (to: string, exact?: boolean) => exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 border-e border-sidebar-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-16 items-center px-6 font-display text-lg font-bold">
          <span className="text-gradient">Portfolio</span>
          <span className="ms-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-glow">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((it) => {
            const active = isActive(it.to, it.exact);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Link to="/" className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent">
            <ExternalLink className="h-3.5 w-3.5" /> View site
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
            onClick={() => { logout(); navigate({ to: "/login" }); }}
          >
            <LogOut className="h-4 w-4" /> {t("admin.logout")}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
          <div className="text-sm text-muted-foreground">
            {t("admin.welcome")}, <span className="font-medium text-foreground">{user.name}</span>
          </div>
          <LangSwitcher />
        </header>
        <main className="flex-1 p-6 md:p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
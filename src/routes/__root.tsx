import { createRootRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AUTH_TOKEN_KEY } from "@/constants";
import { AppHeader, labelFor } from "@/components/layout/app-header";

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, i18n } = useTranslation();
  const isAuthRoute = pathname.startsWith("/auth");

  useEffect(() => {
    const label = labelFor(pathname, t);
    document.title = `Azeel | ${label}`;
  }, [pathname, i18n.language, t]);

  if (isAuthRoute) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="w-[calc(100%-var(--sidebar-width))]">
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: ({ location }) => {
    // Allow auth routes without redirect
    if (location.pathname.startsWith("/auth")) return;
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw redirect({ to: "/auth/login" });
    }
  },
});

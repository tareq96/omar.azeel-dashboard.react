"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
import { useAuthLogout } from "@/services/api/generated/auth/auth";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useIsAr } from "@/lib/utils";
import type { User } from "@/types/user";

export const NavUser = () => {
  const { user: rawUser } = useAuth();

  const { isMobile } = useSidebar();
  const { signOut } = useAuth();
  const { mutateAsync: logout, isPending: isLoggingOut } = useAuthLogout();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const isRtl = useIsAr();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {
      // ignore API errors; proceed to local sign out
    } finally {
      await signOut();
      navigate({ to: "/auth/login" });
    }
  };

  if (!rawUser) {
    return null;
  }

  const user: User = {
    name: ((rawUser as any)?.name ?? "") as string,
    email: ((rawUser as any)?.email ?? "") as string,
    avatar: ((rawUser as any)?.avatar ?? (rawUser as any)?.image ?? "") as string,
  };

  const initials = (() => {
    const name = user?.name?.trim() ?? "";
    if (name) {
      const parts = name.split(/\s+/).filter(Boolean);
      const first = parts[0]?.[0] ?? "";
      const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
      return (first + last).toUpperCase() || first.toUpperCase();
    }
    const emailLocal = (user?.email ?? "").split("@")[0] ?? "";
    return emailLocal.slice(0, 2).toUpperCase() || "U";
  })();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${isRtl ? "text-right" : "text-left"}`}
              dir={i18n.dir(i18n.language)}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={user.name || user.email} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div
                className={`grid flex-1 ${isRtl ? "text-right" : "text-left"} text-sm leading-tight`}
              >
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div dir={i18n.dir(i18n.language)}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div
                  className={`flex items-center gap-2 px-1 py-1.5 ${isRtl ? "text-right" : "text-left"} text-sm`}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar || undefined} alt={user.name || user.email} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`grid flex-1 ${isRtl ? "text-right" : "text-left"} text-sm leading-tight`}
                  >
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  {t("navUser.account")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  {t("navUser.notifications")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  void handleLogout();
                }}
                disabled={isLoggingOut}
              >
                <LogOut />
                {isLoggingOut ? t("navUser.loggingOut") : t("navUser.logout")}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

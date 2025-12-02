import { NavMain } from "@/components/layout/app-sidebar/nav-main";
import { NavUser } from "@/components/layout/app-sidebar/nav-user";
import { Logo } from "@/components/layout/app-sidebar/logo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const { i18n } = useTranslation();

  const sidebarSide = i18n.dir() === "rtl" ? "right" : "left";
  return (
    <Sidebar collapsible="icon" side={sidebarSide} variant="inset">
      <SidebarHeader className="flex h-(--header-height) items-center justify-center p-1">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import { Link } from "@tanstack/react-router";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// A simplified replacement for the previous TeamSwitcher: renders the brand logo
// and links to the application homepage.
export const Logo = () => {
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const logoFullUrl = new URL("../../../../assets/images/logo-full.png", import.meta.url).href;
  const logoSmallUrl = new URL("../../../../assets/images/logo.png", import.meta.url).href;

  const handleLogoClick = () => {
    // Close the mobile sidebar when clicking on the logo
    setOpenMobile(false);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="h-auto py-2" asChild>
          <Link
            to="/"
            aria-label="Go to homepage"
            className="flex items-center"
            onClick={handleLogoClick}
          >
            <img
              src={isCollapsed ? logoSmallUrl : logoFullUrl}
              alt="Azeel"
              className={isCollapsed ? "h-8 w-8 object-contain" : "max-h-20 w-auto"}
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

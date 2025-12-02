import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { BookOpen, SquareTerminal, Home, Users, Package, CreditCard, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsAr } from "@/lib/utils";

export function NavMain() {
  const { t } = useTranslation();
  const { setOpenMobile } = useSidebar();

  const isRtl = useIsAr();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isPathActive = (currentPath: string, targetPath: string) => {
    if (!targetPath) return false;
    // Exact match for root; prefix match for non-root paths
    if (targetPath === "/") return currentPath === "/";
    return currentPath === targetPath || currentPath.startsWith(targetPath + "/");
  };

  // Choose the most specific matching sub-item (longest URL) for active state
  const getActiveSubUrl = (
    currentPath: string,
    subItems: { title: string; url: string }[] = [],
  ): string | undefined => {
    const matches = subItems.filter((s) => isPathActive(currentPath, s.url));
    if (matches.length === 0) return undefined;
    // Prefer the longest matching URL to avoid highlighting parent when a child matches
    return matches.sort((a, b) => b.url.length - a.url.length)[0]?.url;
  };

  const handleLinkClick = () => {
    // Close the mobile sidebar when clicking on any link
    setOpenMobile(false);
  };

  const items = [
    {
      title: t("sidebar.general.title"),
      url: "/#",
      icon: Home,
      isActive: true,
      items: [{ title: t("sidebar.general.items.dashboard"), url: "/" }],
    },
    {
      title: t("sidebar.operations.title"),
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: t("sidebar.operations.items.orders"), url: "/orders" },
        { title: t("sidebar.operations.items.trips"), url: "/trips" },
        { title: t("sidebar.operations.items.items"), url: "/items" },
        { title: t("sidebar.operations.items.lockers"), url: "/lockers" },
        {
          title: t("sidebar.operations.items.lockersGeolocation"),
          url: "/lockers/map",
        },
      ],
    },
    {
      title: t("sidebar.userManagement.title"),
      url: "#",
      icon: Users,
      items: [
        { title: t("sidebar.userManagement.items.adminUsers"), url: "/users" },
        {
          title: t("sidebar.userManagement.items.customers"),
          url: "/customers",
        },
        {
          title: t("sidebar.userManagement.items.drivers"),
          url: "/drivers",
        },
        {
          title: t("sidebar.userManagement.items.memberships"),
          url: "/memberships",
        },
        { title: t("sidebar.userManagement.items.tickets"), url: "/tickets" },
        {
          title: t("sidebar.userManagement.items.addTicket"),
          url: "/tickets/create",
        },
      ],
    },
    {
      title: t("sidebar.information.title"),
      url: "#",
      icon: BookOpen,
      items: [
        { title: t("sidebar.information.items.addresses"), url: "/addresses" },
        { title: t("sidebar.information.items.sms"), url: "/messages" },
      ],
    },
    {
      title: t("sidebar.packaging.title"),
      url: "#",
      icon: Package,
      items: [{ title: t("sidebar.packaging.items.bundles"), url: "/bundles" }],
    },
    {
      title: t("sidebar.payment.title"),
      url: "#",
      icon: CreditCard,
      items: [
        { title: t("sidebar.payment.items.topups"), url: "/topups" },
        { title: t("sidebar.payment.items.promos"), url: "/promos" },
        { title: t("sidebar.payment.items.credits"), url: "/credits" },
        { title: t("sidebar.payment.items.creditCards"), url: "/credits-cards" },
      ],
    },
    {
      title: t("sidebar.accounting.title"),
      url: "#",
      icon: FileText,
      items: [{ title: t("sidebar.accounting.items.invoices"), url: "/invoices" }],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const activeSubUrl = getActiveSubUrl(pathname, item.items ?? []);
          const groupIsActive = Boolean(activeSubUrl);
          const collapsibleProps = groupIsActive ? { open: true } : { defaultOpen: item.isActive };
          return (
            <Collapsible
              key={item.title}
              asChild
              {...collapsibleProps}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={groupIsActive}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${isRtl ? "scale-x-[-1]" : ""}`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={subItem.url === activeSubUrl}>
                          <Link to={subItem.url} onClick={handleLinkClick}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

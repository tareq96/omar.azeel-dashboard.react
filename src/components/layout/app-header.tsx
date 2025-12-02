import { Link } from "@tanstack/react-router";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { cn, useIsAr } from "@/lib/utils";
import { useUsersShowCustomer } from "@/services/api/generated/users/users";
import ThemeToggle from "@/components/layout/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

function titleCase(str: string) {
  return str
    .split(/[-_\s]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export const LABEL_KEYS_BY_PATH: Record<string, string> = {
  "/": "header.dashboard",
  "/users": "header.adminUsers",
  "/customers": "header.customers",
  "/drivers": "header.drivers",
  "/memberships": "header.memberships",
  "/tickets": "header.tickets",
  "/tickets/create": "header.createTicket",
  "/auth": "header.auth",
  "/auth/login": "header.login",
  "/addresses": "header.addresses",
  "/messages": "header.messages",
  "/bundles": "header.bundles",
  "/topups": "header.topups",
  "/promos": "header.promos",
  "/credits": "header.credits",
  "/credits-cards": "header.creditCards",
  "/trips": "header.trips",
  "/invoices": "header.invoices",
  "/items": "header.items",
  "/lockers": "header.lockers",
  "/lockers/map": "lockers.map.title",
};

export function labelFor(path: string, t: (key: string, opts?: any) => string) {
  const key = LABEL_KEYS_BY_PATH[path];
  if (key) return t(key);
  const last = path.split("/").filter(Boolean).pop() || "home";
  return t(`header.fallback.${last}`, { defaultValue: titleCase(last) });
}

function CustomerCrumbLabel({ path, fallback }: { path: string; fallback: string }) {
  const match = path.match(/^\/customers\/(\d+)$/);
  const customerId = match ? Number(match[1]) : undefined;

  if (!customerId) return <>{fallback}</>;

  const { data, isLoading } = useUsersShowCustomer(customerId);
  const name = data?.data?.name;

  if (isLoading || !name) {
    return <>{fallback}</>;
  }

  return <>{name}</>;
}

export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { i18n, t } = useTranslation();
  const isRtl = useIsAr();
  const { setOpenMobile } = useSidebar();

  const segments = pathname.split("/").filter(Boolean);
  const crumbPaths = segments.map((_, idx) => "/" + segments.slice(0, idx + 1).join("/"));

  const allCrumbs = ["/", ...crumbPaths];

  const handleLinkClick = () => {
    // Close the mobile sidebar when clicking on any link
    setOpenMobile(false);
  };

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      dir={i18n.dir(i18n.language)}
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {allCrumbs.map((to, idx) => {
              const isLast = idx === allCrumbs.length - 1;
              const label = labelFor(to, t);
              const isCustomerDetail = /^\/customers\/\d+$/.test(to);
              return (
                <Fragment key={`crumb-${to}`}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>
                        {isCustomerDetail ? (
                          <CustomerCrumbLabel path={to} fallback={label} />
                        ) : (
                          label
                        )}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={to} onClick={handleLinkClick}>
                          {label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast ? (
                    <BreadcrumbSeparator className={cn(isRtl && "[&>svg]:rotate-180")} />
                  ) : null}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2 px-4">
        <ThemeToggle />
        {/* <LanguageSwitcher showName={false} /> */}
      </div>
    </header>
  );
}

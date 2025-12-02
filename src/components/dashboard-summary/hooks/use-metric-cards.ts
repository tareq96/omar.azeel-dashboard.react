import { useMemo } from "react";
import { DASHBOARD_TOTAL_CARDS } from "@/components/dashboard-summary/constants/constants";
import {
  Box,
  Users,
  Inbox,
  Send,
  Truck,
  Utensils,
  AlertTriangle,
  Wallet,
  CreditCard,
  Coins,
} from "lucide-react";

export function useMetricCards(operations: any, finance: any, t: any) {
  return useMemo(() => {
    const orders = (operations?.counts?.orders ?? {}) as Record<string, number>;

    return [
      {
        label: t("dashboard.summary.cards.activeLockers"),
        value: operations?.counts?.activeLockers,
        icon: Box,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        label: t("dashboard.summary.cards.activeRecurringCustomers"),
        value: operations?.counts?.activeRecurringCustomers,
        icon: Users,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      {
        label: t("dashboard.summary.cards.orders.received"),
        value: orders?.Received,
        icon: Inbox,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
      },
      {
        label: t("dashboard.summary.cards.orders.submitted"),
        value: orders?.Submitted,
        icon: Send,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
      },
      {
        label: t("dashboard.summary.cards.orders.dispatched"),
        value: orders?.Dispatched,
        icon: Truck,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        label: t("dashboard.summary.cards.orders.inKitchen"),
        value: orders?.InKitchen,
        icon: Utensils,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
      {
        label: t("dashboard.summary.cards.orders.fake"),
        value: orders?.Fake,
        icon: AlertTriangle,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
      {
        label: t("dashboard.summary.cards.totals.topup"),
        value: finance?.totals?.Topup,
        icon: Wallet,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      },
      {
        label: t("dashboard.summary.cards.totals.creditCard"),
        value: finance?.totals?.Credit_Card,
        icon: CreditCard,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
      },
      {
        label: t("dashboard.summary.cards.totals.credit"),
        value: finance?.totals?.Credit,
        icon: Coins,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
      },
    ].slice(0, DASHBOARD_TOTAL_CARDS);
  }, [operations, finance, t]);
}

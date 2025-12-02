import { createFileRoute } from "@tanstack/react-router";
import { DashboardSummary } from "@/components/dashboard-summary";

export const Route = createFileRoute("/")({
  component: DashboardSummary,
});

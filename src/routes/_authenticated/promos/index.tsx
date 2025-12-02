import { createFileRoute } from "@tanstack/react-router";
import PromosList from "@/components/promos-list";

export const Route = createFileRoute("/_authenticated/promos/")({
  component: PromosList,
});

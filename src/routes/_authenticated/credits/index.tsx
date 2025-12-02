import { createFileRoute } from "@tanstack/react-router";
import CreditsList from "@/components/credits-list";

export const Route = createFileRoute("/_authenticated/credits/")({
  component: CreditsList,
});

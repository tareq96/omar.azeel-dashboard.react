import { createFileRoute } from "@tanstack/react-router";
import CreditsCardsList from "@/components/credits-cards-list";

export const Route = createFileRoute("/_authenticated/credits-cards/")({
  component: CreditsCardsList,
});

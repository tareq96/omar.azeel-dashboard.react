import { createFileRoute } from "@tanstack/react-router";
import TripsList from "@/components/trips-list";

export const Route = createFileRoute("/_authenticated/trips/")({
  component: TripsList,
});

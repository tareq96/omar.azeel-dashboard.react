import { createFileRoute } from "@tanstack/react-router";
import TopupsList from "@/components/topups-list";

export const Route = createFileRoute("/_authenticated/topups/")({
  component: TopupsList,
});

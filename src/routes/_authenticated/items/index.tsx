import { createFileRoute } from "@tanstack/react-router";
import ItemsList from "@/components/items-list";

export const Route = createFileRoute("/_authenticated/items/")({
  component: ItemsList,
});

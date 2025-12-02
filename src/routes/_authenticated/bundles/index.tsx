import { createFileRoute } from "@tanstack/react-router";
import BundlesList from "@/components/bundles-list";

export const Route = createFileRoute("/_authenticated/bundles/")({
  component: BundlesList,
});

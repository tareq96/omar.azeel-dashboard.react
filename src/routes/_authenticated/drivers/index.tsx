import { createFileRoute } from "@tanstack/react-router";
import DriversList from "@/components/drivers-list";

export const Route = createFileRoute("/_authenticated/drivers/")({
  component: DriversList,
});

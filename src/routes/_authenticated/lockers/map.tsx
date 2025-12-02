import { createFileRoute } from "@tanstack/react-router";
import LockersMap from "@/components/lockers-map";

export const Route = createFileRoute("/_authenticated/lockers/map")({
  component: LockersMap,
});

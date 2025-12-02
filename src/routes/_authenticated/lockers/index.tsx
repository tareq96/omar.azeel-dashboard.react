import { createFileRoute } from "@tanstack/react-router";
import LockersList from "@/components/lockers-list";

export const Route = createFileRoute("/_authenticated/lockers/")({
  component: LockersList,
});

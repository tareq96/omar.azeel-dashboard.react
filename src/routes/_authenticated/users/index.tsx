import { createFileRoute } from "@tanstack/react-router";
import UsersList from "@/components/users-list";

export const Route = createFileRoute("/_authenticated/users/")({
  component: UsersList,
});

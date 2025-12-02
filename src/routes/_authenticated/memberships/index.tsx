import { createFileRoute } from "@tanstack/react-router";
import MembershipsList from "@/components/memberships-list";

export const Route = createFileRoute("/memberships/" as any)({
  component: MembershipsList,
});

import { createFileRoute } from "@tanstack/react-router";
import MessagesList from "@/components/messages-list";

export const Route = createFileRoute("/_authenticated/messages/")({
  component: MessagesList,
});

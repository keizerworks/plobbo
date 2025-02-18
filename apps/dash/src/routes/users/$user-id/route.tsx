import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$user-id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/users/$user-id"!</div>;
}

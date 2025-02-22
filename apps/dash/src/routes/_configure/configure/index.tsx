import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_configure/configure/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/configure/"!</div>;
}

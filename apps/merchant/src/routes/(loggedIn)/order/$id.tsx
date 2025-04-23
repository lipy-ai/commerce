import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/order/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(loggedIn)/products/"!</div>;
}

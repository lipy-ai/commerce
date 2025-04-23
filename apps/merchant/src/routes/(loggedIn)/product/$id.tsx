import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/product/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(loggedIn)/products/"!</div>;
}

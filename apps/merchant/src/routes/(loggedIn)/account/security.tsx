import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(loggedIn)/account/security"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>security</div>;
}

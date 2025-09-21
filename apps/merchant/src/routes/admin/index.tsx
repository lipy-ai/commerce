import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
  loader: () => {
    throw redirect({ to: "/admin/store" });
  },
});

function RouteComponent() {
  return null;
}

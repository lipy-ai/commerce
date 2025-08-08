import { useAuthSession } from "@lipy/lib/hooks/use-auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardNav } from "@/components/nav.dashboard";

export const Route = createFileRoute("/pos")({
  component: Component,
});

function Component() {
  const { isPending: authPending, view } = useAuthSession();

  if (authPending) return null;
  if (view !== "full") return <Outlet />;
  return <DashboardNav />;
}

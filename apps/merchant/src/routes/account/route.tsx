import { DashboardNav } from "@/components/nav.dashboard";
import { useAuthSession } from "@lipy/lib/hooks/use-auth";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: Component,
});

function Component() {
  const { isPending: authPending, view } = useAuthSession();

  if (authPending) return null;
  if (view !== "full") return <Outlet />;
  return <DashboardNav />;
}

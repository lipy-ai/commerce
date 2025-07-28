import { DashboardNav } from "@/components/nav.dashboard";
import { useStore } from "@lipy/lib/hooks/use-store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)")({
  component: Component,
});

function Component() {
  const { isPending } = useStore();
  if (isPending) return null;
  return <DashboardNav />;
}

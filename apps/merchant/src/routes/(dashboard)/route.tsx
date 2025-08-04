import { useAuthSession } from "@lipy/lib/hooks/use-auth";
import { useStore } from "@lipy/lib/hooks/use-store";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { DashboardNav } from "@/components/nav.dashboard";

export const Route = createFileRoute("/(dashboard)")({
  component: Component,
});

function Component() {
  const { isPending: authPending, view } = useAuthSession();
  const { isPending } = useStore();
  const navigate = Route.useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (view === "staff") {
      navigate({ to: "/pos" });
    }
  }, [view]);

  if (isPending || authPending || view !== "full") return null;
  return <DashboardNav />;
}

import { env } from "@envClient";
import Loading from "@lipy/web-ui/components/ui/loading";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/(default)/seller")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  useEffect(() => {
    navigate({ href: env.MERCHANT_URL, replace: true });
  });

  return <Loading />;
}

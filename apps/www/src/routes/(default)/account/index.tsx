import Loading from "@lipy/web-ui/components/ui/loading";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { AccountNav } from "./-nav";

export const Route = createFileRoute("/(default)/account/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isMobile } = useViewport();

  const navigate = Route.useNavigate();

  useLayoutEffect(() => {
    !isMobile && navigate({ to: "/account/profile" });
  }, [isMobile, navigate]);

  if (!isMobile) {
    return <Loading />;
  }
  return <AccountNav />;
}

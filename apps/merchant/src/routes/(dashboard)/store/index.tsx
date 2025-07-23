import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import Loading from "@lipy/web-ui/components/ui/loading";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { StoreNav } from "./-nav";

export const Route = createFileRoute("/(dashboard)/store/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isMobile } = useViewport();
  const navigate = Route.useNavigate();

  useLayoutEffect(() => {
    !isMobile && navigate({ to: "/store/general" });
  }, [isMobile, navigate]);

  if (!isMobile) {
    return <Loading />;
  }

  return (
    <>
      <DashboardHeader title="My Store" />
      <StoreNav />
    </>
  );
}

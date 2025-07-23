import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { StoreNav } from "./-nav";

export const Route = createFileRoute("/(dashboard)/store/taxes")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardHeader title="Store Taxes" />
      <StoreNav>
        <div>Taxes</div>
      </StoreNav>
    </>
  );
}

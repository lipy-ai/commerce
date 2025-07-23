import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { StoreNav } from "./-nav";

export const Route = createFileRoute("/(dashboard)/store/discounts")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardHeader title="Store Discounts" />
      <StoreNav>
        <div>Discounts</div>
      </StoreNav>
    </>
  );
}

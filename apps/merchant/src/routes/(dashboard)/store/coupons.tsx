import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Alert, AlertTitle } from "@lipy/web-ui/components/ui/alert";
import { Label } from "@lipy/web-ui/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import { StoreNav } from "./-nav";
export const Route = createFileRoute("/(dashboard)/store/coupons")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardHeader title="Store Policies" />
      <StoreNav>
        <div className="space-y-4 max-w-4xl">
          <Label className="text-lg">Coupons</Label>
          <Alert>
            <Terminal />
            <AlertTitle>Coming Soon...</AlertTitle>
          </Alert>
        </div>
      </StoreNav>
    </>
  );
}

import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Alert, AlertTitle } from "@lipy/web-ui/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
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
        <Card className="flex-1 lg:m-8 max-w-5xl">
          <CardHeader>
            <CardTitle>Coupons</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 max-w-2xl">
            <Alert>
              <Terminal />
              <AlertTitle>Coming Soon...</AlertTitle>
            </Alert>
          </CardContent>
        </Card>
      </StoreNav>
    </>
  );
}

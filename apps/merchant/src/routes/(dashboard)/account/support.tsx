import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Alert, AlertTitle } from "@lipy/web-ui/components/ui/alert";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import { AccountNav } from "./-nav";
export const Route = createFileRoute("/(dashboard)/account/support")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardHeader title="Customer Support" />
      <AccountNav>
        <Card className="flex-1 p-8">
          <CardContent className="flex-1 max-w-2xl">
            <Alert>
              <Terminal />
              <AlertTitle>Coming Soon...</AlertTitle>
            </Alert>
          </CardContent>
        </Card>
      </AccountNav>
    </>
  );
}

import { merchantCustomerApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardAction, CardContent } from "@lipy/web-ui/components/ui/card";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { PenLine, Trash } from "lucide-react";
import DeleteCustomer from "./-delete";
import { CustomerForm } from "./-form";
export const Route = createFileRoute("/(dashboard)/customer/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { q, page } = Route.useSearch();
  const isMobile = useViewport();
  const { id } = Route.useParams();

  const { data, isLoading } = useAPIQuery(
    merchantCustomerApi[":id"],
    "$get",
    {
      param: { id: id },
    },
    {}
  );

  return (
    <>
      <DashboardHeader title="Customer Details" />
      {isLoading ? (
        <Skeleton className="m-4 max-w-5xl" />
      ) : !data ? null : (
        <Card className="m-4 max-w-5xl">
          <CardContent className="space-y-8">
            <CardAction className={cn("flex gap-2")}>
              <DeleteCustomer>
                <Button variant={"outline"} size={"sm"}>
                  <Trash /> {!isMobile && "Delete"}
                </Button>
              </DeleteCustomer>
              <CustomerForm type="create">
                <Button className="" size={"sm"} variant={"outline"}>
                  <PenLine /> {!isMobile && "Edit"}
                </Button>
              </CustomerForm>
            </CardAction>
            <div>
              <div className="relative">
                <img
                  src={data?.image || ""}
                  alt={"Untitled"}
                  className="size-24 aspect-square object-cover bg-accent border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-[120px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
              <Label>Name</Label>
              <p>{data?.name}</p>
              <Label>Email</Label>
              <p>{data?.email}</p>
              <Label>Phone</Label>
              <p>{data?.phoneNumber}</p>
              <Label>Address</Label>
              <p>{data?.address || "-"}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

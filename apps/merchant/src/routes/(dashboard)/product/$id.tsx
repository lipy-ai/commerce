import { merchantProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import ZoomImg from "@lipy/web-ui/components/veiwers/zoomableImage";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";

export const Route = createFileRoute("/(dashboard)/product/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  // FIXME : no any type
  const { id }: any = Route.useParams();

  const { data, isLoading } = useAPIQuery(merchantProductApi[":id"], "$get", {
    param: { id },
  });
  const { isMobile } = useViewport();

  const variants = (
    <Card className="">
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.variants?.map((m, i) => (
          <div key={i} className="flex justify-between border p-4">
            <p>{m.unit}</p>
            <p>{formatAmount("inr", m?.price as number)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  console.log(data);
  return (
    <>
      {isLoading ? (
        <Skeleton className="flex-1 m-8" />
      ) : (
        <>
          <DashboardHeader title={data?.title || ""} />
          <div className="grid lg:grid-cols-3 lg:p-8  lg:gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4 lg:space-y-6">
                <Card className="">
                  <CardHeader className="flex items-center justify-between">
                    <h1 className="text-base font-bold">Product Details</h1>
                    {data?.store && (
                      <Badge className="ml-2" variant="warning">
                        Customized
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-4 md:grid-cols-9 gap-4 overflow-x-auto ">
                      {data?.images
                        ? data.images?.map((src, i) => (
                            <div key={i} className="aspect-square">
                              <ZoomImg src={src} />
                            </div>
                          ))
                        : null}
                    </div>

                    <div className="flex-1">
                      <p className="text-lg">{data?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {data?.category.title}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {data?.summary}
                    </p>
                  </CardContent>
                </Card>
                {isMobile && variants}

                <Card>
                  <CardHeader>
                    <CardTitle>Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data?.highlights && (
                      <div className="grid grid-cols-[120px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
                        {data?.highlights.map((d, i) => (
                          <Fragment key={i}>
                            <Label>{d.name}</Label>
                            <p className="break-words overflow-hidden text-ellipsis max-w-full">
                              {d.value}
                            </p>
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>More Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data?.information && (
                      <div className="grid grid-cols-[120px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
                        {data?.information.map((d, i) => (
                          <Fragment key={i}>
                            <Label>{d.name}</Label>
                            <p className="break-words overflow-hidden text-ellipsis max-w-full">
                              {d.value}
                            </p>
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            {!isMobile && variants}
          </div>
        </>
      )}
    </>
  );
}

import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";

import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";

import { merchantProductApi } from "@lipy/lib/api";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, PenLine } from "lucide-react";
import { Fragment } from "react";
import FormEdit from "./-form.edit";
import ProductVariationForm from "./-variation";

export const Route = createFileRoute("/(dashboard)/product/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  // FIXME : no any type
  const { id }: any = Route.useParams();

  const { data, isLoading } = useAPIQuery(merchantProductApi[":id"], "$get", {
    param: { id },
  });

  const mrp = data?.maxPrice || 0;
  const sp = data?.price || 0;
  const { isMobile } = useViewport();

  const variants = (
    <Card className="">
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProductVariationForm data={{ productId: data?.id! }} />

        {data?.variants?.map((m, i) => (
          <ProductVariationForm data={m} key={i} />
        ))}
      </CardContent>
    </Card>
  );

  return (
    <>
      {isLoading ? (
        <Skeleton className="flex-1 m-8" />
      ) : (
        <>
          <DashboardHeader title={data?.title || ""} />
          <div className="grid lg:grid-cols-3 p-4 lg:p-8 gap-4 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <Card className="">
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardAction className={cn("flex gap-2")}>
                      {!isMobile && (
                        <Button
                          // onClick={() => setOpen("general")}
                          variant={"outline"}
                          size={"sm"}
                        >
                          <Eye /> {!isMobile && "Preview"}
                        </Button>
                      )}

                      {/* <Button
							onClick={() => setOpen("delete")}
							variant={"outline"}
							size={"sm"}
							disabled={pending}
						>
							<Trash /> {!isMobile && (pending ? "Deleting" : "Delete")}
						</Button> */}
                      <FormEdit type="update" data={data}>
                        <Button variant={"outline"} size={"sm"}>
                          <PenLine /> {!isMobile && "Edit"}
                        </Button>
                      </FormEdit>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* <ZoomImg
												images={data?.images || []}
											
											>	<div className="relative w-fit">
														<img
															src={data?.thumbnail || ""}
															alt={data?.title || "Thumbnail"}
															className="size-full lg:size-24 aspect-square object-cover bg-accent border rounded"
														/>
														{(data?.images?.length || 0) > 0 && (
															<Badge
																variant={"outline"}
																className="absolute -top-1 -right-1"
															>
																{data?.images?.length}+
															</Badge>
														)}
													</div>
												</ZoomImg> */}

                      <div className="flex-1">
                        <p className="text-lg">{data?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {data?.category.title}
                        </p>

                        {/* <p className="text-sm text-muted-foreground">{data.summary}</p> */}
                      </div>
                      <div>
                        <Badge variant={"success"}>
                          {formatAmount("inr", mrp - sp)} Off
                        </Badge>
                        <p className="text-2xl font-medium">
                          {formatAmount("inr", sp)}{" "}
                          <span className="line-through text-muted-foreground text-base">
                            {formatAmount("inr", mrp)}
                          </span>
                        </p>
                      </div>
                    </div>
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
                            <Label>{d.label}</Label>
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
                            <Label>{d.label}</Label>
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

import { publicShopApi } from "@lipy/lib/api";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Info } from "lucide-react";
import z from "zod";

export const getStore = createServerFn({ method: "GET" })
  .validator((d) =>
    z.object({ sid: z.uuid({ version: "v4", error: "Invalid sid!" }) }).parse(d)
  )
  .handler(async ({ data }) => {
    const res = await publicShopApi.id[":id"]
      ["$get"]({ param: { id: data.sid } })
      .then(async (r) => await r.json());

    if (res) {
      throw redirect({ to: "/$storeHandle", params: { storeHandle: res } });
    }

    return res || null;
  });

export const Route = createFileRoute("/(default)/share")({
  component: RouteComponent,
  loader: async ({ location }) => {
    await getStore({ data: location.search });
  },
  validateSearch: (s) =>
    z
      .object({
        sid: z.uuid({ version: "v4", error: "Invalid sid!" }),
      })
      .parse(s),
});

function RouteComponent() {
  return (
    <div className="h-screen flex flex-1">
      <Card className="max-w-sm m-auto flex-1">
        <CardHeader className="text-center">
          <Info className="size-16 m-auto" />
          <CardTitle>No Shops Found...</CardTitle>
          <CardDescription>Your link might be expired.</CardDescription>
        </CardHeader>

        <CardFooter>
          <Link
            to={"/"}
            className={cn(
              buttonVariants({ size: "lg", variant: "default" }),
              "w-full"
            )}
          >
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

import { loggedInSessionApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import Loading from "@lipy/web-ui/components/ui/loading";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/(auth)/refresh")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useAPIQuery(loggedInSessionApi.clear, "$post", {});

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <Loading />;
}

import { apiClient } from "@repo/lib/api/index.js";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const authFn = createServerFn({ method: "GET" }).handler(async () => {
  const data = await apiClient.v1.address.$get().then(async (r) => {
    return await r.json();
  });

  return data;
});

export const Route = createFileRoute("/demo/ssr")({
  component: RouteComponent,
  loader: async () => {
    const result = await authFn();
    return result;
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <div>
      Hello "/demo/ssr"!
      <pre className="whitespace-pre-wrap">
        {JSON.stringify({ data }, null, 2)}
      </pre>
    </div>
  );
}

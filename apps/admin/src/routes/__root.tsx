import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ViewportProvider } from "@lipy/web-ui/contexts/viewport";
import { NuqsAdapter } from "nuqs/adapters/react";

export const Route = createRootRoute({
  component: () => (
    <>
      <ViewportProvider>
        <NuqsAdapter>
          <Outlet />
        </NuqsAdapter>
      </ViewportProvider>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});

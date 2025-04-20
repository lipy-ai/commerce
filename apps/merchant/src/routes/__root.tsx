import { Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ViewportProvider } from "@web-ui/contexts/viewport";
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

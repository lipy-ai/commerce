import { Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ViewportProvider } from "@web-ui/contexts/viewport";
import { NuqsAdapter } from "nuqs/adapters/react";
import QueryProvider from "@repo-lib/providers/queryProvider";
import { toast, Toaster } from "@web-ui/components/ui/sonner";
import { useCallback } from "react";

export const Route = createRootRoute({
  component: () => {
    const handleThrowOnError = useCallback((error: Error) => {
      toast.error(error?.message || "Something went wrong!");
      return false;
    }, []);

    return (
      <>
        <QueryProvider handleThrowOnError={handleThrowOnError}>
          <ViewportProvider>
            <NuqsAdapter>
              <Outlet />
            </NuqsAdapter>
          </ViewportProvider>
          <Toaster />
        </QueryProvider>
        {/* <TanStackRouterDevtools /> */}
      </>
    );
  },
});

import { env } from "@envClient";
import { useAuthSession } from "@lipy/lib/hooks/use-auth";
import useGlobalVibration from "@lipy/lib/hooks/use-vibrate";
import QueryProvider from "@lipy/lib/providers/queryProvider";
import { getIsSsrMobile } from "@lipy/lib/utils/isServerMobile";
import Loading from "@lipy/web-ui/components/ui/loading";
import { Toaster, toast } from "@lipy/web-ui/components/ui/sonner";
import { ViewportProvider } from "@lipy/web-ui/contexts/viewport";
import appCss from "@lipy/web-ui/styles.css?url";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getHeader } from "@tanstack/react-start/server";
import { NuqsAdapter } from "nuqs/adapters/react";
import * as React from "react";
// import EventsProvider from "@/events";
import { DefaultCatchBoundary, NotFound } from "@/router";
import { seo } from "@/utils/seo";

export const globalInit = createServerFn({ method: "GET" }).handler(
  async () => {
    const userAgent = getHeader("User-Agent");

    const isSsrMobile = getIsSsrMobile(userAgent);
    return { isSsrMobile, userAgent };
  }
);

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },

      ...seo({
        title: "Lipy Partners",
        description:
          "Lipy Partners is a quick commerce platform designed to empower local businesses by connecting them directly with nearby customers. Sell faster, grow smarter, and stay local.",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://unpkg.com/@bprogress/core/dist/index.css",
      },
      { rel: "stylesheet", href: appCss },

      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/icons/apple-touch-icon.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  loader: async () => {
    const data = await globalInit();
    return data;
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const handleThrowOnError = React.useCallback((error: Error) => {
    console.log("jot");
    toast.error(error?.message || "Something went wrong!");
    return false;
  }, []);

  const { isPending } = useAuthSession();
  useGlobalVibration();

  const data = Route.useLoaderData();
  return (
    <html className="not-print:bg-muted/30" lang="en">
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body
        suppressHydrationWarning
        className="m-auto outline-1 outline-border shadow min-h-screen flex flex-col"
      >
        <ViewportProvider isMobile={data.isSsrMobile}>
          <QueryProvider handleThrowOnError={handleThrowOnError}>
            <NuqsAdapter>
              {/* <EventsProvider /> */}

              {isPending ? <Loading /> : children}
            </NuqsAdapter>
            <Toaster />
          </QueryProvider>
          {env.SHOW_DEV_TOOLS && (
            <TanStackRouterDevtools position="bottom-right" />
          )}
          <Scripts />
        </ViewportProvider>
      </body>
    </html>
  );
}

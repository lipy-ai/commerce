import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import appCss from "@lipy/web-ui/styles.css?url";
import { toast, Toaster } from "@lipy/web-ui/components/ui/sonner";
import { DefaultCatchBoundary, NotFound } from "@/router";
import { ViewportProvider } from "@lipy/web-ui/contexts/viewport";
import QueryProvider from "@lipy/lib/providers/queryProvider";
import { NuqsAdapter } from "nuqs/adapters/react";
import { seo } from "@/utils/seo";
import { getHeader } from "@tanstack/react-start/server";
import { getIsSsrMobile } from "@lipy/lib/utils/isServerMobile";
import { createServerFn } from "@tanstack/react-start";

export const isMobile = createServerFn({ method: "GET" }).handler(async () => {
  const userAgent = getHeader("User-Agent");

  const isSsrMobile = getIsSsrMobile(userAgent);
  return { isSsrMobile };
});

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
        title: "Lipy Commerce",
        description: `Lipy Commerce is a quick commerce platform designed to empower local businesses by connecting them directly with nearby customers. Sell faster, grow smarter, and stay local.`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },

      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/favicon/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon/favicon-16x16.png",
      },
      { rel: "manifest", href: "/favicon/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon/favicon.ico" },
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
    return await isMobile();
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
    toast.error(error?.message || "Something went wrong!");
    return false;
  }, []);

  const { isSsrMobile } = Route.useLoaderData();

  return (
    <html className="bg-muted/30">
      <head>
        <HeadContent />
      </head>
      <body
        suppressHydrationWarning
        className="m-auto outline-1 outline-border shadow min-h-screen flex flex-col "
        style={{ maxWidth: "1920px" }}
      >
        <ViewportProvider isMobile={isSsrMobile}>
          <QueryProvider handleThrowOnError={handleThrowOnError}>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster />
          </QueryProvider>
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </ViewportProvider>
      </body>
    </html>
  );
}

// import { Outlet, createRootRoute } from "@tanstack/react-router";
// // import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { ViewportProvider } from "@lipy/web-ui/contexts/viewport";
// import { NuqsAdapter } from "nuqs/adapters/react";
// import QueryProvider from "@lipy/lib/providers/queryProvider";
// import { toast, Toaster } from "@lipy/web-ui/components/ui/sonner";
// import { useCallback } from "react";

// export const Route = createRootRoute({
//   component: () => {
//     const handleThrowOnError = useCallback((error: Error) => {
//       toast.error(error?.message || "Something went wrong!");
//       return false;
//     }, []);

//     return (
//       <>
//         <QueryProvider handleThrowOnError={handleThrowOnError}>
//           <ViewportProvider>
//             <NuqsAdapter>
//               <Outlet />
//             </NuqsAdapter>
//           </ViewportProvider>
//           <Toaster />
//         </QueryProvider>
//         {/* <TanStackRouterDevtools /> */}
//       </>
//     );
//   },
// });

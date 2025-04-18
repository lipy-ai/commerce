import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "@/components/defaultCatchBoundry";
import { NotFound } from "@/components/notFound";
import { seo } from "@/utils/seo";
import NavBar from "@/components/navBar";
// import appCss from "../styles.css?url";
import appCss from "@web-ui/styles.css?url";
import { ViewportProvider } from "@/context/viewport";

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
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ViewportProvider>
          <NavBar />
          <hr />
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </ViewportProvider>
      </body>
    </html>
  );
}

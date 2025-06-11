// import { useCartStore } from "@/components/cart/store";
import { DefaultCatchBoundary } from "@/components/defaultCatchBoundry";
import NavBar from "@/components/navBar";
import { NotFound } from "@/components/notFound";
import { seo } from "@/utils/seo";
import useGlobalVibration from "@lipy/lib/hooks/use-vibrate";
import QueryProvider from "@lipy/lib/providers/queryProvider";
import { getIsSsrMobile } from "@lipy/lib/utils/isServerMobile";
import { Toaster, toast } from "@lipy/web-ui/components/ui/sonner";
import { ViewportProvider } from "@lipy/web-ui/contexts/viewport";
import appCss from "@lipy/web-ui/styles.css?url";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getHeader } from "@tanstack/react-start/server";
import { NuqsAdapter } from "nuqs/adapters/react";
import * as React from "react";

export const globalInit = createServerFn({ method: "GET" }).handler(
	async () => {
		const userAgent = getHeader("User-Agent");

		const isSsrMobile = getIsSsrMobile(userAgent);
		return { isSsrMobile, userAgent };
	},
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
				title: "Lipy Commerce",
				description:
					"Lipy Commerce is a quick commerce platform designed to empower local businesses by connecting them directly with nearby customers. Sell faster, grow smarter, and stay local.",
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
	loader: async () => {
		const data = await globalInit();
		return data;
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
	useGlobalVibration();

	const handleThrowOnError = React.useCallback((error: Error) => {
		toast.error(error?.message || "Something went wrong!");
		return false;
	}, []);

	const data = Route.useLoaderData();

	return (
		<html className="bg-muted/30" lang="en">
			<head>
				<HeadContent />
			</head>
			<body
				suppressHydrationWarning
				className="m-auto outline-1 outline-border shadow min-h-screen flex flex-col "
				style={{ maxWidth: "1920px" }}
			>
				<ViewportProvider isMobile={data?.isSsrMobile}>
					<QueryProvider handleThrowOnError={handleThrowOnError}>
						{!data?.isSsrMobile && <NavBar />}
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

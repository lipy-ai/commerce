import { getSsrSession } from "@lipy/lib/providers/auth";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { cn } from "@lipy/web-ui/lib/utils";
import { LoginScreen } from "@lipy/web-ui/screens/auth/login";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { cache } from "react";

export const authFn = createServerFn({ method: "GET" }).handler(
	cache(async () => {
		const request = getWebRequest();

		const res = await getSsrSession(request?.headers);

		return res;
	}),
);

export const Route = createFileRoute("/")({
	component: RouteComponent,
	loader: async () => await authFn(),
});

function RouteComponent() {
	const data = Route.useLoaderData();
	if (!data?.session) {
		return <LoginScreen />;
	}
	return (
		<div className="h-svh overflow-hidden flex justify-center items-center xl:grid grid-cols-2">
			<div className="bg-amber-300/50 flex-1 h-full fixed xl:w-2/5 w-full" />
			<div className="fixed xl:left-30 top-14 xl:relative xl:-top-14 xl:flex xl:items-end xl:flex-1 xl:h-full">
				<img
					alt="lipy-login-banner"
					src="/assets/paper-bag-items.webp"
					className="rotate-180 scale-150 xl:scale-140 xl:rotate-0"
					width={800}
				/>
			</div>
			<Card className="flex w-full max-w-sm flex-col gap-6 mx-auto mt-auto md:m-auto py-8 shadow-none border-0 bg-transparent relative z-10">
				<div className="flex items-center gap-2 self-center font-medium" />
				<div className={cn("flex flex-col gap-6")}>
					<div className="space-y-4">
						<div className="flex justify-center items-center">
							<Link to={"/"}>
								<img
									src="/logo/ico.png"
									alt="Lipy"
									width={75}
									height={75}
									className="rounded-md"
								/>
							</Link>
						</div>
						<CardHeader className="text-center">
							<CardDescription>Launching Soon</CardDescription>

							<CardTitle className="text-xl">
								India's Local Commerce App
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-base text-center">
								Thank you for showing your interest we are still building this
								platform and we will get back to you soon.{" "}
							</p>
							<Button className="w-full my-8" variant={"default"} size={"lg"}>
								Launching Soon
							</Button>
						</CardContent>
					</div>
					<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
						By clicking continue, you agree to our{" "}
						<a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>.
					</div>
				</div>
			</Card>
		</div>
	);
}

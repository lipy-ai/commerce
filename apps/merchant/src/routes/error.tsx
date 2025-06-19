import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Dialog, DialogContent } from "@lipy/web-ui/components/ui/dialog";
import { cn } from "@lipy/web-ui/lib/utils";
import {
	Link,
	createFileRoute,
	useCanGoBack,
	useRouter,
} from "@tanstack/react-router";
import { Frown } from "lucide-react";
import { z } from "zod";

const schema = z.object({
	s: z.object({ message: z.string(), title: z.string().optional() }).optional(),
});

export const Route = createFileRoute("/error")({
	component: RouteComponent,
	validateSearch: schema,
});

function RouteComponent() {
	const router = useRouter();
	const canGoBack = useCanGoBack();
	const { s } = Route.useSearch();

	return (
		<Dialog
			open={true}
			onOpenChange={() =>
				canGoBack ? router.history.back() : router.navigate({ to: "/" })
			}
		>
			<DialogContent
				className="px-0 py-0 sm:max-w-md"
				onInteractOutside={(e) => {
					e.preventDefault();
				}}
			>
				<div className="w-full text-center p-8 border rounded bg-red-500/10 m-auto">
					<span className="m-auto inline-flex">
						{<Frown className="size-14" />}
					</span>
					<h1 className="text-2xl mb-1">{s?.title || "Oh no, Error..."}</h1>
					<p className="text-base text-muted-foreground mb-4">
						{s?.message || "Something went wrong!"}
					</p>
					<div className="">
						{canGoBack ? (
							<Button
								onClick={() => router.history.back()}
								variant={"destructive"}
								className="w-42"
							>
								Retry
							</Button>
						) : (
							<Link
								to="/"
								className={cn(
									buttonVariants({ variant: "destructive", size: "lg" }),
									"w-full max-w-56",
								)}
							>
								Back to Home
							</Link>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

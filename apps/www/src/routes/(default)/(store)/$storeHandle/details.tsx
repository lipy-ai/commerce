import { PrimaryCartFooter } from "@/components/cart/cartFooter";
import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import Loading from "@lipy/web-ui/components/ui/loading";
import { shareContent } from "@lipy/web-ui/lib/share";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Share } from "lucide-react";

export const Route = createFileRoute("/(default)/(store)/$storeHandle/details")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const { storeHandle } = Route.useParams();
	const { data, isLoading } = useAPIQuery(
		apiClient.v1.shops[":handle"],
		"$get",
		{
			param: { handle: storeHandle },
		},
		{
			staleTime: Number.POSITIVE_INFINITY,
			cacheTime: Number.POSITIVE_INFINITY,
		},
	);

	return (
		<>
			{isLoading ? (
				<Loading hideDefault />
			) : !data ? (
				<EmptyPage
					title="Shop not found"
					label="The shop you are looking for does not exist."
				/>
			) : (
				<div className="max-w-screen-lg mx-auto mb-20 w-full">
					<DashboardHeader>
						<Button
							size="sm"
							onClick={() => {
								shareContent({
									title: data?.name as string,
									text: "Hey, Check out this shop!",
									url: `${env.WEB_URL}/${data?.handle}`,
								});
							}}
						>
							<Share />
							Share
						</Button>
					</DashboardHeader>
					<div className="relative w-full aspect-[16/9] bg-gray-200">
						<img
							src={data?.image || "/logo/logo.png"}
							alt={data?.name}
							className="absolute inset-0 w-full h-full object-cover"
							loading="lazy"
						/>
					</div>
					<div className="bg-card my-4 p-4 space-y-4">
						<div className="space-y-0.5">
							<h1 className="text-xl font-bold">{data?.name}</h1>
							<p className=" text-xs text-muted-foreground">
								{data?.address?.line1}
							</p>
						</div>

						<p className="text-sm font-normal">{data?.description}</p>
						<div className="mt-4 flex items-center gap-4 justify-between">
							<div className="flex gap-4">
								<a
									href={`mailto:${data?.email}`}
									className={cn(
										buttonVariants({ variant: "outline", size: "sm" }),
									)}
								>
									<Mail />
								</a>
								<a
									href={`tel:${data?.phone}`}
									className={cn(
										buttonVariants({ variant: "outline", size: "sm" }),
									)}
								>
									<Phone />
								</a>
							</div>

							<a
								href={`https://www.google.com/maps/dir/?api=1&destination=${data?.address?.lat},${data?.address?.lng}`}
								className={cn(
									buttonVariants({ variant: "outline", size: "sm" }),
									"flex items-center gap-2",
								)}
							>
								<MapPin className="text-primary" />
								Directions
							</a>
						</div>
					</div>

					<div className="bg-card p-4 divide-y divide-dashed">
						<div>
							<div className="flex items-start gap-4 p-2">
								<Clock className="flex-shrink-0 size-4 mt-1" />
								<div>
									<p className="font-medium ">Opening Hours</p>
									<p className="text-muted-foreground">9:00 am - 9:00 pm</p>
								</div>
							</div>
						</div>
					</div>
					<div className="lg:hidden">
						<PrimaryCartFooter />
					</div>
				</div>
			)}
		</>
	);
}

import { PrimaryCartFooter } from "@/components/cart/cartFooter";
import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { shareContent } from "@lipy/web-ui/lib/share";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Share } from "lucide-react";

export const Route = createFileRoute("/(default)/(store)/$storeHandle/details")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const { storeHandle } = Route.useParams();
	const { data, isFetching } = useAPIQuery(
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

	if (isFetching) return <Spinner />;
	return (
		<div className="max-w-screen-lg mx-auto mb-20">
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
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								window.open(`mailto:${data?.email}`);
							}}
						>
							<Mail />
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								window.open(`tel:${data?.phone}`);
							}}
						>
							<Phone />
						</Button>
					</div>

					<Button
						variant={"outline"}
						size="sm"
						onClick={() => {
							window.open(
								`https://www.google.com/maps/dir/?api=1&destination=${data?.address?.lat},${data?.address?.lng}`,
							);
						}}
					>
						<MapPin className="text-primary" />
						Directions
					</Button>
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
	);
}

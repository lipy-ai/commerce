import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DeleteAddress } from "@lipy/web-ui/components/maps/deleteAdderess";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Building, CirclePlus, House, MapPinHouse } from "lucide-react";

export const Route = createFileRoute("/account/addresses/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading } = useAPIQuery(apiClient.v1.address, "$get", {});
	const { isMobile } = useViewport();

	return (
		<>
			<DashboardHeader title="Addresses">
				{!isMobile && (
					<Link
						className={cn(buttonVariants({ variant: "default" }))}
						to="/account/addresses/new"
					>
						<CirclePlus />
						Add New Address
					</Link>
				)}
			</DashboardHeader>

			{isLoading &&
				[...Array(5)].map((_, i) => (
					<div key={i} className="my-2 flex flex-col items-center">
						<Skeleton className="h-28 w-5/6 " />
					</div>
				))}

			{!isLoading && data && data?.length > 0 && (
				<div className="mb-10">
					{data.map((address) => (
						<div
							key={address.id}
							className={cn(
								!isMobile
									? " flex items-center justify-between"
									: "flex flex-col space-y-2",
								"p-4 border-b",
							)}
						>
							<div className="flex  gap-2">
								<Avatar className="rounded-md ">
									<AvatarFallback>
										{address.tag === "home" ? (
											<House className="text-muted-foreground flex-shrink-0" />
										) : address.tag === "work" ? (
											<Building className="text-muted-foreground  flex-shrink-0" />
										) : (
											<MapPinHouse className="size-6 text-muted-foreground flex-shrink-0" />
										)}
									</AvatarFallback>
								</Avatar>

								<div>
									<h2 className="text-lg font-semibold">{address.name}</h2>
									<p className="text-muted-foreground">{address.line1}</p>
									{address.phone && (
										<p className="text-muted-foreground">
											Phone No. : {address.phone}
										</p>
									)}
								</div>
							</div>

							<div className="flex gap-2 items-center pl-12">
								<DetailedAddress fullAddress={address} label="Edit" />
								<DeleteAddress addressId={address.id} />
							</div>
						</div>
					))}
				</div>
			)}

			{!isLoading && data?.length === 0 && (
				<EmptyPage
					icon={MapPinHouse}
					title="You have no saved addresses"
					label="Add a new address to get started"
				/>
			)}

			{isMobile && (
				<div className="fixed bottom-0 w-full p-4 bg-background">
					<Link
						className={cn(buttonVariants({ variant: "default" }), "w-full")}
						to="/account/addresses/new"
					>
						Add New Address
					</Link>
				</div>
			)}
		</>
	);
}

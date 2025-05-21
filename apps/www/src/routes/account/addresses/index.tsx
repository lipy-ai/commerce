import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import Loading from "@lipy/web-ui/components/ui/loading";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building, CirclePlus, House, MapPinHouse } from "lucide-react";
import { DeleteAddress } from "@lipy/web-ui/components/maps/deleteAdderess";
import DetailedAddress from "@lipy/web-ui/components/maps/detailedAddress";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";

export const Route = createFileRoute("/account/addresses/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading } = useAPIQuery(apiClient.v1.address, "$get", {});
	const { isMobile } = useViewport();

	if (isLoading) {
		return <Loading description="Searching for your saved addresses" />;
	}

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
			<div className="mb-10">
				{data && data?.length > 0 ? (
					<div>
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
									<Avatar>
										<AvatarFallback>
											{address.tag === "home" ? (
												<House className="text-muted-foreground flex-shrink-0" />
											) : address.tag === "work" ? (
												<Building className="size-6 text-muted-foreground flex-shrink-0" />
											) : (
												<MapPinHouse className="size-6 text-muted-foreground flex-shrink-0" />
											)}
										</AvatarFallback>
									</Avatar>

									<div>
										<h2 className="text-lg font-semibold">{address.name}</h2>
										<p className="text-muted-foreground">{address.line1}</p>
									</div>
								</div>

								<div className="flex gap-2 items-center pl-12">
									<DetailedAddress fullAddress={address} label="Edit" />
									<DeleteAddress addressId={address.id} />
								</div>
							</div>
						))}
					</div>
				) : (
					<EmptyPage
						icon={MapPinHouse}
						title="You have no saved addresses"
						label="Add a new address to get started"
					/>
				)}
			</div>

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

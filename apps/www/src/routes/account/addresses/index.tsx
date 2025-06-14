import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DrawerDialogSwitcher } from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DeleteAddress } from "@lipy/web-ui/components/maps/deleteAdderess";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import type { DeliveryLocation } from "@lipy/web-ui/components/maps/utils/store";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";

import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	Building,
	ChevronRight,
	CirclePlus,
	House,
	MapPin,
	MapPinHouse,
	Pencil,
	Trash,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/account/addresses/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isFetching, isFetched } = useAPIQuery(
		apiClient.v1.address,
		"$get",
		{},
	);
	const { isMobile } = useViewport();
	const [optionsDrawerOpen, setOptionsDrawerOpen] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState<
		NonNullable<typeof data>[0] | null
	>(null);

	if (isFetching)
		return [...Array(5)].map((_, i) => (
			<div key={i} className="my-2 flex flex-col items-center">
				<Skeleton className="h-28 w-5/6 " />
			</div>
		));

	return (
		<div>
			<DashboardHeader title="Addresses">
				{!isMobile && (
					<Link
						className={cn(buttonVariants({ variant: "default" }))}
						to="/account/addresses/new"
						search={{ type: "saveAddress" }}
					>
						<CirclePlus />
						Add New Address
					</Link>
				)}
			</DashboardHeader>

			{isFetched && data && data?.length > 0 && (
				<div className="mb-16  divide-y p-4 ">
					{data.map((address) => (
						<div
							key={address.id}
							onClick={() => {
								setOptionsDrawerOpen(true);
								setSelectedAddress(address);
							}}
						>
							<AddressComponent address={address} />
						</div>
					))}
				</div>
			)}

			{isFetched && data?.length === 0 && (
				<EmptyPage
					icon={MapPinHouse}
					title="You have no saved addresses"
					label="Add a new address to get started"
				/>
			)}

			{isMobile && (
				<div className="fixed bottom-0 w-full p-4 bg-background">
					<Link
						className={cn(
							buttonVariants({ variant: "default" }),
							"w-full font-semibold",
						)}
						to="/account/addresses/new"
						search={{
							type: "saveAddress",
						}}
					>
						Add New Address
					</Link>
				</div>
			)}

			{optionsDrawerOpen && (
				<OptionsDrawer
					open={optionsDrawerOpen}
					onOpenChange={setOptionsDrawerOpen}
					address={selectedAddress}
				/>
			)}
		</div>
	);
}

export function AddressComponent({
	address,
}: {
	address: DeliveryLocation;
}) {
	return (
		<div className="flex  gap-2 py-4 ">
			<Avatar className="rounded-md ">
				<AvatarFallback>
					{address.tag === "home" ? (
						<House className=" flex-shrink-0 text-foreground fill-primary/40" />
					) : address.tag === "work" ? (
						<Building className=" flex-shrink-0 text-foreground fill-primary/40" />
					) : (
						<MapPinHouse className="size-6 flex-shrink-0 text-foreground fill-primary/40" />
					)}
				</AvatarFallback>
			</Avatar>

			<div>
				<h2 className="text-lg font-semibold">
					{address.tag.charAt(0).toUpperCase() + address.tag.slice(1)}
				</h2>
				<p className="text-muted-foreground">
					{[address?.name, address?.metadata?.building, address?.line1]
						.filter(Boolean)
						.join(", ")}
				</p>
				{address.phone && (
					<p className="text-foreground/90">Phone number : {address.phone}</p>
				)}
			</div>
		</div>
	);
}

function OptionsDrawer(props: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	address?: any;
}) {
	const [deleteAddressDialogOpen, setDeleteAddressDialogOpen] = useState(false);
	const [detailedAddressDrawerOpen, setDetailedAddressDrawerOpen] =
		useState(false);
	return (
		<div>
			<DrawerDialogSwitcher open={props.open} onOpenChange={props.onOpenChange}>
				<div className="p-0 flex items-start mx-4">
					<p className="font-medium text-base">Select option</p>
				</div>
				<div className="mx-4 my-2 bg-accent p-4 rounded-lg space-y-4 cursor-pointer">
					<div
						className="flex items-center justify-between"
						onClick={() => {
							setDetailedAddressDrawerOpen(true);
						}}
					>
						<div className="flex items-center gap-4">
							<Pencil className="size-4" />
							<p className="font-medium text-sm">Edit address</p>
						</div>

						<ChevronRight className="size-4" />
					</div>
					<Separator className="border-t border-dashed bg-transparent" />
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<MapPin className="size-4" />
							<p className="font-medium text-sm">Set as delivery address</p>
						</div>

						<ChevronRight className="size-4" />
					</div>
					<Separator className="border-t border-dashed bg-transparent" />
					<div
						className="flex items-center justify-between"
						onClick={() => {
							setDeleteAddressDialogOpen(true);
						}}
					>
						<div className="flex items-center gap-4">
							<Trash className="size-4" />
							<p className="font-medium text-sm">Delete address</p>
						</div>

						<ChevronRight className="size-4" />
					</div>
				</div>
			</DrawerDialogSwitcher>
			{deleteAddressDialogOpen && (
				<DeleteAddress
					addressId={props.address.id}
					open={deleteAddressDialogOpen}
					onOpenChange={setDeleteAddressDialogOpen}
				/>
			)}

			{detailedAddressDrawerOpen && (
				<DetailedAddress
					fullAddress={props.address}
					open={detailedAddressDrawerOpen}
					onOpenChange={setDetailedAddressDrawerOpen}
					label="Edit"
				/>
			)}
		</div>
	);
}

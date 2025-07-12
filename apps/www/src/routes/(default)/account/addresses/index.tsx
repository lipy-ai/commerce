import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DeleteAddress } from "@lipy/web-ui/components/maps/deleteAdderess";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import type { DeliveryLocation } from "@lipy/web-ui/components/maps/utils/store";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import Loading from "@lipy/web-ui/components/ui/loading";
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

export const Route = createFileRoute("/(default)/account/addresses/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading } = useAPIQuery(
		apiClient.v1.address,
		"$get",
		{},
		{
			placeholderData: (p) => p,
		},
	);
	const { isMobile } = useViewport();
	const [optionsDrawerOpen, setOptionsDrawerOpen] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState<
		NonNullable<typeof data>[0] | null
	>(null);

	return (
		<>
			<DashboardHeader title="Saved addresses">
				<Link
					className={cn(
						buttonVariants({ variant: "default" }),
						"hidden md:inline-flex",
					)}
					to="/account/addresses/new"
					search={{ type: "saveAddress" }}
				>
					<CirclePlus />
					Add New Address
				</Link>
			</DashboardHeader>
			{isLoading ? (
				<Loading hideDefault />
			) : !data || data.length === 0 ? (
				<EmptyPage
					icon={MapPinHouse}
					title="You have no saved addresses"
					label="Add a new address to get started"
				/>
			) : (
				<div className="w-full">
					<div className="p-4 mb-20 space-y-2">
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
				</div>
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
		</>
	);
}

export function AddressComponent({
	address,
}: {
	address: DeliveryLocation;
}) {
	return (
		<div className="bg-card p-4 flex  gap-2  items-start rounded-xl">
			<div className="mt-1">
				{address.tag === "home" ? (
					<House className=" flex-shrink-0 text-foreground " />
				) : address.tag === "work" ? (
					<Building className=" flex-shrink-0 text-foreground " />
				) : (
					<MapPinHouse className="flex-shrink-0 text-foreground " />
				)}
			</div>

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
				<DrawerDialogHeader>
					<DrawerDialogTitle>Select option</DrawerDialogTitle>
				</DrawerDialogHeader>

				<div className="cursor-pointer divide-y divide-dashed bg-card rounded-xl px-2">
					<div
						className="flex items-center justify-between py-4"
						onClick={() => {
							setDetailedAddressDrawerOpen(true);
						}}
					>
						<div className="flex items-center gap-4">
							<Pencil className="size-5 flex-shrink-0" />
							<p className="font-medium text-sm">Edit address</p>
						</div>

						<ChevronRight className="size-4" />
					</div>

					<div className="flex items-center justify-between py-4">
						<div className="flex items-center gap-4">
							<MapPin className="size-5 flex-shrink-0" />
							<p className="font-medium text-sm">Set as delivery address</p>
						</div>

						<ChevronRight className="size-4" />
					</div>

					<div
						className="flex items-center justify-between py-4"
						onClick={() => {
							setDeleteAddressDialogOpen(true);
						}}
					>
						<div className="flex items-center gap-4 ">
							<Trash className="size-5 flex-shrink-0" />
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

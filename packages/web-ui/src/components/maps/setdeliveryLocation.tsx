import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import {
	Building,
	ChevronRight,
	House,
	MapPinHouse,
	Navigation,
} from "lucide-react";
import SearchBar from "../searchBar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Spinner } from "../ui/spinner";

export default function SetDeliveryLocation({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { data, isLoading } = useAPIQuery(apiClient.v1.address, "$get", {});
	return (
		<Drawer open={open} onOpenChange={onOpenChange} handleOnly={true}>
			<DrawerContent className="p-4">
				<DrawerHeader>
					<DrawerTitle>Enter your address</DrawerTitle>
				</DrawerHeader>
				<SearchBar placeholder="Search for address" />
				<Button
					variant={"link"}
					className="flex justify-between my-2 text-md font-medium"
				>
					<div className="flex items-center gap-2 ">
						<Navigation className="fill-primary" />
						Use my current location
					</div>

					<ChevronRight className="text-muted-foreground" />
				</Button>
				<p className="font-medium text-lg my-2">Saved Address</p>
				{isLoading && <Spinner />}
				{!isLoading && data && data?.length > 0 && (
					<Card className="mb-10 shadow-none p-2">
						{data.map((address) => (
							<div key={address.id} className="border-b last:border-b-0">
								<div className="flex  gap-2 py-2">
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
										<h2 className="text-md font-semibold">{address.name}</h2>
										<p className="text-muted-foreground">{address.line1}</p>
									</div>
								</div>
							</div>
						))}
					</Card>
				)}

				{!isLoading && data?.length === 0 && (
					<div className="flex justify-center my-2">No saved address</div>
				)}
			</DrawerContent>
		</Drawer>
	);
}

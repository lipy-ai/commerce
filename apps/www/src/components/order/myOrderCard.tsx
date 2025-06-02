import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Separator } from "@lipy/web-ui/components/ui/separator";

import CustomAvatarGroup from "@lipy/web-ui/components/custom-ui/customAvatarGroup";

export default function MyOrderCard({ order }: { order: any }) {
	return (
		<>
			<Card className="shadow-none py-2">
				<CardContent className="p-0">
					<div className="flex gap-2 items-center p-4">
						<Avatar className="rounded-md size-12">
							<AvatarImage src={order.storeLogo || ""} />
							<AvatarFallback className="rounded-lg bg-indigo-500 text-white">
								{order.storeName[0]}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="fomt-semibold line-clamp-1">{order.storeName}</p>
							<p className="text-muted-foreground line-clamp-1">
								{order?.storeAddress || "Paschim Vihar, New Delhi"}
							</p>
						</div>
					</div>
					<Separator />
					<div className="flex justify-start p-4">
						<CustomAvatarGroup items={order.items} />
					</div>
				</CardContent>
			</Card>
		</>
	);
}

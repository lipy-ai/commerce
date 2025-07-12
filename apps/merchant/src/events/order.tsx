import { useSoundPlayer } from "@lipy/lib/hooks/use-sound";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { DialogFooter } from "@lipy/web-ui/components/ui/dialog";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { BellRing, Check, X } from "lucide-react";
export function OrderNotification() {
	const { play } = useSoundPlayer({ loop: true });
	const open = false;

	return (
		<DrawerDialogSwitcher open={open} dismissible={false} className="">
			<DrawerDialogHeader className="text-center  justify-center items-center bg-accent p-8 rounded-xl">
				<BellRing className="size-12 rise-shake justify-self-center" />
				<DrawerDialogTitle className="justify-self-center">
					Incoming Order
				</DrawerDialogTitle>
			</DrawerDialogHeader>
			<div className="text-base space-y-4 my-4">
				<div>
					<p className="font-semibold">Kundan Bhosale</p>
					<p>
						Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016
					</p>
				</div>
				<Separator />
				{[...Array(4)].map((m) => (
					<div className="flex gap-2" key={m}>
						<div className="size-12 border bg-accent rounded overflow-hidden">
							<img
								src="https://picsum.photos/200/200"
								alt="Product"
								className="size-full object-contain"
							/>
						</div>
						<div className="flex-1">
							<p>Title of the product</p>
							<Badge size={"small"}>IN Stock</Badge>
						</div>
						<div>
							<p className="font-semibold">{formatAmount("inr", 20)}</p>
						</div>
					</div>
				))}
				<Separator />
				<div className="flex gap-2 justify-between">
					<p>Taxes</p>
					<p className="font-semibold">{formatAmount("inr", 20)}</p>
				</div>
				<div className="flex gap-2 justify-between">
					<p>Delivery Fee</p>
					<p className="font-semibold">{formatAmount("inr", 20)}</p>
				</div>
				<div className="flex gap-2 justify-between">
					<p className="font-semibold">Total Amount</p>
					<p className="text-xl font-bold">{formatAmount("inr", 20)}</p>
				</div>
				<Separator />
			</div>
			<DialogFooter className="">
				<Button
					className="md:flex-1"
					variant={"outline"}
					onClick={() => play()}
				>
					<X /> Reject
				</Button>
				<Button className="md:flex-1">
					<Check /> Accept
				</Button>
			</DialogFooter>
		</DrawerDialogSwitcher>
	);
}

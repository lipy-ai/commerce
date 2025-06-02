// import { authClient } from "@lipy/lib/providers/auth";
import { formatAmount } from "@lipy/lib/utils/intl";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Shirt, ShoppingCart, SquareUser, Store } from "lucide-react";

export const Route = createFileRoute("/(loggedIn)/")({
	component: RouteComponent,
});
const data = [
	{
		name: "Checkout",
		icon: ShoppingCart,
		className: "bg-emerald-600 text-primary-foreground",
	},
	{
		name: "Add Customer",
		icon: SquareUser,
		className: "bg-amber-600 text-primary-foreground",
	},
	{
		name: "Add Product",
		icon: Shirt,
		className: "bg-indigo-600 text-primary-foreground",
	},
];
function RouteComponent() {
	return (
		<div className="min-h-screen grid lg:grid-cols-12 divide-x">
			<div className="col-span-8 py-4 divide-y">
				<div className="flex justify-between items-center p-4">
					<div className="flex gap-4 px-4 py-4 lg:p-0 items-center">
						<Avatar className="size-12 rounded bg-primary">
							<AvatarImage
								alt=""
								className="object-cover"
								src="https://cdn.logojoy.com/wp-content/uploads/2018/05/18143901/8102.png"
							/>
							<AvatarFallback className="bg-primary text-primary-foreground">
								<Store />
							</AvatarFallback>
						</Avatar>
						<div>
							<p>Welcome to,</p>
							<h1 className="text-2xl">Hiravati Kirana Store.</h1>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-4 p-4">
					{data.map((d, i) => (
						<div
							key={i}
							className={cn(
								"p-4 lg:p-6 flex flex-col gap-2 items-center rounded",
								d.className,
							)}
						>
							<div>
								<d.icon className="size-8" />
							</div>
							<p>{d.name}</p>
						</div>
					))}
				</div>
				<div className="lg:hidden">
					<Orders />
				</div>
			</div>
			<div className="col-span-4 hidden lg:block h-screen overflow-y-auto">
				<Orders />
			</div>
		</div>
	);
}

function Orders() {
	return (
		<>
			<DashboardHeader title="Recent Orders" hideBackBtn />
			<div className="bg-background divide-y">
				{[...Array(40)].map((m) => (
					<div className="flex p-4" key={m}>
						<div className="flex w-full gap-4 justify-between text-base lg:text-sm">
							<div className="flex-1">
								<p className="text-xs font-light">#2564432</p>
								<p className="font-medium inline-flex items-center truncate ">
									Kundan Bhosale
								</p>
								<p className="font-light">932554253424</p>
							</div>

							<div className="w-fit text-right">
								<p className="font-semibold text-lg">
									{formatAmount("inr", 320)}
								</p>
								<Badge>Delivery in 20 mins</Badge>
							</div>
							{/* 
						<Link
							to="/"
							className={cn(
								buttonVariants({ variant: "outline", size: "icon" }),
							)}
						>
							<ArrowRight />
						</Link> */}
						</div>
					</div>
				))}
			</div>
		</>
	);
}

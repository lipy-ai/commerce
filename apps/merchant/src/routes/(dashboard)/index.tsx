// import { authClient } from "@lipy/lib/providers/auth";
import { useStore } from "@lipy/lib/hooks/use-store";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Shirt, ShoppingCart, SquareUser, Store } from "lucide-react";

const setupSteps = [
	{
		name: "shopDetailsComplete",
		completed: true,
		title: "Fill necessary information about your shop",
		description: "These information will help you run your shop smoothly.",
		action: (
			<Link
				className={cn(
					buttonVariants({ variant: "link" }),
					"h-fit p-0 underline",
				)}
				to="/store"
			>
				Complete store details
			</Link>
		),
	},
	{
		name: "productAdded",
		completed: false,
		title: "List products at your shop",
		description: "Add products in your shop.",
		action: (
			<Link className={cn(buttonVariants())} to="/product/add">
				Add products
			</Link>
		),
	},
	{
		name: "productAdded",
		completed: false,
		title: "List products at your shop",
		description: "Add products in your shop.",
		action: (
			<Link className={cn(buttonVariants())} to="/product/add">
				Add products
			</Link>
		),
	},
];

export const Route = createFileRoute("/(dashboard)/")({
	component: RouteComponent,
});
const btns = [
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
	const { data } = useStore();

	return (
		<div className="h-full">
			<div className="flex gap-4 px-4 py-4 items-center border-b">
				<Avatar className="size-12 rounded bg-primary">
					<AvatarImage
						alt=""
						className="object-cover"
						src={
							data?.image ||
							"https://cdn.logojoy.com/wp-content/uploads/2018/05/18143901/8102.png"
						}
					/>
					<AvatarFallback className="bg-primary text-primary-foreground">
						<Store />
					</AvatarFallback>
				</Avatar>
				<div>
					<p>Welcome to,</p>
					<h1 className="text-2xl">{data?.name || "Store"}</h1>
				</div>
			</div>

			<div className="min-h-screen grid lg:grid-cols-12 divide-x">
				<div className="col-span-8 py-4 divide-y">
					<div className="grid grid-cols-3 gap-2 lg:gap-4 p-4">
						{btns.map((d, i) => (
							<div
								key={i}
								className={cn(
									"px-2 py-4 lg:p-6 flex flex-col gap-2 items-center rounded text-center",
									d.className,
								)}
							>
								<div>
									<d.icon className="size-8" />
								</div>
								<p className="text-sm lg:text-base">{d.name}</p>
							</div>
						))}
					</div>
					<ShopSetupStatus />

					<div className="lg:hidden">
						<Orders />
					</div>
				</div>
				<div className="col-span-4 hidden lg:block h-screen overflow-y-auto">
					<Orders />
				</div>
			</div>
		</div>
	);
}

function Orders() {
	return (
		<>
			{/* <DashboardHeader title="Recent Orders" hideBackBtn /> */}
			<div className="bg-background divide-y">
				{[...Array(40)].map((_, index) => (
					<div className="flex p-4" key={index}>
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

							{/* <Link
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

export function ShopSetupStatus() {
	return (
		<Card className="p-4 m-4">
			<CardHeader className="">
				<CardTitle>Complete your store setup</CardTitle>
				<CardDescription>
					Fill basic details of your shop and add products you wish to sell in
					easy steps.
				</CardDescription>
			</CardHeader>
			<CardContent className="relative space-y-8 lg:space-y-12">
				{setupSteps.map((item, index) => (
					<div key={index} className="">
						<div className="flex items-start gap-3 lg:gap-4">
							<div className="relative">
								{index !== setupSteps.length - 1 && (
									<div
										className={cn(
											"absolute w-0.5 z-0  top-full left-1/2",
											item.completed ? "bg-primary" : "bg-muted-foreground",
										)}
									/>
								)}
								<div
									className={cn(
										"size-10 flex items-center justify-center rounded-full",
										item.completed
											? "bg-primary"
											: "bg-background border-2 border-muted-foreground",
									)}
								>
									{item.completed ? (
										<Check className="size-4 lg:size-6 text-background stroke-3" />
									) : (
										<p className="font-medium">{index + 1}</p>
									)}
								</div>
							</div>

							<div className="flex-1 flex flex-col md:flex-row gap-2 justify-between">
								<div>
									<p className="font-medium leading-tight">{item.title}</p>
									<p className="text-muted-foreground">{item.description}</p>
								</div>
								<div className="">{item.action}</div>
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

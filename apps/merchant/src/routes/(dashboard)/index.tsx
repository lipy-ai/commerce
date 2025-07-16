// import { authClient } from "@lipy/lib/providers/auth";
import { apiClient } from "@lipy/lib/api";
import { useStore } from "@lipy/lib/hooks/use-store";
import { formatAddress } from "@lipy/lib/utils/address";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock10, StoreIcon } from "lucide-react";
import { Shirt, ShoppingCart, SquareUser, Store } from "lucide-react";

// import {
// 	type ChartConfig,
// 	ChartContainer,
// 	ChartLegend,
// 	ChartLegendContent,
// 	ChartTooltip,
// 	ChartTooltipContent,
// } from "@lipy/web-ui/components/ui/chart";
// import { format } from "date-fns";
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Label } from "@lipy/web-ui/components/ui/label";
import type { InferResponseType } from "hono";

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
		name: "POS",
		icon: StoreIcon,
		className: "bg-yellow-400 text-foreground",
		href: "/pos",
	},
	{
		name: "Checkout",
		icon: ShoppingCart,
		className: "bg-emerald-600 text-primary-foreground",
		href: "/checkout",
	},
	{
		name: "Add Customer",
		icon: SquareUser,
		className: "bg-amber-600 text-primary-foreground",
		href: "/customer/add",
	},
	{
		name: "Add Product",
		icon: Shirt,
		className: "bg-indigo-600 text-primary-foreground",
		href: "/product/add",
	},
];
function RouteComponent() {
	const { data } = useStore();

	const res = useAPIQuery(apiClient.v1.merchant.dashboard, "$get", {});

	return (
		<div className="h-full">
			<div className="grid lg:grid-cols-12 divide-x">
				<div className="col-span-8 px-4 pb-4 flex gap-4 md:h-screen flex-col md:sticky md:top-0">
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
					<Card className="">
						<CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{btns.map((d, i) => (
								<Link
									key={i}
									className={cn(
										"p-4 flex flex-col gap-2 items-center rounded justify-center text-center md:aspect-square cursor-pointer hover:opacity-85",
										d.className,
									)}
									to={d.href}
								>
									<div>
										<d.icon className="size-8" />
									</div>
									<p className="text-sm lg:text-base">{d.name}</p>
								</Link>
							))}
						</CardContent>
					</Card>
					{/* <ChartBarInteractive
						data={res.data?.counts}
						isLoading={res.isLoading}
					/> */}
					<div className="lg:hidden">
						<Orders data={res.data?.pendingOrders} isLoading={res.isLoading} />
					</div>
				</div>
				<div className="col-span-4 hidden lg:flex flex-col p-4">
					<Orders data={res.data?.pendingOrders} isLoading={res.isLoading} />
				</div>
			</div>
		</div>
	);
}

function Orders({
	data,
	isLoading,
}: {
	data:
		| InferResponseType<
				typeof apiClient.v1.merchant.dashboard.$get
		  >["pendingOrders"]
		| undefined;
	isLoading: boolean;
}) {
	if (isLoading) {
		return <Skeleton className="flex-1" />;
	}

	if (!data || data.length === 0) {
		return (
			<Card className="flex-1 py-8">
				<CardContent className="flex flex-1 justify-center flex-col gap-4 text-muted-foreground items-center">
					<Clock10 className="size-16" />
					<Label className="text-lg">No Incoming Orders.</Label>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pending Orders</CardTitle>
			</CardHeader>
			{/* <DashboardHeader title="Recent Orders" hideBackBtn /> */}
			<CardContent className="divide-y">
				{data.map((v, i) => {
					return (
						<div key={i} className="py-4 space-y-2">
							<div className="flex">
								<div className="flex w-full gap-4 justify-between text-base lg:text-sm">
									<div className="flex-1 flex gap-2">
										<div
											className={cn(
												"border size-12 text-[7px] break-words text-center text-balance flex flex-col items-center justify-center",

												v.status === "ordered" &&
													"text-primary-foreground bg-red-800",
												v.status === "accepted" &&
													"text-primary-foreground bg-blue-700",
												v.status === "packed" && "text-foreground bg-amber-400",
												v.status === "out_for_delivery" &&
													"text-primary-foreground bg-green-700",
											)}
										>
											<span className="uppercase">
												{v.status?.replaceAll("_", " ")}
											</span>
										</div>
										<div className="flex-1">
											<p className="text-xs font-light">{v.id}</p>
											<p className="font-medium truncate ">
												{v.customerDetails?.name}
											</p>
										</div>
									</div>

									<div className="w-fit text-right">
										<p className="font-semibold">
											{formatAmount("inr", v.totalAmount || 0)}
										</p>
									</div>
								</div>
							</div>
							<p className="text-xs">
								{formatAddress(v.customerDetails?.address as any)}
							</p>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}

export function ShopSetupStatus() {
	return (
		<Card className="p-4">
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
										className={cn("absolute w-0.5 z-0  top-full left-1/2")}
									/>
								)}
								<div
									className={cn(
										"size-10 flex items-center justify-center rounded-full",
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

// export function ChartBarInteractive({
// 	data,
// 	isLoading,
// }: {
// 	data:
// 		| InferResponseType<typeof apiClient.v1.merchant.dashboard.$get>["counts"]
// 		| undefined;
// 	isLoading: boolean;
// }) {
// 	const chartConfig = {
// 		views: {
// 			label: "Page Views",
// 		},
// 		pending: {
// 			label: "Pending",
// 			color: "var(--chart-1)",
// 		},
// 		completed: {
// 			label: "Completed",
// 			color: "var(--chart-2)",
// 		},
// 		returned: {
// 			label: "Returned",
// 			color: "var(--chart-3)",
// 		},
// 	} satisfies ChartConfig;

// 	if (isLoading) {
// 		return <Skeleton />;
// 	}

// 	return (
// 		<Card className="w-full flex flex-col">
// 			<CardHeader>
// 				<CardTitle>Orders</CardTitle>
// 				<CardDescription>Last 30 days</CardDescription>
// 			</CardHeader>
// 			<CardContent>
// 				<ChartContainer config={chartConfig} className="max-h-[300px] w-full">
// 					<BarChart accessibilityLayer data={data || []}>
// 						<CartesianGrid vertical={false} />
// 						<XAxis
// 							dataKey="date"
// 							minTickGap={10}
// 							tickFormatter={(v) => format(v, "dd MMM")}
// 						/>
// 						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
// 						<ChartLegend content={<ChartLegendContent />} />
// 						<Bar
// 							dataKey="pending"
// 							stackId="a"
// 							fill="var(--color-pending)"
// 							radius={[0, 0, 4, 4]}
// 						/>
// 						<Bar
// 							dataKey="completed"
// 							stackId="a"
// 							fill="var(--color-completed)"
// 							radius={[0, 0, 4, 4]}
// 						/>
// 						<Bar
// 							dataKey="returned"
// 							stackId="a"
// 							fill="var(--color-returned)"
// 							radius={[0, 0, 4, 4]}
// 						/>
// 					</BarChart>
// 				</ChartContainer>
// 			</CardContent>
// 		</Card>
// 	);
// }

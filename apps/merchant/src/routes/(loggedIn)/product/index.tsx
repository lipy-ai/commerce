import { formatAmount } from "@lipy/lib/utils/intl";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@lipy/web-ui/components/ui/table";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";

export const Route = createFileRoute("/(loggedIn)/product/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isMobile } = useViewport();
	return (
		<div>
			<DashboardHeader title="Products">
				<Button>
					<Plus />
					New Product
				</Button>
			</DashboardHeader>

			<div className="lg:p-8 lg:space-y-8">
				{isMobile ? <MobileView /> : <DesktopView />}
			</div>
		</div>
	);
}

function MobileView() {
	return (
		<div className="bg-background border divide-y">
			{[...Array(40)].map((m) => (
				<Link
					to={"/product/$id"}
					params={{ id: "id" }}
					className="flex p-4"
					key={m}
				>
					<div className="flex w-full gap-4 justify-between text-base">
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
				</Link>
			))}
		</div>
	);
}

function DesktopView() {
	const navigate = useNavigate();

	return (
		<Table className="bg-background border p-8">
			<TableHeader>
				<TableRow>
					<TableHead className="w-fit">#</TableHead>
					<TableHead className="">Product</TableHead>

					<TableHead className="w-32">Status</TableHead>
					<TableHead className="w-32">Stock</TableHead>
					<TableHead className="w-24">Amount</TableHead>

					<TableHead className="w-10" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...Array(40)].map((m) => (
					<TableRow
						key={m}
						onClick={() =>
							navigate({ to: "/product/$id", params: { id: "id" } })
						}
						className="cursor-pointer focus:bg-accent"
					>
						<TableCell>2142</TableCell>
						<TableCell>
							<div className="grid grid-cols-[50px_auto] gap-2">
								<img
									src="https://picsum.photos/200"
									alt=""
									className="size-12 border rounded bg-accent"
								/>
								<div className="block break-words">
									<p className="font-medium">Product Name</p>
									<p className="font-light">
										Portronics Charge Clamp 2, Mobile Holder With Wireless
										Charging - Black
									</p>
								</div>
							</div>
						</TableCell>

						<TableCell>
							<p>Active</p>
						</TableCell>
						<TableCell>
							<Badge className="" variant={"success"}>
								In Stock
							</Badge>
						</TableCell>
						<TableCell>{formatAmount("inr", 320)}</TableCell>
						<TableCell>
							<Link
								to="/"
								className={cn(
									buttonVariants({ size: "icon", variant: "ghost" }),
								)}
							>
								<ArrowUpRight />
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

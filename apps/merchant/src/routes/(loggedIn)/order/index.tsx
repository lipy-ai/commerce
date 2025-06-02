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
import { ArrowRight, Plus } from "lucide-react";

export const Route = createFileRoute("/(loggedIn)/order/")({
	component: RouteComponent,
});

const data = [
	{ name: "Pending", value: 100, className: "bg-chart-1" },
	{ name: "Delivered", value: 100, className: "bg-chart-2" },
	{ name: "Returned", value: 100, className: "bg-chart-3" },
	{ name: "All", value: 100, className: "bg-chart-4" },
];

function RouteComponent() {
	const { isMobile } = useViewport();
	return (
		<div>
			<DashboardHeader title="Orders">
				<Button>
					<Plus />
					Create Order
				</Button>
			</DashboardHeader>

			<div className="lg:p-8 lg:space-y-8">
				<div className="max-w-2xl">
					<div className="grid grid-cols-4 gap-2 p-2 lg:p-0">
						{data.map((d, i) => (
							<Link
								to="/"
								className={cn(
									"p-4 text-base rounded",
									d.className,
									// i === 0 && "bg-chart-1 border-primary",
								)}
								key={i}
							>
								<h1 className="lg:text-xl font-semibold">{d.value}</h1>
								<h2 className="font-light">
									{d.name} {!isMobile && "Orders"}
								</h2>
							</Link>
						))}
					</div>
				</div>
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
					to={"/order/$id"}
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
					<TableHead className="w-32">#</TableHead>
					<TableHead className="">Customer</TableHead>
					<TableHead className="">Delivery Partner</TableHead>

					<TableHead className="w-32">Status</TableHead>
					<TableHead className="w-32">Time Left</TableHead>
					<TableHead className="w-24">Total</TableHead>

					<TableHead className="w-10" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...Array(40)].map((m) => (
					<TableRow
						key={m}
						onClick={() => navigate({ to: "/order/$id", params: { id: "id" } })}
						className="cursor-pointer focus:bg-accent"
					>
						<TableCell>2142</TableCell>
						<TableCell>
							<div>
								<p className="font-medium"> Kundan Bhosale</p>
								<p className="font-light">9325029914</p>
							</div>
						</TableCell>
						<TableCell>
							<div>
								<p className="font-medium"> Kundan Bhosale</p>
								<p className="font-light">9325029914</p>
							</div>
						</TableCell>

						<TableCell>
							<p>Ordered</p>
						</TableCell>
						<TableCell>
							<Badge className="" variant={"success"}>
								10 mins
							</Badge>
						</TableCell>
						<TableCell>{formatAmount("inr", 320)}</TableCell>
						<TableCell>
							<Link
								to="/"
								className={cn(
									buttonVariants({ size: "icon", variant: "outline" }),
								)}
							>
								<ArrowRight />
							</Link>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

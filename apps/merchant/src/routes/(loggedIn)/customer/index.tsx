import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
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
import { Dot, Phone, Plus } from "lucide-react";

export const Route = createFileRoute("/(loggedIn)/customer/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isMobile } = useViewport();

	return (
		<div>
			<DashboardHeader title="Customers">
				<Button>
					<Plus />
					Create Customer
				</Button>
			</DashboardHeader>

			<div className="lg:p-8 lg:space-y-8">
				{/* <div className="p-4 lg:p-0">
					<div className="border grid grid-cols-4 divide-x bg-background">
						{data.map((d, i) => (
							<div className="p-4" key={i}>
								<h1 className="lg:text-xl font-semibold">{d.value}</h1>
								<h2 className="lg:text-sm font-light text-xs">
									{d.name} {!isMobile && "Customers"}
								</h2>
							</div>
						))}
					</div>
				</div> */}
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
					to={"/customer/$id"}
					params={{ id: "id" }}
					className="flex p-4"
					key={m}
				>
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<Avatar className="size-10">
								<AvatarImage />
								<AvatarFallback>A</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium inline-flex items-center truncate text-base">
									Kundan Bhosale <Dot />
									<span className="font-light">932554253424</span>
								</p>
								<p className="line-clamp-1 text-sm text-muted-foreground">
									Bhagwan Pur, Chhapra - Rewa - Muzaffarpur Rd, Shrirampuri,
									Muzaffarpur, Bhagwanpur, Bihar 842001, India
								</p>
							</div>
						</div>

						<Link
							to="/"
							className={cn(
								buttonVariants({ variant: "outline", size: "icon" }),
							)}
						>
							<Phone />
						</Link>
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
					<TableHead className="w-52">Name</TableHead>
					<TableHead className="">Address</TableHead>
					<TableHead className="w-24">Orders</TableHead>
					<TableHead className="w-24">Returns</TableHead>
					<TableHead className="w-24">Refunds</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...Array(40)].map((m) => (
					<TableRow
						key={m}
						className="cursor-pointer"
						onClick={() =>
							navigate({ to: "/customer/$id", params: { id: "id" } })
						}
					>
						<TableCell>
							<div>
								<p className="font-medium"> Kundan Bhosale</p>
								<p className="font-light">9325029914</p>
							</div>
						</TableCell>
						<TableCell>
							Bhagwan Pur, Chhapra - Rewa - Muzaffarpur Rd, Shrirampuri,
							Muzaffarpur, Bhagwanpur, Bihar 842001, India
						</TableCell>
						<TableCell>100</TableCell>
						<TableCell>0</TableCell>
						<TableCell>0</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

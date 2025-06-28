import { apiClient } from "@lipy/lib/api";
import { useSoundPlayer } from "@lipy/lib/hooks/use-sound";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card, CardHeader, CardTitle } from "@lipy/web-ui/components/ui/card";
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
import type { InferResponseType } from "hono/client";
import { ArrowUpRight, Dot, Plus } from "lucide-react";
import { z } from "zod";
import { CustomerForm } from "./-form";

export const Route = createFileRoute("/(loggedIn)/customer/")({
	component: RouteComponent,
	validateSearch: z.object({
		page: z.coerce.number().int().min(1).catch(1),
		q: z.string().default(""),
	}),
});

type Response = InferResponseType<typeof apiClient.v1.merchant.product.$get>;

function RouteComponent() {
	const { isMobile } = useViewport();
	const { page, q } = Route.useSearch();

	const { play, pause, stop } = useSoundPlayer({ loop: true });

	const { data, isLoading } = useAPIQuery(
		apiClient.v1.merchant.product,
		"$get",
		{
			query: { page: String(page), limit: String(10), q },
		},
		{ placeholderData: (p) => p },
	);

	return (
		<div>
			<DashboardHeader title="Customers">
				<CustomerForm type="create">
					<Button size={isMobile ? "icon-sm" : "sm"}>
						<Plus /> {!isMobile ? "Customer" : ""}
					</Button>
				</CustomerForm>
				<Button onClick={play}>Play</Button>
				<Button onClick={pause}>Pause</Button>
				<Button onClick={stop}>Stop</Button>
			</DashboardHeader>

			<div className="lg:p-8 lg:space-y-8">
				<div className="p-4 lg:p-0">
					<SearchBar placeholder="Search customers" defaultValue={q} />
				</div>
				{isLoading ? null : !data || data.items.length === 0 ? (
					<Card>
						<CardHeader>
							<CardTitle>No Cusotomers Found...</CardTitle>
						</CardHeader>
					</Card>
				) : (
					<>
						{isMobile ? (
							<MobileView items={data.items} />
						) : (
							<DesktopView items={data.items} />
						)}
						<Pagination {...data} />
					</>
				)}
			</div>
		</div>
	);
}

function MobileView({ items }: { items: Response["items"] }) {
	return (
		<div className="bg-background border divide-y">
			{items.map((m) => (
				<Link
					to={"/customer/$id"}
					params={{ id: m.id }}
					className="flex p-4"
					key={m.id}
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
					</div>
				</Link>
			))}
		</div>
	);
}

function DesktopView({ items }: { items: Response["items"] }) {
	const navigate = useNavigate();

	return (
		<Table className="bg-background border p-8">
			<TableHeader>
				<TableRow>
					{/* <TableHead className="w-32">#</TableHead> */}
					<TableHead className="w-52">Name</TableHead>
					<TableHead className="">Address</TableHead>
					<TableHead className="w-24">Orders</TableHead>
					<TableHead className="w-24">Returns</TableHead>
					<TableHead className="w-24">Refunds</TableHead>

					<TableHead className="w-10" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((m) => (
					<TableRow
						key={m.id}
						onClick={() =>
							navigate({ to: "/customer/$id", params: { id: m.id } })
						}
						className="cursor-pointer focus:bg-accent"
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

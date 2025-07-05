import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
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
import { formatDistanceToNow } from "date-fns";
import type { InferResponseType } from "hono/client";
import { ArrowUpRight, PlusCircle } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/(loggedIn)/order/")({
	component: RouteComponent,
	validateSearch: z.object({
		page: z.coerce.number().int().min(1).catch(1),
		q: z.string().default(""),
	}),
});

type Response = InferResponseType<typeof apiClient.v1.merchant.order.$get>;

function RouteComponent() {
	const { isMobile } = useViewport();
	const { page, q } = Route.useSearch();

	const { data, isLoading } = useAPIQuery(
		apiClient.v1.merchant.order,
		"$get",
		{
			query: { page: String(page), limit: String(10), q },
		},
		{ placeholderData: (p) => p },
	);

	return (
		<div>
			<DashboardHeader title="Orders">
				{/* <Link
					to="/order/$id"
					params={{ id: "" }}
					className={cn(buttonVariants({ size: "sm" }))}
				>
					<PlusCircle />
					New Order
				</Link> */}
			</DashboardHeader>

			<div className="lg:p-8 lg:space-y-8">
				<div className="p-4 lg:p-0">
					<SearchBar placeholder="Search orders" defaultValue={q} />
				</div>
				{isLoading ? null : !data || data.items.length === 0 ? (
					<Card>
						<CardHeader>
							<CardTitle>No Orders Found...</CardTitle>
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
					to={"/order/$id"}
					params={{ id: m.id }}
					className="flex p-4"
					key={m.id}
				>
					<div className="flex w-full gap-4 justify-between text-base">
						<div className="flex-1">
							<p className="text-xs font-light">{m.id}</p>
							<p className="font-medium inline-flex items-center truncate ">
								Kundan Bhosale
							</p>
							<p className="font-light">932554253424</p>
						</div>

						<div className="w-fit text-right">
							<p className="font-semibold text-lg">
								{formatAmount("inr", Number(m.totalAmount))}
							</p>
							<Badge>
								{m.orderedAt && ` ${formatDistanceToNow(m.orderedAt)} ago`}
							</Badge>
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
					<TableHead className="w-32">#</TableHead>
					{/* <TableHead className="">Customer</TableHead>
					<TableHead className="">Delivery Partner</TableHead>{" "} */}
					<TableHead className="w-32">Status</TableHead>
					<TableHead className="w-32">Ordered</TableHead>
					<TableHead className="w-24">Total</TableHead>
					<TableHead className="w-10" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((m) => (
					<TableRow
						key={m.id}
						onClick={() => navigate({ to: "/order/$id", params: { id: m.id } })}
						className="cursor-pointer focus:bg-accent"
					>
						<TableCell>{m.id}</TableCell>
						{/* <TableCell>
							<div>
								<p className="font-medium">Kundan Bhosale</p>
								<p className="font-light">9325029914</p>
							</div>
						</TableCell>
						<TableCell>
							<div>
								<p className="font-medium"> Kundan Bhosale</p>
								<p className="font-light">9325029914</p>
							</div>
						</TableCell> */}

						<TableCell>
							<Badge className="" variant={"success"}>
								{m.status}
							</Badge>
						</TableCell>
						<TableCell>
							<Badge className="" variant={"outline"}>
								{m.orderedAt && ` ${formatDistanceToNow(m.orderedAt)} ago`}
							</Badge>
						</TableCell>
						<TableCell>{formatAmount("inr", m.totalAmount || 0)}</TableCell>
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

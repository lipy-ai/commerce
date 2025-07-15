import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { SearchInput } from "@lipy/web-ui/components/forms/searchInput";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card, CardHeader, CardTitle } from "@lipy/web-ui/components/ui/card";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
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
import { ArrowUpRight, Plus } from "lucide-react";
import { z } from "zod";
import FormEdit from "./-form.edit";

export const Route = createFileRoute("/admin/product/")({
	component: RouteComponent,
	validateSearch: z.object({
		page: z.coerce.number().int().min(1).catch(1),
		q: z.string().default(""),
		category: z.string().optional(),
	}),
});

type Response = InferResponseType<typeof apiClient.v1.merchant.product.$get>;

function RouteComponent() {
	const { isMobile } = useViewport();
	const { page, q, category } = Route.useSearch();
	const navigate = Route.useNavigate();

	const { data, isLoading, isFetching } = useAPIQuery(
		apiClient.v1.admin.product,
		"$get",
		{
			query: { page: String(page), limit: String(10), q, category },
		},
		{ placeholderData: (p) => p },
	);

	return (
		<>
			<DashboardHeader title="Products">
				<FormEdit type="create">
					<Button size={"sm"}>
						<Plus />
						{isMobile ? "" : "New Product"}
					</Button>
				</FormEdit>
			</DashboardHeader>

			<div className="lg:p-8 lg:space-y-8 flex flex-col flex-1">
				<div className="p-4 lg:p-0 flex flex-col lg:flex-row items-center gap-2">
					<SearchInput
						type="categories"
						value={category || ""}
						onChange={(v) =>
							navigate({ search: (p) => ({ ...p, category: v || "" }) })
						}
						placeholder={"Select Category"}
						name={"Category"}
						className="lg:w-fit"
					/>
					<SearchBar
						placeholder="Search products"
						defaultValue={q}
						className="flex-1 w-full lg:w-auto p-0"
					/>
				</div>
				{isLoading || isFetching ? (
					<Skeleton className="flex-1 mx-4 lg:mx-0" />
				) : !data || data.items.length === 0 ? (
					<Card className="m-4 md:m-0">
						<CardHeader>
							<CardTitle>No Products Found...</CardTitle>
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
		</>
	);
}

function MobileView({ items }: { items: Response["items"] }) {
	return (
		<div className="bg-background border divide-y">
			{items.map((m) => (
				<Link
					to={"/admin/product/$id"}
					params={{ id: m.id }}
					className="flex p-4"
					key={m.id}
				>
					<div className="flex w-full gap-4 justify-between text-base">
						<div className="grid grid-cols-[75px_auto] gap-2">
							<img
								src={m.thumbnail || ""}
								alt={m.title || ""}
								className="aspect-square border rounded bg-accent"
							/>
							<div className="block break-words">
								<p className="font-medium line-clamp-1">{m.title}</p>
								<p className="font-light line-clamp-1">{m.summary}</p>
								{<Badge size={"small"}>In Stock</Badge>}
							</div>
						</div>

						<div className="w-fit text-right">
							<p className="font-semibold text-lg">
								{formatAmount("inr", m?.price || 0)}
							</p>
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

function DesktopView({ items }: { items: Response["items"] }) {
	const navigate = useNavigate();

	return (
		<Table className="bg-background border p-8">
			<TableHeader>
				<TableRow>
					{/* <TableHead className="w-32">#</TableHead> */}
					<TableHead className="">Product</TableHead>

					<TableHead className="w-32">Status</TableHead>
					<TableHead className="w-32">Stock</TableHead>
					<TableHead className="w-24">Amount</TableHead>

					<TableHead className="w-10" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((m) => (
					<TableRow
						key={m.id}
						onClick={() =>
							navigate({ to: "/admin/product/$id", params: { id: m.id } })
						}
						className="cursor-pointer focus:bg-accent"
					>
						{/* <TableCell className="truncate">{m.id}</TableCell> */}
						<TableCell>
							<div className="grid grid-cols-[50px_auto] gap-2">
								<img
									src={m.thumbnail || ""}
									alt={m.title || ""}
									className="size-12 border rounded bg-accent"
								/>
								<div className="block break-words">
									<p className="font-medium">{m.title}</p>
									<p className="font-light">{m.summary}</p>
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
						<TableCell> {formatAmount("inr", m?.price || 0)}</TableCell>
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

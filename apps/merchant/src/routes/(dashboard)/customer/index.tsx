import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
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
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { Dot, Plus } from "lucide-react";
import { z } from "zod";
import { CustomerForm } from "./-form";

export const Route = createFileRoute("/(dashboard)/customer/")({
	component: RouteComponent,
	validateSearch: z.object({
		page: z.coerce.number().int().min(1).catch(1),
		q: z.string().default(""),
	}),
});

type Response = InferResponseType<typeof apiClient.v1.merchant.customer.$get>;

function RouteComponent() {
	const { isMobile } = useViewport();
	const { page, q } = Route.useSearch();

	const { data, isLoading } = useAPIQuery(
		apiClient.v1.merchant.customer,
		"$get",
		{
			query: { page: String(page), limit: String(10), q },
		},
		{ placeholderData: (p) => p },
	);

	return (
		<>
			<DashboardHeader title="Customers">
				<CustomerForm type="create">
					<Button size="sm">
						<Plus /> {!isMobile ? "Customer" : ""}
					</Button>
				</CustomerForm>
			</DashboardHeader>

			<div className="lg:p-8 lg:space-y-8 flex flex-col flex-1">
				<div className="p-4 lg:p-0">
					<SearchBar placeholder="Search customers" defaultValue={q} />
				</div>
				{isLoading ? null : !data || data.items.length === 0 ? (
					<Card className="mx-4 md:m-0">
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
		</>
	);
}

function MobileView({ items }: { items: Response["items"] }) {
	return (
		<div className="bg-background border divide-y">
			{items.map((m) => (
				<Link
					to={"/customer/$id"}
					params={{ id: m?.id || "" }}
					className="flex p-4"
					key={m.id}
				>
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<Avatar className="size-10">
								<AvatarImage src={m.image || ""} />
								<AvatarFallback>{m?.name?.[0]}</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium inline-flex items-center truncate text-base">
									{m.name}
									<Dot />
									<span className="font-light">{m.phoneNumber}</span>
								</p>
								{/* <p className="line-clamp-1 text-sm text-muted-foreground">
									Bhagwan Pur, Chhapra - Rewa - Muzaffarpur Rd, Shrirampuri,
									Muzaffarpur, Bhagwanpur, Bihar 842001, India
								</p> */}
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
		<Table className="border p-8">
			<TableHeader>
				<TableRow>
					<TableHead className="w-10">#</TableHead>
					<TableHead className="">Name</TableHead>
					<TableHead className="">Phone</TableHead>
					<TableHead className="">Email</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((m) => (
					<TableRow
						key={m.id}
						onClick={() =>
							navigate({ to: "/customer/$id", params: { id: m.id || "" } })
						}
						className="cursor-pointer focus:bg-accent"
					>
						<TableCell>
							<Avatar className="size-10">
								<AvatarImage src={m.image || ""} />
								<AvatarFallback>{m?.name?.[0]}</AvatarFallback>
							</Avatar>
						</TableCell>
						<TableCell>
							<div>
								<p className="font-medium"> {m.name}</p>
							</div>
						</TableCell>
						<TableCell>
							<p className="font-light">{m.phoneNumber}</p>
						</TableCell>
						<TableCell>
							<p className="font-light">{m.email}</p>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

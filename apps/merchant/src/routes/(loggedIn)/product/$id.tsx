import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";

import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";

import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { Eye, PenLine } from "lucide-react";
import { Fragment } from "react";

import FormEdit from "./-form.edit";

export const Route = createFileRoute("/(loggedIn)/product/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const product = useAPIQuery(apiClient.v1.merchant.product[":id"], "$get", {
		param: { id },
	});

	return (
		<>
			{product.isLoading ? (
				<Skeleton className="flex-1 m-8" />
			) : (
				<>
					<DashboardHeader title={product.data?.title || ""} />
					<div className="grid lg:grid-cols-3 p-4 lg:p-8 gap-4 lg:gap-8">
						<div className="lg:col-span-2">
							<BasicProductDetails data={product.data} />
						</div>
						<div className="">
							<Variations data={product.data} />
						</div>
					</div>
				</>
			)}
		</>
	);
}

export function Variations({ data }: { data: any }) {
	return (
		<div>
			<Card className="">
				<CardHeader>
					<CardTitle>Variants</CardTitle>
				</CardHeader>
				<CardContent>
					<div>
						<p> {data?.variations?.label}</p>
						<p> {data?.variations?.value}</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export function BasicProductDetails({
	data,
}: {
	data?: InferResponseType<
		(typeof apiClient.v1.merchant.product)[":id"]["$get"]
	>;
}) {
	// const [pending, trans] = useTransition();
	// const queryClient = useQueryClient();
	// const navigate = Route.useNavigate();

	const { isMobile } = useViewport();
	// const delMutation = useAPIMutation(apiClient.v1.merchant.product, "$delete", {
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries({
	// 			queryKey: apiQueryOptions(
	// 				apiClient.v1.merchant.product,
	// 				"$get",
	// 				{} as any,
	// 			).queryKey,
	// 		});
	// 		setOpen?.("");
	// 		navigate({ to: "/product", replace: true });
	// 	},
	// });

	// const handleDelete = () => {
	// 	if (!data) return;
	// 	trans(() => {
	// 		delMutation.mutateAsync({ json: { ids: [data.id] } });
	// 	});
	// };

	const mrp = data?.maxPrice || 0;
	const sp = data?.price || 0;

	return (
		<div className="space-y-8">
			<Card className="">
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
					<CardAction className={cn("flex gap-2")}>
						{!isMobile && (
							<Button
								// onClick={() => setOpen("general")}
								variant={"outline"}
								size={"sm"}
							>
								<Eye /> {!isMobile && "Preview"}
							</Button>
						)}
						{/* <Button
							onClick={() => setOpen("delete")}
							variant={"outline"}
							size={"sm"}
							disabled={pending}
						>
							<Trash /> {!isMobile && (pending ? "Deleting" : "Delete")}
						</Button> */}
						<FormEdit type="update" data={data}>
							<Button variant={"outline"} size={"sm"}>
								<PenLine /> {!isMobile && "Edit"}
							</Button>
						</FormEdit>
					</CardAction>
				</CardHeader>
				<CardContent className="space-y-8">
					<div className="flex gap-4">
						<div className="relative">
							<img
								src={data?.thumbnail || ""}
								alt={data?.title || "Untitled"}
								className="size-24 aspect-square object-cover bg-accent border rounded"
							/>
							{(data?.images?.length || 0) > 0 && (
								<Badge variant={"outline"} className="absolute -top-1 -right-1">
									{data?.images?.length}+
								</Badge>
							)}
						</div>
						<div className="flex justify-between w-full">
							<div>
								<p className="text-lg">{data?.title}</p>
								<p className="text-sm text-muted-foreground">
									{data?.category.title}
								</p>

								{/* <p className="text-sm text-muted-foreground">{data.summary}</p> */}
							</div>
							<div>
								<Badge variant={"success"}>
									{formatAmount("inr", mrp - sp)} Off
								</Badge>
								<p className="text-2xl font-medium">
									{formatAmount("inr", sp)}{" "}
									<span className="line-through text-muted-foreground text-base">
										{formatAmount("inr", mrp)}
									</span>
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Highlights</CardTitle>
				</CardHeader>
				<CardContent>
					{data?.highlights && (
						<div className="grid grid-cols-[120px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
							{data?.highlights.map((d, i) => (
								<Fragment key={i}>
									<Label>{d.label}</Label>
									<p>{d.value}</p>
								</Fragment>
							))}
						</div>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>More Information</CardTitle>
				</CardHeader>
				<CardContent>
					{data?.information && (
						<div className="grid grid-cols-[120px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
							{data?.information.map((d, i) => (
								<Fragment key={i}>
									<Label>{d.label}</Label>
									<p>{d.value}</p>
								</Fragment>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

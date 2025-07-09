import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
	apiQueryOptions,
	useAPIMutation,
	useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@lipy/web-ui/components/ui/collapsible";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@lipy/web-ui/components/ui/hover-card";
import { Label } from "@lipy/web-ui/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@lipy/web-ui/components/ui/select";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import type { InferRequestType } from "hono";
import { Info } from "lucide-react";
export const Route = createFileRoute("/(dashboard)/order/$id/")({
	component: RouteComponent,
});

type PatchTypes = InferRequestType<
	(typeof apiClient.v1.merchant.order)[":id"]["$patch"]
>;
function RouteComponent() {
	const { id }: any = Route.useParams();
	const queryClient = useQueryClient();
	const q = apiQueryOptions(apiClient.v1.merchant.order[":id"], "$get", {
		param: { id },
	})

	const { data, isLoading } = useAPIQuery(
		apiClient.v1.merchant.order[":id"],
		"$get",
		{
			param: { id },
		},
	)
	const mutation = useAPIMutation(
		apiClient.v1.merchant.order[":id"],
		"$patch",
		{
			onMutate: ({ json }) => {
				queryClient.setQueryData(q.queryKey, (p: typeof data) => ({
					...p,
					status: json.status,
				}))
			},
			onError() {
				queryClient.invalidateQueries({ queryKey: q.queryKey });
			},
		},
	)

	const handlePrint = () => {
		const printContents = document.getElementById("invoice-content")?.innerHTML;
		if (!printContents) return;

		const originalContents = document.body.innerHTML;
		document.body.innerHTML = printContents;
		window.print();
		document.body.innerHTML = originalContents;
		window.location.reload();
	}

	const status = [
		"ordered",
		"accepted",
		"packed",
		"out_for_delivery",
		"delivered",
		"return_requested",
		"refunded",
		"replaced",
		"cancelled",
	] satisfies PatchTypes["json"]["status"][];

	const handlePatch = async (status: PatchTypes["json"]["status"]) => {
		await mutation.mutateAsync({ param: { id }, json: { status } });
	}

	return (
		<>
			{isLoading ? (
				<Skeleton className="flex-1 m-8" />
			) : (
				<>
					<div className="min-h-screen flex flex-col">
						<DashboardHeader title="Edit Order" />{" "}
						{/* Hidden iframe for printing */}
						<div
							className="lg:grid lg:grid-cols-12 flex-1 md:p-4 gap-8 print:p-0"
							id={"invoice-content"}
						>
							<Card className="col-span-8 print:shadow-none">
								<CardContent className="divide-y p-0 py-4 lg:p-4 print:border-none">
									<div className="flex flex-col lg:flex-row gap-8 lg:gap-4 p-4 justify-between">
										<div className="">
											<div>
												<h1 className="text-2xl font-semibold mb-2">
													Order ID: {id}
												</h1>
											</div>
											<div className="flex flex-col md:flex-row gap-2">
												<p>
													Order Date:{" "}
													<span className="font-medium">
														{data?.orderedAt && format(data?.orderedAt, "Pp")}
													</span>
												</p>
												<span className="hidden md:block print:hidden">|</span>
												<p className="text-primary print:hidden">
													Delivery in 10 mins
												</p>
											</div>
										</div>
										<div className="flex gap-4 print:hidden">
											<Button variant={"outline"} onClick={() => handlePrint()}>
												Invoice
											</Button>
											<Select
												defaultValue={data?.status || status[0]}
												onValueChange={(v) => handlePatch(v as any)}
												disabled={mutation.isPending}
											>
												<SelectTrigger className="capitalize pl-0">
													<span className={buttonVariants()}>
														Change Status
													</span>
													<Separator orientation="vertical" />
													<SelectValue placeholder="Order Status" />
												</SelectTrigger>
												<SelectContent>
													{status.map((s) => (
														<SelectItem
															key={s}
															value={s}
															className={cn(
																"capitalize",
																status.indexOf(s) <=
																	status.indexOf(data?.status as any) &&
																	"pointer-events-none bg-muted/30 text-muted-foreground my-1",
															)}
														>
															{s.replaceAll("_", " ")}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className="py-4">
										{data?.items?.map((m, i) => (
											<div
												key={i}
												className="flex gap-2 items-center print:py-2 p-4"
											>
												<img
													src={m.thumbnail}
													alt={m.title}
													className="size-12 border rounded bg-accent print:hidden"
												/>
												<div className="flex-1">
													<h2 className="font-semibold">{m.title}</h2>
													<p className="text-sm text-muted-foreground">
														{m.variant.unit}
													</p>
												</div>
												<div className="text-right">
													<p className="font-medium">
														{formatAmount("inr", m.variant.price)}
													</p>
													<p className="text-sm text-muted-foreground">
														Qty {m.quantity}
													</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
							<Card className="col-span-4 print:shadow-none print:border-t">
								<CardContent className="space-y-4 px-0 py-4 lg:p-4 divide-y border-t print:border-0">
									<div className="space-y-4 p-4">
										<Label>Payment Summary</Label>
										<div className="space-y-4">
											<div className="flex justify-between">
												<p>Item Total ({data?.items?.length} Items)</p>
												<p className="font-medium">
													{formatAmount("inr", Number(data?.itemTotalAmount))}
												</p>
											</div>

											<Collapsible>
												<CollapsibleTrigger asChild>
													<div className="flex w-full justify-between">
														<p className="flex gap-1 items-center">
															Total Discount
															<HoverCard>
																<HoverCardTrigger>
																	<Info className="size-4" />
																</HoverCardTrigger>
																<HoverCardContent>
																	Total discount applied on this order
																</HoverCardContent>
															</HoverCard>
														</p>
														<p className="">
															{formatAmount(
																"inr",
																Number(data?.totalDiscountAmount),
															)}
														</p>
													</div>
												</CollapsibleTrigger>
												<CollapsibleContent className="space-y-2 my-2 py-2  text-muted-foreground">
													{data?.discounts?.map((t) => (
														<div
															key={t.id}
															className="flex w-full justify-between"
														>
															<p className="capitalize">{t.name}</p>
															<p className="">
																{formatAmount("inr", Number(t?.amount))}
															</p>
														</div>
													))}
												</CollapsibleContent>
											</Collapsible>
											<Collapsible>
												<CollapsibleTrigger asChild>
													<div className="flex w-full justify-between">
														<p className="flex gap-1 items-center">
															Total Taxes
															<HoverCard>
																<HoverCardTrigger>
																	<Info className="size-4" />
																</HoverCardTrigger>
																<HoverCardContent>
																	Total taxes applied on this order
																</HoverCardContent>
															</HoverCard>
														</p>
														<p className="font-medium">
															{formatAmount(
																"inr",
																Number(data?.totalDiscountAmount),
															)}
														</p>
													</div>
												</CollapsibleTrigger>
												<CollapsibleContent className="space-y-2 my-2 py-2  text-muted-foreground">
													{data?.taxes?.map((t) => (
														<div
															key={t.id}
															className="flex w-full justify-between"
														>
															<p className="capitalize">{t.name}</p>
															<p className="font-medium">
																{formatAmount("inr", Number(t?.amount))}
															</p>
														</div>
													))}
												</CollapsibleContent>
											</Collapsible>
										</div>
									</div>
									<div className="flex justify-between items-center p-4">
										<p className="font-semibold text-xl">Total Payable</p>
										<p className="font-semibold text-3xl mb-2">
											{formatAmount("inr", Number(data?.itemTotalAmount))}
										</p>
									</div>
									<div className="space-y-4 p-4">
										<Label>Contact Info</Label>
										<div className="space-y-1">
											<p className="">{data?.customerDetails?.name}</p>
											<p className="">
												<span>{data?.customerDetails?.phone}</span>
											</p>
										</div>
									</div>
									<div className="space-y-4 p-4">
										<Label>Delivery Address</Label>
										<div className="space-y-1">
											<p className="">
												{data?.customerDetails?.address?.line1}
												{data?.customerDetails?.address?.line2
													? `, ${data?.customerDetails?.address?.line2}`
													: ""}
											</p>
											<p>{data?.customerDetails?.address?.city}</p>
											<p>{data?.customerDetails?.address?.postalCode}</p>
											<p>
												{data?.customerDetails?.address?.state},
												{data?.customerDetails?.address?.country}
											</p>
										</div>
									</div>
									<div className="space-y-4 p-4 print:hidden">
										<Label>Delivery Partner</Label>

										<div className="space-y-4">
											<div className="flex gap-2">
												<Avatar className="size-12">
													<AvatarImage src="https://picsum.photos/200" alt="" />
													<AvatarFallback>A</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">Kundan Bhosale</p>
													<p className="text-sm">+91 3567866754</p>
												</div>
											</div>
											<p className="font-light text-sm">
												Delivery partner was assigned on 12 Feb 2025
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</>
			)}
		</>
	)
}

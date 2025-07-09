import { apiClient } from "@lipy/lib/api";
import {
	apiQueryOptions,
	useAPIMutation,
	useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";

import {
	DrawerDialogClose,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import {
	FormButton,
	FormInput,
	FormSwitch,
} from "@lipy/web-ui/components/forms/elements";
import {
	DashboardHeader,
	useLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import {
	Form,
	FormDescription,
	FormLabel,
} from "@lipy/web-ui/components/ui/form";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { InferResponseType } from "hono";
import { produce } from "immer";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
export const Route = createFileRoute("/(dashboard)/product/add/")({
	component: RouteComponent,
	validateSearch: z.object({
		page: z.coerce.number().int().min(1).catch(1),
		q: z.string().default(""),
	}),
});

type Response = InferResponseType<typeof apiClient.v1.merchant.product.$get>;

function RouteComponent() {
	const { page, q } = Route.useSearch();
	const { addFooter, removeFooter } = useLayout();
	const queryClient = useQueryClient();

	const query = { page: String(page), limit: String(3 * 3), q };
	const { data, isLoading } = useAPIQuery(
		apiClient.v1.merchant.product,
		"$get",
		{
			query,
		},
		{
			placeholderData: (p) => p,
		},
	)

	const mutation = useAPIMutation(apiClient.v1.merchant.inventory, "$patch", {
		onMutate({ json }) {
			queryClient.setQueryData(
				apiQueryOptions(apiClient.v1.merchant.product, "$get", {
					query,
				}).queryKey,
				(prev: typeof data) =>
					produce(prev, (draft) => {
						if (!draft) return draft;

						let variantIdx = -1;
						const productIdx = draft.items.findIndex((product) => {
							const idx = product.variants?.findIndex(
								(variant) => variant.id === json.variantId,
							)
							if (Number(idx) >= 0) {
								variantIdx = idx
								return true
							}
							return false
						})
						if (productIdx !== -1 && variantIdx !== -1) {
							const variant = draft.items[productIdx].variants[variantIdx];
							draft.items[productIdx].variants[variantIdx] =
								json.operation !== "delete"
									? {
											...variant,
											inventoryId: json.id,
											storePrice: Number(json.price),
											stock: Number(json.stock),
											sku: json.sku || null,
										}
									: {
											...variant,
											storePrice: null,
											stock: null,
											sku: null,
											inventoryId: null,
										}
						}

						return draft
					}),
			)
		},
	})

	const onSubmit = async (
		m: Response["items"][0]["variants"][0] & { active: boolean },
	) => {
		await mutation.mutateAsync({
			json: {
				id: m.inventoryId || crypto.randomUUID(),
				variantId: m.id!,
				sku: m.sku || undefined,
				price: m.price === null ? undefined : Number(m.price),
				stock: m.stock === null ? undefined : Number(m.stock),
				operation: m.inventoryId
					? "update"
					: m.inventoryId && !m.active
						? "delete"
						: "create",
			},
		})
	}

	const [updates, setUpdates] = useState<Response["items"][0]["variants"]>([]);

	const SaveBtn = () => (
		<Card className="">
			<CardContent className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 drop-shadow">
				<div className="flex gap-4 w-full md:w-auto">
					<Button className="flex-1">
						<CheckCircle />
						Save {updates.length} Changes
					</Button>

					<Button
						className="flex-1"
						// size={"icon"}
						variant={"outline"}
						onClick={() => setUpdates([])}
					>
						<XCircle /> Clear
					</Button>
				</div>
			</CardContent>
		</Card>
	)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (updates.length > 0) {
			addFooter({ id: "save-btn", node: <SaveBtn /> });
		} else {
			removeFooter("save-btn");
		}
		return () => {
			removeFooter("save-btn");
		}
	}, [updates]);

	return (
		<div>
			<DashboardHeader title="Add Products" />

			<div className="lg:p-8 lg:space-y-8">
				<div className="p-4 lg:p-0">
					<SearchBar placeholder="Search products" defaultValue={q} />
				</div>
				{isLoading ? null : !data || data.items.length === 0 ? (
					<Card>
						<CardHeader>
							<CardTitle>No Products Found...</CardTitle>
						</CardHeader>
					</Card>
				) : (
					<>
						<div className="grid md:grid-cols-3 2xl:grid-cols-3  divide-x divide-y border">
							{data.items.map((m, i) => (
								<SingProduct product={m} key={i} onSubmit={onSubmit} />
							))}
						</div>
						<Pagination {...data} />
					</>
				)}
			</div>
		</div>
	)
}

function SingProduct({
	product,
	onSubmit,
}: {
	product: Response["items"][0];
	onSubmit: (
		v: Response["items"][0]["variants"][0] & { active: boolean },
	) => void;
}) {
	const m = product;
	return (
		<div className="space-y-8  p-8 border-r" key={m.id}>
			<div className="flex gap-4">
				<div className="size-14 overflow-hidden">
					<img
						src={m.thumbnail || ""}
						alt={m.title || ""}
						className="size-full object-cover"
					/>
				</div>
				<div className="flex-1">
					<p className="font-semibold">{m.title}</p>
					<p className="line-clamp-2"> {m.summary}</p>
				</div>
			</div>
			<div className="flex-1">
				<div className="grid gap-6">
					{!m.variants || m.variants?.length === 0 ? (
						<div className="p-4 text-base gap-2 items-center border flex justify-between">
							<span>No Variants Yet....</span>
							<Button variant={"link"} className="text-base">
								Raise Request
							</Button>
						</div>
					) : (
						m.variants?.map((v, i) => {
							// const isActive = activeIds.includes(v.id || "");
							return <EditVariation data={v} key={i} onSubmit={onSubmit} />;
						})
					)}
				</div>
			</div>
		</div>
	)
}

// function StockToggle({
// 	onPressedChange,
// }: { onPressedChange?: (v: boolean) => void }) {
// 	const [active, setActive] = useState(false);

// 	return (
// 		<Toggle
// 			pressed={active}
// 			onPressedChange={(v) => {
// 				setActive(v);
// 				onPressedChange(v);
// 			}}
// 			className={cn(
// 				"flex flex-col justify-center min-w-auto text-center items-center py-2 gap-0  h-12 text-xs cursor-pointer bg-accent rounded-none",
// 			)}
// 		>
// 			<span className="font-semibold">{active ? "IN" : "OUT"}</span>
// 			<span className="font-light">Stock</span>
// 		</Toggle>
// 	);
// }

function EditVariation({
	data,
	onSubmit,
}: {
	data: Response["items"][0]["variants"][0];
	onSubmit: (
		v: Response["items"][0]["variants"][0] & { active: boolean },
	) => void;
}) {
	const [open, setOpen] = useState(false);

	const defaultValues = {
		active: !!data.inventoryId || false,
		price: data?.storePrice || data?.price || 0,
		stock: data?.stock || 0,
		sku: data?.sku || "",
	}

	const form = useForm({
		defaultValues,
	})

	const isActivated = form.watch("active");

	const handle = async (body: typeof defaultValues) => {
		onSubmit({ ...data, ...body });

		setOpen(false);
	}

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				className={cn("text-sm border border-primary/30 relative")}
			>
				<p
					className={cn(
						"absolute before:absolute before:-z-10 before:-inset-1 before:block before before:bg-primary/20 after:absolute after:-z-20 after:-inset-1 after after:block after:bg-white -top-3 z-10 inline-flex text-foreground bg-white text-xs px-2",
						data.stock &&
							data.stock !== 0 &&
							"before:bg-primary text-primary-foreground",
					)}
				>
					{data?.unit}
				</p>
				<div className="text-sm md:text-base">
					<div
						className={cn(
							"flex has-[input:focus]:bg-muted overflow-hidden h-12",
							data.inventoryId ? "" : "disabled-background",
						)}
					>
						<span className="pl-2 flex items-center justify-center text-muted-foreground">
							₹
						</span>
						<span className="flex flex-1 flex-col px-2 h-12 justify-center">
							{data?.storePrice || data?.price}
						</span>
						{/* <Editable.Root
												defaultValue={String(v.price)}
												onValueChange={(val) => {
													String(val) !== String(v.price) &&
														updateInventory({ ...v, price: Number(val) });
												}}
												placeholder="0"
												triggerMode="focus"
												className="flex w-full"
											>
												<Editable.Area className="flex flex-1 flex-col px-2 h-12 justify-center">
													<Editable.Preview className="" />
													<Editable.Input type="number" className="w-full " />
													<Editable.Trigger />
												</Editable.Area>
											</Editable.Root> */}
						{/* <StockToggle />
											<EditVariation /> */}
					</div>
				</div>
				<div
					className={cn(
						"bg-accent/50 border-t border-accent text-sm px-2 py-0.5 flex justify-between gap-4 flex-wrap font-light",
						data.stock &&
							data.stock !== 0 &&
							"bg-primary text-primary-foreground",
					)}
				>
					<div className="flex">
						<span>
							{!data.storePrice
								? "Inactive"
								: !data?.stock
									? "Out of Stock"
									: data?.stock === -1
										? "In Stock"
										: data?.stock > 0
											? "${data?.stock} left"
											: "-"}
						</span>
					</div>
					{data.sku && (
						<div className="flex">
							<span>SKU: {data?.sku || "-"}</span>
						</div>
					)}
				</div>
			</div>
			<DrawerDialogSwitcher open={open} onOpenChange={setOpen}>
				<DrawerDialogHeader>
					<DrawerDialogTitle>Edit Variant</DrawerDialogTitle>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handle)} className="grid gap-8">
							<div className="grid">
								<div className="flex gap-4 flex-row items-center justify-between rounded-lg border p-3 my-4 shadow-sm">
									<div className="space-y-0.5 flex-1">
										<FormLabel>Activate / Deactivate</FormLabel>
										<FormDescription>Do you sell this variant?</FormDescription>
									</div>
									<FormSwitch name="active" wrapperClassName="w-fit" />
								</div>
								{isActivated && (
									<>
										<FormInput
											name="price"
											label="Price"
											placeholder="0"
											type="number"
											min={0}
										/>
										<FormInput
											name="stock"
											label="Stock Quantity"
											placeholder="0"
											type="number"
											min={-1}
										/>
										<FormInput name="sku" label="SKU" min={0} />
									</>
								)}
							</div>
							<DrawerDialogFooter>
								<DrawerDialogClose />
								<FormButton>Save Changes</FormButton>
							</DrawerDialogFooter>
						</form>
					</Form>
				</DrawerDialogHeader>
			</DrawerDialogSwitcher>
		</>
	)
}

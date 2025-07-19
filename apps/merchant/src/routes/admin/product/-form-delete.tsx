import { useGlobalSessionStore } from "@/stores/global";
import { apiClient } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import {
	DrawerDialogClose,
	DrawerDialogDescription,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Checkbox } from "@lipy/web-ui/components/ui/checkbox";
import { Label } from "@lipy/web-ui/components/ui/label";
import { useDebouncedCallback } from "@lipy/web-ui/hooks/use-debounced-callback";
import { cn } from "@lipy/web-ui/lib/utils";
import { type ReactNode, useState } from "react";
import { useProductInvalidate } from "./-hook-invalidate";

export default function FormDelete({
	children,
	id,
}: { id: string; children: ReactNode }) {
	const { promptOnDelete, update } = useGlobalSessionStore();
	const [open, setOpen] = useState(false);

	const { invalidate } = useProductInvalidate();

	const mutation = useAPIMutation(apiClient.v1.admin.product, "$delete", {
		onMutate: () => {
			setOpen(false);
		},
		onError: () => {
			invalidate();
		},
	});

	const handleDelete = useDebouncedCallback(async () => {
		await mutation.mutateAsync({ json: { ids: [id] } });
	}, 100);

	if (promptOnDelete)
		return (
			<DrawerDialogSwitcher
				className=""
				open={open}
				onOpenChange={setOpen}
				trigger={
					<div
						className={cn(
							(mutation.isPending || mutation.isSuccess) &&
								"pointer-events-none opacity-50",
						)}
					>
						{children}
					</div>
				}
			>
				<DrawerDialogHeader>
					<DrawerDialogTitle>Delete Product</DrawerDialogTitle>
					<DrawerDialogDescription>
						Are you sure, you want to delete product?
					</DrawerDialogDescription>
				</DrawerDialogHeader>
				<DrawerDialogFooter>
					<Label className="flex-1 justify-start">
						<Checkbox onCheckedChange={(v) => update({ promptOnDelete: !v })} />{" "}
						Don't ask again?
					</Label>
					<DrawerDialogClose />
					<Button onClick={handleDelete} variant="destructive">
						Delete Permanently
					</Button>
				</DrawerDialogFooter>
			</DrawerDialogSwitcher>
		);
	return (
		<div
			onClick={handleDelete}
			className={cn(
				(mutation.isPending || mutation.isSuccess) &&
					"pointer-events-none opacity-50",
			)}
		>
			{children}
		</div>
	);
}

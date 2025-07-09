import {
	DrawerDialogClose,
	DrawerDialogDescription,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Button } from "@lipy/web-ui/components/ui/button";
import { useState } from "react";

export default function FormDelete() {
	const handleDelete = () => {};
	const [open, setOpen] = useState(false);
	return (
		<DrawerDialogSwitcher className="" open={open} onOpenChange={setOpen}>
			<DrawerDialogHeader>
				<DrawerDialogTitle>Delete Product</DrawerDialogTitle>
				<DrawerDialogDescription>
					Are you sure, you want to delete product?
				</DrawerDialogDescription>
			</DrawerDialogHeader>
			<DrawerDialogFooter>
				<DrawerDialogClose />
				<Button onClick={handleDelete} variant="destructive">
					Delete Permanently
				</Button>
			</DrawerDialogFooter>
		</DrawerDialogSwitcher>
	);
}

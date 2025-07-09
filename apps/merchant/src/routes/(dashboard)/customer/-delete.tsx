import {
	DrawerDialogClose,
	DrawerDialogDescription,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Button } from "@lipy/web-ui/components/ui/button";
import { type ReactNode, useState } from "react";

export default function DeleteCustomer({ children }: { children: ReactNode }) {
	const handleDelete = () => {};
	const [open, setOpen] = useState(false);
	return (
		<DrawerDialogSwitcher
			className=""
			open={open}
			onOpenChange={setOpen}
			trigger={children}
		>
			<DrawerDialogHeader>
				<DrawerDialogTitle>Delete Customer</DrawerDialogTitle>
				<DrawerDialogDescription>
					Are you sure, you want to delete customer?
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

import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Dialog, DialogContent } from "../ui/dialog";
import { Drawer, DrawerContent } from "../ui/drawer";

export const DrawerDailogSwitcher = ({
	open,
	onOpenChange,
	children,
	handleInteractOutside = true,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
	handleInteractOutside?: boolean;
}) => {
	const { isMobile } = useViewport();
	if (isMobile) {
		return (
			<Drawer
				open={open}
				onOpenChange={onOpenChange}
				handleOnly={!handleInteractOutside}
			>
				<DrawerContent className="p-4">
					{/* <DrawerHeader>
						<DrawerTitle />
						<DrawerDescription />
					</DrawerHeader> */}
					{children}
				</DrawerContent>
			</Drawer>
		);
	}
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onInteractOutside={(e) => {
					if (!handleInteractOutside) {
						e.preventDefault();
					}
				}}
				className="[&>button:last-child]:hidden"
			>
				{/* <DialogHeader>
					<DialogTitle />
					<DialogDescription />
				</DialogHeader> */}

				{children}
			</DialogContent>
		</Dialog>
	);
};

import { useViewport } from "@lipy/web-ui/contexts/viewport";
import type { ReactNode } from "@tanstack/react-router";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";

const DrawerDialogSwitcher = ({
	open,
	onOpenChange,
	children,
	handleInteractOutside = true,
	className,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
	handleInteractOutside?: boolean;
	className?: string;
}) => {
	const { isMobile } = useViewport();
	if (isMobile) {
		return (
			<Drawer
				open={open}
				onOpenChange={onOpenChange}
				dismissible={handleInteractOutside}
			>
				<DrawerContent className={className}>{children}</DrawerContent>
			</Drawer>
		);
	}
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={className}
				onInteractOutside={(e) => {
					if (!handleInteractOutside) {
						e.preventDefault();
					}
				}}
			>
				{children}
			</DialogContent>
		</Dialog>
	);
};

const DrawerDialogHeader = (props: React.HTMLAttributes<HTMLDivElement>) => {
	const { isMobile } = useViewport();

	return isMobile ? <DrawerHeader {...props} /> : <DialogHeader {...props} />;
};

const DrawerDialogFooter = (props: React.HTMLAttributes<HTMLDivElement>) => {
	const { isMobile } = useViewport();

	return isMobile ? <DrawerFooter {...props} /> : <DialogFooter {...props} />;
};

const DrawerDialogTitle = (props: React.HTMLAttributes<HTMLDivElement>) => {
	const { isMobile } = useViewport();

	return isMobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />;
};

const DrawerDialogDescription = (
	props: React.HTMLAttributes<HTMLDivElement>,
) => {
	const { isMobile } = useViewport();

	return isMobile ? (
		<DrawerDescription {...props} />
	) : (
		<DialogDescription {...props} />
	);
};

const DrawerDialogClose = ({ children }: { children?: ReactNode }) => {
	const { isMobile } = useViewport();
	const Btn = () => {
		return (
			<Button variant={"outline"}>{children ? children : "Cancel"}</Button>
		);
	};
	return isMobile ? (
		<DrawerClose className="[&_button]:w-full">
			<Btn />
		</DrawerClose>
	) : (
		<DialogClose>
			<Btn />
		</DialogClose>
	);
};

export {
	DrawerDialogSwitcher,
	DrawerDialogClose,
	DrawerDialogTitle,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogDescription,
};

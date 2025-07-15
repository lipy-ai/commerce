import { DrawerDialogSwitcher } from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";

export const OptionsMenu = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	return (
		<DrawerDialogSwitcher open={open} onOpenChange={onOpenChange}>
			helo
		</DrawerDialogSwitcher>
	);
};

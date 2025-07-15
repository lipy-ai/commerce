import {
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Button } from "@lipy/web-ui/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, ChevronRight, Images } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute(
	"/(default)/(store)/$storeHandle/order/(pharmacy)/new",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const [openOptions, setOpenOptions] = useState(false);

	return (
		<>
			<DashboardHeader title="Upload prescription" />

			<div className="flex flex-col items-center justify-center h-full m-auto">
				<img
					src="/assets/prescription.svg"
					alt="prescription"
					className="size-64 object-cover pl-10 -mt-16"
				/>
			</div>
			{/* <input
				accept="image/*"
				id="icon-button-file"
				type="file"
				capture="environment"
			/> */}

			<div
				className="fixed bottom-0 w-full bg-card p-4"
				onClick={() => setOpenOptions(true)}
			>
				<Button className="w-full">Upload prescription</Button>
			</div>

			{openOptions && (
				<OptionsDrawer open={openOptions} onOpenChange={setOpenOptions} />
			)}
		</>
	);
}

function OptionsDrawer(props: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<div>
			<DrawerDialogSwitcher open={props.open} onOpenChange={props.onOpenChange}>
				<DrawerDialogHeader>
					<DrawerDialogTitle>Upload prescriptions</DrawerDialogTitle>
				</DrawerDialogHeader>

				<div className="cursor-pointer divide-y divide-dashed bg-card rounded-xl px-2">
					<div className="flex items-center justify-between py-4">
						<div className="flex items-center gap-4">
							<Camera className="size-5 flex-shrink-0" />
							<p className="font-medium text-sm">Capture from camera</p>
						</div>

						<ChevronRight className="size-4" />
					</div>
					<div className="flex items-center justify-between py-4">
						<div className="flex items-center gap-4">
							<Images className="size-5 flex-shrink-0" />
							<p className="font-medium text-sm">Upload from gallery</p>
						</div>

						<ChevronRight className="size-4" />
					</div>
				</div>
			</DrawerDialogSwitcher>
		</div>
	);
}

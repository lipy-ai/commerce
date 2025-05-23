import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { MapPinOff, Search } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";

export default function SetLocation({
	error,
	onRetry,
}: {
	error: string;
	onRetry: () => void;
}) {
	return (
		<Drawer open={true} handleOnly={true}>
			<DrawerContent>
				<DrawerHeader className="flex flex-col items-center justify-center">
					<MapPinOff className="size-16" />
					<DrawerTitle>{error}</DrawerTitle>
					<DrawerDescription>
						Please allow location permission for better experience.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<Button onClick={onRetry}>Continue</Button>

					{/* <Button variant="outline" >
              
            </Button> */}
					<Link
						to="/account/addresses"
						className={cn(buttonVariants({ variant: "outline" }))}
					>
						<Search />
						Search your location
					</Link>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

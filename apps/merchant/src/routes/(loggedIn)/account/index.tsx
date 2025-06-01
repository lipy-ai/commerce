import { authClient } from "@lipy/lib/providers/auth";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	Headset,
	LogOut,
	Settings2,
	Share2,
	Store,
	Trash,
	UserCircle,
	Users,
} from "lucide-react";

export const Route = createFileRoute("/(loggedIn)/account/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = authClient.useSession();

	return (
		<div>
			<DashboardHeader title="Settings" />
			<div className="max-w-4xl px-4 py-8 lg:p-8 space-y-8 lg:text-base text-lg">
				<div className="flex gap-2">
					<Avatar className="size-14">
						<AvatarImage src={data?.user.image || ""} />
						<AvatarFallback>{data?.user.name[0]}</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="font-medium text-lg"> {data?.user.name}</h1>
						<p> {data?.user.email}</p>
					</div>
				</div>
				<div className="bg-background border divide-y">
					<Link to="/account/profile" className="p-4 flex gap-4 items-center">
						<span>
							<UserCircle />
						</span>
						<span>Profile</span>
					</Link>

					<Link to="/store" className="p-4 flex gap-4 items-center">
						<span>
							<Store />
						</span>
						<span>My Store</span>
					</Link>
					<Link to="/store/staff" className="p-4 flex gap-4 items-center">
						<span>
							<Users />
						</span>
						<span>Store Staff</span>
					</Link>
					<Link
						to="/account/preferences"
						className="p-4 flex gap-4 items-center"
					>
						<span>
							<Settings2 />
						</span>
						<span>Preferences</span>
					</Link>
				</div>
				<div className="bg-background border divide-y">
					<Link to="/account/referral" className="p-4 flex gap-4 items-center">
						<span>
							<Share2 />
						</span>
						<span>Refer and Earn</span>
					</Link>
					<Link to="/account/support" className="p-4 flex gap-4 items-center">
						<span>
							<Headset />
						</span>
						<span>Customer Support</span>
					</Link>
					<Link to="/" className="p-4 flex gap-4 items-center">
						<span>
							<LogOut />
						</span>
						<span>Logout</span>
					</Link>
				</div>
				<div className="p-4 grid gap-4 lg:flex bg-destructive/10 border w-full">
					<div className="flex-1">
						<Label className="text-md font-medium">Delete Account</Label>
						<p className="font-light">
							This action is irreversible and will permanently deactivate your
							account.
						</p>
					</div>
					<div>
						<Button variant={"destructive"}>
							<Trash />
							Delete Account
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

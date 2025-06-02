import { authClient } from "@lipy/lib/providers/auth.tsx";
import SettingsCard from "@lipy/web-ui/components/custom-ui/settingsCard";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card } from "@lipy/web-ui/components/ui/card";
import { Label } from "@lipy/web-ui/components/ui/label";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	ChevronRight,
	Info,
	LogOut,
	MapPin,
	Share2,
	ShoppingBag,
	Store,
	UserCircle2,
} from "lucide-react";

export const Route = createFileRoute("/account/")({
	component: RouteComponent,
});

const yourInfo = [
	{
		icon: ShoppingBag,
		title: "Your Orders",
		url: "/account/orders",
	},
	{
		icon: UserCircle2,
		title: "Profile",
		url: "/account/profile",
	},
	{
		icon: MapPin,
		title: "Saved Addresses",
		url: "/account/addresses",
	},
];

const moreInfo = [
	{
		title: "Start your own shop",
		icon: Store,
		url: "/",
	},
	{
		title: "Share the app",
		icon: Share2,
		url: "/",
	},
	{
		title: "General Info",
		icon: Info,
		url: "/",
	},
	{
		title: "Logout",
		icon: LogOut,
		url: "/logout",
	},
];

function RouteComponent() {
	const { data } = authClient.useSession();

	const filteredMoreInfo = data
		? moreInfo
		: moreInfo.filter((item) => item.title !== "Logout");
	return (
		<div>
			<DashboardHeader title="Settings" />
			<div className={cn("p-4 lg:p-8 max-w-4xl space-y-8")}>
				{data ? (
					<div className="flex items-center gap-4">
						<Avatar className="size-12">
							<AvatarImage src={data?.user.image || ""} alt={data.user.name} />
							<AvatarFallback>
								<UserCircle2 width={40} height={75} strokeWidth={1.5} />
							</AvatarFallback>
						</Avatar>

						<div>
							<h1 className="font-semibold text-xl">
								{data?.user.name || "Hello, User"}
							</h1>
							<p className="text-muted-foreground">{data?.user.email || ""}</p>
						</div>
					</div>
				) : (
					<Card className="p-4 shadow-none">
						<h1 className="font-bold text-xl"> Hi 👋</h1>
						<p className="text-muted-foreground font-normal">
							Discover and shop from your favorite local businesses online. Join
							our community today and support local commerce.
						</p>
						<Link
							to="/login"
							className={cn(
								buttonVariants({ variant: "default" }),
								"flex items-center justify-between",
							)}
						>
							Log In / Sign up
							<ChevronRight />
						</Link>
					</Card>
				)}

				{data && (
					<div className="space-y-2">
						<Label>Your Information</Label>
						<SettingsCard items={yourInfo} />
					</div>
				)}

				<div className="space-y-2">
					<Label>{data ? "More" : "General"}</Label>

					<SettingsCard items={filteredMoreInfo} />
				</div>
			</div>
		</div>
	);
}

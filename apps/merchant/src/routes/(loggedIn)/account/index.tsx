import { authClient } from "@lipy/lib/providers/auth";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { createFileRoute } from "@tanstack/react-router";
import {
	Headset,
	LogOut,
	Settings2,
	Share2,
	Store,
	UserCircle2,
	Users,
} from "lucide-react";

import SettingsCard from "@lipy/web-ui/components/custom-ui/settingsCard";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";

export const Route = createFileRoute("/(loggedIn)/account/")({
	component: RouteComponent,
});

const generalInfo = [
	{
		title: "Profile",
		icon: UserCircle2,
		url: "/account/profile",
	},
	{
		title: "My Store",
		icon: Store,
		url: "/store",
	},
	{
		title: "Store Staff",
		icon: Users,
		url: "/store/staff",
	},
	{
		title: "Preferences",
		icon: Settings2,
		url: "/account/settings",
	},
];

const moreInfo = [
	{
		title: "Refer and Earn",
		icon: Share2,
		url: "/account/referral",
	},
	{
		title: "Customer Support",
		icon: Headset,
		url: "/account/support",
	},
	{
		title: "Logout",
		icon: LogOut,
		url: "/logout",
	},
];

function RouteComponent() {
	const { data } = authClient.useSession();
	const { isMobile } = useViewport();

	const filteredMoreInfo = data
		? moreInfo
		: moreInfo.filter((item) => item.title !== "Logout");

	return (
		<div>
			<DashboardHeader title="Settings" />
			<div className={cn(isMobile ? "p-4 " : "p-8", " space-y-8 max-w-4xl")}>
				{data && (
					<div className="flex items-center gap-4">
						<Avatar className="size-12">
							<AvatarImage src={data?.user.image || ""} alt="@shadcn" />
							<AvatarFallback>
								<UserCircle2 width={40} height={75} strokeWidth={1.5} />
							</AvatarFallback>
						</Avatar>

						<div>
							<h1 className="font-semibold text-xl">
								{data?.user.name || "Hello, User"}
							</h1>
							<p className="text-muted-foreground text-xs">
								{data?.user.email || ""}
							</p>
						</div>
					</div>
				)}

				<SettingsCard items={generalInfo} />
				<SettingsCard items={filteredMoreInfo} />
			</div>
		</div>
	);
}

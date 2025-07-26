// import { authClient } from "@lipy/lib/providers/auth";
// import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
// import {
// 	Avatar,
// 	AvatarFallback,
// 	AvatarImage,
// } from "@lipy/web-ui/components/ui/avatar";
// import { createFileRoute } from "@tanstack/react-router";
// import {
// 	Headset,
// 	LogOut,
// 	Settings2,
// 	Share2,
// 	Store,
// 	UserCircle2,
// 	Users,
// } from "lucide-react";

// import SettingsCard from "@lipy/web-ui/components/custom-ui/settingsCard";
// import { Label } from "@lipy/web-ui/components/ui/label";
// import { Spinner } from "@lipy/web-ui/components/ui/spinner";

// export const Route = createFileRoute("/(dashboard)/account/")({
// 	component: RouteComponent,
// });

// const generalInfo = [
// 	{
// 		title: "Profile",
// 		icon: UserCircle2,
// 		url: "/account/profile",
// 	},
// 	{
// 		title: "My Store",
// 		icon: Store,
// 		url: "/store",
// 	},
// 	{
// 		title: "Store Staff",
// 		icon: Users,
// 		url: "/store/staff",
// 	},
// 	{
// 		title: "Preferences",
// 		icon: Settings2,
// 		url: "/account/preferences",
// 	},
// ];

// const moreInfo = [
// 	{
// 		title: "Refer and Earn",
// 		icon: Share2,
// 		url: "/account/referral",
// 	},
// 	{
// 		title: "Customer Support",
// 		icon: Headset,
// 		url: "/account/support",
// 	},
// 	{
// 		title: "Logout",
// 		icon: LogOut,
// 		url: "/logout",
// 	},
// ];

// function RouteComponent() {
// 	const { data, isPending } = authClient.useSession();

// 	if (isPending) return <Spinner />;

// 	const filteredMoreInfo = data
// 		? moreInfo
// 		: moreInfo.filter((item) => item.title !== "Logout");

// 	return (
// 		<div>
// 			<DashboardHeader title="Settings" />
// 			<div className="p-4 lg:p-8 space-y-6 max-w-4xl mb-40">
// 				{data && (
// 					<div className="flex items-center gap-4 ">
// 						<Avatar className="size-12">
// 							<AvatarImage src={data?.user.image || ""} alt="" />
// 							<AvatarFallback>
// 								<UserCircle2 width={40} height={75} strokeWidth={1.5} />
// 							</AvatarFallback>
// 						</Avatar>

// 						<div>
// 							<h1 className="font-semibold text-xl">
// 								{data?.user.name || "Hello, User"}
// 							</h1>
// 							<p className="text-muted-foreground text-base">
// 								{data?.user.email || ""}
// 							</p>
// 						</div>
// 					</div>
// 				)}

// 				<div className="space-y-2">
// 					<Label className="text-base">General Information</Label>
// 					<SettingsCard items={generalInfo} />
// 				</div>

// 				<div className="space-y-2">
// 					<Label className="text-base">More</Label>
// 					<SettingsCard items={filteredMoreInfo} />
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import Loading from "@lipy/web-ui/components/ui/loading";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { AccountNav } from "./-nav";

export const Route = createFileRoute("/(dashboard)/account/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isMobile } = useViewport();
  const navigate = Route.useNavigate();

  useLayoutEffect(() => {
    !isMobile && navigate({ to: "/account/profile" });
  }, [isMobile, navigate]);

  if (!isMobile) {
    return <Loading />;
  }

  return (
    <>
      <DashboardHeader title="My Account" />
      <AccountNav />
    </>
  );
}

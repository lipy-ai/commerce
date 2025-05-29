// import { HorizontalNav } from "@lipy/web-ui/components/nav/horizontal";
// import HorizontalNavSkeleton from "@lipy/web-ui/components/skeleton/horizontal";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
import { User } from "lucide-react";

import { authClient } from "@lipy/lib/providers/auth";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/account")({
	component: RouteComponent,
});

const navs = [
	{
		url: "/account",
		label: "General",
	},
	{
		url: "/account/security",
		label: "Security",
	},
	{
		url: "/account/preferences",
		label: "Preferences",
	},
];

function RouteComponent() {
	const { data, isPending } = authClient.useSession();

	// if (isPending) {
	//   return <HorizontalNavSkeleton />;
	// }

	return (
		// <div className="p-8 space-y-8">
		//   <div className="flex gap-8 max-w-5xl bg-background p-4 border rounded-md">
		//     <div>
		//       <Avatar className="size-[125px] rounded-lg">
		//         <AvatarImage src="/logo.svg" />
		//         <AvatarFallback className="flex-1 rounded-none text-5xl">
		//           <User width={40} height={75} strokeWidth={1.5} />
		//         </AvatarFallback>
		//       </Avatar>
		//     </div>
		//     <div className="flex gap-4 justify-between w-full">
		//       <div>
		//         <h1 className="text-3xl">{data?.user.name}</h1>
		//         <p className="text-xl text-muted-foreground">{data?.user.email}</p>
		//         {/* {data?.user.createdAt && (
		//           <p className="text-sm font-light text-muted-foreground">
		//             Joined on {format(data?.user.createdAt, "PPpp")}
		//           </p>
		//         )} */}
		//       </div>
		//       <div>
		//         <Button>Upgrade Plan</Button>
		//       </div>
		//     </div>
		//   </div>

		//   <div>{/* <HorizontalNav navs={navs} /> */}</div>
		<>
			{/* <DashboardHeader title="Settings" />
      <div className="p-8"> */}
			<Outlet />
			{/* </div> */}
		</>
	);
}

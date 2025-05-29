import { authClient } from "@lipy/lib/providers/auth.tsx";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card } from "@lipy/web-ui/components/ui/card";
import { Separator } from "@lipy/web-ui/components/ui/separator";
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

	return (
		<div>
			<DashboardHeader title="Settings" />
			<div className="p-4">
				{data ? (
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
					<>
						<h1 className="text-sm font-semibold pb-1 pt-4 text-muted-foreground">
							Your Information
						</h1>
						<Card className="p-4 shadow-none">
							{yourInfo.map((item, index) => (
								<div key={index}>
									<Link to={item.url} className="flex flex-col gap-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Avatar className="size-7">
													<AvatarFallback>
														<item.icon className="size-4 text-muted-foreground" />
													</AvatarFallback>
												</Avatar>

												<div className="text-sm font-medium">{item.title}</div>
											</div>
											<ChevronRight />
										</div>

										{index !== yourInfo.length - 1 && (
											<Separator className="-mb-4 border-t border-dashed bg-transparent" />
										)}
									</Link>
								</div>
							))}
						</Card>
					</>
				)}

				<h1 className="text-sm font-semibold pb-1 pt-4 text-muted-foreground">
					{data ? "More" : "General"}
				</h1>
				<Card className="p-4 shadow-none">
					{moreInfo.map((item, index) => {
						if (!data && item.title === "Logout") return;
						return (
							<div key={index}>
								<Link className="flex flex-col gap-2" to={item.url}>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Avatar className="size-7">
												<AvatarFallback>
													<item.icon className="size-4 text-muted-foreground" />
												</AvatarFallback>
											</Avatar>
											<div className="text-sm font-medium">{item.title}</div>
										</div>
										<ChevronRight />
									</div>

									{index !== moreInfo.length - 1 && (
										<Separator className="-mb-4 border-t border-dashed bg-transparent" />
									)}
								</Link>
							</div>
						);
					})}
				</Card>
			</div>
		</div>
	);
}

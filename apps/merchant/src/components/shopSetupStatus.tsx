import { authClient } from "@lipy/lib/providers/auth";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

const setupSteps = [
	{
		name: "shopDetailsComplete",
		completed: true,
		title: "Fill necessary information about your shop",
		description: "These information will help you run your shop smoothly.",
		action: (
			<Link
				className={cn(
					buttonVariants({ variant: "link" }),
					"p-0 underline text-sm lg:text-lg",
				)}
				to="/store"
			>
				Complete store details
			</Link>
		),
	},
	{
		name: "productAdded",
		completed: false,
		title: "List products at your shop",
		description: "Add products in your shop.",
		action: (
			<Link className={cn(buttonVariants(), "font-medium")} to="/product">
				Add products
			</Link>
		),
	},
];

export const ShopSetupStatus = () => {
	const { data: organizations } = authClient.useListOrganizations();

	console.log(organizations);

	return (
		<div className="h-full bg-white border-l border-r lg:mx-40 p-4 lg:p-12 space-y-8 lg:space-y-12">
			<div className="space-y-3 lg:space-y-4">
				<p className="text-2xl lg:text-4xl font-semibold">
					Complete your store setup
				</p>
				<p className="text-muted-foreground text-base lg:text-2xl">
					Fill basic details of your shop and add products you wish to sell in
					easy steps.
				</p>
			</div>
			<div className="relative space-y-8 lg:space-y-12">
				{setupSteps.map((item, index) => (
					<div key={index} className="relative">
						{index !== setupSteps.length - 1 && (
							<div
								className={cn(
									"absolute left-6 lg:left-8 top-12 lg:top-16 w-0.5 z-0 h-full",
									item.completed ? "bg-primary" : "bg-muted-foreground",
								)}
							/>
						)}

						<div className="flex items-start lg:items-center gap-3 lg:gap-4">
							<Avatar className="size-12 lg:size-16 flex-shrink-0">
								<AvatarFallback
									className={
										item.completed
											? "bg-primary"
											: "bg-background border-2 lg:border-4 rounded-full border-muted-foreground"
									}
								>
									{item.completed ? (
										<Check className="size-4 lg:size-6 text-background stroke-3" />
									) : (
										<p className="font-medium text-lg lg:text-xl">
											{index + 1}
										</p>
									)}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1 min-w-0">
								<p className="text-lg lg:text-xl font-medium leading-tight">
									{item.title}
								</p>
								<p className="text-muted-foreground text-sm lg:text-base mt-1 lg:mt-0">
									{item.description}
								</p>
								<div className="mt-2 lg:mt-1">{item.action}</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

import { formatAmount } from "@lipy/lib/utils/intl";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Input } from "@lipy/web-ui/components/ui/input";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export const Route = createFileRoute("/(loggedIn)/product/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [search, setSearch] = useQueryState("search", parseAsString);
	const { isMobile } = useViewport();
	return (
		<div className="">
			{/* <div className="sticky top-0 bg-accent p-4 border-b">
				<Input prefixEl={<Search />} placeholder="Search by: ID, Title, SKU" />
			</div> */}

			<DashboardHeader title="Edit Product">
				{!isMobile && (
					<Input
						prefixEl={<Search />}
						placeholder="Search Products..."
						className="w-1/4"
					/>
				)}
				<Link
					to="/product/$id"
					params={{ id: "new" }}
					className={cn(buttonVariants({}))}
				>
					<Plus />
					{isMobile ? "Product" : "New Product"}
				</Link>
			</DashboardHeader>

			{isMobile && (
				<div className="p-4">
					<Input
						prefixEl={<Search />}
						placeholder="Search Products..."
						className="w-full"
					/>
				</div>
			)}

			<div className="lg:p-4">
				<div className="w-full grid lg:grid-cols-3 border-x border-t">
					{Array.from({ length: 100 }).map((_, index) => (
						<Link
							to={"/product/$id"}
							params={{ id: "n" }}
							key={index}
							className="flex p-3 bg-background border-r border-b hover:bg-primary/10 cursor-pointer gap-4"
						>
							<div className="bg-accent">
								<img
									src="https://prd.place/400?padding=30"
									alt="product"
									className="size-12"
								/>
							</div>
							<div className="w-full flex-1">
								<div className="flex-1 flex text-sm gap-4">
									<div className="flex-1">
										<h1 className="font-medium text-sm leading-tight line-clamp-1">
											While this is not a train smash, clean code is all about{" "}
											{index + 1}
										</h1>
									</div>
									<div>
										<p className="space-x-1">
											<span className="text-xl font-medium">
												{formatAmount("INR", 14)}
											</span>
											<span className="line-through text-muted-foreground">
												{formatAmount("INR", 20)}
											</span>
										</p>
									</div>
								</div>
								<div className="flex justify-end">
									<Badge variant={"destructive"}>No Stock</Badge>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

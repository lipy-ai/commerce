import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { ScrollingTabs } from "@lipy/web-ui/components/custom-ui/scrollable-tabs";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import ComingSoonPage from "@lipy/web-ui/components/pages/coming-soon";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import type { InferResponseType } from "hono/client";
import { MapPin, Star } from "lucide-react";
import { Cherry, Milk, Salad, ShoppingBasket, Store } from "lucide-react";
import { useEffect, useState } from "react";

const CATEGORIES = [
	{ id: "all", name: "All Stores", icon: Store },
	{ id: "grocery", name: "Grocery", icon: ShoppingBasket },
	{ id: "fruits", name: "Fruits", icon: Cherry },
	{ id: "vegetables", name: "Vegetables", icon: Salad },
	{ id: "dairy", name: "Dairy", icon: Milk },
];

export default function NearByShops() {
	// const [showFavorites, setShowFavorites] = useState(false);
	const [shops, setShops] = useState<
		InferResponseType<typeof apiClient.v1.shops.$get>
	>([]);
	const [_, setActiveCategory] = useState("all");

	const { data, isFetched, isFetching } = useAPIQuery(
		apiClient.v1.shops,
		"$get",
		{},
	);
	const [navBarColorChange, setNavBarColorChange] = useState(false);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (latest) => {
		if (latest > 80) {
			setNavBarColorChange(true);
		} else {
			setNavBarColorChange(false);
		}
	});

	useEffect(() => {
		if (isFetched && data) {
			setShops(data);
		}
	}, [isFetched, data]);

	if (isFetching) {
		return <Spinner />;
	}

	return (
		<div>
			{isFetched && shops && shops.length > 0 && (
				<div className="lg:hidden border-b shadow-sm sticky top-0 z-50 bg-card  overflow-hidden">
					<motion.div
						className="absolute inset-0 bg-chart-3/30"
						initial={{ opacity: 0 }}
						animate={{ opacity: navBarColorChange ? 1 : 0 }}
						transition={{
							duration: 1,
							ease: "easeInOut",
						}}
					/>

					<div className="relative z-10 space-y-2">
						<SearchBar
							placeholder="Search for shop, grocery, fruits..."
							defaultValue=""
						/>

						<div>
							<ScrollingTabs
								tabs={CATEGORIES}
								handleTabChange={setActiveCategory}
								className="text-foreground"
							/>
						</div>
					</div>
				</div>
			)}

			<div className="m-auto max-w-screen-2xl px-2">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4 py-4">
					{isFetched &&
						shops &&
						shops.length > 0 &&
						shops.map((shop) => (
							<div key={shop.id} className="space-y-6">
								<div className="bg-card border p-0 rounded-xl border-accent">
									<Link
										to="/$storeHandle"
										params={{ storeHandle: shop.handle as string }}
										viewTransition={{ types: ["warp"] }}
									>
										<div className="relative h-44">
											<img
												src={shop.image || "/assets/paper-bag-items.webp"}
												alt={shop.name}
												className="w-full h-full object-cover rounded-t-xl"
											/>

											<Badge
												className="absolute bottom-3 right-3"
												variant={"secondary"}
											>
												<div className="flex items-center">
													<MapPin className="size-4 mr-1" />
													<span>1 km</span>
												</div>
											</Badge>
										</div>

										<div className="p-4 -my-4">
											<div className="flex items-center justify-between">
												<h3 className="font-bold text-xl">{shop.name}</h3>

												<div className="flex items-center mt-1">
													<div className="flex items-center bg-green-800 text-background px-2 rounded text-sm">
														<span>4.6</span>
														<Star className="h-3 w-3 ml-1 fill-white" />
													</div>
												</div>
											</div>

											<div className="mt-2 text-sm text-muted-foreground">
												Books • Stationary
											</div>

											<div className="flex items-center justify-between mt-3 text-sm" />
										</div>
									</Link>
								</div>
							</div>
						))}
				</div>
			</div>
			{isFetched && shops && shops.length === 0 && <ComingSoonPage />}
		</div>
	);
}

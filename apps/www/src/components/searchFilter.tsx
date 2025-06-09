import { ScrollingTabs } from "@lipy/web-ui/components/custom-ui/scrollable-tabs";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { Cherry, Milk, Salad, ShoppingBasket, Store } from "lucide-react";
import { useState } from "react";
import { Noise } from "./shop/shopHeroSection";

const CATEGORIES = [
	{ id: "all", name: "All Stores", icon: Store },
	{ id: "grocery", name: "Grocery", icon: ShoppingBasket },
	{ id: "fruits", name: "Fruits", icon: Cherry },
	{ id: "vegetables", name: "Vegetables", icon: Salad },
	{ id: "dairy", name: "Dairy", icon: Milk },
];

export function SearchFilter() {
	const [_, setActiveCategory] = useState("all");
	return (
		<div className="px-4 ">
			<Noise />
			<div className="relative mb-4 gap-2">
				<SearchBar />
			</div>

			<div className="-ml-4 -mr-4 ">
				<ScrollingTabs tabs={CATEGORIES} handleTabChange={setActiveCategory} />
			</div>
		</div>
	);
}

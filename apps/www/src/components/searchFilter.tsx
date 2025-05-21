import { ScrollingTabs } from "@lipy/web-ui/components/scrollable-tabs";
import SearchBar from "@lipy/web-ui/components/searchBar";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Cherry,
	Filter,
	Milk,
	Salad,
	ShoppingBasket,
	Store,
} from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
	{ id: "all", name: "All Stores", icon: Store },
	{ id: "grocery", name: "Grocery", icon: ShoppingBasket },
	{ id: "fruits", name: "Fruits", icon: Cherry },
	{ id: "vegetables", name: "Vegetables", icon: Salad },
	{ id: "dairy", name: "Dairy", icon: Milk },
];

export function SearchFilter() {
	const [activeCategory, setActiveCategory] = useState("all");
	return (
		<div className="px-4 py-3 ">
			<div className="relative mb-4 gap-2">
				<SearchBar />
			</div>

			<div className="-ml-4 -mr-4 -mb-3 ">
				<ScrollingTabs tabs={CATEGORIES} handleTabChange={setActiveCategory} />
			</div>
		</div>
	);
}

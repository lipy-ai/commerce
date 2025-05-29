import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Card } from "@lipy/web-ui/components/ui/card";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { Link } from "@tanstack/react-router";
import {
	Coffee,
	Heart,
	MapPin,
	ShoppingBag,
	ShoppingCart,
	Star,
} from "lucide-react";
import { useEffect, useState } from "react";

// Sample data
const SHOPS = [
	{
		id: "abcshop",
		name: "Green Market Grocery",
		image: "/assets/paper-bag-items.webp",
		rating: 4.7,
		reviews: 324,
		categories: ["Grocery", "Organic"],
		type: "grocery",
		hours: "8:00 AM - 10:00 PM",
		distance: "1.3 km",
		discount: "10% OFF on all fruits",
		isPromoted: true,
		isOpen: true,
		isBookmarked: false,
	},
	{
		id: "2",
		name: "Urban Style Retail",
		image: "/assets/paper-bag-items.webp",
		rating: 4.3,
		reviews: 267,
		categories: ["Clothing", "Accessories"],
		type: "retail",
		hours: "10:00 AM - 9:00 PM",
		distance: "0.8 km",
		discount: "15% OFF on new arrivals",
		isPromoted: false,
		isOpen: true,
		isBookmarked: true,
	},
	{
		id: "3",
		name: "Morning Brew Cafe",
		image: "/assets/paper-bag-items.webp",
		rating: 4.5,
		reviews: 418,
		categories: ["Cafe", "Breakfast"],
		type: "cafe",
		hours: "7:00 AM - 8:00 PM",
		distance: "1.7 km",
		discount: "Buy 1 Get 1 on all coffees",
		isPromoted: false,
		isOpen: true,
		isBookmarked: false,
	},
	{
		id: "4",
		name: "Value Mart Superstore",
		image: "/assets/paper-bag-items.webp",
		rating: 4.1,
		reviews: 532,
		categories: ["Grocery", "Electronics", "Home"],
		type: "grocery",
		hours: "9:00 AM - 11:00 PM",
		distance: "2.4 km",
		discount: "20% OFF home essentials",
		isPromoted: true,
		isOpen: false,
		isBookmarked: false,
	},
	{
		id: "5",
		name: "Tech Gadget Store",
		image: "/assets/paper-bag-items.webp",
		rating: 4.4,
		reviews: 186,
		categories: ["Electronics", "Computers"],
		type: "retail",
		hours: "10:00 AM - 9:00 PM",
		distance: "1.5 km",
		discount: "Up to 30% OFF on accessories",
		isPromoted: false,
		isOpen: true,
		isBookmarked: false,
	},
	{
		id: "6",
		name: "Cozy Corner Bookstore",
		image: "/assets/paper-bag-items.webp",
		rating: 4.6,
		reviews: 378,
		categories: ["Books", "Stationery"],
		type: "retail",
		hours: "9:00 AM - 8:00 PM",
		distance: "3.1 km",
		discount: "Flat 15% OFF on bestsellers",
		isPromoted: false,
		isOpen: true,
		isBookmarked: true,
	},
	{
		id: "7",
		name: "Cozy Corner Bookstore",
		image: "/assets/paper-bag-items.webp",
		rating: 4.6,
		reviews: 378,
		categories: ["Books", "Stationery"],
		type: "retail",
		hours: "9:00 AM - 8:00 PM",
		distance: "3.1 km",
		discount: "Flat 15% OFF on bestsellers",
		isPromoted: false,
		isOpen: true,
		isBookmarked: true,
	},
	{
		id: "8",
		name: "Cozy Corner Bookstore",
		image: "/assets/paper-bag-items.webp",
		rating: 4.6,
		reviews: 378,
		categories: ["Books", "Stationery"],
		type: "retail",
		hours: "9:00 AM - 8:00 PM",
		distance: "3.1 km",
		discount: "Flat 15% OFF on bestsellers",
		isPromoted: false,
		isOpen: true,
		isBookmarked: true,
	},
];

export default function NearByShops() {
	const [showFavorites, setShowFavorites] = useState(false);
	const [shops, setShops] = useState([]);

	const { data, isFetched, isFetching } = useAPIQuery(
		apiClient.v1.shops,
		"$get",
		{},
	);

	useEffect(() => {
		if (isFetched) setShops(data);
	}, [data, isFetched]);

	if (isFetching) {
		return <Spinner className="absolute top-1/2 left-1/2" />;
	}

	return (
		<div>
			<div className="px-4 pb-20">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
					{isFetched &&
						shops &&
						shops.length > 0 &&
						shops.map((shop) => (
							<Card key={shop.id} className="p-0">
								<Link to={`/shop/${shop.id}`}>
									{/* Image Container */}
									<div className="relative h-48">
										<img
											src={shop.logo}
											alt={shop.name}
											className="w-full h-full object-cover rounded-tl-lg rounded-tr-lg"
										/>

										{/* <div
										className={`absolute bottom-3 left-3 text-white text-xs px-2 py-1 rounded flex items-center ${
											shop.type === "grocery"
												? "bg-green-500"
												: shop.type === "retail"
													? "bg-purple-500"
													: "bg-amber-500"
										}`}
									>
										{shop.type === "grocery" ? (
											<ShoppingCart className="h-3 w-3 mr-1" />
										) : shop.type === "retail" ? (
											<ShoppingBag className="h-3 w-3 mr-1" />
										) : (
											<Coffee className="h-3 w-3 mr-1" />
										)}
										{shop.type.charAt(0).toUpperCase() + shop.type.slice(1)}
									</div> */}

										{/* Discount Banner */}

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

									{/* Content */}
									<div className="p-4 -my-4">
										<div className="flex items-center justify-between">
											<h3 className="font-bold text-lg">{shop.name}</h3>

											<div className="flex items-center mt-1">
												<div className="flex items-center bg-green-800 text-background px-2 rounded text-sm">
													<span>4.6</span>
													<Star className="h-3 w-3 ml-1 fill-white" />
												</div>
											</div>
										</div>

										<div className="mt-2 text-sm text-muted-foreground">
											{/* {shop.categories.join(" • ")} */}
											Books • Stationary
										</div>

										<div className="flex items-center justify-between mt-3 text-sm" />
									</div>
								</Link>
							</Card>
						))}
				</div>
			</div>
		</div>
	);
}

import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { useMotionValueEvent, useScroll } from "framer-motion";
import {
	Apple,
	ArrowLeft,
	Banana,
	Beef,
	BookOpen,
	Calculator,
	Carrot,
	Cherry,
	Coffee,
	Egg,
	Fish,
	Grape,
	Leaf,
	Milk,
	Package,
	Paperclip,
	PenTool,
	Scissors,
	Search,
	ShoppingCart,
	Wheat,
} from "lucide-react";
import { useState } from "react";

const shopInfo = {
	id: "abcshop",
	name: "Grihasthi Kirana",
	category: "grocery", // grocery, vegetable, fruit, dairy, stationery, default
	distance: "1.7 km",
	address: "Bhagwapur Chowk",
};

type CategoryType =
	| "grocery"
	| "vegetable"
	| "fruit"
	| "dairy"
	| "stationery"
	| "default";

// Define color schemes for each category
const categoryColors: Record<
	CategoryType,
	{ background: string; text: string; accent: string }
> = {
	grocery: {
		background: "bg-gradient-to-br from-amber-700 to-orange-800",
		text: "text-amber-50",
		accent: "text-yellow-100",
	},
	vegetable: {
		background: "bg-gradient-to-br from-green-700 to-emerald-800",
		text: "text-green-50",
		accent: "text-lime-100",
	},
	fruit: {
		background: "bg-gradient-to-br from-red-600 to-pink-700",
		text: "text-red-50",
		accent: "text-pink-100",
	},
	dairy: {
		background: "bg-gradient-to-br from-blue-600 to-cyan-700",
		text: "text-blue-50",
		accent: "text-cyan-100",
	},
	stationery: {
		background: "bg-gradient-to-br from-purple-700 to-indigo-800",
		text: "text-purple-50",
		accent: "text-indigo-100",
	},
	default: {
		background: "bg-gradient-to-br from-slate-700 to-gray-800",
		text: "text-slate-50",
		accent: "text-gray-100",
	},
};

// Define icons for each category
const categoryIcons = {
	grocery: [ShoppingCart, Wheat, Package, Coffee],
	vegetable: [Carrot, Leaf, Wheat],
	fruit: [Apple, Cherry, Grape, Banana],
	dairy: [Milk, Beef, Fish, Egg],
	stationery: [PenTool, BookOpen, Scissors, Paperclip, Calculator],
	default: [Package, ShoppingCart],
};
const getCategoryColors = (category: string) => {
	const normalizedCategory = category.toLowerCase() as CategoryType;
	return categoryColors[normalizedCategory] || categoryColors.default;
};

// Function to get icons based on category
const getCategoryIcons = (category: string) => {
	const normalizedCategory = category.toLowerCase() as CategoryType;
	return categoryIcons[normalizedCategory] || categoryIcons.default;
};

export const ShopHeroPage = () => {
	const category = getCategoryColors(shopInfo.category);
	const icons = getCategoryIcons(shopInfo.category);

	const [backgroundVisible, setBackgroundVisible] = useState(false);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (current) => {
		if (current > 100) {
			setBackgroundVisible(true);
		} else {
			setBackgroundVisible(false);
		}
	});

	return (
		<>
			<section
				className={cn(
					"mx-auto w-full relative rounded-b-xl overflow-hidden",
					category.background,
				)}
			>
				<div
					className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 overflow-hidden"
					style={{
						boxShadow:
							"0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
					}}
				>
					<div className={cn("px-4 py-8 sm:px-10")}>
						<Noise />
						<CategoryBackgroundIcons icons={icons} textColor={category.text} />

						<div
							className={cn(
								"fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 transition-all duration-300",
								backgroundVisible &&
									"bg-white/10 backdrop-blur-lg border-b border-white/10",
							)}
						>
							<Link to="/" className="flex items-center">
								<Avatar className="size-8">
									<AvatarFallback>
										<ArrowLeft className="size-4 stroke-2" />
									</AvatarFallback>
								</Avatar>
							</Link>

							<Avatar className="size-8">
								<AvatarFallback>
									<Search className="size-4 stroke-2" />
								</AvatarFallback>
							</Avatar>
						</div>

						<div
							className={cn(
								"text-2xl lg:text-3xl font-bold text-center pt-6",
								"flex items-center justify-center",
								category.accent,
							)}
						>
							{shopInfo.name.toUpperCase()}
						</div>

						<div
							className={cn(
								"text-xs text-center font-medium pb-16",
								category.text,
							)}
						>
							<div className="flex justify-center space-x-2">
								<span>{shopInfo.distance} away</span>
								<span>|</span>
								<span>{shopInfo.address}</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

const CategoryBackgroundIcons = ({
	icons,
	textColor,
}: { icons: any[]; textColor: string }) => {
	// Create an array of positioned icons with different sizes and positions
	const iconPositions = [
		{ top: "15%", left: "10%", size: 20, opacity: 0.15, rotation: -15 },
		{ top: "25%", right: "15%", size: 24, opacity: 0.12, rotation: 25 },
		{ top: "45%", left: "8%", size: 18, opacity: 0.18, rotation: -30 },
		{ top: "60%", right: "20%", size: 22, opacity: 0.14, rotation: 20 },
		{ top: "35%", left: "25%", size: 16, opacity: 0.16, rotation: -10 },
		{ top: "70%", left: "30%", size: 20, opacity: 0.13, rotation: 35 },
		{ top: "20%", right: "35%", size: 18, opacity: 0.15, rotation: -25 },
		{ top: "55%", right: "8%", size: 24, opacity: 0.11, rotation: 15 },
		{ top: "80%", right: "40%", size: 16, opacity: 0.17, rotation: -20 },
		{ top: "10%", left: "40%", size: 22, opacity: 0.12, rotation: 30 },
	];

	return (
		<div className="absolute inset-0 w-full h-full pointer-events-none">
			{iconPositions.map((position, index) => {
				const IconComponent = icons[index % icons.length];
				return (
					<div
						key={index}
						className="absolute"
						style={{
							top: position.top,
							left: position.left,
							right: position.right,
							transform: `rotate(${position.rotation}deg)`,
							opacity: position.opacity,
						}}
					>
						<IconComponent className={cn(textColor)} size={position.size} />
					</div>
				);
			})}
		</div>
	);
};

export const Noise = () => {
	return (
		<div
			className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
			style={{
				backgroundImage: "url(/assets/noise.webp)",
				backgroundSize: "30%",
			}}
		/>
	);
};

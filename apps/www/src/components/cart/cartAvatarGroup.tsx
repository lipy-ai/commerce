import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { cn } from "@lipy/web-ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import type { CartStore } from "./store";

type AvatarProps = React.ComponentProps<typeof Avatar>;

interface AvatarGroupProps extends React.ComponentProps<"div"> {
	children: React.ReactElement<AvatarProps>[];
	max?: number;
	spacing?: "tight" | "normal" | "loose";
	size?: "sm" | "md" | "lg";
	showCount?: boolean;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
	(
		{
			children,
			max = 5,
			spacing = "normal",
			size = "md",
			showCount = true,
			className,
			...props
		},
		ref,
	) => {
		const totalAvatars = React.Children.count(children);
		const maxToShow = Math.min(max, totalAvatars);
		const displayedAvatars = React.Children.toArray(children).slice(
			0,
			maxToShow,
		);
		const remainingCount = Math.max(totalAvatars - maxToShow, 0);

		const spacingClasses = {
			tight: "-ml-1",
			normal: "-ml-2",
			loose: "-ml-3",
		};

		const sizeClasses = {
			sm: "h-6 w-6 text-xs",
			md: "h-8 w-8 text-sm",
			lg: "h-10 w-10 text-base",
		};

		return (
			<div ref={ref} className={cn("flex items-center", className)} {...props}>
				{displayedAvatars.map((avatar, index) => {
					if (!React.isValidElement(avatar)) return null;

					return (
						<div
							key={index}
							className={cn(
								"relative transition-transform hover:scale-110 hover:z-10",
								index > 0 && spacingClasses[spacing],
							)}
						>
							{React.cloneElement(avatar as React.ReactElement<AvatarProps>, {
								className: cn(
									"ring-2 ring-background border border-border/20",
									sizeClasses[size],
									(avatar as React.ReactElement<AvatarProps>).props.className,
								),
							})}
						</div>
					);
				})}

				{remainingCount > 0 && showCount && (
					<div className={cn("relative", spacingClasses[spacing])}>
						<Avatar
							className={cn(
								"ring-2 ring-background border border-border/20 bg-muted hover:bg-muted/80 transition-colors cursor-default",
								sizeClasses[size],
							)}
						>
							<AvatarFallback className="bg-transparent text-muted-foreground font-medium">
								+{remainingCount}
							</AvatarFallback>
						</Avatar>
					</div>
				)}
			</div>
		);
	},
);

AvatarGroup.displayName = "AvatarGroup";

interface CustomAvatarGroupProps extends Omit<AvatarGroupProps, "children"> {
	items: CartStore["cart"];
	onItemClick?: (item: CartStore["cart"][0]) => void;
	showQuantity?: boolean;
}

const CartAvatarGroup = React.forwardRef<
	HTMLDivElement,
	CustomAvatarGroupProps
>(
	(
		{
			items,
			onItemClick,
			showQuantity = false,
			max = 3,
			spacing = "normal",
			size = "md",
			showCount = true,
			className,
			...props
		},
		ref,
	) => {
		const totalItems = items.length;
		const maxToShow = Math.min(max, totalItems);
		const displayedItems = items.slice(0, maxToShow);
		const remainingCount = Math.max(totalItems - maxToShow, 0);

		const spacingClasses = {
			tight: "-ml-1",
			normal: "-ml-2",
			loose: "-ml-3",
		};

		const sizeClasses = {
			sm: "h-6 w-6 text-xs",
			md: "h-8 w-8 text-sm",
			lg: "h-10 w-10 text-base",
		};

		const handleItemClick = React.useCallback(
			(item: CartStore["cart"][0]) => {
				onItemClick?.(item);
			},
			[onItemClick],
		);

		const getInitials = (title: string) => {
			return title
				.split(" ")
				.map((word) => word.charAt(0))
				.join("")
				.toUpperCase()
				.slice(0, 2);
		};

		return (
			<div ref={ref} className={cn("flex items-center", className)} {...props}>
				<AnimatePresence mode="popLayout">
					{displayedItems.map((item, index) => (
						<motion.div
							key={item.inventoryId}
							initial={{ opacity: 0, scale: 0.8, y: -100 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.8, y: 100 }}
							transition={{
								duration: 0.3,
								ease: "easeInOut",
								delay: index * 0.1,
							}}
							className={cn(
								"relative transition-transform hover:scale-110 hover:z-10",
								index > 0 && spacingClasses[spacing],
							)}
						>
							<Avatar
								className={cn(
									"cursor-pointer transition-all duration-200 ring-2 ring-background border border-border/20",
									onItemClick && "hover:shadow-lg",
									sizeClasses[size],
								)}
								onClick={() => handleItemClick(item)}
							>
								<AvatarImage
									src={item.thumbnail || ""}
									alt={item.variantTitle || ""}
									className="object-cover"
								/>
								<AvatarFallback className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground font-medium">
									{getInitials(item.variantTitle || "")}
								</AvatarFallback>
							</Avatar>
							{showQuantity && item.quantity && item.quantity > 1 && (
								<motion.div
									initial={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0 }}
									transition={{ delay: 0.2 }}
									className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
								>
									{item.quantity > 99 ? "99+" : item.quantity}
								</motion.div>
							)}
						</motion.div>
					))}
				</AnimatePresence>

				{remainingCount > 0 && showCount && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className={cn("relative", spacingClasses[spacing])}
					>
						<Avatar
							className={cn(
								"ring-2 ring-background border border-border/20 bg-muted hover:bg-muted/80 transition-colors cursor-default",
								sizeClasses[size],
							)}
						>
							<AvatarFallback className="bg-transparent text-muted-foreground font-medium">
								+{remainingCount}
							</AvatarFallback>
						</Avatar>
					</motion.div>
				)}
			</div>
		);
	},
);

CartAvatarGroup.displayName = "CartAvatarGroup";

export default CartAvatarGroup;
export { AvatarGroup };

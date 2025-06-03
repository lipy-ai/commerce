import { cn } from "@lipy/web-ui/lib/utils";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

interface CustomAvatarGroupItem {
	id: string;
	title: string;
	quantity: number;
	thumbnail: string;
	variant: {
		id: string;
		title: string;
		maxPrice: number;
		price: number;
	};
}

interface CustomAvatarGroupProps extends Omit<AvatarGroupProps, "children"> {
	items: CustomAvatarGroupItem[];
	onItemClick?: (item: CustomAvatarGroupItem) => void;
	showQuantity?: boolean;
}

const CustomAvatarGroup = React.forwardRef<
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
		const handleItemClick = React.useCallback(
			(item: CustomAvatarGroupItem) => {
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
			<AvatarGroup
				ref={ref}
				max={max}
				spacing={spacing}
				size={size}
				showCount={showCount}
				className={className}
				{...props}
			>
				{items.map((item) => (
					<Avatar
						key={item.id}
						className={cn(
							"cursor-pointer transition-all duration-200",
							onItemClick && "hover:shadow-lg",
						)}
						onClick={() => handleItemClick(item)}
					>
						<AvatarImage
							src={item.thumbnail}
							alt={item.title}
							className="object-cover"
						/>
						<AvatarFallback className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground font-medium">
							{getInitials(item.title)}
						</AvatarFallback>
						{showQuantity && item.quantity && item.quantity > 1 && (
							<div className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
								{item.quantity > 99 ? "99+" : item.quantity}
							</div>
						)}
					</Avatar>
				))}
			</AvatarGroup>
		);
	},
);

CustomAvatarGroup.displayName = "CustomAvatarGroup";

export default CustomAvatarGroup;
export { AvatarGroup };

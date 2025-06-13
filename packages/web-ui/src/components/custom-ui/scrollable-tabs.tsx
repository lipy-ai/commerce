import { cn } from "@lipy/web-ui/lib/utils";
import { useEffect, useRef, useState } from "react";

type Tab = {
	id: string;
	name: string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
};

type ScrollingTabsProps = {
	tabs: Tab[];
	handleTabChange: (tabId: string) => void;
	className?: string;
};

export const ScrollingTabs = ({
	tabs,
	handleTabChange,
	className,
}: ScrollingTabsProps) => {
	const [activeTab, setActiveTab] = useState(0);
	const tabsRef = useRef<HTMLDivElement>(null);

	const onTabChange = (index: number, id: string) => {
		setActiveTab(index);
		handleTabChange(id);
	};

	useEffect(() => {
		const checkForArrows = () => {
			// Optional: logic for showing arrows if needed later
		};

		const tabsEl = tabsRef.current;
		if (!tabsEl) return;

		tabsEl.addEventListener("scroll", checkForArrows);
		window.addEventListener("resize", checkForArrows);
		checkForArrows();

		return () => {
			tabsEl.removeEventListener("scroll", checkForArrows);
			window.removeEventListener("resize", checkForArrows);
		};
	}, []);

	return (
		<div className="w-full">
			<div ref={tabsRef} className="flex overflow-x-auto scrollbar-hide">
				{tabs.map((tab, index) => {
					const Icon = tab.icon;
					const isActive = activeTab === index;

					return (
						<div
							key={tab.id}
							onClick={() => onTabChange(index, tab.id)}
							className={cn(
								"group relative flex flex-col lg:flex-row items-center px-4 py-2 lg:py-4  mx-2 min-w-16 cursor-pointer transition-all duration-300",
								isActive
									? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1.5 after:bg-background lg:after:bg-primary after:rounded-t-full text-primary"
									: "text-background hover:text-background/80",
								className,
							)}
						>
							<Icon
								size={20}
								className={cn(
									isActive
										? "lg:text-primary text-background"
										: "lg:text-muted-foreground",
									"lg:size-5",
								)}
							/>
							<span
								className={cn(
									"mt-1 lg:mt-0 lg:ml-2 sm:text-sm lg:text-lg font-medium whitespace-nowrap",
									isActive
										? "lg:text-primary text-background"
										: "lg:text-muted-foreground",
								)}
							>
								{tab.name}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

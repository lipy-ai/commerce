import { useEffect, useRef, useState } from "react";

type Tab = {
	id: string;
	name: string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
};

type ScrollingTabsProps = {
	tabs: Tab[];
	handleTabChange: (tabId: string) => void;
};

export const ScrollingTabs = ({
	tabs,
	handleTabChange,
}: ScrollingTabsProps) => {
	const [activeTab, setActiveTab] = useState(0);
	const tabsRef = useRef<HTMLDivElement>(null);

	// Handle tab change
	const onTabChange = (index: number, id: string) => {
		setActiveTab(index);
		handleTabChange(id);
	};

	// Handle showing arrows (not implemented, but hook is in place)
	useEffect(() => {
		if (!tabsRef.current) return;

		const checkForArrows = () => {
			// const container = tabsRef.current;
			// You can add logic here to determine whether arrows should show
		};

		checkForArrows();
		tabsRef.current.addEventListener("scroll", checkForArrows);
		window.addEventListener("resize", checkForArrows);

		return () => {
			tabsRef.current?.removeEventListener("scroll", checkForArrows);
			window.removeEventListener("resize", checkForArrows);
		};
	}, []);

	return (
		<div className="flex flex-col w-full">
			<div className="relative flex items-center">
				<div
					ref={tabsRef}
					className="flex overflow-x-auto scrollbar-hide w-full"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					{tabs.map((tab, index) => {
						const Icon = tab.icon;
						const isActive = activeTab === index;

						return (
							<div
								key={tab.id}
								onClick={() => onTabChange(index, tab.id)}
								className={`relative flex flex-col items-center px-4 py-2 mx-2 min-w-16 cursor-pointer transition-all duration-300 ${
									isActive
										? " after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[6px] after:bg-background after:rounded-t-full"
										: "text-background hover:text-muted-foreground"
								}`}
							>
								<Icon size={20} />
								<span className="mt-1 text-sm whitespace-nowrap">
									{tab.name}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

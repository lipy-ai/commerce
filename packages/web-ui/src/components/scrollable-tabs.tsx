import { useEffect, useRef, useState } from "react";

export const ScrollingTabs = ({ tabs, handleTabChange }) => {
	const [activeTab, setActiveTab] = useState(0);
	const tabsRef = useRef(null);

	// Handle tab change
	const onTabChange = (index, label) => {
		setActiveTab(index);
		handleTabChange(label);
	};

	// Check if scroll arrows should be shown
	useEffect(() => {
		if (tabsRef.current) {
			const checkForArrows = () => {
				const container = tabsRef.current;
			};

			// Initial check
			checkForArrows();

			// Listen for scroll events
			tabsRef.current.addEventListener("scroll", checkForArrows);

			// Listen for resize events
			window.addEventListener("resize", checkForArrows);

			return () => {
				if (tabsRef.current) {
					tabsRef.current.removeEventListener("scroll", checkForArrows);
				}
				window.removeEventListener("resize", checkForArrows);
			};
		}
	}, []);

	return (
		<div className="flex flex-col w-full">
			<div className="relative flex items-center">
				{/* Tabs container */}
				<div
					ref={tabsRef}
					className="flex overflow-x-auto scrollbar-hide  w-full"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					{tabs.map((tab, index) => {
						const Icon = tab.icon;
						return (
							<div
								key={index}
								onClick={() => onTabChange(index, tab.id)}
								className={`relative flex flex-col items-center px-4 py-2 mx-2 min-w-16 cursor-pointer transition-all duration-300 ${
									activeTab === index
										? "text-foreground-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-foreground after:rounded-full after:shadow-[0_2px_6px_theme(colors.primary.DEFAULT)]"
										: "text-muted-foreground hover:text-muted-foreground"
								}`}
							>
								<Icon
									size={20}
									className={activeTab === index ? "fill-primary/40" : ""}
								/>
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

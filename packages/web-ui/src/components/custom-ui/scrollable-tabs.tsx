import { cn } from "@lipy/web-ui/lib/utils";
import { useEffect, useRef, useState } from "react";

type Tab = {
  id: string;
  name: string;
  src: string;
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
      // Optional: Add future logic for scroll indicators
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
      <div
        ref={tabsRef}
        className="flex overflow-x-auto scrollbar-hide snap-x scroll-pl-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;

          return (
            <div
              key={tab.id}
              onClick={() => onTabChange(index, tab.id)}
              className={cn(
                "group snap-start flex-shrink-0 relative flex flex-col lg:flex-row items-center py-2 lg:px-2 lg:py-4 mx-2 min-w-14 cursor-pointer transition-all duration-300 text-center",
                isActive
                  ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary lg:after:bg-primary after:rounded-t-full text-primary"
                  : "text-foreground ",
                className
              )}
            >
              <img
                src={tab.src}
                alt={tab.name}
                className="size-12 aspect-square object-contain"
              />

              <span
                className={cn(
                  "mt-1 lg:mt-0 lg:ml-2 lg:text-lg  whitespace-nowrap",
                  isActive ? " lg:text-primary" : "font-light"
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

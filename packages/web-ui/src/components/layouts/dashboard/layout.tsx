"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@web-ui/lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useViewport } from "@web-ui/contexts/viewport";
type Navs = Array<{
  label: string;
  url: string;
  icon: LucideIcon;
  mobile?: boolean;
}>;
export type DashboardNavs = Record<"primary" | "secondary", Navs>;

export const DashboardLayout = ({
  children,
  dashboardNav,
  mobileNav,
  logo,
}: {
  children: ReactNode;
  dashboardNav: DashboardNavs;
  mobileNav: Navs;
  logo: {
    icon: string;
    full: string;
    alt: string;
  };
}) => {
  const [open, setOpen] = useState(false);

  const { isMobile } = useViewport();

  const handleNavClick = (e: React.MouseEvent) => {
    // Only toggle the sidebar if the click is directly on the nav element
    // and not on any of its children
    if (e.currentTarget === e.target) {
      setOpen((o) => !o);
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen overflow-y-auto">
        <div className="">{children}</div>
        <br />
        <br /> <br />
        <br /> <br />
        <div
          className={cn(
            `grid fixed bottom-0 justify-center px-4 border-t w-screen z-50 bg-background`
          )}
          style={{ gridTemplateColumns: `repeat(${mobileNav.length}, 1fr)` }}
        >
          {mobileNav.map((n, i) => (
            <ActiveLink key={i} nav={n} mobile />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <motion.nav
        className="flex flex-col justify-between h-screen sticky top-0 left-0 p-3 border-r z-10 bg-background"
        onClick={handleNavClick}
        initial={{
          width: "70px",
          color: open ? "hsl(var(--primary-foreground))" : "",
        }}
        animate={{
          width: open ? "250px" : "70px",
          color: open ? "hsl(var(--primary-foreground))" : "",
        }}
      >
        <div className="space-y-8">
          <motion.div className="flex justify-start items-center">
            <Link to={"/"} className={cn("overflow-hidden size-[50px]")}>
              <img
                key={String(open)}
                src={!open ? logo.icon : logo.full}
                alt={logo.alt}
                width={"50px"}
                height={"50px"}
                className="rounded-md"
              />
            </Link>
          </motion.div>
          <motion.div className="space-y-2">
            {dashboardNav.primary.map((n, i) => (
              <ActiveLink key={i} nav={n} open={open} />
            ))}
          </motion.div>
        </div>
        <div className="space-y-2">
          {dashboardNav.secondary.map((n, i) => (
            <ActiveLink key={i} nav={n} open={open} />
          ))}
        </div>
      </motion.nav>
      <div
        className="flex-1 flex flex-col overflow-x-auto h-screen overflow-y-auto"
        onClick={() => open && setOpen(false)}
      >
        {children}
      </div>
    </div>
  );
};

export function ActiveLink({
  nav,
  open,
  mobile,
}: {
  nav: DashboardNavs["primary"][0];
  open?: boolean;
  mobile?: boolean;
}) {
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({ to: nav.url, fuzzy: true }); // fuzzy for nested matches

  return (
    <div
      className={cn(
        "overflow-hidden border-b border-border/20 truncate rounded-md px-2 relative w-full",
        open && "justify-start",
        mobile && "px-0 justify-center rounded-none",
        mobile
          ? isActive && "text-primary [&_svg]:stroke-primary"
          : isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent"
      )}
    >
      {mobile && (
        <span
          className={cn(
            "h-1.5 w-4/5 block bg-transparent rounded-b-2xl m-auto",
            isActive && "bg-primary"
          )}
        />
      )}
      <Link
        className={cn(
          "inline-flex items-center text-sm font-medium py-2 gap-2",
          mobile && "flex-col text-[10px] font-light w-full"
        )}
        to={nav.url}
      >
        <span className="flex justify-center items-center w-[30px]">
          <nav.icon
            className={cn(
              "stroke-muted-foreground size-5",
              isActive && "stroke-primary-foreground"
            )}
          />
        </span>
        <motion.span
          className={cn(
            "flex justify-between gap-2 w-full items-center flex-1",
            mobile && "justify-center"
          )}
        >
          {nav.label}
        </motion.span>
      </Link>
    </div>
  );
}

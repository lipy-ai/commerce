"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@web-ui/lib/utils";
import { Link, useMatchRoute, useRouter } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
export type DashboardNavs = Record<
  string,
  Array<{ label: string; url: string; icon: LucideIcon }>
>;

export const DashboardLayout = ({
  children,
  navs,
  logo,
}: {
  children: ReactNode;
  navs: DashboardNavs;

  logo: {
    icon: string;
    full: string;
    alt: string;
  };
}) => {
  const [open, setOpen] = useState(false);
  const { state } = useRouter();

  // if (data?.name) {
  //   const idx = navs.secondary.findIndex((f) => f.label === "Company");

  //   if (idx !== -1) {
  //     navs.secondary[idx]!.label = `Comapny (${data.name})`;
  //   }
  // }

  const handleNavClick = (e: React.MouseEvent) => {
    // Only toggle the sidebar if the click is directly on the nav element
    // and not on any of its children
    if (e.currentTarget === e.target) {
      setOpen((o) => !o);
    }
  };

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
            {navs.primary.map((n, i) => (
              <ActiveLink key={i} nav={n} open={open} />
            ))}
          </motion.div>
        </div>
        <div className="space-y-2">
          {navs.secondary.map((n, i) => (
            <ActiveLink key={i} nav={n} open={open} />
          ))}
        </div>
      </motion.nav>
      <div
        className="flex-1 flex flex-col overflow-x-auto"
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
}: {
  nav: DashboardNavs["primary"][0];
  open: boolean;
}) {
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({ to: nav.url, fuzzy: true }); // fuzzy for nested matches

  return (
    <div
      className={cn(
        "overflow-hidden border-b border-border/20 truncate rounded-md px-2",
        open && "justify-start",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
      )}
    >
      <Link
        className={cn(
          "inline-flex items-center text-sm font-medium py-2 gap-2"
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
            "flex justify-between gap-2 w-full items-center flex-1"
          )}
        >
          {nav.label}
        </motion.span>
      </Link>
    </div>
  );
}

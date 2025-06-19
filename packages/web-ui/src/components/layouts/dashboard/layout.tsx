"use client";

import { usePWAInstall } from "@lipy/web-ui/hooks/use-pwa-install";

import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowDownToLine, type LucideIcon, Store } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";

export type DashboardNavs = Record<
	"primary" | "secondary",
	Array<{
		label: string;
		url: string;
		icon: LucideIcon;
		mobile?: boolean;
	}>
>;

export const DashboardLayout = ({
	children,
	dashboardNav,
	mobileNav,
	logo,
	isVisibleDashboarNav = true,
	...props
}: {
	children?: ReactNode;
	dashboardNav: DashboardNavs;
	mobileNav: DashboardNavs["primary"];
	logo: {
		icon: string;
		full: string;
		alt: string;
	};
	isVisibleDashboarNav?: boolean;
	activeOrgData?: any;
}) => {
	const [open, setOpen] = useState(true);
	const { isMobile } = useViewport();
	const { isInstallable, promptInstall } = usePWAInstall();
	if (isMobile) {
		return (
			<div className="flex flex-col min-h-screen">
				{isInstallable && (
					<div
						onClick={promptInstall}
						className="appearance-none bg-foreground w-full col-span-2 p-2 sticky top-0 flex gap-2 items-center justify-between"
					>
						<span className="flex items-center gap-2 text-background">
							<span>Install app on your phone</span>
						</span>
						<span
							className={cn(
								buttonVariants({ variant: "outline", size: "icon" }),
								"size-6",
							)}
						>
							<ArrowDownToLine />
						</span>
					</div>
				)}

				<div className="pb-18 flex-1 flex flex-col">{children}</div>

				<ActiveLinks
					isMobile
					mobileNav={mobileNav}
					dashboardNav={dashboardNav}
					logo={logo}
					{...props}
				/>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen">
			{isVisibleDashboarNav && (
				<ActiveLinks
					open={open}
					setOpen={setOpen}
					dashboardNav={dashboardNav}
					logo={logo}
					{...props}
				/>
			)}

			<div
				className="flex-1 flex flex-col overflow-x-auto h-screen overflow-y-auto"
				// onClick={() => open && setOpen(false)}
			>
				{children}
			</div>
		</div>
	);
};

function ActiveLinks({
	dashboardNav,
	mobileNav,
	logo,
	isMobile = false,
	open = false,
	setOpen,
	...props
}: {
	dashboardNav: Record<
		"primary" | "secondary",
		Array<{ label: string; url: string; icon: LucideIcon }>
	>;
	mobileNav?: Array<{ label: string; url: string; icon: LucideIcon }>;
	logo: { icon: string; full: string; alt: string };
	isMobile?: boolean;
	open?: boolean;
	setOpen?: (o: boolean) => void;
	activeOrder?: boolean;
	activeOrgData?: any;
}) {
	const matchRoute = useMatchRoute();
	const [isHidden, setIsHidden] = useState(false);
	const lastRef = useRef(0);

	const { scrollY } = useScroll();
	useMotionValueEvent(scrollY, "change", (current) => {
		const diff = current - lastRef.current;
		if (Math.abs(diff) > 100) {
			setIsHidden(diff > 0);
			lastRef.current = current;
		}
	});

	if (isMobile && mobileNav) {
		return (
			<motion.div
				className="fixed bottom-0 w-screen z-50"
				initial="visible"
				animate={isHidden ? "hidden" : "visible"}
				variants={{
					hidden: { y: 77 },
					visible: { y: 0 },
				}}
				transition={{ duration: 0.2, ease: "easeInOut" }}
			>
				{props.activeOrder && (
					<div className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white relative overflow-hidden rounded-t-lg">
						{/* Animated background pulse */}
						<div className="absolute inset-0 bg-white/10 animate-pulse" />

						{/* Content */}
						<div className="relative flex items-center justify-between px-4 py-2">
							<div className="flex items-center space-x-3">
								{/* Pulsing dot indicator */}
								<div className="flex items-center">
									<div className="w-2 h-2 bg-white rounded-full animate-ping" />
									<div className="w-2 h-2 bg-white rounded-full absolute" />
								</div>

								<p className="text-sm text-green-100 font-medium">
									Your have active orders
								</p>
							</div>

							{/* Action button */}
							<button
								type="button"
								className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 hover:scale-105"
							>
								Track order status
							</button>
						</div>
					</div>
				)}
				{/* Enhanced Active Order Banner */}

				{/* Mobile Nav */}
				<div className="bg-background border-t">
					<div
						className={cn("grid justify-center px-4")}
						style={{ gridTemplateColumns: `repeat(${mobileNav.length}, 1fr)` }}
					>
						{mobileNav.map((n, i) => (
							<NavLink key={i} nav={n} mobile matchRoute={matchRoute} />
						))}
					</div>
				</div>
			</motion.div>
		);
	}

	const handleNavClick = (e: React.MouseEvent) => {
		if (e.currentTarget === e.target && setOpen) {
			setOpen(!open);
		}
	};

	return (
		<motion.nav
			className="flex flex-col justify-between h-screen sticky top-0 left-0 p-3 border-r z-10 bg-background"
			onClick={handleNavClick}
			initial={{ width: "var(--sidebar-size)" }}
			animate={{
				width: open ? "var(--sidebar-max-size)" : "var(--sidebar-size)",
			}}
			transition={{ duration: 0.3 }}
		>
			<div className="space-y-8">
				{/* <div className="flex justify-start items-center">
					<Link to="/" className="overflow-hidden size-[50px]">
						<img
							key={String(open)}
							src={!open ? logo.icon : logo.full}
							alt={logo.alt}
							width={50}
							height={50}
							className="rounded-md"
						/>
					</Link>
				</div> */}
				<div className="flex items-center gap-2 pt-4">
					<Store className="fill-primary/40" />
					<p className="text-lg font-medium">{props.activeOrgData.name}</p>
				</div>

				<div className="space-y-2">
					{dashboardNav.primary.map((n, i) => (
						<NavLink key={i} nav={n} open={open} matchRoute={matchRoute} />
					))}
				</div>
			</div>
			<div className="space-y-2">
				{dashboardNav.secondary.map((n, i) => (
					<NavLink key={i} nav={n} open={open} matchRoute={matchRoute} />
				))}
			</div>
		</motion.nav>
	);
}

function NavLink({
	nav,
	open,
	mobile,
	matchRoute,
}: {
	nav: { label: string; url: string; icon: LucideIcon };
	open?: boolean;
	mobile?: boolean;
	matchRoute: ReturnType<typeof useMatchRoute>;
}) {
	const isActive = !!matchRoute({ to: nav.url, fuzzy: true });

	return (
		<div
			className={cn(
				"overflow-hidden border-b border-border/20 truncate rounded-md px-1.5 relative w-full",
				open && "justify-start",
				mobile && "px-0 justify-center rounded-none",
				mobile
					? isActive && ""
					: isActive
						? "bg-accent font-semibold"
						: "hover:bg-accent",
			)}
		>
			{/* {mobile && (
				<span
					className={cn(
						"h-2 w-4/5 block bg-transparent rounded-b-2xl m-auto",
						isActive && "bg-primary",
					)}
				/>
			)} */}
			<Link
				className={cn(
					"inline-flex items-center font-medium py-2 gap-2",
					mobile && "flex-col font-normal w-full",
				)}
				to={nav.url}
			>
				<span className="flex justify-center items-center w-[30px]">
					<nav.icon
						className={cn(
							"size-5",
							mobile && "flex-col font-normal w-full stroke-1.5",

							isActive && "fill-foreground/40",
						)}
					/>
				</span>
				{!mobile && (
					<motion.span
						className={
							"flex justify-between gap-2 w-full items-center flex-1 font-medium"
						}
						initial={{ opacity: 0 }}
						animate={{ opacity: open ? 1 : 0 }}
						transition={{ duration: 0.2 }}
					>
						{nav.label}
					</motion.span>
				)}
				{mobile && <span className={" font-semibold"}>{nav.label}</span>}
			</Link>
		</div>
	);
}

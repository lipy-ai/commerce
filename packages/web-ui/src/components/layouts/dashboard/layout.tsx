"use client";

import { usePWAInstall } from "@lipy/web-ui/hooks/use-pwa-install";

import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowDownToLine, type LucideIcon } from "lucide-react";
import {
  Fragment,
  type ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

export type DashboardNavs = Record<
  "primary" | "secondary",
  Array<{
    label: string;
    url: string;
    icon: LucideIcon;
    // activeIcon?: JSX.Element;
    mobile?: boolean;
  }>
>;

type ContextType = {
  footer: {
    id: "save-btn" | "cart-btn";
    node: ReactNode;
  }[];
  addFooter: (v: ContextType["footer"][0]) => void;
  removeFooter: (v: ContextType["footer"][0]["id"]) => void;
};

const Context = createContext<ContextType>({
  footer: [],
  addFooter: () => {},
  removeFooter: () => {},
});

export const DashboardLayout = ({
  children,
  dashboardNav,
  mobileNav,
  logo,
  ...props
}: {
  children?: ReactNode;
  dashboardNav?: DashboardNavs;
  mobileNav?: DashboardNavs["primary"];
  logo: {
    icon: string;
    full: string;
    alt: string;
  };
}) => {
  const [open, setOpen] = useState(false);
  const { isMobile } = useViewport();
  const { isInstallable, promptInstall } = usePWAInstall();
  const [footer, setFooter] = useState<ContextType["footer"]>([]);
  const removeFooter: ContextType["removeFooter"] = (v) => {
    setFooter((p) => p.filter((f) => f.id !== v));
  };
  const addFooter: ContextType["addFooter"] = (v) => {
    setFooter((p) => [...p.filter((f) => f.id !== v.id), v]);
  };

  const footerList = footer && footer.length > 0 && (
    <div className="space-y-4 fixed bottom-10 left-1/2 -translate-x-1/2 p-4">
      {footer?.map((f, i) => (
        <Fragment key={i}>{f.node}</Fragment>
      ))}
    </div>
  );

  return (
    <Context.Provider value={{ addFooter, footer, removeFooter }}>
      {isMobile ? (
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
                  "size-6"
                )}
              >
                <ArrowDownToLine />
              </span>
            </div>
          )}

          <div
            className="pb-18 flex-col flex flex-1"
            style={{
              viewTransitionName: "main-content",
            }}
            id="main-content"
          >
            {children}
          </div>
          {!mobileNav && footerList}
          <ActiveLinks
            isMobile
            footer={footer}
            mobileNav={mobileNav}
            dashboardNav={dashboardNav}
            logo={logo}
            {...props}
          />
        </div>
      ) : (
        <div className="flex min-h-screen">
          <ActiveLinks
            open={open}
            setOpen={setOpen}
            dashboardNav={dashboardNav}
            logo={logo}
            {...props}
          />

          <div
            className="w-full flex flex-col flex-1"
            onClick={() => open && setOpen(false)}
            style={{
              viewTransitionName: "main-content",
            }}
          >
            {children}

            {footerList}
          </div>
        </div>
      )}
    </Context.Provider>
  );
};

function ActiveLinks({
  dashboardNav,
  mobileNav,
  logo,
  isMobile = false,
  open = false,
  setOpen,
  footer,
  // ...props
}: {
  dashboardNav?: Record<
    "primary" | "secondary",
    Array<{ label: string; url: string; icon: LucideIcon }>
  >;
  mobileNav?: Array<{ label: string; url: string; icon: LucideIcon }>;
  logo: { icon: string; full: string; alt: string };
  isMobile?: boolean;
  open?: boolean;
  setOpen?: (o: boolean) => void;
  footer?: ContextType["footer"];
  // activeOrder?: boolean;
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
      <>
        <motion.div
          className={cn(
            "fixed bottom-0 w-screen z-50 print:hidden transition-all ease-in-out"
          )}
          initial="visible"
          animate={isHidden ? "hidden" : "visible"}
          variants={{
            hidden: { y: 77 },
            visible: { y: 0 },
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          data-state={isHidden ? "hidden" : "visible"}
        >
          {footer && footer.length > 0 && (
            <div className="space-y-4 p-4">
              {footer?.map((f, i) => (
                <Fragment key={i}>{f.node}</Fragment>
              ))}
            </div>
          )}

          {/* Mobile Nav */}
          <div className="bg-background border-t">
            <div
              className={cn("grid justify-center px-2")}
              style={{
                gridTemplateColumns: `repeat(${mobileNav.length}, 1fr)`,
              }}
            >
              {mobileNav.map((n, i) => (
                <NavLink key={i} nav={n} mobile matchRoute={matchRoute} />
              ))}
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  const handleNavClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target && setOpen) {
      setOpen(!open);
    }
  };

  if (dashboardNav)
    return (
      <motion.nav
        className="flex flex-col justify-between h-screen sticky top-0 left-0 p-3 border-r z-10 bg-background print:hidden"
        onClick={handleNavClick}
        initial={{ width: "var(--sidebar-size)" }}
        animate={{
          width: open ? "var(--sidebar-max-size)" : "var(--sidebar-size)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-8">
          <div className="flex justify-start items-center">
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
          </div>
          <div className="space-y-2">
            {dashboardNav?.primary.map((n, i) => (
              <NavLink key={i} nav={n} open={open} matchRoute={matchRoute} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {dashboardNav?.secondary.map((n, i) => (
            <NavLink key={i} nav={n} open={open} matchRoute={matchRoute} />
          ))}
        </div>
      </motion.nav>
    );
  return null;
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
          ? isActive && "text-primary [&_svg]:stroke-primary"
          : isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent"
      )}
    >
      {mobile && (
        <span
          className={cn(
            "h-2 w-4/5 block bg-transparent rounded-b-2xl m-auto",
            isActive && "bg-primary"
          )}
        />
      )}
      <Link
        className={cn(
          "inline-flex items-center font-medium py-2 gap-2",
          mobile && "flex-col font-normal w-full"
        )}
        to={nav.url}
      >
        <span className="flex justify-center items-center w-[30px]">
          <nav.icon
            className={cn(
              "size-5",
              mobile && "flex-col font-normal w-full stroke-1.5"
            )}
          />
        </span>
        {!mobile && (
          <motion.span
            className="flex justify-between gap-2 w-full items-center flex-1 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {nav.label}
          </motion.span>
        )}
        {mobile && <span>{nav.label}</span>}
      </Link>
    </div>
  );
}

export const useLayout = () => {
  return useContext(Context);
};

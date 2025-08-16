import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="px-8 py-2 border-b flex justify-between items-center">
      <div className="flex items-center gap-2 lg:justify-start shrink-0">
        <Link to="/">
          <img
            src="/logo/ico.png"
            alt="Lipy logo"
            className="size-14 rounded-lg shrink-0"
          />
        </Link>
      </div>
      <div className="flex space-x-4 items-center text-base">
        <Link to="/">Home</Link>
        <Link to={"/seller"} className={cn(buttonVariants({}), "rounded-full")}>
          Become Seller
        </Link>
      </div>
    </header>
  );
}

import { useCartStore } from "@/components/cart/store";
import CustomAvatarGroup from "@lipy/web-ui/components/custom-ui/customAvatarGroup";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/shop")({
	component: RouteComponent,
});

function RouteComponent() {
	const { cart } = useCartStore();

	return (
		<div className="max-w-4xl [view-transition-name:main-content]">
			<Outlet />
			<AnimatePresence>
				{cart.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 100 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: "easeInOut" }}
						exit={{ opacity: 0, y: 100 }}
						className="fixed bottom-2 left-2 right-2  rounded-xl bg-white shadow-2xl p-2"
					>
						<div className="flex items-center justify-between mx-4">
							<CustomAvatarGroup items={cart} />

							<Link
								to="/cart"
								className={cn(
									buttonVariants({ variant: "emerald", size: "lg" }),
									"gap-4",
								)}
								viewTransition={{ types: ["slide-left"] }}
							>
								<div className="flex flex-col items-center">
									<p className="font-semibold text-base">View Cart</p>
									<p>{cart.length} items</p>
								</div>
								<Avatar>
									<AvatarFallback className="bg-green-800">
										<ChevronRight />
									</AvatarFallback>
								</Avatar>
							</Link>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

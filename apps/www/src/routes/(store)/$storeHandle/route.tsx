// import CartAvatarGroup from "@/components/cart/cartAvatarGroup";
// import { useCartStore } from "@/components/cart/store";
// import { buttonVariants } from "@lipy/web-ui/components/ui/button";
// import { useViewport } from "@lipy/web-ui/contexts/viewport";
// import { cn } from "@lipy/web-ui/lib/utils";
import { Outlet, createFileRoute } from "@tanstack/react-router";
// import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/(store)/$storeHandle")({
	component: RouteComponent,
});

function RouteComponent() {
	// const { cart } = useCartStore();
	// const { isMobile } = useViewport();

	return (
		<div>
			<Outlet />
			{/* {isMobile && (
				<AnimatePresence>
					{cart.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 100 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, ease: "easeInOut" }}
							exit={{ opacity: 0, y: 100 }}
							className="fixed bottom-2 left-4 right-4  rounded-2xl bg-card shadow-2xl p-2"
						>
							<div className="flex items-center justify-between mx-4">
								<CartAvatarGroup items={cart} />

								<Link
									to="/cart"
									className={cn(buttonVariants(), "gap-4")}
									viewTransition={{ types: ["slide-left"] }}
								>
									<div className="flex flex-col items-center">
										<p className="font-semibold text-sm">View Cart</p>
										<p className="text-xs text-background/80">
											{cart.length} items
										</p>
									</div>
								</Link>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			)} */}
		</div>
	);
}

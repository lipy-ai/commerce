import { createFileRoute, useLocation } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/(default)")({
	component: RouteComponent,
});

function RouteComponent() {
	const location = useLocation();

	const prevLocationRef = useRef<string | null>(null);
	const historyStackRef = useRef<string[]>([]);

	const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

	useEffect(() => {
		const currentPath = location.pathname;

		if (historyStackRef.current.length === 0) {
			// Initial page load
			historyStackRef.current.push(currentPath);
			prevLocationRef.current = currentPath;
			return;
		}

		const prevPath = prevLocationRef.current;

		if (prevPath === currentPath) {
			// Same page
			return;
		}

		const prevIndex = historyStackRef.current.findIndex(
			(path) => path === currentPath,
		);

		if (prevIndex !== -1) {
			// Navigating backward
			historyStackRef.current = historyStackRef.current.slice(0, prevIndex + 1);
			setDirection(-1);
		} else {
			// Navigating forward
			historyStackRef.current.push(currentPath);
			setDirection(1);
		}

		prevLocationRef.current = currentPath;
	}, [location]);

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				key={location.pathname}
				initial={{
					x: direction > 0 ? 300 : -300,
					opacity: 0,
				}}
				animate={{
					x: 0,
					opacity: 1,
				}}
				exit={{
					x: direction > 0 ? -300 : 300,
					opacity: 0,
				}}
				transition={{ duration: 0.2, ease: "easeInOut" }}
			>
				<Outlet />
			</motion.div>
		</AnimatePresence>
	);
}

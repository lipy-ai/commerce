import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute(
	"/(default)/(store)/$storeHandle/products/search",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 1000 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full"
		>
			<DashboardHeader className="border-b-0 pl-0" hideBackBtn>
				<SearchBar className="w-full " fullPageSearch />
			</DashboardHeader>
		</motion.div>
	);
}

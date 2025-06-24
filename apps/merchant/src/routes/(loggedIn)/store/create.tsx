import { ShopCreateForm } from "@/components/shopCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/store/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<ShopCreateForm />
		</div>
	);
}

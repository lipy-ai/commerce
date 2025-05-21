import { authClient } from "@lipy/lib/providers/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/")({
	component: RouteComponent,
});

function RouteComponent() {
	const data = authClient.useSession();
	return (
		<div>
			Hello "/(loggedIn)/"!
			<pre className="whitespace-pre-wrap max-w-md p-8">
				{JSON.stringify(data, null, 2)}
			</pre>
		</div>
	);
}

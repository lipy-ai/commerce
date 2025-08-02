import { getIsSsrMobile } from "@lipy/lib/utils/isServerMobile";
import { json } from "@tanstack/react-start";
import { createServerFileRoute, getHeader } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/init").methods({
	GET: async () => {
		const userAgent = getHeader("User-Agent");
		const isSsrMobile = getIsSsrMobile(userAgent);
		return json({ isSsrMobile, userAgent });
	},
});

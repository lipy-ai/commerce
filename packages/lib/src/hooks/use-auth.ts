import { authClient } from "../providers/auth";
import { redirectToLoginURL } from "./use-navigate";

export const useAuthSession = () => {
	const res = authClient.useSession();

	if (!res.isPending && !res.data?.session?.userId) {
		redirectToLoginURL();
	}

	const role = res.data?.session.activeStoreRole || "";
	let view: "full" | "staff" | "delivery" | null = null;

	if (["admin", "owner"].includes(role)) {
		view = "full";
	}

	if (["staff"].includes(role)) {
		view = "staff";
	}

	if (["delivery"].includes(role)) {
		view = "delivery";
	}

	return { ...res, view };
};

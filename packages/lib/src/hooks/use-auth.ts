import { authClient } from "../providers/auth";
import { redirectToLoginURL } from "./use-navigate";

export const useAuthSession = () => {
	const res = authClient.useSession();

	if (!res.isPending && !res.data?.session?.userId) {
		redirectToLoginURL();
	}

	return res;
};

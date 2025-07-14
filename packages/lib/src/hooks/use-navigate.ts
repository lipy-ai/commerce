import { useNavigate } from "@tanstack/react-router";

import { env } from "@envClient";

export const redirectToLoginURL = () => {
	window.location.href = `${env.WEB_URL}/login?cb=${btoa(window.location.href)}`;
};

export const useRedirect = () => {
	const navigate = useNavigate() as any;
	const handleNavigate = (code?: string) => {
		if (!code) return;
		if (code === "NOT_LOGGED_IN") {
			redirectToLoginURL();
		}

		if (code === "NO_ACTIVE_STORE") {
			navigate({ to: "/register" });
		}

		if (code === "INSUFFICIENT_PERMISSION") {
			navigate({ to: "/error" });
		}
	};

	return { handleNavigate };
};

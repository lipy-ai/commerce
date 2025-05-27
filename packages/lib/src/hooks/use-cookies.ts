import { useCookies as uC } from "react-cookie";

export const keys = {
	is_pwa_mobile: "is_pwa_mobile",
} as const;

export const useCookies = ({
	cookieKey,
}: { cookieKey: (keyof typeof keys)[] }) => {
	const [cookies, setCookie, removeCookie] = uC(cookieKey);

	return { cookies, setCookie, removeCookie };
};

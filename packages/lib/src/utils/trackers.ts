import { env } from "@envClient";

declare global {
	interface Window {
		gtag: (...args: any[]) => void;
	}
}

export const trackPageView = (url: string) => {
	console.log(env.GTAG_ID);
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("config", env.GTAG_ID, {
			page_path: url,
		});
	}
};

export const trackEvent = ({
	action,
	category,
	label,
	value,
}: {
	action: string;
	category: string;
	label: string;
	value: number;
}) => {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", action, {
			event_category: category,
			event_label: label,
			value: value,
		});
	}
};

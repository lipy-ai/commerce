const IS_CLIENT_RENDERED = typeof window !== "undefined";
const UA = (IS_CLIENT_RENDERED && navigator?.userAgent) || "";

const IOS = UA?.match(/iPhone|iPad|iPod/);
const ANDROID = UA?.match(/Android/);

export const PLATFORM = IOS ? "ios" : ANDROID ? "android" : "unknown";

const standalone =
	IS_CLIENT_RENDERED &&
	window?.matchMedia("(display-mode: standalone)").matches;

export const PWA_INSTALLED = !!(standalone || (IOS && !UA?.match(/Safari/)));

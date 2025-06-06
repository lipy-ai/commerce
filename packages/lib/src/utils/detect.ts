const IS_CLIENT_RENDERED = typeof window !== "undefined";
const UA = (IS_CLIENT_RENDERED && navigator?.userAgent) || "";

// Platform detection
const IOS = UA?.match(/iPhone|iPad|iPod/);
const ANDROID = UA?.match(/Android/);

export const PLATFORM = IOS ? "ios" : ANDROID ? "android" : "unknown";

// PWA display mode detection
const displayModeFullscreen =
	IS_CLIENT_RENDERED &&
	window?.matchMedia("(display-mode: fullscreen)").matches;

const displayModeStandalone =
	IS_CLIENT_RENDERED &&
	window?.matchMedia("(display-mode: standalone)").matches;

// Export whether PWA is installed (fullscreen or standalone)
export const PWA_INSTALLED = !!(
	displayModeFullscreen ||
	displayModeStandalone ||
	(IOS && !UA?.match(/Safari/))
);

// Optional: export display mode string (helpful for UI)
export const DISPLAY_MODE = displayModeFullscreen
	? "fullscreen"
	: displayModeStandalone
		? "standalone"
		: "browser";

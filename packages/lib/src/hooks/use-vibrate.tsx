import { useEffect } from "react";

const useGlobalVibration = () => {
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			// Traverse up in case the click was on a nested span or icon inside button or a
			const clickable = target.closest("button, a[href]");

			console.log(clickable, navigator.vibrate);

			if (clickable && navigator.vibrate) {
				navigator.vibrate(15); // subtle haptic
			}
		};

		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);
};

export default useGlobalVibration;

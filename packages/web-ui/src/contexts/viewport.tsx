"use client";

import {
	type ReactNode,
	createContext,
	useContext,
	useLayoutEffect,
	useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";

const viewportContext = createContext({
	width: 0,
	height: 0,
	screenWidth: 0,
	screenHeight: 0,
	isMobile: false,
});

const ViewportProvider = ({
	children,
	isMobile,
}: {
	children: ReactNode;
	isMobile?: boolean;
}) => {
	const initial = isMobile ? 768 : 1250;

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [screenWidth, setScreenWidth] = useState(0);
	const [screenHeight, setScreenHeight] = useState(0);

	const handleWindowResize = useDebouncedCallback(
		// function
		() => {
			if (typeof window === "undefined") return;
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
			setScreenWidth(window.screen.width);
			setScreenHeight(window.screen.height);

			document.body.style.opacity = "1";
		},
		// delay in ms
		500,
	);
	useLayoutEffect(() => {
		if (typeof window === "undefined") return;
		if (width === 0 && height === 0) {
			handleWindowResize();
		} else {
			window.addEventListener("resize", handleWindowResize);
			return () => {
				window.removeEventListener("resize", handleWindowResize);
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [width, height]);

	return (
		<viewportContext.Provider
			value={{
				width: width || initial,
				height: height || initial,
				screenWidth: screenWidth || initial,
				screenHeight: screenHeight || initial,
				isMobile:
					width === 0 && height === 0 ? !!isMobile : width > 800 ? false : true,
			}}
		>
			{children}
		</viewportContext.Provider>
	);
};

const useViewport = () => {
	return useContext(viewportContext);
};

export { ViewportProvider, useViewport };

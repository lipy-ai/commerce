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
	const [width, setWidth] = useState(-1);
	const [height, setHeight] = useState(-1);
	const [screenWidth, setScreenWidth] = useState(-1);
	const [screenHeight, setScreenHeight] = useState(-1);

	const handleWindowResize = useDebouncedCallback(
		// function
		() => {
			if (typeof window === "undefined") return;

			if (window.innerWidth !== window.screen.width) {
				window.resizeTo(window.screen.width, window.screen.height);
			}

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
		if (width === -1 && height === -1) {
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
				width: width,
				height: height,
				screenWidth: screenWidth,
				screenHeight: screenHeight,
				isMobile: isMobile || (screenWidth < 768 && screenWidth > -1) || false,
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

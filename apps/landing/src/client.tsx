/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start";
import { createRouter } from "./router";

const router = createRouter();

if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/sw.js")
		.then((reg) => {
			console.log("Service Worker registered:", reg.scope);
		})
		.catch((err) => {
			console.error("Service Worker registration failed:", err);
		});
}

hydrateRoot(document, <StartClient router={router} />);

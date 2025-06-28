import { env } from "@envClient"; // Make sure this is a client-safe env import
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

type Message = {
	type: string;
	message: string;
	[key: string]: any; // Allow other fields
};

const e =
	typeof window !== "undefined" &&
	new EventSource(`${env.API_URL}/v1/events`, { withCredentials: true });

if (e) {
	e.onopen = () => console.log("SSE connection open");
	e.onerror = (e) => console.log("SSE error", e);
	e.onmessage = (e) => {
		console.log("data", e.data);
	};
}
// e?.onmessage = (event: MessageEvent) => {
// 	try {
// 		const data: Message = event.data; //JSON.parse(event.data);
// 		// setMessages((prev) => [...prev, data]);
// 		// You can do custom actions here too:
// 		// if (data.type === "NOTIFICATION") { showToast(data.message) }
// 		console.log(data);
// 	} catch (err) {
// 		console.error("Invalid SSE message:", event.data);
// 	}
// };

// e?.onerror = (err) => {
// 	console.error("SSE error:", err);
// };

const EventsProvider: React.FC = () => {
	const sse = useRef<EventSource | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (!sse.current) {
			console.log("hit");
			// sse.current = new EventSource(`${env.API_URL}/events`);
		}

		return () => {
			sse.current?.close();
			sse.current = null;
		};
	}, []);

	return null; // Or return context/provider if exposing `messages` to children
};

export default EventsProvider;

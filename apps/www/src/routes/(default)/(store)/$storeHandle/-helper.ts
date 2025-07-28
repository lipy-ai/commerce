import { format, parse } from "date-fns";

export const getStoreStatus = (openingHour: string, closingHour: string) => {
	const now = new Date();

	const openingTime = parse(openingHour, "HH:mm:ss", now);
	const closingTime = parse(closingHour, "HH:mm:ss", now);

	const openTime = format(openingTime, "hh:mm a");
	const closeTime = format(closingTime, "hh:mm a");

	const isOpen = now >= openingTime && now <= closingTime;

	return { openTime, closeTime, isOpen };
};

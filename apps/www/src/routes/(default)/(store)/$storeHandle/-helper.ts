import { format, parse } from "date-fns";

export const getStoreStatus = (openingHour: string, closingHour: string) => {
	const now = new Date();

	const is24HourOpen = openingHour === "00:00:00" && closingHour === "00:00:00";
	if (is24HourOpen) {
		return {
			openTime: "12:00 AM",
			closeTime: "12:00 AM (next day)",
			isOpen: true,
		};
	}

	const openingTime = parse(openingHour, "HH:mm:ss", now);
	const closingTime = parse(closingHour, "HH:mm:ss", now);

	// If the closing time is earlier than opening (e.g. 10 PM to 2 AM), add 1 day to closingTime
	if (closingTime <= openingTime) {
		closingTime.setDate(closingTime.getDate() + 1);
	}

	const openTime = format(openingTime, "hh:mm a");
	const closeTime = format(closingTime, "hh:mm a");

	const isOpen = now >= openingTime && now <= closingTime;

	return { openTime, closeTime, isOpen };
};

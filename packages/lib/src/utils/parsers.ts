import { createParser } from "nuqs";

export const parseAtobToString = createParser({
	parse(queryValue) {
		return atob(queryValue);
	},
	serialize(value) {
		return String(value);
	},
});

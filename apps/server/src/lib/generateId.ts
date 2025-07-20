import { customAlphabet } from "nanoid";

type IType = {
	prefix?: "ORD";
	alphabet_type?: "0-9" | "0-9/A-Z/a-z" | "0-9/A-Z";
	timestamp?: boolean;
	length?:number
};
export const idGenerate = (props?: IType) => {
	const types = {
		"0-9/A-Z/a-z":
			"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
		"0-9/A-Z": "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		"0-9": "0123456789",
	};

	const addTimeStamp = () => {
		const date = new Date();
		return date.toISOString().slice(0, 10).replace(/-/g, "");
	};

	const nanoid = customAlphabet(types[props?.alphabet_type || "0-9/A-Z"], props?.length || 14);

	return `${props?.prefix ? `${props.prefix}-` : ""}${props?.timestamp ? addTimeStamp() : ""}${nanoid()}`;
};

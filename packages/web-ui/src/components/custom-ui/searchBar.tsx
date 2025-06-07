import { Search, X } from "lucide-react";
import { CustomInput } from "./customInput";

export default function SearchBar({ placeholder }: { placeholder?: string }) {
	return (
		<div>
			<CustomInput
				placeholder={placeholder || "Search for shop, grocery, fruits...."}
				size="lg"
				prefixEl={<Search />}
				className="bg-background rounded-xl  text-md text-black"
				suffixEl={<X />}
			/>
		</div>
	);
}

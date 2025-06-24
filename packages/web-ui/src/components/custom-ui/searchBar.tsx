import { cn } from "@lipy/web-ui/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SearchBar({
	placeholder,
	onSearch,
	defaultValue,
}: {
	placeholder?: string;
	onSearch?: (v: string) => void;
	defaultValue?: string;
}) {
	const [value, setValue] = useState(defaultValue || "");
	const [debounced] = useDebounce(value, 300);
	const navigate = useNavigate();

	useEffect(() => {
		navigate({
			// @ts-ignore -- I want it to set on any route -- Should fix this though
			search: (p) => ({
				...p,
				q: debounced,
			}),
		});
	}, [debounced, navigate]);

	return (
		<form onSubmit={() => onSearch?.(value)} className="p-2 md:p-0">
			<Input
				value={value}
				onChange={(e) => {
					setValue(e.currentTarget.value);
				}}
				placeholder={placeholder || "Search"}
				prefixEl={<Search />}
				suffixEl={
					<Button
						type="button"
						variant={"ghost"}
						size="icon-sm"
						onClick={() => setValue("")}
						className={cn(value ? "" : "hidden")}
					>
						<X />
					</Button>
				}
			/>
		</form>
	);
}

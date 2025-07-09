import { cn } from "@lipy/web-ui/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SearchBar({
	placeholder,
	defaultValue,
	className,
}: {
	placeholder?: string;
	defaultValue?: string;
	className?: string;
}) {
	const [value, setValue] = useState(defaultValue || "");
	const [debounced] = useDebounce(value, 300);
	const navigate = useNavigate();

	const onSearch = (q: string) =>
		navigate({
			// @ts-ignore -- I want it to set on any route -- Should fix this though
			search: (p) => ({
				...p,
				q,
			}),
		});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		onSearch(debounced);
	}, [debounced]);

	return (
		<form
			onSubmit={(e) => {
				onSearch(value);
				e.preventDefault();
			}}
			className={cn("", className)}
		>
			<Input
				className="rounded"
				value={value}
				onChange={(e) => {
					setValue(e.currentTarget.value);
				}}
				placeholder={placeholder || "Search"}
				prefixEl={<Search className="stroke-2" />}
				suffixEl={
					<Button
						type="button"
						variant={"ghost"}
						size="icon"
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

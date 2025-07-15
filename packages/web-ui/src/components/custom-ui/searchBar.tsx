import { cn } from "@lipy/web-ui/lib/utils";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SearchBar({
	placeholder,
	defaultValue,
	className,
	fullPageSearch,
}: {
	placeholder?: string;
	defaultValue?: string;
	className?: string;
	fullPageSearch?: boolean;
}) {
	const [value, setValue] = useState(defaultValue || "");
	const [debounced] = useDebounce(value, 300);
	const navigate = useNavigate();
	const router = useRouter();

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
				className="rounded-xl"
				value={value}
				onChange={(e) => {
					setValue(e.currentTarget.value);
				}}
				placeholder={placeholder || "Search"}
				prefixEl={
					fullPageSearch ? (
						<Button
							type="button"
							variant={"ghost"}
							size="icon-xs"
							onClick={(e) => {
								e.preventDefault();
								router.history.back();
								return false;
							}}
						>
							<ChevronLeft className="size-6" />
						</Button>
					) : (
						<Search />
					)
				}
				suffixEl={
					value && (
						<Button
							type="button"
							variant={"ghost"}
							size="icon"
							onClick={() => setValue("")}
						>
							<X />
						</Button>
					)
				}
			/>
		</form>
	);
}

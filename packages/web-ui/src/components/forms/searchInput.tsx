"use client";

import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
	CommandDialog,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@lipy/web-ui/components/ui/command";
import { CommandLoading } from "cmdk";
import type { InferRequestType } from "hono/client";
import { ChevronDown, Loader2 } from "lucide-react";
import * as React from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";

type Type = InferRequestType<
	typeof apiClient.v1.merchant.combobox.$get
>["query"]["type"];

export function SearchInput({
	placeholder,
	disabled,
	type,
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string | null) => void;
	placeholder: string;
	name: string;
	disabled?: boolean;
	type: Type;
}) {
	const [open, setOpen] = React.useState(false);
	const ref = React.useRef<HTMLButtonElement>(null);
	const [search, setSearch] = React.useState("");
	const [debouncedSearch] = useDebounce(search, 300);

	const { data, isLoading } = useAPIQuery(
		apiClient.v1.merchant.combobox,
		"$get",
		{ query: { type, q: debouncedSearch } },
		{ placeholderData: (p) => p },
	);

	const list = data ?? [];

	const selected = React.useMemo(() => {
		return list.find((f) => f.value === value) || "";
	}, [list, value]);

	const button = (
		<Button
			ref={ref}
			variant="outline"
			className="w-full"
			onClick={() => setOpen(true)}
			disabled={disabled}
		>
			{selected ? (
				<>
					{selected.icon && (
						<span className="bg-muted block size-5 overflow-hidden rounded border">
							<span
								className="block size-full"
								style={{
									backgroundImage: `url(${selected.icon})`,
									backgroundSize: "contain",
								}}
							/>
						</span>
					)}
					<span className="truncate">{selected.label}</span>
				</>
			) : (
				<span className="truncate">{placeholder}</span>
			)}
			<span className="ml-auto">
				<ChevronDown />
			</span>
		</Button>
	);

	return (
		<
			// shouldFilter={false}
		>
			{button}
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					value={search}
					onValueChange={setSearch}
					placeholder={placeholder}
				/>

				<CommandList className="min-h-[400px] flex-1">
					{isLoading ? (
						<CommandLoading className="m-auto flex min-h-[400px] flex-1 items-center justify-center px-4">
							<Loader2 className="animate-spin" />
						</CommandLoading>
					) : !list || list.length === 0 ? (
						<CommandEmpty className="flex min-h-[400px] flex-1 items-center justify-center px-4">
							No results found.
						</CommandEmpty>
					) : (
						list?.map((d) => (
							<CommandItem
								key={d.value}
								value={d.label || "Untitled"}
								onSelect={() => {
									onChange(d.value);
									setOpen(false);
								}}
								className="flex items-center gap-2"
							>
								{d.icon && (
									<span className="bg-muted block size-5 overflow-hidden rounded border">
										<span
											className="block size-full"
											style={{
												backgroundImage: `url(${d.icon})`,
												backgroundSize: "contain",
											}}
										/>
									</span>
								)}
								<div>
									<span className="truncate">{d.label}</span>
									{/* <span className="truncate">{d.description}</span> */}
								</div>
							</CommandItem>
						))
					)}
				</CommandList>
			</CommandDialog>
		</>
	);
}

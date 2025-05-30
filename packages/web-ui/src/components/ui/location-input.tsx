// Import JSON data directly
import { Check, ChevronsUpDown } from "lucide-react";
import  { useEffect, useState } from "react";

import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@lipy/web-ui/components/ui/command";
import { ScrollArea, ScrollBar } from "@lipy/web-ui/components/ui/scroll-area";
import { cn } from "@lipy/web-ui/lib/utils";
import countriesData from "../../data/countries.json";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";

interface Timezone {
	zoneName: string;
	gmtOffset: number;
	gmtOffsetName: string;
	abbreviation: string;
	tzName: string;
}

interface CountryProps {
	id: number;
	name: string;
	iso3: string;
	iso2: string;
	numeric_code: string;
	phone_code: string;
	capital: string;
	currency: string;
	currency_name: string;
	currency_symbol: string;
	tld: string;
	native: string;
	region: string;
	region_id: string;
	subregion: string;
	subregion_id: string;
	nationality: string;
	timezones: Timezone[];
	translations: Record<string, string>;
	latitude: string;
	longitude: string;
	emoji: string;
	emojiU: string;
}

// interface StateProps {
// 	id: number;
// 	name: string;
// 	country_id: number;
// 	country_code: string;
// 	country_name: string;
// 	state_code: string;
// 	type: string | null;
// 	latitude: string;
// 	longitude: string;
// }

interface LocationSelectorProps {
	size: "default" | "lg";
	disabled?: boolean;
	value?: string;
	onCountryChange?: (country: CountryProps | null) => void;
}

const LocationSelector = ({
	size = "default",
	disabled,
	onCountryChange,
	value,
}: LocationSelectorProps) => {
	const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(
		null,
	);
	const [openCountryDropdown, setOpenCountryDropdown] = useState(false);

	// Cast imported JSON data to their respective types
	const countries = countriesData as CountryProps[];

	const handleCountrySelect = (country: CountryProps | null) => {
		setSelectedCountry(country);
		onCountryChange?.(country);
	};

	useEffect(() => {
		const find = countries.find((c) => c.iso3 === value);
		setSelectedCountry(find || null);
	}, [value]);

	return (
		<div className="flex gap-4">
			{/* Country Selector */}
			<Dialog open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
				<DialogTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						size={size}
						aria-expanded={openCountryDropdown}
						disabled={disabled}
						className={cn("w-full justify-between", "px-4")}
					>
						{selectedCountry ? (
							<div className="flex items-center gap-2">
								<span>{selectedCountry.emoji}</span>
								<span>{selectedCountry.name}</span>
							</div>
						) : (
							<span>Select Country...</span>
						)}
						<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</DialogTrigger>
				<DialogContent className="p-0">
					<DialogTitle className="sr-only">Select Country</DialogTitle>
					<Command>
						<CommandInput placeholder="Search country..." />
						<CommandList>
							<CommandEmpty>No country found.</CommandEmpty>
							<CommandGroup>
								<ScrollArea className="">
									{countries?.map((country) => (
										<CommandItem
											key={country.id}
											value={country.name}
											onSelect={() => {
												handleCountrySelect(country);
												setOpenCountryDropdown(false);
											}}
											className="flex cursor-pointer items-center justify-between text-sm"
										>
											<div className="flex items-center gap-2">
												<span>{country.emoji}</span>
												<span>{country.name}</span>
											</div>
											<Check
												className={cn(
													"h-4 w-4",
													selectedCountry?.id === country.id
														? "opacity-100"
														: "opacity-0",
												)}
											/>
										</CommandItem>
									))}
									<ScrollBar orientation="vertical" />
								</ScrollArea>
							</CommandGroup>
						</CommandList>
					</Command>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default LocationSelector;

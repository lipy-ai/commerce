import * as Editable from "@lipy/web-ui/components/ui/editable";
import type { InputProps } from "./input";

export const RowInput = ({
	type,
	value,
	onChange,
}: {
	type: InputProps["type"];
	value: InputProps["value"];
	onChange: (v: string) => void;
}) => {
	return (
		<Editable.Root
			defaultValue={value}
			onValueChange={onChange}
			triggerMode="dblclick"
		>
			<Editable.Area>
				<Editable.Preview className="block truncate line-clamp-1 flex-1 break-all" />
				<Editable.Input type={type} />
			</Editable.Area>
		</Editable.Root>
	);
};

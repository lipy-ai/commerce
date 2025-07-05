import { cn } from "@lipy/web-ui/lib/utils";
import { ToggleGroup } from "@radix-ui/react-toggle-group";
import { IterationCcw, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { type ControllerRenderProps, useFormContext } from "react-hook-form";
import InputWithAnimatedLabel from "../custom-ui/inputWithAnimatedLabel";
import { Button } from "../ui/button";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input, type InputProps } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { SingleImage, type SingleImageProps } from "../ui/single-image";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { ToggleGroupItem } from "../ui/toggle-group";
import { SearchInput } from "./searchInput";

export const RequiredEl = <span className="text-red-700">*</span>;

export type SharedFormProps = {
	name: string;
	label?: string;
	description?: string;
	required?: boolean;
	static?: boolean;
	size?: "lg" | "default";
	wrapperClassName?: string;
	tabular?: boolean;
};

export const FormItemWrapper = ({
	label,
	required,
	description,
	wrapperClassName,
	children,
	fieldType,
}: SharedFormProps & {
	wrapperClassName?: string;
	children: React.ReactNode;
	fieldType?: string;
}) => {
	return (
		<FormItem className={cn("w-full gap-1 mb-3", wrapperClassName)}>
			<div>
				{!(fieldType === "InputWithAnimatedLabel") && (
					<div className="flex items-start py-2">
						<FormLabel
							className={cn(
								"font-normal text-muted-foreground break-all gap-0.5",
							)}
						>
							{label}
							{required ? RequiredEl : ""}
						</FormLabel>
					</div>
				)}

				{children}
			</div>
			<FormDescription>{description}</FormDescription>
			<FormMessage />
		</FormItem>
	);
};

export const FormButton = ({
	children,
	className,
	...props
}: React.ComponentProps<typeof Button> & {
	children: ReactNode;
}) => {
	const form = useFormContext();
	return (
		<Button
			{...props}
			className={cn(className, "relative")}
			disabled={!form.formState.isDirty || form.formState.isSubmitting}
		>
			{form.formState.isSubmitting ? (
				<div className="absolute size-full flex justify-center items-center">
					<Loader2 className="animate-spin" />
				</div>
			) : form.formState.isSubmitted && !form.formState.isSubmitSuccessful ? (
				<div className="absolute size-full flex justify-center items-center gap-2">
					<IterationCcw /> <span>Try Again</span>
				</div>
			) : null}
			<div
				className={cn(
					(form.formState.isSubmitting ||
						(form.formState.isSubmitted &&
							!form.formState.isSubmitSuccessful)) &&
						"invisible",
				)}
			>
				{children}
			</div>
		</Button>
	);
};
export const FormInput = ({ ...props }: InputProps & SharedFormProps) => {
	const form = useFormContext();
	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => (
				<FormItemWrapper {...props}>
					<FormControl>
						<Input {...props} {...field} />
					</FormControl>
				</FormItemWrapper>
			)}
		/>
	);
};

export const FormInputWithAnimatedLabel = ({
	...props
}: React.ComponentProps<"input"> & SharedFormProps) => {
	const form = useFormContext();
	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => (
				<FormItemWrapper {...props} fieldType="InputWithAnimatedLabel">
					<FormControl>
						<InputWithAnimatedLabel {...field} title={props.label} {...props} />
					</FormControl>
				</FormItemWrapper>
			)}
		/>
	);
};

export const FormSwitch = ({
	className,
	thumbClassName,

	...props
}: Parameters<typeof Switch>[0] & SharedFormProps) => {
	const form = useFormContext();
	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => (
				<FormItemWrapper {...props}>
					{
						<FormControl>
							<Switch
								className={className}
								thumbClassName={thumbClassName}
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
					}
				</FormItemWrapper>
			)}
		/>
	);
};

export const FormDropdown = (
	props: React.ComponentProps<"input"> &
		SharedFormProps & { opts: Array<{ label: string; value: string }> },
) => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => (
				<FormItemWrapper {...props}>
					<FormControl>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger className="capitalize">
									<SelectValue placeholder={props.placeholder} />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{props.opts.map((o, i) => (
									<SelectItem key={i} value={o.value} className="capitalize">
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
				</FormItemWrapper>
			)}
		/>
	);
};

export const FormSelect = (
	props: React.ComponentProps<"input"> &
		SharedFormProps & { type: Parameters<typeof SearchInput>[0]["type"] },
) => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => (
				<FormItemWrapper {...props}>
					<FormControl>
						<SearchInput
							placeholder={props.placeholder || ""}
							type={props.type}
							value={field.value}
							onChange={field.onChange}
							name={field.name}
						/>
					</FormControl>
				</FormItemWrapper>
			)}
		/>
	);
};

export const FormTextarea = ({
	...props
}: React.ComponentProps<"textarea"> & SharedFormProps) => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => (
				<FormItemWrapper {...props}>
					<FormControl>
						<Textarea
							{...props}
							{...field}
							className={cn("resize-none w-full", props.className)}
						/>
					</FormControl>
				</FormItemWrapper>
			)}
		/>
	);
};

export const FormImage = ({
	wrapperClassName,
	imageClassName,
	alt,
	referrerPolicy,
	...props
}: SharedFormProps &
	Pick<SingleImageProps, "alt" | "referrerPolicy"> & {
		imageClassName?: string;
	}) => {
	const form = useFormContext();
	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => {
				return (
					<SingleImage
						referrerPolicy={referrerPolicy}
						url={field.value || ""}
						alt={alt}
						wrapperClassName={wrapperClassName}
						imageClassName={imageClassName}
						onSuccess={(data) => field.onChange(data || undefined)}
					/>
				);
			}}
		/>
	);
};

export const FormToggleGroup = (
	props: SharedFormProps &
		Pick<Parameters<typeof ToggleGroupItem>[0], "variant"> &
		Pick<Parameters<typeof ToggleGroup>[0], "type" | "defaultValue"> & {
			opts: Array<{ label: string; value: string; icon?: string }>;
		},
) => {
	const form = useFormContext();

	const options = props.opts.map(({ label, value }) => (
		<ToggleGroupItem
			value={value}
			variant={props.variant}
			key={value}
			className="flex items-center gap-x-2 md:w-full min-w-32 capitalize"
		>
			{label}
		</ToggleGroupItem>
	));

	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => (
				<FormItemWrapper {...props}>
					<FormControl>
						{props.type === "single" ? (
							<ToggleGroup
								{...field}
								type="single"
								onValueChange={field.onChange}
								defaultValue={props.defaultValue?.toString()}
								className="flex flex-wrap justify-start items-center gap-4"
							>
								{options}
							</ToggleGroup>
						) : (
							<ToggleGroup
								{...field}
								type="multiple"
								onValueChange={field.onChange}
								defaultValue={
									Array.isArray(props.defaultValue)
										? props.defaultValue.filter((val) => val !== undefined)
										: [props.defaultValue].filter((val) => val !== undefined)
								}
								className="flex justify-start items-center gap-2 flex-wrap"
							>
								{options}
							</ToggleGroup>
						)}
					</FormControl>
				</FormItemWrapper>
			)}
		/>
	);
};

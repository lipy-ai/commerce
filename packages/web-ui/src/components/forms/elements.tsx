import { cn } from "@lipy/web-ui/lib/utils";
import type { ReactNode } from "@tanstack/react-router";
import { IterationCcw, Loader2 } from "lucide-react";
import { type ControllerRenderProps, useFormContext } from "react-hook-form";
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
import { SingleImage, type SingleImageProps } from "../ui/single-image";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

export const RequiredEl = <span className="text-destructive">*</span>;

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
}: SharedFormProps & {
	wrapperClassName?: string;
	children: React.ReactNode;
}) => {
	return (
		<FormItem className={cn("w-full gap-1 mb-3", wrapperClassName)}>
			<div>
				<div className="flex items-start py-2">
					<FormLabel
						className={cn("font-normal text-muted-foreground break-all")}
					>
						{label}
						{required ? RequiredEl : ""}
					</FormLabel>
				</div>
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
							className={cn("resize-none w-full")}
						/>
					</FormControl>
				</FormItemWrapper>
			)}
		/>
	);
};

export const FormImage = ({
	wrapperClassName,
	alt,
	referrerPolicy,
	...props
}: SharedFormProps & Pick<SingleImageProps, "alt" | "referrerPolicy">) => {
	const form = useFormContext();
	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => {
				return (
					<SingleImage
						referrerPolicy={referrerPolicy}
						url={field.value}
						alt={alt}
						className={wrapperClassName}
						onSuccess={(data) => field.onChange(data)}
					/>
				);
			}}
		/>
	);
};

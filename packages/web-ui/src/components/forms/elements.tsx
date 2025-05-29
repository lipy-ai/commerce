import { cn } from "@lipy/web-ui/lib/utils";
import { type ControllerRenderProps, useForm } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input, type InputProps } from "../ui/input";
import { SingleImage } from "../ui/single-image";
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
		<FormItem className={cn("w-full", wrapperClassName)}>
			<div className="">
				<div className="flex items-start py-2">
					<FormLabel className="font-normal text-muted-foreground break-all">
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

export const FormInput = ({ ...props }: InputProps & SharedFormProps) => {
	const form = useForm();
	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => (
				<FormItemWrapper {...props}>
					{
						<FormControl>
							<Input {...props} {...field} />
						</FormControl>
					}
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
	const form = useForm();
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
	const form = useForm();

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

export const FormImage = ({ wrapperClassName, ...props }: SharedFormProps) => {
	const form = useForm();
	return (
		<FormField
			control={form.control}
			name={props.name}
			render={({ field }: { field: ControllerRenderProps }) => {
				return (
					<SingleImage
						fileType={"image"}
						className={wrapperClassName}
						onSuccess={(data) => field.onChange(data)}
					/>
				);
			}}
		/>
	);
};

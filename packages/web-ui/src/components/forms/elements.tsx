import { cn } from "@lipy/web-ui/lib/utils";
import { IterationCcw, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { type ControllerRenderProps, useFormContext } from "react-hook-form";
import InputWithAnimatedLabel from "../custom-ui/inputWithAnimatedLabel";
import { Button } from "../ui/button";
import {
  Editable,
  EditableArea,
  EditableInput,
  type EditableInputProps,
  EditablePreview,
} from "../ui/editable";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input, type InputProps } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Textarea, type TextareaProps } from "../ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { SingleImage, type SingleImageProps } from "../uploads/image";
import MultiImage from "../uploads/multiImage";
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
    <FormItem
      className={cn("w-full block gap-1 mb-3 last:mb-0", wrapperClassName)}
    >
      <div>
        {label && !(fieldType === "InputWithAnimatedLabel") && (
          <div className="flex items-start py-2">
            <FormLabel
              className={cn(
                "font-normal text-muted-foreground break-all gap-0.5"
              )}
            >
              {label}
              {required ? RequiredEl : ""}
            </FormLabel>
          </div>
        )}

        {children}
      </div>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

export const ActionButton = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  isPending?: boolean;
  isError?: boolean;
  isSuccessful?: boolean;
  children: ReactNode;
}) => {
  return (
    <Button
      {...props}
      className={cn(className, "relative flex")}
      disabled={props.disabled}
    >
      {props.isPending ? (
        <div className="absolute size-full flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : props.isError ? (
        <div className="absolute size-full flex justify-center items-center gap-2">
          <IterationCcw /> <span>Try Again</span>
        </div>
      ) : null}
      <div
        className={cn(
          "flex",
          (props.isPending || props.isError) && "invisible"
        )}
      >
        {children}
      </div>
    </Button>
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
    <ActionButton
      {...props}
      disabled={!form.formState.isDirty || form.formState.isSubmitting}
      isPending={form.formState.isSubmitting}
      isError={form.formState.isSubmitted && !form.formState.isSubmitSuccessful}
      isSuccessful={
        form.formState.isSubmitted && form.formState.isSubmitSuccessful
      }
    >
      {children}
    </ActionButton>
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

export const FormEditableInput = (
  props: SharedFormProps & EditableInputProps
) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }: { field: ControllerRenderProps }) => (
        <FormItemWrapper
          {...props}
          wrapperClassName={cn(props.wrapperClassName, "mb-0 gap-0")}
        >
          <FormControl>
            <Editable
              defaultValue={field.value}
              onSubmit={field.onChange}
              invalid={!!form.formState.errors.name}
              className="h-full w-full"
            >
              <EditableArea className="h-8 bg-accent rounded flex">
                <EditablePreview className="py-1.5 px-2 flex truncate line-clamp-1 items-center text-balance break-all w-full" />
                <EditableInput className="px-2 h-8" />
              </EditableArea>
            </Editable>
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

export const FormRadioInput = ({
  opts,
  ...props
}: Parameters<typeof RadioGroup>[0] &
  SharedFormProps & { opts: { value: string; label: string }[] }) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }: { field: ControllerRenderProps }) => (
        <FormItemWrapper {...props}>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              {opts.map((o) => (
                <FormItem key={o.value} className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem value={o.value} />
                  </FormControl>
                  <FormLabel>{o.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItemWrapper>
      )}
    />
  );
};

export const FormSlider = (
  props: SharedFormProps &
    Parameters<typeof Slider>[0] & {
      suffix: string;
      maxLabel?: string;
      prefix?: string;
    }
) => {
  const form = useFormContext();

  const max = props.max || 100;

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }: { field: ControllerRenderProps }) => (
        <FormItemWrapper {...props}>
          <div className="relative mt-1">
            <span className="inline-flex absolute right-0 bottom-full p-2">
              {props.maxLabel && Number(field.value) === Number(max) ? (
                props.maxLabel
              ) : (
                <>
                  {props.prefix}&nbsp;
                  {field.value || 0}&nbsp;
                  {props.suffix}
                </>
              )}
            </span>

            <FormControl>
              <Slider
                max={max}
                step={props.step || 1}
                value={[Number(field.value) || 0]}
                onValueChange={(f) => field.onChange(f[0])}
              />
            </FormControl>
          </div>
        </FormItemWrapper>
      )}
    />
  );
};

export const FormDropdown = (
  props: React.ComponentProps<"input"> &
    SharedFormProps & { opts: Array<{ label: string; value: string }> }
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
    SharedFormProps & { type: Parameters<typeof SearchInput>[0]["type"] }
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

export const FormTextarea = ({ ...props }: TextareaProps & SharedFormProps) => {
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

export const FormMultiImage = ({
  alt,
  referrerPolicy,
  imageClassName,
  wrapperClassName,
  ...props
}: SharedFormProps &
  Pick<SingleImageProps, "alt" | "referrerPolicy"> & {
    imageClassName?: string;
  }) => {
  const form = useFormContext();

  return (
    <div>
      <FormField
        control={form.control}
        name={props.name}
        render={({ field }: { field: ControllerRenderProps }) => {
          return <MultiImage urls={field.value} setUrls={field.onChange} />;
        }}
      />
    </div>
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
            onSuccess={(data) => {
              field.onChange(data?.url || undefined);
            }}
            onDelete={() => {
              field.onChange(null);
            }}
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
    }
) => {
  const form = useFormContext();

  const options = props.opts.map(({ label, value }) => (
    <ToggleGroupItem
      value={value}
      variant={props.variant}
      key={value}
      className="flex items-center gap-x-2 w-full h-20  min-w-32 capitalize break-all p-2 text-balance whitespace-break-spaces"
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

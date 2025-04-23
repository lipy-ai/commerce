import type * as React from "react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import { cn } from "@web-ui/lib/utils";
import { Checkbox } from "@web-ui/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@web-ui/components/ui/form";
import { Input } from "@web-ui/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@web-ui/components/ui/input-otp";
import { Label } from "@web-ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@web-ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web-ui/components/ui/select";
import { Slider } from "@web-ui/components/ui/slider";
import { Switch } from "@web-ui/components/ui/switch";
import { Textarea } from "@web-ui/components/ui/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@web-ui/components/ui/toggle-group";

import LocationSelector from "@web-ui/components/ui/location-input";
import type { FormElement } from "./types";

const RequiredEl = <span className="text-destructive">*</span>;

export const RenderFormElement = ({
  formElement,
  form,
}: {
  formElement: FormElement;
  form: UseFormReturn<any, any, undefined>;
}): React.ReactElement => {
  const ItemWrapper = ({
    label,
    required,
    description,
    className,
    children,
  }: {
    label?: string;
    description?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <FormItem className={cn("w-full", className)}>
        <div>
          <FormLabel className="mb-1 block font-normal text-muted-foreground">
            {label}
            {required ? RequiredEl : ""}
          </FormLabel>
          {children}
        </div>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
      </FormItem>
    );
  };

  switch (formElement.fieldType) {
    case "Input":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <ItemWrapper {...formElement}>
              {
                <FormControl>
                  <Input
                    placeholder={formElement.placeholder}
                    disabled={formElement.disabled}
                    type={formElement.type ?? "text"}
                    size={formElement?.style?.size}
                    // onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    {...field}
                  />
                </FormControl>
              }
            </ItemWrapper>
          )}
        />
      );
    case "CountrySelector":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <ItemWrapper {...formElement}>
              <FormControl>
                <LocationSelector
                  size={formElement?.style?.size}
                  value={field.value}
                  disabled={formElement.disabled}
                  onCountryChange={(country) => field.onChange(country?.iso3)}
                />
              </FormControl>
            </ItemWrapper>
          )}
        />
      );
    case "Password":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <ItemWrapper {...formElement}>
              <FormControl>
                <Input
                  placeholder={formElement.placeholder}
                  disabled={formElement.disabled}
                  type={"password"}
                  size={formElement?.style?.size}
                  {...field}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
            </ItemWrapper>
          )}
        />
      );
    case "OTP":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <ItemWrapper {...formElement}>
              <FormControl>
                <InputOTP
                  {...field}
                  //   size={formElement?.style?.size}
                  maxLength={formElement.maxLength ?? 6}
                  name={formElement.name}
                  value={formElement.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
            </ItemWrapper>
          )}
        />
      );
    case "Textarea":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <ItemWrapper {...formElement}>
              <FormControl>
                <Textarea
                  {...field}
                  //   size={formElement?.style?.size}
                  placeholder={formElement.placeholder}
                  required={formElement.required}
                  disabled={formElement.disabled}
                  defaultValue={formElement.defaultValue}
                  className="resize-none"
                />
              </FormControl>
            </ItemWrapper>
          )}
        />
      );
    case "Checkbox":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <FormItem className="flex items-center gap-2 w-full py-1 space-y-0">
              <FormControl>
                <Checkbox
                  {...field}
                  //   size={formElement.size}

                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="leading-none">
                {formElement.label} {formElement.required && RequiredEl}
              </FormLabel>
              {formElement.description ? (
                <FormDescription>{formElement.description}</FormDescription>
              ) : (
                ""
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "RadioGroup":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <ItemWrapper
              {...formElement}
              className="flex flex-col gap-2 w-full py-1"
            >
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {formElement.options.map(({ label, value }) => (
                    <div key={value} className="flex items-center gap-x-2">
                      <RadioGroupItem value={value} id={value} />
                      <Label htmlFor={value}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            </ItemWrapper>
          )}
        />
      );
    case "ToggleGroup": {
      const options = formElement.options.map(({ label, value }) => (
        <ToggleGroupItem
          value={value}
          key={value}
          size={formElement?.style?.size}
          className="flex items-center gap-x-2 md:w-full min-w-32"
        >
          {label}
        </ToggleGroupItem>
      ));
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <ItemWrapper
              {...formElement}
              className="flex flex-col gap-2 w-full py-1"
            >
              <FormControl>
                {formElement.type === "single" ? (
                  <ToggleGroup
                    {...field}
                    type="single"
                    variant="outline"
                    onValueChange={field.onChange}
                    defaultValue={formElement.defaultValue}
                    className="flex flex-wrap md:flex-nowrap justify-start items-center gap-4"
                  >
                    {options}
                  </ToggleGroup>
                ) : (
                  <ToggleGroup
                    {...field}
                    type="multiple"
                    variant="outline"
                    onValueChange={field.onChange}
                    defaultValue={
                      Array.isArray(formElement.defaultValue)
                        ? formElement.defaultValue.filter(
                            (val) => val !== undefined
                          )
                        : [formElement.defaultValue].filter(
                            (val) => val !== undefined
                          )
                    }
                    className="flex justify-start items-center gap-2"
                  >
                    {options}
                  </ToggleGroup>
                )}
              </FormControl>
            </ItemWrapper>
          )}
        />
      );
    }
    case "Switch":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <FormItem className="flex flex-col p-3 justify-center w-full border rounded">
              <div className="flex items-center justify-between h-full">
                <FormLabel className="w-full grow">
                  {formElement.label}
                </FormLabel>
                <FormControl>
                  <Switch
                    {...field}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              {formElement.description && (
                <FormDescription>{formElement.description}</FormDescription>
              )}
            </FormItem>
          )}
        />
      );
    case "Slider":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => {
            const min = formElement.min || 0;
            const max = formElement.max || 100;
            const step = formElement.step || 5;
            const defaultValue = 25;
            const value = Array.isArray(field.value)
              ? field.value
              : [field.value || defaultValue];
            return (
              <FormItem className="w-full">
                <FormLabel className="flex justify-between items-center">
                  {formElement.label}
                  <span>
                    {value}/{max}
                  </span>
                </FormLabel>
                <FormControl>
                  <Slider
                    {...field}
                    min={min}
                    max={max}
                    step={step}
                    defaultValue={[defaultValue]}
                    value={value}
                    onValueChange={(newValue) => field.onChange(newValue[0])}
                  />
                </FormControl>
                <FormDescription className="py-1">
                  {formElement.description}
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    case "Select":
      return (
        <FormField
          control={form.control}
          name={formElement.name}
          render={({ field }: { field: ControllerRenderProps }) => (
            <ItemWrapper {...formElement}>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={String(field?.value ?? "")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={formElement.placeholder || "Select item"}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {formElement.options.map(({ label, value }) => (
                    <SelectItem key={label} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ItemWrapper>
          )}
        />
      );

    default:
      return <div>Invalid Form Element</div>;
  }
};

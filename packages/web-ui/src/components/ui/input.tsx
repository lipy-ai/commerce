import { cn } from "@lipy/web-ui/lib/utils";
import * as React from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "lg" | "default";
  prefixEl?: React.ReactNode;
  prefixClassName?: string;
  inputClassName?: string;
  suffixEl?: React.ReactNode;
  suffixClassName?: string;
  noStyle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      prefixClassName,
      suffixClassName,
      inputClassName,
      prefixEl,
      suffixEl,
      size = "default",
      noStyle,
      type,
      ...props
    },
    ref
  ) => {
    const wrapperId = React.useId();

    const update = () => {
      const wrapper = document.getElementById(wrapperId) as HTMLDivElement;
      if (!wrapper) return;
      wrapper.classList.remove("opacity-0");

      if (!prefixEl && !suffixEl) return;

      const prefixE = wrapper?.getElementsByClassName("prefix-el")[0];
      const suffixE = wrapper?.getElementsByClassName("suffix-el")[0];
      const input = wrapper?.getElementsByTagName(
        "input"
      )[0] as HTMLInputElement;
      if (!input) return;
      if (suffixE) input.style.paddingRight = `${suffixE.clientWidth + 10}px`;
      if (prefixE) input.style.paddingLeft = `${prefixE.clientWidth + 2}px`;
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
      update();
    }, [wrapperId, prefixEl, suffixEl]);

    return (
      <div
        id={wrapperId}
        className={cn(
          "selection:bg-primary selection:text-primary-foreground",
          "relative flex items-center overflow-hidden rounded-md border text-base",
          "bg-background border-input focus-within:ring-1 focus-within:ring-ring focus-within:border-ring",
          "transition-colors focus-within:outline-none",
          size === "sm"
            ? "h-10 sm:h-8"
            : size === "lg"
              ? "h-14 sm:h-12 text-lg"
              : "h-12 sm:h-10",
          noStyle && "border-none bg-transparent rounded-none",
          className,
          (prefixEl || suffixEl) && "opacity-0"
        )}
      >
        {prefixEl && (
          <div
            className={cn(
              "inline-flex text-muted-foreground items-center pl-2.5 [&>svg]:w-5 absolute appearance-none h-10",
              "text-base leading-0 align-middle ",
              size === "sm" ? "text-sm h-8" : size === "lg" && "text-lg h-12",

              prefixClassName,
              "prefix-el"
            )}
          >
            {prefixEl}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          className={cn(
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "placeholder:text-muted-foreground flex-1 flex h-full px-2 shadow-none w-full bg-transparent py-1 text-base outline-none transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium disabled:cursor-not-allowed disabled:opacity-50",

            size === "sm" ? "text-sm " : size === "lg" && "text-lg",
            noStyle && "h-fit w-fit",
            inputClassName
          )}
          {...props}
        />

        {suffixEl && (
          <div
            className={cn(
              "inline-flex text-muted-foreground items-center px-2.5 [&>svg]:w-5 absolute right-0 appearance-none h-10",
              "text-base leading-0 align-middle ",
              size === "sm" ? "text-sm h-8" : size === "lg" && "text-lg h-12",

              suffixClassName,
              "suffix-el"
            )}
            onClick={() => {}}
          >
            {suffixEl}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };

import { cn } from "@lipy/web-ui/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SearchBar({
  placeholder,
  defaultValue,
  className,
  inputClassName,
  fullPageSearch,
  prefixClassName,
  formClassName,
}: {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  inputClassName?: string;
  fullPageSearch?: boolean;
  prefixClassName?: string;
  formClassName?: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [debounced] = useDebounce(value, 300);
  const navigate = useNavigate();

  const onSearch = (q: string) =>
    navigate({
      // @ts-ignore -- I want it to set on any route -- Should fix this though
      search: (p: any) => ({
        ...p,
        page: p?.q !== q ? 1 : p.page,
        q,
      }),
      replace: true,
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
      className={cn("w-full", formClassName)}
    >
      <Input
        className={cn("rounded-lg", className)}
        inputClassName={inputClassName}
        prefixClassName={prefixClassName}
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
        placeholder={placeholder || "Search"}
        prefixEl={
          fullPageSearch ? (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              <ChevronLeft className="stroke-2 size-5" />
            </Button>
          ) : (
            <Search className="mr-2" />
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
        autoFocus={fullPageSearch}
      />
    </form>
  );
}

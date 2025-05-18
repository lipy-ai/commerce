import { Input } from "@lipy/web-ui/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar({placeholder}: {placeholder?: string}) {
  return (
    <div>
      <Input
        placeholder={placeholder || "Search for shop, grocery, fruits...."}
        size="lg"
        prefixEl={<Search />}
        className="bg-background rounded-xl font-semibold text-md"
      />
    </div>
  );
}

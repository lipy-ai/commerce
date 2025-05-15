import { Input } from "@web-ui/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div>
      <Input
        placeholder="Search over 5000 products..."
        size="lg"
        prefixEl={<Search />}
        className="bg-background rounded-xl text-lg"
      />
    </div>
  );
}

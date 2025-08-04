import { cn } from "@lipy/web-ui/lib/utils";
import { type LucideIcon, Package2 } from "lucide-react";
import { Label } from "../ui/label";

export default function EmptyPage(props: {
  icon?: LucideIcon;
  title?: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  let Icon = Package2;
  if (props.icon) Icon = props.icon;

  return (
    <div
      className={cn(
        "m-auto flex flex-1 flex-col space-y-1 items-center justify-center p-6 text-center",
        props.className
      )}
    >
      {props.children}
      {props.icon && (
        <Icon className="size-24 lg:size-28 opacity-70" strokeWidth={1.1} />
      )}
      {props.title && (
        <p className="text-xl lg:text-3xl font-medium">
          {props.title || "Feels Light & Empty"}
        </p>
      )}
      {props.label && (
        <Label className="text-md font-light">
          {props.label || "We couldn't find any records!"}
        </Label>
      )}
    </div>
  );
}

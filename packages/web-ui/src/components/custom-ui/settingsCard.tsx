import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export default function SettingsCard({
  items,
}: {
  items: {
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    url?: string;
    type?: "link" | "button";
    handleFunction?: () => void;
  }[];
}) {
  return (
    <div className="rounded-xl border border-border/40 divide-y overflow-hidden divide-dashed bg-card">
      {items.map((item, index) => {
        return (
          <div key={index} className="">
            <Link
              to={item?.url}
              className="flex flex-col p-5 hover:bg-accent/30 focus:bg-accent"
              onClick={() => {
                if (item.type === "button" && item.handleFunction) {
                  item.handleFunction();
                }
              }}
              viewTransition={{ types: ["slide-left"] }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <item.icon className="size-5 stroke-2" />

                  <p className="font-medium">{item.title}</p>
                </div>
                <ChevronRight className="size-5 stroke-2" />
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

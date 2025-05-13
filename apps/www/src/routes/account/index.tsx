import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHeader } from "@web-ui/components/layouts/dashboard";
import { Card } from "@web-ui/components/ui/card";
import { ChevronRight, MapPin, ShoppingBag, UserCircle2 } from "lucide-react";
export const Route = createFileRoute("/account/")({
  component: RouteComponent,
});

const yourInfo = [
  {
    icon: ShoppingBag,
    title: "Your Orders",
    url: "/account/orders",
  },
  {
    icon : UserCircle2,
    title: "Profile",
    url: "/account/profile",
  },
  {
    icon : MapPin,
    title: "Saved Addresses",
    url: "/account/addresses",
  },
  
];

function RouteComponent() {
  return (
    <div>
      <DashboardHeader title="Settings" />
      <div className="p-4">
        <h1 className="text-base font-semibold py-2">Your Information</h1>
        <Card className="p-4 rounded-lg shadow-none">
          {yourInfo.map((item, index) => (
            <div  key={index}>

<Link
             
             className="flex items-center justify-between"
             to={item.url}
           >
             <div className="flex items-center gap-2">
               <item.icon className="size-5" />
               <div className="text-sm font-medium">{item.title}</div>
             </div>
             <ChevronRight />

           </Link>
          
            </div>
            
          ))}
        </Card>
      </div>
    </div>
  );
}

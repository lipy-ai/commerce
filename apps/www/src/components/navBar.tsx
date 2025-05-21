import { Link } from "@tanstack/react-router";
import {
  Cherry,
  ChevronDown,
  Filter,
  MapPin,
  Milk,
  Salad,
  ShoppingBasket,
  Store,
  UserCircle2,
  UserRound,
} from "lucide-react";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { authClient } from "@lipy/lib/providers/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { useLocationStore } from "@lipy/web-ui/components/maps/store";

export default function NavBar() {
  const { isMobile } = useViewport();
  const { data } = authClient.useSession();
  const { deliveryLocation } = useLocationStore();


  // Mobile layout
  if (isMobile) {
    return (
      
        <div className="p-4 flex items-center justify-between ">
          <div>
            <Link to="/account/addresses">
              <div className="text-lg font-bold flex items-center gap-2">
                <MapPin className="size-5 fill-primary" />
                <p className="truncate max-w-[250px] block">
                  {deliveryLocation.addressName}
                </p>
                <ChevronDown className="size-5" />
              </div>
              <p className="text-sm">
                <span className="truncate max-w-[250px] block">
                  {deliveryLocation.address}
                </span>
              </p>
            </Link>
          </div>

          <Link to="/account">
            {/* <Avatar className="h-8 w-8">
              <AvatarImage src={data?.user.image || ""} alt="User" />
              <AvatarFallback className='px-4'>
                <UserRound className="h-6 w-6 " />
              </AvatarFallback>
            </Avatar> */}

            <div className='py-1 px-2 rounded-full bg-black'>

              <UserRound className="size-6 fill-background" />
            </div>
          </Link>
        </div>

  
    );
  }
}
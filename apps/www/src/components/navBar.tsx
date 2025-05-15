import { Link } from "@tanstack/react-router";
import { logos } from "@/site.config";
import { UserCircle2 } from "lucide-react";
import { cn } from "@lipy/web-ui/lib/utils";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { authClient } from "@lipy/lib/providers/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
export default function NavBar() {
  const { isMobile } = useViewport();
  const { data } = authClient.useSession();
  if (isMobile) {
    return (
      <nav className="p-4 w-screen overflow-hidden space-y-6 bg-primary/50 backdrop-blur-sm rounded-b-2xl shadow-lg">
        <div className="flex justify-between">
          <Link to="/">
            <div className="flex justify-between items-center flex-col">
              <div className="size-10 flex justify-center items-start">
                <img
                  src={logos.default}
                  className={cn("size-10 rounded-full overflow-hidden")}
                />
              </div>
            </div>
          </Link>
          <div className="flex justify-end items-center space-x-4">
            <div>
              <p className="font-semibold leading-tighter text-xs">
                Delivery in 20 mins
              </p>
              <p className="text-xs leading-tighter">Andheri West, Mumbai</p>
            </div>
            <Link
              to={"/account"}
              className="text-center flex flex-col justify-center items-center"
            >
              <Avatar className="size-8">
                <AvatarImage src={data?.user.image!} alt="@shadcn" />
                <AvatarFallback>
                  <UserCircle2 width={40} height={75} strokeWidth={1.5} />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
        <div>
          {/* <SearchBar />
           */}
        </div>
      </nav>
    );
  }
  // return (
  //   <nav className="p-4 md:px-8 flex justify-between gap-8 items-center">
  //     <div>
  //       <Link to="/" className="block">
  //         <img
  //           src={logos.default}
  //           className={cn("size-10")}
  //           width={50}
  //           height={50}
  //         />
  //       </Link>
  //     </div>
  //     <div className="flex-1">
  //       <SearchBar />
  //     </div>
  //     <div className="flex gap-8 items-center text-xs justify-center">
  //       <Link
  //         to={"/account"}
  //         className="text-center flex flex-col justify-center items-center space-y-1"
  //       >
  //         <UserCircle />
  //         <span>Account</span>
  //       </Link>
  //       <Link
  //         to={"/cart"}
  //         className="text-center flex flex-col justify-center items-center space-y-1"
  //       >
  //         <ShoppingBag />
  //         <span>Cart</span>
  //       </Link>
  //     </div>
  //   </nav>
  // );
}

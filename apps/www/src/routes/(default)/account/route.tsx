import NavBar from "@/components/navBar";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { AccountPage } from "./-account";

export const Route = createFileRoute("/(default)/account")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isMobile } = useViewport();
  const { pathname } = useLocation();

  if (isMobile) return <Outlet />;

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-12 divide-x m-auto">
        {/* Left Sidebar */}
        <div className="col-span-3  sticky self-start overflow-y-auto h-[calc(100vh-110px)] p-8 top-28">
          <AccountPage />
        </div>

        {/* Right Content Area */}
        <div className="col-span-9 overflow-y-auto ">
          {pathname === "/account" ? (
            <div className="flex flex-1 flex-col items-center justify-center  m-auto">
              <img
                src="/assets/online-store.png"
                alt="Online Store"
                className="mx-auto aspect-square object-cover"
              />
              <p className="text-2xl font-bold">
                Now shop from your own local stores
              </p>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

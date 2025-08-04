import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import NavBar from "@/components/navBar";
export const Route = createFileRoute("/(default)/(store)")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isMobile } = useViewport();
  if (isMobile) return <Outlet />;
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

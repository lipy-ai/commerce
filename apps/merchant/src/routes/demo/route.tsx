import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";

export const Route = createFileRoute("/demo")({
  component: RouteComponent,
});

function RouteComponent() {
  const matchRoute = useMatchRoute();
  return (
    <div className="p-8">
      <div className="flex gap-4 mb-8">
        <Link
          to="/demo/client"
          className={buttonVariants({
            variant: !!matchRoute({ to: "/demo/client", fuzzy: true })
              ? "default"
              : "outline",
          })}
        >
          Client Fetch
        </Link>
        <Link
          to="/demo/ssr"
          className={buttonVariants({
            variant: !!matchRoute({ to: "/demo/ssr", fuzzy: true })
              ? "default"
              : "outline",
          })}
        >
          Server Side Fetch
        </Link>
        <Link
          to="/demo/directMutation"
          className={buttonVariants({
            variant: !!matchRoute({ to: "/demo/directMutation", fuzzy: true })
              ? "default"
              : "outline",
          })}
        >
          Direct Mutation
        </Link>
        <Link
          to="/demo/tanstackMutation"
          className={buttonVariants({
            variant: !!matchRoute({ to: "/demo/tanstackMutation", fuzzy: true })
              ? "default"
              : "outline",
          })}
        >
          Tanstack Mutation
        </Link>
      </div>
      <Outlet />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@web-ui/components/auth/login";
export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-dvh overflow-hidden flex justify-center items-center xl:grid grid-cols-2">
      <div className="bg-amber-300/50 flex-1 h-full fixed xl:w-2/5 -z-20 w-full" />
      <img
        src="/assets/paper-bag-items.webp"
        className="fixed top-14 rotate-180 -z-10 scale-150 xl:relative xl:scale-140 xl:left-30  xl:rotate-0"
        width={800}
      />

      <LoginForm />
    </div>
  );
}

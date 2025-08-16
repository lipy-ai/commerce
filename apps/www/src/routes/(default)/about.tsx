import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "./-footer";
import Header from "./-header";

export const Route = createFileRoute("/(default)/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <div className="py-42 flex-1">
        <h1 className="text-5xl max-w-5xl m-auto">
          Lipy isn’t another food / grocery delivery app. We want to be social
          commerce platform which helps businesses sell their goods & services
          locally.
        </h1>
      </div>
      <Footer />
    </>
  );
}

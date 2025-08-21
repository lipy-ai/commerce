import { createFileRoute } from "@tanstack/react-router";
import { Features } from "./-features";
import { Footer } from "./-footer";
import { HeroSection } from "./-heroSection";
import { Offerings } from "./-offerings";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <Features />
      <Offerings />
      <Footer />
    </div>
  );
}

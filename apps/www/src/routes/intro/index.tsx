import { createFileRoute } from "@tanstack/react-router";
import { Features } from "./-features";
import { Footer } from "./-footer";
import { HeroSection } from "./-heroSection";
import { LeadForm } from "./-leadForm";
import { Offerings } from "./-offerings";
import CartComparison from "./-priceComparison";

export const Route = createFileRoute("/intro/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <Features />
      <Offerings />
      <CartComparison />
      <LeadForm />
      <Footer />
    </div>
  );
}

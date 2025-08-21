import { env } from "@envClient";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { CircleCheck } from "lucide-react";

export function HeroSection() {
  const { isMobile } = useViewport();
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-white to-blue-100" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full  mx-auto px-6 md:px-12">
        <Link to="/">
          <img
            src="/logo/logo.png"
            alt="Lipy logo"
            className="absolute w-16 h-12  shrink-0 top-4 left-6"
          />
        </Link>
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left pt-20 md:pt-0 space-y-6 md:pl-12">
          <h1 className="max-w-xl text-6xl md:text-7xl font-bold leading-tight ">
            From Your Street to Your Screen
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
            Lipy helps local shops go online in seconds — making shopping
            simple, seamless, and affordable for customers in your locality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <a
              className={cn(
                buttonVariants({ size: isMobile ? "default" : "lg" })
              )}
              href={`${env.WEB_URL}`}
            >
              Shop Now
            </a>
            <a
              className={cn(
                buttonVariants({
                  size: isMobile ? "default" : "lg",
                  variant: "outline",
                })
              )}
              href={`${env.MERCHANT_URL}`}
            >
              Start selling online
            </a>
          </div>
        </div>

        {/* Right Content (Image) */}
        <div className="relative flex-1 mt-10 md:mt-0">
          <div className="absolute top-16 -left-4 bg-card p-4 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <CircleCheck className="text-white fill-green-500 size-8 flex items-center justify-center" />

              <div>
                <div className="font-semibold text-sm">Order Confirmed</div>
                <div className="text-xs text-muted-foreground">
                  ETA: 12 mins
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-16 -right-4 bg-card p-4 rounded-2xl shadow-xl animate-float animation-delay-1000 z-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                🍕
              </div>
              <div>
                <div className="font-semibold text-sm">Margherita Pizza</div>
                <div className="text-xs text-muted-foreground">
                  ★ 4.9 • ₹299
                </div>
              </div>
            </div>
          </div>
          <img
            src="/assets/landing/assets/delivery.png"
            alt="Lipy app preview"
            className="w-[500px] md:w-[800px] mx-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}

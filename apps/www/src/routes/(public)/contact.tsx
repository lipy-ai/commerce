import { createFileRoute } from "@tanstack/react-router";
import Header from "./-header";
import { Footer } from "./-footer";
import { env } from "@envClient";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/(public)/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header />
      <div className="py-42 flex-1 max-w-5xl m-auto space-y-8">
        <h1 className="text-5xl">Get in touch.</h1>
        <div className="p-8 border bg-muted rounded">
          <h2 className="text-2xl">Customer Support</h2>
          <p className="text-xl text-muted-foreground">hello@lipy.in</p>
        </div>
        <div className="p-8 border bg-muted rounded">
          <h2 className="text-2xl">Talk with founder</h2>
          <p className="text-xl text-muted-foreground">kundanbhosale@lipy.in</p>
        </div>
        <div className="p-8 border bg-muted rounded">
          <h2 className="text-2xl">Social Media</h2>
          <div className="flex gap-4">
            <a
              href={env.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-muted-foreground flex gap-2 items-center"
            >
              Instagram <ArrowUpRight className="size-4" />
            </a>
            <a
              href={env.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-muted-foreground flex gap-2 items-center"
            >
              Linkedin <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

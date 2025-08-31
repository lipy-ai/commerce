import { env } from "@envClient";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { CheckCircle } from "lucide-react";

const lipyForShopping = [
  "Get to shop from all the shops nearby at a single place.",
  "Compare prices of items in from a single place rather than going out and asking in each shop.",
  "Items are listed at shop owner's price directly , so no need to pay any hidden charges.",
];
const offers = [
  {
    title: "Inventory Management",
    icon: "👕",
    description:
      "We are simplifying inventory setup and management . Sellers do not need to manually upload each inventory data, they can simply setup the inventory in simple clicks.",
  },
  {
    title: "Support and Assistance",
    icon: "🎧",
    description:
      "End to end support in store setup. We are just a message or phone call away.",
  },
  {
    title: "No Commission",
    icon: "💸",
    description:
      "We are trying to make our services accessible to all. So we are charging absolutely negligible commission just to sustain the softwares.",
  },
  {
    title: "Marketing Assistance",
    icon: "📢",
    description:
      "Our team will help you plan and run online and offline marketing campaign.",
  },
  {
    title: "Analytics",
    icon: "📊",
    description:
      "Get analytics about your business and customer insights in your locality to take data driven decisions.",
  },
  {
    title: "Plugins",
    icon: "🔌",
    description:
      "We will be introducing different plugins to directly integrate lipy with your existing devices and softwares",
  },
];
export function Offerings() {
  const { isMobile } = useViewport();
  return (
    <div>
      <div className="p-4 md:p-16 mx-auto bg-blue-100">
        <h1 className="text-center font-bold text-4xl pb-12">
          Your one stop solution for local commerce
        </h1>

        <div className=" grid md:grid-cols-3  gap-8">
          {offers.map((o, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-xs p-8 justify-center text-center"
            >
              <div className="text-4xl pb-6">{o.icon}</div>

              <p className="text-xl font-bold pb-4">{o.title}</p>
              <p className="text-lg text-muted-foreground font-normal">
                {o.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="my-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Side Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/assets/landing/assets/network.png"
            alt="Network"
            className="w-[280px] md:w-[420px] lg:w-[500px] object-contain"
          />
        </div>

        {/* Right Side Content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-8">
            Get exposed to a{" "}
            <span className="text-indigo-600">larger audience</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Lipy lists your store in a common marketplace which not only helps
            you manage your customers better but also attracts new customers in
            your locality. Forget the hassle of running a dedicated website,
            managing servers, or overspending on marketing.
          </p>
          <p className="text-xl font-semibold text-gray-900">
            Just focus on your business, and we’ll handle the rest!
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-100 to-blue-200 rounded-2xl m-4 md:m-12  flex flex-col md:flex-row items-center justify-between overflow-hidden  md:px-20">
        {/* Left Section */}
        <div className="max-w-2xl space-y-4 p-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Why choose Lipy for shopping?
          </h1>
          <div className="space-y-4">
            {lipyForShopping.map((l, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="text-green-600 w-5 h-5 md:w-6 md:h-6 mt-1 flex-shrink-0" />
                <p className="text-base md:text-xl">{l}</p>
              </div>
            ))}
          </div>
          <a
            className={cn(
              buttonVariants({ size: isMobile ? "default" : "lg" })
            )}
            href={`${env.WEB_URL}`}
          >
            Start shopping now
          </a>
        </div>

        {/* Right Section (Phone) */}
        <div className="relative mt-6 md:mt-0 md:ml-8 flex-shrink-0 h-96 w-full md:w-72 overflow-hidden flex items-start justify-center pt-8 ">
          <img
            src="/assets/landing/assets/storeFront.png"
            alt="Mobile Preview"
            className="h-[32rem] object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

import { CheckCircle } from "lucide-react";

const onboarding = {
  title: "Hassle-free Onboarding",
  features: [
    "Fill simple information about your store",
    "Set store policies like minimum order value, delivery distance, etc.",
    "Get intuitive dashboard to manage your store",
    "Fully responsive for mobile and desktop",
  ],
};

const management = {
  title: "Better management",
  features: [
    "Add your own products or browse from our library",
    "Manage orders, customers, and inventory",
    "Track sales and analytics",
    "Add staffs and delivery partners to your shop",
  ],
};

const pos = {
  title: "Point of Sale (POS)",
  features: [
    "Manage your offline sales better",
    "Fast and simple billing & checkout",
    "Simple product search",
    "Generate receipts & invoices instantly",
    "Track in-store inventory in real time",
  ],
};

export function Features() {
  const FeatureList = ({
    section,
  }: {
    section: {
      title: string;
      features: string[];
    };
  }) => {
    return (
      <div className="flex flex-col gap-8 max-w-lg">
        <h3 className="text-2xl md:text-4xl font-bold">{section.title}</h3>
        <div className="space-y-6">
          {section.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="text-green-600 w-5 h-5 md:w-6 md:h-6 mt-1 flex-shrink-0" />
              <p className="text-base md:text-xl">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ImageSection1 = () => (
    <div className="relative flex-shrink-0 w-full max-w-sm md:max-w-none p-4 bg-pink-100 rounded-xl">
      {/* Parent container with proper spacing for overlay */}
      <div className="relative pl-8 md:pl-12 pb-16 md:pb-20">
        <img
          src={"/assets/lipy-dashboard.png"}
          alt="Dashboard preview"
          className="rounded-2xl w-full md:w-[450px] lg:w-[600px] border drop-shadow-xl"
        />
        <img
          src={"/assets/mobile-dashboard.png"}
          alt="Mobile dashboard preview"
          className="absolute bottom-0 left-0 w-[90px] md:w-[120px] lg:w-[140px] border rounded-2xl drop-shadow-xl"
        />
      </div>
    </div>
  );

  const ImageSection2 = () => (
    <div className="relative flex-shrink-0 w-full max-w-sm md:max-w-none p-4 bg-emerald-100 rounded-xl">
      {/* Parent container with proper spacing for overlay */}
      <div className="relative pr-8 md:pr-12 pt-16 md:pt-20">
        <img
          src={"/assets/order.png"}
          alt="order"
          className="rounded-2xl w-full md:w-[450px] lg:w-[600px] border drop-shadow-xl"
        />
        <img
          src={"/assets/product.png"}
          alt="Product preview"
          className="absolute top-0 right-0 w-[90px] md:w-[120px] lg:w-[140px] border rounded-2xl drop-shadow-xl"
        />
      </div>
    </div>
  );

  const ImageSection3 = () => (
    <div className="relative flex-shrink-0 w-full max-w-sm md:max-w-none p-4 bg-yellow-100 rounded-xl">
      {/* Parent container with proper spacing for overlay */}
      <div className="relative">
        <img
          src={"/assets/pos.png"}
          alt="order"
          className="rounded-2xl w-full md:w-[450px] lg:w-[700px] border drop-shadow-xl"
        />
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto mb-24 md:mb-36">
      <h1 className="text-xl sm:text-2xl md:text-5xl font-bold text-center my-8 md:my-20">
        Bridging the gap between local shops and online shoppers
      </h1>

      {/* First Section - Desktop: Image Left, Text Right | Mobile: Image First, Text Second */}
      <div className="mb-16 md:mb-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
          {/* Image - Order 1 on mobile, Order 1 on desktop */}
          <div className="order-1 md:order-1 flex justify-center md:justify-start">
            <ImageSection1 />
          </div>
          {/* Text - Order 2 on mobile, Order 2 on desktop */}
          <div className="order-2 md:order-2 flex justify-center md:justify-start">
            <FeatureList section={onboarding} />
          </div>
        </div>
      </div>

      {/* Second Section - Desktop: Text Left, Image Right | Mobile: Image First, Text Second */}
      <div className="mt-16 md:mt-32">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
          {/* Text - Order 2 on mobile, Order 1 on desktop */}
          <div className="order-2 md:order-1 flex justify-center md:justify-start">
            <FeatureList section={management} />
          </div>
          {/* Image - Order 1 on mobile, Order 2 on desktop */}
          <div className="order-1 md:order-2 flex justify-center md:justify-start">
            <ImageSection2 />
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-32">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
          {/* Image - Order 1 on mobile, Order 1 on desktop */}
          <div className="order-1 md:order-1 flex justify-center md:justify-start">
            <ImageSection3 />
          </div>
          {/* Text - Order 2 on mobile, Order 2 on desktop */}
          <div className="order-2 md:order-2 flex justify-center md:justify-start">
            <FeatureList section={pos} />
          </div>
        </div>
      </div>
    </div>
  );
}

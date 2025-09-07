import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import FormEdit from "../-form.edit";

export const Route = createFileRoute("/(dashboard)/product/add/")({
  component: RouteComponent,
});

const features = [
  {
    icon: "📚",
    description:
      "We are curating a library of products so that you may not have to add each product manually.",
  },
  {
    icon: "🔍",
    description:
      "Search your desired product or browse in different categories",
  },
  {
    icon: "⚡",
    description:
      "Seamlessly, set your price and add to your inventory in just one click.",
  },
];

function RouteComponent() {
  return (
    <div>
      <DashboardHeader title="Add Product" />
      <div className="grid lg:grid-cols-12 gap-4  lg:p-8 min-h-[80vh]">
        <Card className="lg:col-span-8">
          <CardContent className="flex flex-1 flex-col justify-center items-center m-auto space-y-4">
            <img
              src="/assets/add-product.png"
              alt=""
              className="size-40 md:size-48 object-cover"
            />
            <div className="text-center">
              <h3 className="font-semibold text-xl">
                Add products to your shop
              </h3>
              <p className="text-muted-foreground text-base px-6 max-w-[500px]">
                List your products at your shop asn start selling.
              </p>
            </div>

            <div className="flex gap-4 flex-col md:flex-row w-full md:w-fit">
              <Link
                className={cn(buttonVariants({ variant: "outline" }))}
                to="/product/add/bulk"
              >
                Bulk upload products
              </Link>
              <FormEdit view="create">
                <Button>
                  <Plus />
                  Add product
                </Button>
              </FormEdit>
            </div>
          </CardContent>
        </Card>
        <Card className=" lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-semibold text-xl">
              Explore in Lipy Library
            </CardTitle>
            <CardDescription>
              Simply browse in different categories and add to your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {features?.map((feature, index) => (
                <div className="flex items-start space-x-4" key={index}>
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">
                      {feature.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <h4 className="font-semibold text-gray-900">
                  Ready to get started?
                </h4>
              </div>
              <p className=" text-sm">
                Begin exploring our extensive collection today and set your
                inventory in just simple click.
              </p>
              <Link
                to="/product/lipy-library"
                className={cn(buttonVariants(), "my-2")}
              >
                Explore products now
                <ArrowUpRight />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

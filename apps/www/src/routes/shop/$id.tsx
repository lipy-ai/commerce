import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import ShopShortDetails from "@/components/shop/shopShortDetails";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import SearchBar from "@lipy/web-ui/components/searchBar";
import ProductCard from "@lipy/web-ui/components/product/productCard"; // Fixed the path
import { cn } from "@lipy/web-ui/lib/utils";
import Loading from "@lipy/web-ui/components/ui/loading";
import { motion } from "framer-motion";

export const Route = createFileRoute("/shop/$id")({
  component: RouteComponent,
});

const shopInfo = {
  name: "Tasty Bites Restaurant",
  address: "123 Main Street, Downtown, City",
  rating: 4.7,
  reviews: 328,
  isOpen: true,
  deliveryTime: "25-35",
};

function RouteComponent() {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shopInfoVisible, setShopInfoVisible] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("https://dummyjson.com/products/categories");
        const data: string[] = await res.json();
        setCategories(data);

        // Fetch products for all categories
        const productsData = await Promise.all(
          data.map(async (category: string) => {
            const res = await fetch(category.url);
            const json = await res.json();
            return {
              [category.name]: json.products, // key: category, value: product array
            };
          })
        );

        // Result is array of objects; merge them into one array of objects if needed
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <DashboardHeader
        titleChildren={
          <motion.div
            key={shopInfoVisible ? "empty" : "title"}
            initial={{ opacity: 0, y: 10 }} // Start slightly lower
            animate={{ opacity: 1, y: 0 }} // Move to normal position
            exit={{ opacity: 0, y: -10 }} // Exit upward
            transition={{ duration: 0.1 }}
            className="text-lg font-semibold"
          >
            {!shopInfoVisible ? shopInfo.name : ""}
          </motion.div>
        }
      />

      <ShopShortDetails
        shopInfo={shopInfo}
        setShopInfoVisible={setShopInfoVisible}
      />

      <Separator className="-my-4" />

      <div className="mb-16">
        {products.map((productGroup, idx) => {
          const categoryName = Object.keys(productGroup)[0];
          const productArray = Object.values(productGroup)[0];

          return (
            <div key={categoryName} className="my-10">
              <p className="text-lg font-semibold px-4 my-4">{categoryName}</p>

              <div
                className="flex overflow-x-auto flex-nowrap  scrollbar-hide w-full"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {productArray?.map((product: any, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={cn(
                      index === 0
                        ? "pl-4"
                        : index === productArray.length - 1
                          ? "pr-4"
                          : "",
                      "flex-shrink-0 w-32 pl-4"
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 p-4 w-full bg-background">
        <SearchBar placeholder={`Search in ${shopInfo.name}`} />
      </div>
    </>
  );
}

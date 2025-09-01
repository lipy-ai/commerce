import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent, CardFooter } from "@lipy/web-ui/components/ui/card";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Minus, Plus } from "lucide-react";

const CartComparison = () => {
  const { isMobile } = useViewport();
  const CompetitorCart = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-xs sm:max-w-sm mx-auto border">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
            ←
          </div>
          <h3 className="font-semibold text-gray-800">Cart</h3>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
            🏪
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Rasoi Ghar</h4>
            <p className="text-xs text-gray-500">2 items</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-4">
        {[
          {
            icon: "🍜",
            bg: "from-orange-200 to-orange-300",
            title: "Vegetable Maggie",
            desc: "1 x serves 1",
            price: "₹120.00",
          },
          {
            icon: "🥘",
            bg: "from-yellow-200 to-yellow-300",
            title: "Chole",
            desc: "1 x 300 ml",
            price: "₹180.00",
          },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className={`w-14 h-14 bg-gradient-to-br ${item.bg} rounded-lg flex items-center justify-center text-xl`}
            >
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-800">{item.title}</h5>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center border border-gray-300 rounded mb-2">
                    <Button
                      className="px-2 py-1 text-red-500 hover:bg-gray-100"
                      variant="ghost"
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="px-3 py-1 text-sm border-l border-r">
                      1
                    </span>
                    <Button
                      className="px-2 py-1 text-green-500 hover:bg-gray-100"
                      variant="ghost"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill Details */}
      <div className="border-t bg-gray-50 px-4 py-4">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          📄 Bill details
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Item total (Rasoi Ghar)</span>
            <span className="ml-2 font-medium">₹300.00</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Charge</span>
            <span className="font-medium">₹40.00</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform fee</span>
            <span className="font-medium">₹25.00</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Rain charge</span>
            <span className="font-medium">₹15.00</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">
              GST and Restaurant Charges
            </span>
            <span className="font-medium">₹17.00</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium"> - ₹30</span>
          </div>

          <div className="border-t border-dashed pt-3 mt-3">
            <div className="flex justify-between items-center text-base font-semibold">
              <span>Total Payable</span>
              <span className="text-lg">₹367.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-white">
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
          Place order ₹367
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Why customers order less from your restaurant?
        </h1>

        {/* Responsive grid instead of fixed flex */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start mb-12">
          {/* Competitor Cart */}
          <div className="flex flex-col items-center relative">
            <CompetitorCart />
            {!isMobile && (
              <div className="mt-4 flex items-center md:absolute md:-right-16 md:top-80">
                <div className="w-12 h-12 bg-red-100 border-2 border-red-500 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">₹367</span>
                </div>
                <div className="hidden md:block w-0 h-0 border-l-8 border-l-red-500 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-2"></div>
              </div>
            )}
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-400">
              <span className="font-bold text-gray-700">VS</span>
            </div>
            <div className="mt-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-red-600">
                ₹180
              </div>
              <div className="text-sm text-gray-600">DIFFERENCE</div>
            </div>
          </div>

          {/* Our Cart */}
          <div className="flex flex-col items-center relative">
            <img
              src="/assets/landing/assets/cart.png"
              alt=""
              className="border-2 rounded-xl w-full max-w-xs"
            />
            {!isMobile && (
              <div className="mt-4 flex items-center md:absolute md:-left-16 md:top-72">
                <div className="w-0 h-0 border-r-8 border-r-green-500 border-t-4 border-t-transparent border-b-4 border-b-transparent mr-2"></div>
                <div className="w-12 h-12 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm  ">
                    ₹187
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom explanation */}

        <Card>
          <CardContent>
            <div className="flex  justify-center items-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-4xl mb-2">😰</div>
                <div className="text-sm font-semibold text-red-600">
                  Customer thinks:
                </div>
                <div className="text-xs text-gray-600">"Too expensive!"</div>
                <div className="text-xs text-red-500 font-semibold mt-1">
                  Orders less
                </div>
              </div>

              <div className="text-3xl text-gray-400">→</div>

              <div className="text-center">
                <div className="text-4xl mb-2">😊</div>
                <div className="text-sm font-semibold text-green-600">
                  Customer thinks:
                </div>
                <div className="text-xs text-gray-600">"Fair price!"</div>
                <div className="text-xs text-green-500 font-semibold mt-1">
                  Orders more
                </div>
              </div>
            </div>
            <CardFooter className="justify-center text-center">
              {" "}
              <p className=" text-lg sm:text-xl font-bold text-gray-800">
                Result: <span className="text-green-600">More orders</span> ={" "}
                <span className="text-green-600">More revenue</span> for your
                restaurant
              </p>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartComparison;

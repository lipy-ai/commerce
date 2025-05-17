
import { Clock, MapPin, Star} from "lucide-react";

export default function ShopShortDetails({ shopInfo}) {


  return (
    <div className="p-4">
      {/* Header with Shop Name and Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h1 className="font-bold text-xl text-gray-800">{shopInfo.name}</h1>
          <div className="flex items-center mt-1 text-gray-600">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <p className="text-sm line-clamp-1">
              {shopInfo.address}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
           <div className="flex items-center mt-1">
                      <div className="flex items-center bg-green-800 text-background px-2 rounded text-sm">
                        <span>{shopInfo.rating}</span>
                        <Star className="h-3 w-3 ml-1 fill-white" />
                      </div>
                    </div>
          <div className="mt-1 text-sm text-gray-500 font-medium">
            {shopInfo.reviews} reviews
          </div>
        </div>
      </div>
      
      {/* Status Badge */}
      <div className="flex items-center mb-5">
        <div className={`w-2 h-2 rounded-full mr-2 ${shopInfo.isOpen ? "bg-green-500" : "bg-red-500"}`}></div>
        <span className={`text-sm font-medium ${shopInfo.isOpen ? "text-green-600" : "text-red-600"}`}>
          {shopInfo.isOpen ? "Open Now" : "Closed"}
        </span>
        <div className="mx-2 h-4 border-r border-gray-300"></div>
        <Clock className="h-4 w-4 mr-1 text-gray-500" />
        <p className="text-sm text-gray-600">
          {shopInfo.deliveryTime} min delivery
        </p>
      </div>
      
     
    
    </div>
  );
}
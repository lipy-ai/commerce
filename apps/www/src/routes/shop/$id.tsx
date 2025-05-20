import { createFileRoute } from '@tanstack/react-router'
import { DashboardHeader } from '@lipy/web-ui/components/layouts/dashboard'
import ShopShortDetails from '@/components/shop/shopShortDetails'
import {Separator} from '@lipy/web-ui/components/ui/separator'
import SearchBar from '@lipy/web-ui/components/searchBar'
import ProductCard from '../../../../../packages/web-ui/src/components/product/productCard'

export const Route = createFileRoute("/shop/$id")({
  component: RouteComponent,
});

const shopInfo =  {
  name: "Tasty Bites Restaurant",
  address: "123 Main Street, Downtown, City",
  rating: 4.7,
  reviews: 328,
  isOpen: true,
  deliveryTime: "25-35"
} 

const product ={
  image : "/assets/maggy.jpeg",
  title:"Organic Avocado",
  summary : "Fresh organic avocados from local farms. Rich in nutrients and perfect for salads, sandwiches, or guacamole.",
  price: 299,
  originalPrice: 499
}

function RouteComponent() {
  return (
    <>
    <DashboardHeader title={''}/>
   
       <ShopShortDetails shopInfo={shopInfo}/>

     <Separator className='-my-4'/>
     <div className='m-8'>
          <ProductCard product={product}/>

     </div>
 

     <div className='fixed bottom-0 p-4 w-full bg-background'>
      <SearchBar placeholder={`Search in ${shopInfo.name}`}/>
     </div>
   
    
    </>
  );
}

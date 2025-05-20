import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function ProductCard({product}){
    return (
        <div className="w-36">
         <div className="relative">
             <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-36 object-cover rounded-xl"
        />
        <Button className="absolute bottom-2 right-2 p-2 bg-primary/90" size={'icon'}>
            <Plus/>
        </Button>
        </div>

        <p className="font-bold text-base py-1">{product.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2 py-1">{product.summary}</p>
        <span className="font-bold text-lg pr-2"> ₹{product.price}</span>
        <span className='line-through text-muted-foreground'>₹{product.originalPrice}</span>
        
        
        </div>
       
    )
}
import { useState } from 'react';
import {  MapPin, Star, Filter, Heart, ShoppingCart, Coffee, Store, ShoppingBag, Milk} from 'lucide-react';
import SearchBar from './searchBar';
import { Button } from '@web-ui/components/ui/button';
import {Badge} from '@web-ui/components/ui/badge'
import { Card } from '@web-ui/components/ui/card';
import {ScrollingTabs} from '@web-ui/components/scrollable-tabs'
import { Link } from '@tanstack/react-router';
import {DairyIcon, FruitBasketIcon, GroceryIcon, ShopIcon, VegetableIcon } from '@web-ui/components/icons/index';

// Sample data
const SHOPS = [
  {
    id: '1',
    name: 'Green Market Grocery',
    image: '/public/assets/paper-bag-items.webp',
    rating: 4.7,
    reviews: 324,
    categories: ['Grocery', 'Organic'],
    type: 'grocery',
    hours: '8:00 AM - 10:00 PM',
    distance: '1.3 km',
    discount: '10% OFF on all fruits',
    isPromoted: true,
    isOpen: true,
    isBookmarked: false
  },
  {
    id: '2',
    name: 'Urban Style Retail',
    image: '/assets/paper-bag-items.webp',
    rating: 4.3,
    reviews: 267,
    categories: ['Clothing', 'Accessories'],
    type: 'retail',
    hours: '10:00 AM - 9:00 PM',
    distance: '0.8 km',
    discount: '15% OFF on new arrivals',
    isPromoted: false,
    isOpen: true,
    isBookmarked: true
  },
  {
    id: '3',
    name: 'Morning Brew Cafe',
    image: '/assets/paper-bag-items.webp',
    rating: 4.5,
    reviews: 418,
    categories: ['Cafe', 'Breakfast'],
    type: 'cafe',
    hours: '7:00 AM - 8:00 PM',
    distance: '1.7 km',
    discount: 'Buy 1 Get 1 on all coffees',
    isPromoted: false,
    isOpen: true,
    isBookmarked: false
  },
  {
    id: '4',
    name: 'Value Mart Superstore',
    image: '/assets/paper-bag-items.webp',
    rating: 4.1,
    reviews: 532,
    categories: ['Grocery', 'Electronics', 'Home'],
    type: 'grocery',
    hours: '9:00 AM - 11:00 PM',
    distance: '2.4 km',
    discount: '20% OFF home essentials',
    isPromoted: true,
    isOpen: false,
    isBookmarked: false
  },
  {
    id: '5',
    name: 'Tech Gadget Store',
    image: '/assets/paper-bag-items.webp',
    rating: 4.4,
    reviews: 186,
    categories: ['Electronics', 'Computers'],
    type: 'retail',
    hours: '10:00 AM - 9:00 PM',
    distance: '1.5 km',
    discount: 'Up to 30% OFF on accessories',
    isPromoted: false,
    isOpen: true,
    isBookmarked: false
  },
  {
    id: '6',
    name: 'Cozy Corner Bookstore',
    image: '/assets/paper-bag-items.webp',
    rating: 4.6,
    reviews: 378,
    categories: ['Books', 'Stationery'],
    type: 'retail',
    hours: '9:00 AM - 8:00 PM',
    distance: '3.1 km',
    discount: 'Flat 15% OFF on bestsellers',
    isPromoted: false,
    isOpen: true,
    isBookmarked: true
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Stores', icon: ShopIcon },
  { id: 'grocery', name: 'Grocery', icon: GroceryIcon},
  { id: 'fruits', name: 'Fruits', icon: FruitBasketIcon },
  { id: 'vegetables', name: 'Vegetables', icon: VegetableIcon},
  { id: 'dairy', name: 'Dairy', icon: DairyIcon }
];

export default function NearByShops() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [shops, setShops] = useState(SHOPS);

  // Toggle bookmarked status
  const toggleBookmark = (id) => {
    setShops(shops.map(shop => 
      shop.id === id ? {...shop, isBookmarked: !shop.isBookmarked} : shop
    ));
  };

  // Filter by category
  const filteredShops = shops.filter(shop => {
    if (showFavorites && !shop.isBookmarked) return false;
    if (activeCategory !== 'all' && shop.type !== activeCategory) return false;
    return true;
  });
  
  return (
    <div>
      {/* Search and Filter Header */}
      <div className="sticky top-0 z-10 shadow-sm px-4 py-3 bg-background">
        <div className="relative flex items-center mb-4 gap-2">
          <div className="relative flex-1 ">
            <SearchBar/>
          </div>
          <Button variant={'secondary'} className='p-2'>
            <Filter className="size-6" />
          </Button>
        </div>

        <div className='-ml-4 -mr-4 -mb-3'>
           <ScrollingTabs tabs={CATEGORIES} handleTabChange={setActiveCategory}/>

        </div>
       
      </div>

     
      {/* Shop List */}
      <div className="px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {filteredShops.map(shop => (
            <Card 
              key={shop.id} 
              className='p-0'
            >
              <Link to={`/shop/${shop.id}`}>


               {/* Image Container */}
              <div className="relative h-48">
                <img 
                  src={shop.image} 
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
                {/* Bookmark Button */}
                <button 
                  onClick={() => toggleBookmark(shop.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition"
                >
                  <Heart className={`h-5 w-5 ${shop.isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                
              
                {/* Store Type Badge - Different color for each type */}
                <div className={`absolute bottom-3 left-3 text-white text-xs px-2 py-1 rounded flex items-center ${
                  shop.type === 'grocery' ? 'bg-green-500' : 
                  shop.type === 'retail' ? 'bg-purple-500' : 'bg-amber-500'
                }`}>
                  {shop.type === 'grocery' ? <ShoppingCart className="h-3 w-3 mr-1" /> : 
                   shop.type === 'retail' ? <ShoppingBag className="h-3 w-3 mr-1" /> : 
                   <Coffee className="h-3 w-3 mr-1" />}
                  {shop.type.charAt(0).toUpperCase() + shop.type.slice(1)}
                </div>
                
                {/* Discount Banner */}
                
        <Badge className='absolute bottom-3 right-3' variant={'secondary'} >

                     <div className="flex items-center">
                    <MapPin className="size-4 mr-1" />
                    <span>{shop.distance}</span>
                  </div> 


                  </Badge>
                
                </div>
              
              
              {/* Content */}
              <div className="p-4 -my-4">
               
                  <div className='flex items-center justify-between'>
                    <h3 className="font-bold text-lg">{shop.name}</h3>
                    

                      <div className="flex items-center mt-1">
                      <div className="flex items-center bg-green-800 text-background px-2 rounded text-sm">
                        <span>{shop.rating}</span>
                        <Star className="h-3 w-3 ml-1 fill-white" />
                      </div>
                    </div>

              
                    
                 
                

                </div>
                
                <div className="mt-2 text-sm text-muted-foreground">
                  {shop.categories.join(' • ')}
                </div>
                
                <div className="flex items-center justify-between mt-3 text-sm">
                 
                  
                </div>
              </div>
              
              
              </Link>
             
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
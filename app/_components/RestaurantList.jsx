"use client"
import React, { useEffect, useState } from 'react'
import GlobalApi from '../_utils/GlobalApi';
import { useSearchParams } from 'next/navigation';
import RestaurantCard from './RestaurantCard';

function RestaurantList() {
    const params = useSearchParams()
    const [categories, setCategories] =useState("All");
    const [restaurant,setRestaurant] = useState([]);

    useEffect(()=>{
        const cat = params?.get('category')
        const q = params?.get('q')
        if (cat) setCategories(cat)
        getRestaurantsList(cat, q);
    },[params])


       const getRestaurantsList =  (category, q) => {
            GlobalApi.getRestaurants(category, q).then(resp=>{
                console.log(resp);
                setRestaurant(resp?.restaurants || []);
            }).catch(err => console.error('getRestaurantsList error', err));
        }
  return (

    <div className='mt-10'>

      <div className='flex items-center gap-5 justify-between mb-4'>

    <h2 className="relative inline-block text-[#2e3082] text-2xl font-bold after:content-[''] after:block after:absolute after:left-0 after:bottom-[-8px] after:w-2/2 after:h-[3px] after:bg-[#F42600]">
  Popular {categories} Restaurants
</h2>

<h2 className='text-[#F42600]  font-bold'>{restaurant?.length ?? 0} Results</h2>
 </div>

 <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
  {restaurant.map((res)=>(
      <RestaurantCard key={res.id} res={res}/>
  ))}
 </div>
</div>
  )
}

export default RestaurantList
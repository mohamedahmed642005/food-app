import Image from "next/image";
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs";
import CatetegoryList from "./_components/CatetegoryList";
import RestaurantList from "./_components/RestaurantList";
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className="">
      <Suspense fallback={<div className='py-6'>Loading categories...</div>}>
        <CatetegoryList />
      </Suspense>

      <Suspense fallback={<div className='py-6'>Loading restaurants...</div>}>
        <RestaurantList />
      </Suspense>

    </div>
  );
}

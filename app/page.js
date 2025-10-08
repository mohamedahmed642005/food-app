import Image from "next/image";
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs";
import CatetegoryList from "./_components/CatetegoryList";
import RestaurantList from "./_components/RestaurantList";
export default function Home() {
  return (
    <div className="">
      <CatetegoryList />
      <RestaurantList />
     
    </div>
  );
}

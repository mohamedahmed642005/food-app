import { Button } from '../../components/ui/button'
import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useContext } from 'react'
import GlobalApi from '../_utils/GlobalApi'
import { UpdateCartContext } from './_context/UpdateCartConetext'
import { toast } from 'sonner'
import Link from 'next/link'

function CartInfo({cart}) {
    const { setCartItems } = useContext(UpdateCartContext)


    const totalAmount=()=>{
        let total = 0;
        cart?.forEach((item)=>{
          total = total+item?.price || 0;
        })
        return total;
    }

    const handleRemoveFromCart =async(id)=> {
      try{
        await GlobalApi.DeleteFromCart(id)
         setCartItems(prev => !prev)
         toast.success("Item removed from cart")
      }catch(error){
          console.error("Error removing item:", error)
      }
    }
  return (
    <div>

      {cart?.map((item)=>(
        <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 flex-1'>
        <Image className='rounded-full w-10 h-10 mt-3' src={item?.productImage?.url} alt="" width={70} height={70} />
      
        <h2 className='font-bold text-sm text-[#333]'>{item?.productName}</h2>
        
        </div>
        <div className='flex items-center gap-2'>
            <span className='font-bold text-sm text-red-600'>
              ${item?.price}
            </span>
            <button className='p-1 hover:bg-red-100 rounded-full'>
              <X onClick={() => handleRemoveFromCart(item.id)} className='cursor-pointer text-red-500 h-4 w-4' />
            </button>
          </div>
       </div>
      ))}
      <Link href="/checkout">
        <Button className='w-full mt-4'>Checkout {totalAmount()} $</Button>
      </Link>

    </div>
  )
}

export default CartInfo
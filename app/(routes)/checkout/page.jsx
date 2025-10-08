"use client"

import React, { useContext, useEffect, useState } from 'react'
import GlobalApi from '@/app/_utils/GlobalApi'
import { UpdateCartContext } from '@/app/_components/_context/UpdateCartConetext'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
function Checkout() {

    const { cartItems, setCartItems } = useContext(UpdateCartContext)
    const [cart,setCart] = useState([])
     const [loading, setLoading] = useState(true);
     const [subTotal,setSubTotal] = useState(0)
    const [deliveryAmount,setDeliveryAmount] = useState(15)
    const [taxAmount,setTaxAmount] = useState(0)
    const [total,setTotal] = useState(0)

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [phone,setPhone] = useState("")
    const [zip,setZip] = useState("")
    const [address,setAddress] = useState("")
    const {user} = useUser()
    const [lastOrder,setLastOrder] = useState(null)

        useEffect(()=>{
             user && getUserCart()
              console.log("Cart Items:",cartItems)
            },[user , cartItems])


     const getUserCart=()=>{
          GlobalApi.getUserCart(user.primaryEmailAddress.emailAddress).then((resp)=>{
            setCart( resp?.shoppingCarts)

            totalAmount(resp?.shoppingCarts)
          })

          setLoading(false)
        }

        const totalAmount=(cartAmount)=>{
            let total = 0

            cartAmount?.forEach((item)=>{
                total = total + item.price
            })

            setSubTotal(total.toFixed(2))
            setTaxAmount(total * 0.09)
            setTotal(total + deliveryAmount + taxAmount)

            return total
        }

    const createOrder=async ()=>{

            const data = {
                email:user?.primaryEmailAddress.emailAddress,
                orderAmount: total,
                userName:user.fullName,
                address:address,
                phone:phone,
                zip:zip,
                orderItems: cart.map(item => ({
                    name: item.productName,
                    price: item.price,
                }))
            }
                    const resp = await GlobalApi.createNewOrder(data)
                    if (!resp) {
                        toast.error('Failed to create order. Please try again.')
                        return
                    }
                    for(const item of cart){
                            GlobalApi.DeleteFromCart(item.id)
                    }
                    setLastOrder(resp)
                    setCart([])
                    console.log("Order Created:", resp)
                    toast.success("Order Placed Successfully!")

        }
  return (
   <div className='container mx-auto p-6'>
            <h1 className='text-2xl font-bold mb-6'>Checkout</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
             
                <div className='bg-white shadow-md rounded-2xl p-6'>
                    <h2 className="text-lg font-bold mb-4">Billing Details</h2>
                    <form className='grid grid-cols-2 gap-4'>
                        <Input onChange={(e) => setName(e.target.value)} placeholder="Name" />
                        <Input 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email" 
                        />
                        <Input onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
                        <Input onChange={(e) => setZip(e.target.value)} placeholder="Zip" />
                        <Input className="col-span-2" onChange={(e) => setAddress(e.target.value)} placeholder="Address" />

                        <Button onClick={createOrder} type="button" className='col-span-2  text-white py-2 rounded-md'>Place Order</Button>
                    </form>
                </div>

              

                  <div className='bg-gray-50 shadow-md rounded-2xl p-6'>
                <h2 className="text-lg font-bold mb-4">Your Orders</h2>
                <div className='space-y-3 max-h-64 overflow-y-auto'>
                    {loading  ? (
                          <p>Loading cart...</p>
                    ):
                        cart.length === 0 ? (

                         <p>No items in cart.</p>
                    ):(
                        cart?.map((item, idx)=> (
                        <div key={item?.id ?? item?.productName ?? idx} className='flex justify-between items-center border-b pb-2'>
                            <div className='flex items-center gap-3'>

                                {item.productImage?.url && (

                            <Image src={item.productImage.url} alt={item.productName} width={100} height={100} />
                                )}

                          <div>
                        <h3 className="text-sm font-semibold">{item.productName}</h3>
                         <p className="text-xs text-gray-500">{item.productDescription}</p>
                             </div>       
                            </div>
                  <span className="font-bold text-sm">${item.price}</span>
                        </div>
                        ))
                    )}
                </div>
{cart?.length > 0 && (
                <div className='mt-4 border-t pt-4 space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span>Subtotal</span>
                    <span>$ {subTotal} </span>
                  </div>

                 <div className="flex justify-between">
                  <span>Delivery:</span> 
                   <span>${deliveryAmount}</span>
                   </div>  


                 <div className="flex justify-between">
                  <span>Tax:</span> 
                   <span>${taxAmount.toFixed(2)}</span>
                   </div>  

                <div className='flex justify-between font-bold text-base border-t pt-2'>
                    
                  <span>Total:</span> 
                   <span>$ {total.toFixed(2)}</span>   
                    
                    </div>   


                </div>
             )}   
                  </div>

               
            </div>
       
        </div>
    )
}

export default Checkout
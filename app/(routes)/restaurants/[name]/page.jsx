"use client"
import { UpdateCartContext } from '@/app/_components/_context/UpdateCartConetext';
import ReviewSection from '@/app/_components/ReviewSection';
import { useParams } from 'next/navigation'
import GlobalApi from '@/app/_utils/GlobalApi';
import { useUser } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import React, { useContext,useEffect, useState } from 'react'
import { toast } from 'sonner';

function RestaurantDeteils() {
    const {user} = useUser()
     const { cartItems, setCartItems } = useContext(UpdateCartContext)
    const { name } = useParams()
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        if(!name) return;
        GlobalApi.restaurantDetails(name).then((resp)=>{
            setRestaurant(resp?.restaurant);
               setCartItems(!cartItems)
            setLoading(false);
        }).catch(err => {
            console.error('restaurantDetails error', err)
            setLoading(false)
        })
    },[name])

    if (loading) {
        return(
            <div className="flex justify-center items-center h-[60vh]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading restaurant details...</p>
                </div>
            </div>
        )
    }

    if (!restaurant) return <p className="text-center mt-10 text-red-500">Restaurant not found</p>;

    const handleAddToCart = (item) => {
        const data = {
            email: user?.primaryEmailAddress?.emailAddress,
            productName: item?.name,
            productDescription: item?.description,
            price: item?.price,
            productImageId: item?.productImage?.id,
        }

        GlobalApi.AddToCart(data).then((resp)=>{
            console.log(resp)
            toast.success("Item added to cart")
            setCartItems(prev => prev + 1)
          }).catch(error=> {
            console.error(error)
            toast.error("Failed to add item to cart")
        })

    }

    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            
            <div className='relative w-full mb-6 rounded-lg overflow-hidden shadow-md'>
                <div className='relative w-full h-56 md:h-96'>
                    {restaurant?.banner?.url ? (
                        <Image src={restaurant.banner.url} alt={restaurant?.name || 'restaurant banner'} fill className="object-cover" priority />
                    ) : (
                        <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400'>No banner image</div>
                    )}
                </div>

                <div className='absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent pointer-events-none'></div>

                <div className='absolute left-6 bottom-6 text-white'>
                    <h1 className='text-2xl md:text-4xl font-extrabold drop-shadow-md'>{restaurant.name}</h1>
                    {restaurant?.restuarantType && (
                        <div className='mt-2 flex flex-wrap gap-2'>
                            {restaurant.restuarantType.map((t, i)=> (
                                <span key={i} className='text-xs md:text-sm bg-white/20 px-2 py-1 rounded-md'>{t}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
             
                <div className='lg:col-span-2'>
                    <div className='mb-6'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                            <div>
                                <p className='text-gray-700 font-medium'>
                                    <span className="font-bold">Address:</span> {restaurant.address}
                                </p>
                                <p className="text-gray-700 font-medium mt-1">
                                    <span className="font-bold">Working Hours:</span> {restaurant.workingHours}
                                </p>
                            </div>

                            <div className='flex items-center gap-4'>
                                <div className='bg-white shadow rounded-md px-3 py-2'>
                                    <div className='text-sm text-gray-500'>Rating</div>
                                    <div className='font-semibold text-lg text-indigo-600'>4.5</div>
                                </div>

                                <div className='bg-white shadow rounded-md px-3 py-2'>
                                    <div className='text-sm text-gray-500'>Orders</div>
                                    <div className='font-semibold text-lg text-indigo-600'>{restaurant?.ordersCount ?? '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className='text-2xl md:text-3xl font-bold mb-4 border-b pb-2'>Menu</h2>
                        {restaurant.menu?.map((menuCategory, mIdx) => (
                            <div key={menuCategory?.id ?? menuCategory?.category ?? mIdx} className="mb-8">
                                <h3 className='text-xl md:text-2xl font-semibold mb-3'>{menuCategory.category}</h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {menuCategory?.menuItem?.map((item, idx) => (
                                        <article key={item?.id ?? item?.name ?? idx} className='bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col'>
                                            <div className='relative w-full h-44'>
                                                {item?.productImage?.url ? (
                                                    <Image src={item.productImage.url} alt={item.name || 'product image'} fill className="object-cover" loading="lazy"/>
                                                ) : (
                                                    <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400'>No image</div>
                                                )}
                                            </div>

                                            <div className='p-4 flex-1 flex flex-col justify-between min-h-[110px]'>
                                                <div>
                                                    <h4 className='text-lg font-semibold'>{item.name}</h4>
                                                    {item.description && <p className='text-sm text-gray-600 mt-1 line-clamp-3'>{item.description}</p>}
                                                </div>

                                                <div className='mt-4 flex items-center justify-between'>
                                                    <div className='text-indigo-600 font-semibold text-lg'>${item.price?.toFixed ? item.price.toFixed(2) : item.price}</div>
                                                    <button onClick={()=> handleAddToCart(item)} aria-label={`Add ${item.name} to cart`} className='flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700'>
                                                        <Plus />
                                                        <span className='text-sm'>Add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

               
                <aside className='hidden lg:block'>
                    <div className='sticky top-24 space-y-4'>
                        <div className='bg-white shadow rounded-lg p-4'>
                            <h4 className='font-semibold'>About</h4>
                            <p className='text-sm text-gray-600 mt-2'>{restaurant.aboutUs}</p>
                        </div>

                        <div className='bg-white shadow rounded-lg p-4'>
                            <h4 className='font-semibold'>Contact</h4>
                            <p className='text-sm text-gray-600 mt-1'>Phone: {restaurant.phone ?? '—'}</p>
                            <p className='text-sm text-gray-600 mt-1'>Email: {restaurant.email ?? '—'}</p>
                        </div>
                    </div>
                </aside>
            </div>

             <ReviewSection restaurant={restaurant} />
        </div>
    )
}

export default RestaurantDeteils
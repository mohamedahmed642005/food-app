"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, SignOutButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Search, ShoppingCart, Menu } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { UpdateCartContext } from './_context/UpdateCartConetext'
import GlobalApi from '../_utils/GlobalApi'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import CartInfo from './CartInfo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function Header() {
  const {user} = useUser()
  const { cartItems, setCartItems } = useContext(UpdateCartContext)
  const [cart,setCart] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(()=>{
    if (user) getUserCart()
  },[user, cartItems])

  const getUserCart = () => {
    if (!user || !user.primaryEmailAddress) return
    GlobalApi.getUserCart(user.primaryEmailAddress.emailAddress).then((resp)=>{
      setCart( resp?.shoppingCarts || [])
    }).catch(err => console.error('getUserCart error', err))
  }

  const onSearchSubmit = (e) => {
    e.preventDefault()
    const q = (searchTerm || '').trim()
    
    router.push(q ? `/?q=${encodeURIComponent(q)}` : '/')
    setShowSearch(false)
  }

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
       
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={48} height={48} />
              <span className="hidden sm:inline-block font-bold text-lg text-gray-800">Delivery</span>
            </Link>
          </div>

        
          <div className="flex-1 flex justify-center">
        
            <form onSubmit={onSearchSubmit} className="hidden md:flex w-full max-w-xl items-center border rounded-xl p-2 bg-[#f3f4ff]">
              <input value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)} className='w-full bg-transparent outline-none px-2 text-sm'  type='text' placeholder='Search for restaurants or dishes...' />
              <button type="submit" className='p-2 text-gray-600'><Search className='text-gray-500' /></button>
            </form>

            <div className="flex md:hidden items-center">
              {showSearch ? (
                <form onSubmit={onSearchSubmit} className="flex items-center w-full max-w-xs border rounded-lg p-1 bg-[#f3f4ff]">
                  <input value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)} className='w-full bg-transparent outline-none text-sm px-2' type='text' placeholder='Search...' />
                  <button type="button" onClick={() => { setShowSearch(false); setSearchTerm('') }} className="ml-2 text-gray-600">✕</button>
                </form>
              ) : (
                <button onClick={() => setShowSearch(true)} aria-label="Open search" className="p-2 rounded-md hover:bg-gray-100">
                  <Search />
                </button>
              )}
            </div>
          </div>

      
          <div className="flex items-center gap-3">
            {!user && (
              <div className="hidden sm:flex items-center gap-2">
                <SignInButton mode='modal'>
                  <Button size="sm">Sign in</Button>
                </SignInButton>
                <SignUpButton mode='modal'>
                  <Button size="sm">Sign up</Button>
                </SignUpButton>
              </div>
            )}

            
            <Popover>
              <PopoverTrigger asChild>
                <div className='relative cursor-pointer p-2 rounded-md hover:bg-gray-100'>
                  <span className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs'>{cart.length}</span>
                  <ShoppingCart className='text-[#4f46e5]' />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <CartInfo cart={cart}/>
              </PopoverContent>
            </Popover>

      
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="p-1 rounded-md hover:bg-gray-100">
                  <UserButton />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/user"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                <Link href="/orders"><DropdownMenuItem>My Orders</DropdownMenuItem></Link>
                <Link href="/"><DropdownMenuItem><SignOutButton /></DropdownMenuItem></Link>
              </DropdownMenuContent>
            </DropdownMenu>

        
            <div className="md:hidden">
              <button className="p-2 rounded-md hover:bg-gray-100" aria-label="menu">
                <Menu />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
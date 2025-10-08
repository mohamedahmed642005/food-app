import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

function RestaurantCard({ res }) {
  const router = useRouter()
  const slug = res?.slug

  const onCardClick = () => {
    if (!slug) return
    router.push(`/restaurants/${slug}`)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onCardClick() }}
      className='group mt-6 block hover:scale-105 cursor-pointer transition-transform duration-300 ease-in-out outline-none'
    >
      <div className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100'>

        
        <div className='relative overflow-hidden rounded-t-2xl h-48 sm:h-56 md:h-44 lg:h-56'>
          {res?.banner?.url ? (
            <Image 
              src={res.banner.url}
              alt={res?.name || 'Restaurant banner'}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, 400px'
            />
          ) : (
            <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400'>No image</div>
          )}

     
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none'></div>

        
          <div className='absolute top-4 right-4'>
            <span className='bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-1 rounded-full text-sm font-semibold shadow-sm'>
              {res?.category?.[0]?.name}
            </span>
          </div>

       
          <button
            onClick={(e) => { e.stopPropagation(); /* TODO: toggle favorite */ }}
            aria-label='Add to favorites'
            className='absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50'
            type='button'
          >
            <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
            </svg>
          </button>
        </div>

        <div className='p-4 sm:p-6 bg-white'>
      
          <h2 className='text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1'>
            {res?.name}
          </h2>

         
          {res?.aboutUs && (
            <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{res.aboutUs}</p>
          )}

         
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <Image src="/star.png" width={16} height={16} alt="rating" />
                <span className='text-sm font-semibold text-gray-700'>4.5</span>
              </div>

              <div className='text-sm text-gray-500'>
                {res?.restuarantType?.[0]}
              </div>
            </div>

            <div className='text-sm font-semibold text-orange-600'>
              {res?.category?.[0]?.name}
            </div>
          </div>

      
          <div className='mt-4 flex items-center justify-between gap-4'>
            <div className='text-sm text-gray-500'>
             
              <div className='flex items-center gap-3'>
                <span className='text-xs text-gray-400'>25-30 min</span>
                <span className='text-xs text-gray-400'>• Free delivery</span>
              </div>
            </div>

            <div>
              <Link
                href={`/restaurants/${slug}#menu`}
                onClick={(e) => e.stopPropagation()}
                className='inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300'
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default RestaurantCard
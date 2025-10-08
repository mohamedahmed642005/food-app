"use client"

import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import GlobalApi from '../_utils/GlobalApi';
import { toast } from 'sonner';

function ReviewSection({restaurant}) {

    const {user} = useUser()

      const [reviews, setReviews] = useState([]);
      const [formData, setFormData] = useState({
        userName: user?.name || '',
        userEmail: user?.email || '',
        comment: '',
        rating: 1,
      });


      useEffect(()=>{
        GlobalApi.getReviews(restaurant.slug).then((resp)=>{
          setReviews(resp?.reviews || [])
        })
      },[restaurant])

      const handleSubmit = async (e) => {

        try{
        e.preventDefault()
        await GlobalApi.addNewReview({...formData,restaurantSlug: restaurant.slug})

        const resp = await GlobalApi.getReviews(restaurant.slug)
        setReviews(resp?.reviews || [])

        setFormData({ userName: "", userEmail: "", comment: "", rating: 1 });
      toast.success("Your review has been submitted!");
        }catch{
        toast.error("Failed to submit your review.");
        }
        


      }
  return (
    <div className='mt-8'>
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      <form  onSubmit={handleSubmit} className="space-y-3 mb-6">

         <input
          type="text"
          placeholder="Your name"
          value={formData.userName}
          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

          <input
          type="email"
          placeholder="Your email"
          value={formData.userEmail}
          onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
         
          className="border p-2 rounded w-full"
          required
        />

         <textarea
          placeholder="Write your comment..."
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />


        <input
          type="number"
          placeholder="Your rating (1-5)"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          min="1"
          max="5"
          className="border p-2 rounded w-full"
        />

        <Button type="submit" className=" text-white px-4 py-2 rounded">
          Submit Review
        </Button>
      </form>

    

      <div className='space-y-4'>
        {reviews?.map((review)=>(
            <div className='border p-3 rounded'>
                <div className='flex justify-between'>
                   <span className="font-semibold">{review.userName}</span>
               <span className="text-sm text-gray-500">⭐ {review.rating}/5</span>


                </div>

             <p>{review.comment}</p>
            </div>
        ))}
      </div>

    </div>
  )
}

export default ReviewSection
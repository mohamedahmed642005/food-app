import { UserProfile } from '@clerk/nextjs'
import React from 'react'

function User() {
  return (
    <div className='flex justify-center mt-6'><UserProfile/></div>
  )
}

export default User
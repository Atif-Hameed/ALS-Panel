import React from 'react'
import ReviewCard from './ReviewCard'

const page = () => {
  return (
    <div>
    <h1 className='text-[#0A1629] font-[700] text-[28px] mt-4 w-full sm:text-[30px] md:text-[36px]'>
    Reviews
    </h1>
<div className='flex flex-col gap-3'>
    <ReviewCard
        avatarUrl="/assets/photo.svg" // Replace with your actual image path
        name="Ryan Thompson"
        email="ryanthom@gmail.com"
        reviewText="This site looks amazing and I like it. Rayan has listed such a great application!"
        rating={4} // Example rating of 4 stars
      />
       <ReviewCard
        avatarUrl="/assets/photo.svg" // Replace with your actual image path
        name="Ryan Thompson"
        email="ryanthom@gmail.com"
        reviewText="This site looks amazing and I like it. Rayan has listed such a great application!"
        rating={4} // Example rating of 4 stars
      />
       <ReviewCard
        avatarUrl="/assets/photo.svg" // Replace with your actual image path
        name="Ryan Thompson"
        email="ryanthom@gmail.com"
        reviewText="This site looks amazing and I like it. Rayan has listed such a great application!"
        rating={4} // Example rating of 4 stars
      />
       <ReviewCard
        avatarUrl="/assets/photo.svg" // Replace with your actual image path
        name="Ryan Thompson"
        email="ryanthom@gmail.com"
        reviewText="This site looks amazing and I like it. Rayan has listed such a great application!"
        rating={4} // Example rating of 4 stars
      />
      </div>
    
    </div>
  )
}

export default page
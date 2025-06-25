import PricingPlans from '../../Components/pages/plan/pricing'
import Hero from '../../Components/pages/plan/hero'
import React from 'react'
import { getAllPlans } from '../../actions/plans.action';

const page = async ({ searchParams }) => {

  const { email, id } = await searchParams;

  const { data, error } = await getAllPlans();

  if (error) {
    return (
      <div>
        <h1 className='text-2xl text-center py-60'>Soemthing went wrong, please try again!</h1>
      </div>
    )

  }

  return (
    <div>
      <Hero />
      <PricingPlans plans={data} email={email} userId={id} />
    </div>
  )
}

export default page

import AboutUs from '../../Components/pages/about/aboutUs'
import AboutAls from '../../Components/pages/about/aboutAls'
import Hero from '../../Components/pages/about/hero'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero/>
      <AboutAls/>
      <AboutUs/>
    </div>
  )
}

export default page

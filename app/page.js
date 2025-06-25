import React from 'react'
import Hero from './Components/pages/home/hero'
import HowItWorksSection from './Components/pages/home/how-work'
import ToolsSection from './Components/pages/home/tools'
import BuildBrandSection from './Components/pages/home/build-brand'
import FAQSection from './Components/pages/home/faq'
import TestimonialsCarousel from './Components/pages/home/testimonial'
import Footer from './Components/layout/footer'
import MainPage from './Components/pages/home/main-page'

const page = () => {
  return (
    <div className='font-urbanist'>

      <MainPage />

      {/* <Hero/>
      <HowItWorksSection/>
      <ToolsSection/>
      <BuildBrandSection/>
      <FAQSection/>
      <TestimonialsCarousel/>
      <Footer/> */}
    </div>
  )
}

export default page

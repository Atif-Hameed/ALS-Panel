import Footer from '../Components/layout/footer'
import Navbar from '../Components/layout/navbar'
import Container from '../Components/shared/container'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div className='w-full h-full font-urbanist'>
      <Container className='relative '>
        <Navbar style={'z-40 absolute top-0 left-0 lg:px-16 sm:px-8 px-4'} />
      </Container>
      {children}
      <Footer />
    </div>
  )
}

export default layout

import React from 'react'
import Container from '../../shared/container'
import HeroBanner from '../../shared/hero-banner'

const Hero = ({ data }) => {
    // console.log(data)
    return (
        <Container
            parentStyle={`bg-cover md:!h-[70vh] !h-[60vh] relative bg-[url("/assets/images/profile-banner.jpg")]`}
            className={'lg:px-16 sm:px-8 px-4'}
        >
            <div className='flex items-center h-full justify-center'>
                <div className='text-white z-30 text-center'>
                    <h1 className=' md:text-7xl sm:text-6xl text-5xl font-medium '>{(data?.firstName || '-') + ' ' + (data?.lastName || '-')}</h1>
                    <p className=' sm:text-2xl text-xl'>{data?.email}</p>
                </div>
            </div>
            <div className='bg-[#033054d1] absolute w-full h-full top-0 left-0 z-10'></div>

        </Container>
    )
}

export default Hero

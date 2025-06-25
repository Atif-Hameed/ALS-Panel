import React from 'react'
import CustomImage from '../../shared/custom-image'
import Container from '../../shared/container'

const AboutAls = () => {
    return (
        <Container className='flex sm:flex-row flex-col items-center gap-6 md:py-16 py-10'>
            <div className='relative sm:w-1/2 '>
                <div className='md:w-[70%] '>
                    <CustomImage
                        alt=''  src={'/assets/images/about2.png'}
                        className={' h-full w-full rounded-md'}
                    />
                </div>
                <div className='lg:-mt-56 -mt-40 lg:-ml-10 w-full md:flex hidden justify-end items-end '>
                   <div className='p-1 bg-white'>
                    <CustomImage
                        alt='' 
                        src={'/assets/images/about1.png'}
                        className={'lg:h-[300px] md:h-[250px] object-cover w-[250px] '}
                    />
                    </div>
                </div>
            </div>

            <div className='sm:w-1/2' >
                <h1 className='lg:text-5xl md:text-4xl text-3xl md:mb-8 mb-4 font-semibold'>About ALS</h1>
                <div className='flex flex-col md:gap-6 gap-4'>
                    <p className='text-[#00000099]  font-medium  lg:text-xl md:text-lg'>ALS enhances your visibility, showcasing the true value of real estate professionals. We give you a powerful presence—both globally and in your local market—so you can attract more clients, build trust, and grow your business.</p>
                    <p className='text-[#00000099]  font-medium  lg:text-xl md:text-lg'>To be the leading platform that transforms how real estate professionals connect, market themselves, and grow their businesses—ensuring they are recognized for their value in every local and global market.</p>
                </div>
            </div>
        </Container>
    )
}

export default AboutAls

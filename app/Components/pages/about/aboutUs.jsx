import React from 'react'
import CustomImage from '../../shared/custom-image'
import Container from '../../shared/container'

const AboutUs = () => {

    const data = [
        { value: '200+', name: 'Happy Customers' },
        { value: '10k+', name: 'Properties For Clients' },
        { value: '16+', name: 'Years of Experience' },
    ]

    return (
        <Container className={'flex items-center gap-6 md:py-20 py-10 md:flex-row flex-col'}>
            <div className='md:w-1/2'>
                <h1 className='lg:text-5xl md:text-4xl text-3xl font-semibold mb-4'>About Us</h1>
                <p className='text-[#999999]'>Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary. Over the years, we've expanded our reach, forged valuable partnerships, and gained the trust of countless clients.</p>

                <div className='mt-8 flex items-center gap-4' >
                    {
                        data.map((e, i) => (
                            <div key={i} className='border border-[#A4A4A4] rounded-lg p-3' >
                                <h1 className='text-black font-semibold mb-3 lg:text-3xl md:text-2xl text-xl'>{e.value}</h1>
                                <p className='text-sm text-[#999999]'>{e.name}</p>
                            </div>
                        ))
                    }
                </div>

            </div>
            <div className='md:w-1/2 w-full p-2'>
                <CustomImage
                    alt=''
                    src={'/assets/images/about3.png'}
                    className={'w-full h-full rounded-xl'}
                />
            </div>
        </Container>
    )
}

export default AboutUs

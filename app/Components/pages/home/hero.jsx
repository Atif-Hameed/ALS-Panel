'use client'
import { useEffect } from 'react';
import Navbar from '../../layout/navbar';
import HeroBanner from '../../shared/hero-banner';
import { getUserLocation } from '../../../utils/get-location';

const Hero = () => {

    useEffect(() => {
        const storedLat = localStorage.getItem("userLat");
        const storedLng = localStorage.getItem("userLong");

        if (!storedLat || !storedLng) {
            const storeUserLocation = async () => {
                try {
                    const { latitude, longitude } = await getUserLocation();
                    localStorage.setItem("userLat", latitude.toString());
                    localStorage.setItem("userLong", longitude.toString());

                    // Only reload if location was just set
                    location.reload();
                } catch (error) {
                    console.warn("User denied location access or an error occurred:", error);
                }
            };

            storeUserLocation();
        }
    }, []);

    return (
        <HeroBanner bgStyle={'bg-[url("/assets/images/mainbanner.jpg")] lg:!h-screen md:!h-[80vh] !h-[74vh] bg-center relative'}>

            <Navbar style={'z-40 absolute top-0 left-0 lg:px-16 sm:px-8 px-4'} />

            <div className='h-full sm:mt-10 flex items-center'>
                <div className='lg:w-[60%] md:w-4/6 w-full z-30 flex flex-col items-start relative'>
                    <h1 className={'text-white z-30 md:text-left text-center xl:leading-[90px] xl:text-[85px] lg:text-7xl md:text-6xl text-4xl'}>Find the <br className='md:block hidden' />
                        <strong> Right Agent <br className='md:block hidden' /></strong>
                        for your Referral!</h1>
                    <p className='text-lightGray md:text-left text-center lg:text-lg z-30 mt-4'>
                        Connecting agents with powerful tools that showcase you and your listings beyond your local MLS, facilitating seamless referrals for lucrative fees, placing you on a global search engine where new clients can discover you.
                    </p>

                </div>
            </div>

            <div
                className="absolute w-full h-full top-0 left-0 z-20"
                style={{
                    background: 'linear-gradient(270deg, rgba(10, 22, 41, 0) -1.55%, #0A1629 97.46%)',
                    backgroundBlendMode: 'multiply',
                }}

            ></div>

        </HeroBanner>
    );
};

export default Hero;
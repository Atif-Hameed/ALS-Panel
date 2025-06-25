import Image from 'next/image';
import React from 'react';
import Container from '../../shared/container';

export default function HowItWorksSection() {

    const data = [
        { heading: 'Create Your Own Profile', para: 'Create a dynamic profile that will be seen by agents and by potentially new clients on our consumer search engine, that might have never found you before.' },
        { heading: 'View Profiles and Start Connecting', para: 'Search for agents based on your needs, post or reply to as many referrals you want, pay ZERO referral fees. Search by City, State, Zip code, Map, Name' },
        { heading: 'Building Your Network and start earning', para: 'Build a solid referral network reputation while creating a lucrative real estate side-hustle while staying in your lane of and gaining exposure to new clients all over the world.' },
    ]

    return (
            <Container className="py-16 px-4 lg:px-20">
                <div className="text-center mb-10">
                    <p className="sm:text-xl text-black font-medium">■ How it Works</p>
                    <h2 className=" md:text-3xl lg:text-4xl text-2xl font-medium mt-2">
                        Search to see if you are already in our <br className="hidden md:block" />
                        nationwide database.
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-10">
                        {
                            data.map((e, i) => (
                                <div key={i} className={`pl-4 ${i===0 ? ' border-l-4 border-blue-600' : ''}`}>
                                    <h3 className={`lg:text-3xl md:text-2xl  text-xl font-semibold relative `}>
                                        {e.heading}
                                    </h3>
                                    <p className="mt-2 text-gray-700 text-sm md:text-base">
                                        {e.para}
                                    </p>
                                </div>
                            ))
                        }
                    </div>

                    {/* Image */}
                    <div className="w-full h-full">
                        <div className="relative w-full h-96 rounded-xl overflow-hidden">
                            <Image
                                src={'/assets/images/howWork.jpg'}
                                alt="People working together"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </Container>
    );
}

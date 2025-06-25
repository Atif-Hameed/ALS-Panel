import Image from 'next/image';
import React from 'react';
import Container from '../../shared/container';

const tools = [
    'Portal Access',
    'All contact info',
    'Your profile bio',
    'Map location',
    'Calendar',
    'Classified board',
    'Agent to Agent Reviews',
    'Profile image',
    'Business images',
    'Digital business card',
];

export default function ToolsSection() {
    return (
        <Container className="lg:py-16 sm:py-8 py-4 px-4 lg:px-20 bg-white">
            <div className=" mx-auto">
                {/* Heading */}
                <h2 className="text-center text-2xl md:text-4xl lg:text-5xl font-medium sm:mb-12 mb-6">
                    Giving You Tools of the Modern Day Trade
                </h2>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-md">
                    {/* Image Section */}
                    <div className="relative w-full h-96 lg:h-auto">
                        <Image
                            src={'/assets/images/tools.jpg'}
                            alt="Modern homes"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    {/* Tools List */}
                    <div className="bg-[#E6EDF5] flex flex-col justify-center   py-6 sm:px-6 px-3 text-sm sm:text-base">
                        {tools.map((tool, index) => (
                            <div
                                key={index}
                                className="py-3 px-2 border-b border-gray-300 lg:text-xl sm:text-lg font-medium first:pt-0 last:border-none"
                            >
                                {tool}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
}

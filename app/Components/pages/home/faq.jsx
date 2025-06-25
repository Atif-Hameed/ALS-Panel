'use client'
import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import Container from '../../shared/container';
import Image from 'next/image';
import CustomImage from '../../shared/custom-image';

const faqs = [
    'How do I get started on the platform?',
    'How do I get started on the platform?',
    'How do I get started on the platform?',
    'How do I get started on the platform?',
    'How do I get started on the platform?',
];

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className='py-12'>
            <h2 className="text-3xl md:text-4xl text-center font-bold mb-8">Frequently Ask Questions</h2>

            <Container className="lg:!px-20  px-4 py-6 grid md:grid-cols-2 lg:gap-8 gap-4 items-start">

                {/* Left: FAQs */}
                <div className="space-y-4 w-full">


                    {faqs.map((question, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-md transition-all duration-300 overflow-hidden"
                        >
                            <button
                                className="w-full flex justify-between gap-2 items-center p-4 text-left"
                                onClick={() => toggle(index)}
                            >
                                <div className="flex items-center gap-3 font-semibold">
                                    <Plus className="w-5 h-5 text-[#1B1139]" />
                                    <span className="md:text-lg text-[#1B1139]">{question}</span>
                                </div>
                                <div className='bg-black text-white px-1  text-lg h-4 w-4 flex items-center justify-center leading-5 rounded-full' >
                                    {activeIndex === index ? '-' : '+'}
                                </div>

                            </button>
                            <div
                                className={`px-4 pb-4 text-sm text-gray-600 transition-all duration-300 ${activeIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                    } overflow-hidden`}
                            >
                                To get started, sign up for an account, verify your email, and follow the onboarding steps.
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Question Box */}
                <div className="flex flex-col items-center text-center">
                    <div className='py-4'>
                        <CustomImage
                            src={'/assets/images/mark.png'}
                            className={'w-64'}
                        />
                    </div>
                    <h3 className="lg:text-3xl text-2xl font-semibold mb-2">Any Question?</h3>
                    <p className="font-semibold  mb-4">You can ask anything you want to know Feedback</p>
                    <div className="w-full max-w-sm">
                        <label className="block text-sm mb-1 text-left font-semibold">Let me know</label>
                        <div className="flex border border-[#929292] overflow-hidden">
                            <input
                                type="text"
                                placeholder="Enter Here"
                                className="w-full px-3 py-2 outline-none text-sm"
                            />
                            <button className=" px-3 text-sm font-semibold">X</button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>

    );
}

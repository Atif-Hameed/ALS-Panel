'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Star } from 'lucide-react';
import Container from '../../shared/container';

const testimonials = [
    {
        name: 'Cameron Williamson',
        role: 'Designer',
        image: '/assets/images/person.png',
        quote:
            'Searches for multiplexes, property comparisons, and the loan estimator. Works great. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        name: 'Esther Howard',
        role: 'Marketing',
        image: '/assets/images/person.png',
        quote:
            'Searches for multiplexes, property comparisons, and the loan estimator. Works great. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        name: 'Devon Lane',
        role: 'Developer',
        image: '/assets/images/person.png',
        quote:
            'Searches for multiplexes, property comparisons, and the loan estimator. Works great. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
];

export default function TestimonialsCarousel() {
    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="   mx-auto mb-28">
            <Container parentStyle={'bg-white'} className=" py-8 px-4 flex items-center w-full gap-3 md:flex-row flex-col justify-between">
                <h2 className="text-3xl lg:text-[40px] font-bold mb-2">What our customers are<br className='lg:block hidden' /> saying us?</h2>
               
                <div className="flex md:justify-center justify-between md:w-auto w-full  gap-10 text-sm text-gray-600 mt-4">
                   
                    <div className="font-semibold text-black text-3xl">10m+ <span className="block text-sm text-[#1A1A1A] font-normal">Happy People</span></div>
                    
                    <div className="font-semibold text-black text-3xl">4.88
                        <div className='text-sm'>
                        <span className="block text-[#1A1A1A] font-normal ">
                            Overall rating
                        </span>
                        <span className=''>⭐⭐⭐⭐⭐</span>
                        </div>
                    </div>
                </div>
            </Container>

            <Container parentStyle={'bg-[#E6EDF5] lg:px-4 sm:px-4 px-4 '}>
                <Slider {...settings} className='w-full'>
                    {testimonials.map((t, index) => (
                        <div key={index} className="p-2 w-full">
                            <div className="bg-[#F9F9F9] min-h-[230px] p-6 py-8 rounded-lg shadow-sm h-full">
                                <div className="flex items-center gap-4 mb-4">
                                    <Image
                                        src={t.image}
                                        alt={t.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold">{t.name}</p>
                                        <p className="text-sm text-gray-500">{t.role}</p>
                                    </div>
                                    <span className="ml-auto">
                                        <svg width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.67883 37.9902C6.64234 37.9902 4.27007 36.9426 2.56204 34.8473C0.854015 32.6569 0 29.4188 0 25.1331C0 20.6569 0.99635 16.3712 2.98905 12.2759C5.07664 8.18071 8.01825 4.13309 11.8139 0.133098C11.9088 0.0378557 12.0511 -0.00976562 12.2409 -0.00976562C12.5255 -0.00976562 12.7153 0.133092 12.8102 0.418808C13 0.609282 13.0474 0.847377 12.9526 1.13309C10.6752 4.18071 9.10949 7.13309 8.25548 9.99023C7.49635 12.7521 7.11679 15.8473 7.11679 19.2759C7.11679 21.8473 7.44891 23.8473 8.11314 25.2759C8.77737 26.7045 9.67883 27.9902 10.8175 29.1331L5.40876 30.1331C5.31387 28.514 5.74088 27.2759 6.68978 26.4188C7.73358 25.5616 9.06205 25.1331 10.6752 25.1331C12.6679 25.1331 14.1861 25.7045 15.2299 26.8473C16.3686 27.9902 16.938 29.5616 16.938 31.5616C16.938 33.6569 16.2737 35.2759 14.9453 36.4188C13.7117 37.4664 11.9562 37.9902 9.67883 37.9902ZM31.5985 37.9902C28.562 37.9902 26.1898 36.9426 24.4818 34.8473C22.8686 32.6569 22.062 29.4188 22.062 25.1331C22.062 20.5616 23.0584 16.2283 25.0511 12.1331C27.0438 8.03786 29.9854 4.03785 33.8759 0.133098C33.9708 0.0378557 34.1131 -0.00976562 34.3029 -0.00976562C34.5876 -0.00976562 34.7774 0.133092 34.8723 0.418808C35.062 0.609282 35.1095 0.847377 35.0146 1.13309C32.7372 4.18071 31.1715 7.13309 30.3175 9.99023C29.5584 12.7521 29.1788 15.8473 29.1788 19.2759C29.1788 21.8473 29.4635 23.895 30.0328 25.4188C30.6971 26.8473 31.5985 28.0854 32.7372 29.1331L27.4708 30.1331C27.3759 28.514 27.8029 27.2759 28.7518 26.4188C29.7007 25.5616 31.0292 25.1331 32.7372 25.1331C34.7299 25.1331 36.2482 25.7045 37.292 26.8473C38.4307 27.9902 39 29.5616 39 31.5616C39 33.6569 38.3358 35.2759 37.0073 36.4188C35.7737 37.4664 33.9708 37.9902 31.5985 37.9902Z" fill="#1A1A1A" />
                                        </svg>

                                    </span>
                                </div>
                                <p className="text-lg text-[#1A1A1A]">{t.quote}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </Container>
        </div>
    );
}

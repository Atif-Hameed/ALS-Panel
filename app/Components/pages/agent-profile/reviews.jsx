'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SubHeading from '../../shared/sub-heading';
import { renderStars } from '../../../utils/renderStars';
import CustomInput from '../../shared/custom-input';
import CustomTextarea from '../../shared/custom-textarea';
import CustomSelect from '../../shared/custom-selector';
import Button from '../../shared/custom-btn';
import Container from '../../shared/container';
import { createReview } from '../../../actions/review.action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserDetails } from '../../../hooks/useUser';


const rating = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
];

const Reviews = ({ id, data }) => {

    const [userId, setUserId] = useState(null);
    const { data: user } = useUserDetails(userId);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [formData, setFormData] = useState({
        userId: null,
        propertyId: id,
        title: '',
        rating: 0,
        review: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);


    // Get userId from localStorage and update formData
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
                setFormData(prev => ({
                    ...prev,
                    userId: storedUserId
                }));
            }
            setIsLoading(false); // Set loading to false after check
        }
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (value) => {
        setFormData(prev => ({
            ...prev,
            rating: value
        }));
    };

    const handleSubmit = async (e) => {
        console.log("Start")
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        if (!formData.title || !formData.rating || !formData.review) {
            setError('Title, rating, and review are required');
            setLoading(false);
            return;
        }
        console.log(formData)
        try {
            const { data, error } = await createReview(formData);

            console.log(data)

            if (error) {
                setError(error);
            } else {
                setSuccess(true);
                setFormData({
                    userId: userId,
                    propertyId: id,
                    title: '',
                    rating: 0,
                    review: ''
                });
                router.refresh();
            }
        } catch (err) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        autoplaySpeed: 3000,
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

    console.log(data)

    return (
        <Container parentStyle={'bg-[#f7faff]'} className=" py-16 ">
            <div className=" mx-auto ">
                {
                    data?.data?.length > 0 &&
                    <SubHeading styles=" text-[#181A20] sm:px-6 px-2 text-start font-semibold lg:w-6/12  sm:mb-10 mb-6">
                        People Love Working with Esther Howard
                    </SubHeading>
                }

                {
                    data?.data?.length <= 3 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {data.data.map((review, index) => (
                                <div key={index} className="py-4 sm:px-4 px-2">
                                    <div className="bg-black text-white rounded-xl p-6 px-7 h-full flex flex-col justify-between shadow-lg">
                                        <div>
                                            <h3 className="font-semibold mb-4">{review.title}</h3>
                                            <p className="text-white font-semibold text-sm mb-4 line-clamp-6">“{review.review}”</p>
                                            <div className="flex items-center gap-2 mb-6">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-2 border-t border-white pt-6">
                                            <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                                                {review.userId?.profileImage ? (
                                                    <Image
                                                        src={review.userId?.profileImage}
                                                        alt={'Profile Image'}
                                                        layout="fill"
                                                        objectFit="cover"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-darkBlue text-white font-bold text-xl flex items-center justify-center">
                                                        {review.userId?.firstName?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">
                                                    {(review.userId?.firstName || '-') + ' ' + (review.userId?.lastName || '-')}
                                                </h4>
                                                <p className="text-[#717171] text-xs">{review.userId?.role || 'User'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Slider {...settings} className="h-full">
                            {data.data.map((review, index) => (
                                <div key={index} className="py-4 sm:px-4 px-2">
                                    <div className="bg-black text-white rounded-xl p-6 px-7 h-full flex flex-col justify-between shadow-lg">
                                        <div>
                                            <h3 className="font-semibold mb-4">{review.title}</h3>
                                            <p className="text-white font-semibold text-sm mb-4 line-clamp-6">“{review.review}”</p>
                                            <div className="flex items-center gap-2 mb-6">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-2 border-t border-white pt-6">
                                            <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                                                {review.image ? (
                                                    <Image
                                                        src={review.image}
                                                        alt={review.name}
                                                        layout="fill"
                                                        objectFit="cover"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-darkBlue text-white font-bold text-xl flex items-center justify-center">
                                                        {review?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">{review.name}</h4>
                                                <p className="text-[#717171] text-xs">{review.role || 'User'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    )
                }


                <div className='sm:mt-12 mt-8 sm:px-4'>
                    <SubHeading styles="text-[#181A20] text-start font-semibold sm:mb-10 mb-6">
                        Leave a Review
                    </SubHeading>


                    {isLoading ? (
                        <div className="mb-6 text-center">Loading...</div>
                    ) : !user ? (
                        <p className="mb-6">
                            If you want to post a review please{' '}
                            <Link
                                href={'/login'}
                                className='text-lg font-semibold text-blue-600 underline'
                            >
                                Login
                            </Link>{' '}
                            first
                        </p>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                                    Review submitted successfully!
                                </div>
                            )}

                            <form>
                                <div className='flex sm:flex-row flex-col items-center sm:gap-4 sm:mb-0 mb-2'>
                                    {/* <CustomInput
                                        placeholder={'Your Name'}
                                        inputStyle={'border-none placeholder:text-[#878787]'}
                                        name={'name'}
                                        value={formData.name}
                                        onChange={handleChange}
                                        inputType={'text'}
                                    /> */}
                                    <CustomInput
                                        placeholder={'Review title'}
                                        inputStyle={'border-none placeholder:text-[#878787]'}
                                        name={'title'}
                                        value={formData.title}
                                        onChange={handleChange}
                                        inputType={'text'}
                                        required
                                    />
                                    <CustomSelect
                                        selectStyle="border-none placeholder:text-[#878787]"
                                        options={rating}
                                        placeholder="Rating"
                                        label=""
                                        name={'rating'}
                                        value={formData.rating}
                                        onChange={handleRatingChange}
                                        required
                                    />
                                </div>
                                <CustomTextarea
                                    placeholder={'Write a Review'}
                                    textareaStyle={'border-none placeholder:text-[#878787]'}
                                    name={'review'}
                                    value={formData.review}
                                    onChange={handleChange}
                                    required
                                />
                                <div className='pt-6'>
                                    <Button
                                        loading={loading}
                                        loadingLabel='Submitting...'
                                        disabled={loading}
                                        onClick={(e) => handleSubmit(e)}
                                        label='Submit Review'
                                        style='bg-black text-white rounded-lg px-4 py-2'
                                    />
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default Reviews;

'use client';
import React, { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '../../shared/pagination';
import { FaArrowLeft, FaListUl, FaArrowRight } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import Image from 'next/image';
import { MdOutlineStarOutline } from "react-icons/md";
import { MdOutlineStarPurple500 } from "react-icons/md";
import CustomLink from '../../shared/custom-link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import Link from 'next/link';

const ShowPost = ({ data, filters }) => {
    const [view, setView] = useState('listing');
    const router = useRouter();
    const searchParams = useSearchParams();
    const sliderRef = useRef(null);

    console.log(data)

    const posts = data?.posts || [];
    const { currentPage, totalPages, totalItems } = data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    };

    const handlePageChange = (newPage) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', newPage.toString());
        if (filters.limit) newSearchParams.set('limit', filters.limit.toString());
        if (filters.postType) newSearchParams.set('postType', filters.postType);
        if (filters.category) newSearchParams.set('category', filters.category);
        if (filters.city) newSearchParams.set('city', filters.city);
        router.push(`/board-posts/post?${newSearchParams.toString()}`);
    };

    // react-slick settings
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        adaptiveHeight: true,
    };

    return (
        <div className="">

            <div className='flex items-center justify-between w-full py-2'>
                <h1 className="text-2xl font-bold mb-4">All Posts</h1>

                <div className="mb-6 flex space-x-4">
                    <button
                        onClick={() => setView('listing')}
                        className={`px-4 py-2 cursor-pointer rounded ${view === 'listing' ? 'bg-dark text-white' : 'bg-gray-200 text-black'
                            }`}
                    >
                        <FaListUl className='text-xl' />
                    </button>
                    <button
                        onClick={() => setView('picture')}
                        className={`px-4 cursor-pointer py-2 rounded ${view === 'picture' ? 'bg-dark text-white' : 'bg-gray-200 text-black'
                            }`}
                    >
                        <FiImage className='text-xl' />
                    </button>
                </div>
            </div>

            <div className='w-full h-full bg-white rounded-lg p-4'>
                {posts.length === 0 ? (
                    <p className="text-gray-500">No posts found.</p>
                ) : view === 'listing' ? (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post.id} className="flex gap-4 items-center">
                                <MdOutlineStarOutline className='text-2xl' />
                                <CustomLink href={`/board-post/view?id=${post.id}&post=${post?.postData?.title.replaceAll(' ', '-')}`} className="flex gap-4 items-center">
                                    <h2 className="text-lg font-semibold">{post.postData.title}</h2>
                                    <p className="text-gray-600">City: {post.postData.city}</p>
                                </CustomLink>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 grid-cols-2 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="p-2 border border-border rounded flex flex-col">
                                {post.media?.length > 0 ? (
                                    post.media.length === 1 ? (
                                        <CustomLink href={`/board-post/view?id=${post.id}&post=${post?.postData?.title.replaceAll(' ', '-')}`}>
                                            <Image
                                                src={post.media[0]}
                                                alt={post.title}
                                                width={500}
                                                height={500}
                                                className="w-full h-60 object-cover rounded mr-4"
                                            />
                                        </CustomLink>
                                    ) : (
                                        <div className="relative w-full h-60">
                                            <Slider {...sliderSettings} ref={sliderRef} className="w-full h-60">
                                                {post?.media?.map((image, index) => (
                                                    <CustomLink key={index} href={`/board-post/view?id=${post.id}&post=${post?.postData?.title.replaceAll(' ', '-')}`}>
                                                        <Image
                                                            src={image}
                                                            alt={`${post.title} - ${index + 1}`}
                                                            width={500}
                                                            height={500}
                                                            className="w-full h-60 object-cover rounded"
                                                        />
                                                    </CustomLink>
                                                ))}
                                            </Slider>
                                            <div className="absolute bottom-0 right-0 flex space-x-2 p-2">
                                                <button
                                                    onClick={() => sliderRef.current?.slickPrev()}
                                                    className="p-2 bg-white/60 cursor-pointer text-white rounded-full hover:bg-dark"
                                                >
                                                    <IoIosArrowBack className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => sliderRef.current?.slickNext()}
                                                    className="p-2 bg-white/60 cursor-pointer text-white rounded-full hover:bg-dark"
                                                >
                                                    <IoIosArrowForward className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="w-full h-60 bg-gray-200 rounded flex items-center justify-center">
                                        <p className="text-gray-500">No images</p>
                                    </div>
                                )}
                                <div className="flex-1 mt-2">
                                    <CustomLink
                                        href={`/board-post/view?id=${post.id}&post=${post?.postData?.title.replaceAll(' ', '-')}`}
                                        className="text-lg font-semibold">
                                        {post.postData.title}
                                    </CustomLink>
                                    <div className='flex items-center gap-4 text-sm py-1'>
                                        <p className=""><strong>City:</strong> {post.postData.city}</p>
                                        {post.postData?.price && (
                                            <p className=""><strong>Price:</strong> ${post.postData.price}</p>
                                        )}
                                    </div>
                                    <p className="text-sm line-clamp-3">{post.postData.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                />
                {/* <p className="text-sm text-gray-500 mt-2">
                    Showing page {currentPage} of {totalPages} (Total Posts: {totalItems})
                </p> */}
            </div>
        </div>
    );
};

export default ShowPost;
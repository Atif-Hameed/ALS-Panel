'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FiEdit } from "react-icons/fi";
import { IoPersonCircle } from "react-icons/io5";
import CustomLink from '../../shared/custom-link';
import { useUserDetails } from '../../../hooks/useUser';

const BoardPost = ({ topics }) => {

    const [userId, setUserId] = useState(null)
    const { data: user } = useUserDetails(userId);

    // Get userId from localStorage and update formData
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            }
        }
    }, []);

    // Convert the topics object into an array of {postType, categories} objects
    const postTypesWithCategories = Object.entries(topics || {}).map(([postType, categories]) => ({
        postType,
        categories
    }));

    return (
        <div>
            <div className='flex items-center w-full justify-between rounded-t-lg text-white py-2 px-4 bg-dark'>
                <h1 className='sm:text-2xl text-xl font-semiBold'>All Posts</h1>
                <div className='flex items-center gap-6'>
                    <Link href={'/board-post/create'} className='flex flex-col cursor-pointer items-center gap-1.5'>
                        <FiEdit className='text-2xl' />
                        <p className='text-xs'>Post</p>
                    </Link>
                    <Link href={`/board-post/account?userId=${userId}&user=${user?.firstName + ' ' + user?.lastName}`} className='flex flex-col cursor-pointer items-center justify-center gap-1'>
                        <IoPersonCircle className='text-3xl ' />
                        <p className='text-xs'>Account</p>
                    </Link>
                </div>
            </div>

            <div className="py-4 px-1 bg-white">
                {postTypesWithCategories.length > 0 ? (
                    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1">
                        {postTypesWithCategories.map(({ postType, categories }) => {

                            return (
                                <div key={postType} className=" rounded-lg p-4 w-full">
                                    <div className='bg-dark text-white p-2 px-4 rounded-t-lg w-full'>
                                        <h2 className="text-lg font-bold  capitalize">{postType}</h2>
                                    </div>
                                    <ul className="w-full flex flex-col gap-0 bg-gray-50 rounded-b-lg hover:bg-gray-100 transition">
                                        {categories.map((category, index) => {
                                            // Remove any text in parentheses along with the parentheses
                                            const cleanedCategory = category.replace(/\s*\(.*?\)\s*/g, '').trim();

                                            let refineCategory;
                                            if (cleanedCategory === "I'm offering an event-related service") {
                                                refineCategory = 'event-related services';
                                            } else if (cleanedCategory === "I'm selling a small number of tickets to an event") {
                                                refineCategory = 'selling tickets';
                                            } else if (cleanedCategory === "My business is having a sale") {
                                                refineCategory = 'bussiness sale';
                                            } else if (cleanedCategory === "I'm advertising a garage sale, estate sale, moving sale, flea market, or other non-corporate sale") {
                                                refineCategory = 'advertising sale';
                                            } else if (cleanedCategory === "I'm advertising a class or training session") {
                                                refineCategory = 'advertising class';
                                            } else if (cleanedCategory === "I'm advertising an event, other than the above") {
                                                refineCategory = 'advertising events';
                                            } else if (cleanedCategory === "I want to hire someone") {
                                                refineCategory = 'hiring';
                                            } else if (cleanedCategory === "I have a service to offer") {
                                                refineCategory = 'offer service';
                                            } else if (cleanedCategory === "I'm an individual seeking employment") {
                                                refineCategory = 'seeking employment';
                                            } else if (cleanedCategory === "I'm offering or advertising a service") {
                                                refineCategory = 'advertising service';
                                            } else if (cleanedCategory === "I'm offering a job") {
                                                refineCategory = 'offering job';
                                            } else if (cleanedCategory === "I'm offering childcare") {
                                                refineCategory = 'offering childcare';
                                            } else if (cleanedCategory === "food/beverage/hospitality") {
                                                refineCategory = 'hospitality';
                                            } else if (cleanedCategory === "marketing/advertising/pr") {
                                                refineCategory = 'marketing/pr';
                                            } else if (cleanedCategory === "apartments / housing for rent") {
                                                refineCategory = 'apartments/housing rent';
                                            } else {
                                                refineCategory = cleanedCategory;
                                            }

                                            return (
                                                <CustomLink
                                                    key={index}
                                                    className="px-3 py-2"
                                                    href={`/board-post/post?category=${category}&postType=${postType}`}
                                                >
                                                    <span>{refineCategory}</span>
                                                </CustomLink>
                                            );
                                        })}

                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <h1 className='text-center py-10'>No Topic Available Yet</h1>
                )}
            </div>
        </div>
    )
}

export default BoardPost
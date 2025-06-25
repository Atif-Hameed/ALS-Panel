'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { deletePost } from '../../../actions/boardPost.action';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { MdDelete } from "react-icons/md";

const Account = ({ data, userId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const router = useRouter();

    // react-slick settings for media carousel
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        adaptiveHeight: true,
    };

    // Open modal and set post ID
    const openDeleteModal = (postId) => {
        setPostIdToDelete(postId);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setPostIdToDelete(null);
    };

    // Handle post deletion
    const handleDeletePost = async () => {
        try {
            setLoading(true)
            const { data, error } = await deletePost(postIdToDelete, userId);
            console.log(data, error)
            if (error) {
                toast.error(error);
            } else {
                toast.success('Post deleted successfully');
                router.refresh();
            }
        } catch (err) {
            toast.error('Failed to delete post.');
        } finally {
            setLoading(false)
            closeModal();
        }
    };

    return (
        <div className="">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Posts</h1>

                {data?.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No posts found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((post) => (
                            <div
                                key={post._id}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
                            >
                                {/* Media */}
                                <div className="relative w-full h-60">


                                    <button
                                        onClick={() => openDeleteModal(post._id)}
                                        className="absolute top-1 right-1 cursor-pointer z-10 px-1 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                    >
                                        <MdDelete />
                                    </button>


                                    {post.media?.length > 0 ? (
                                        post.media.length === 1 ? (
                                            <Link href={`/board-post/view?id=${post._id}&post=${post.postData.title.replaceAll(' ', '-')}`}>
                                                <Image
                                                    src={post.media[0]}
                                                    alt={post.postData.title}
                                                    width={500}
                                                    height={500}
                                                    className="w-full h-60 object-cover rounded-t-lg"
                                                />
                                            </Link>
                                        ) : (
                                            <div className="relative w-full h-60">
                                                <Slider {...sliderSettings} className="w-full h-60">
                                                    {post.media.map((image, index) => (
                                                        <Link
                                                            key={index}
                                                            href={`/board-post/view?id=${post._id}&post=${post.postData.title.replaceAll(' ', '-')}`}
                                                        >
                                                            <Image
                                                                src={image}
                                                                alt={`${post.postData.title} - ${index + 1}`}
                                                                width={500}
                                                                height={500}
                                                                className="w-full h-60 object-cover rounded-t-lg"
                                                            />
                                                        </Link>
                                                    ))}
                                                </Slider>
                                                <div className="absolute bottom-4 right-4 flex space-x-2">
                                                    <button
                                                        className="p-2 bg-white/80 text-gray-800 rounded-full hover:bg-gray-200"
                                                    >
                                                        <IoIosArrowBack className="text-sm" />
                                                    </button>
                                                    <button
                                                        className="p-2 bg-white/80 text-gray-800 rounded-full hover:bg-gray-200"
                                                    >
                                                        <IoIosArrowForward className="text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="w-full h-60 bg-gray-200 rounded-t-lg flex items-center justify-center">
                                            <p className="text-gray-500">No images</p>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <Link
                                        href={`/board-post/view?id=${post._id}&post=${post.postData.title.replaceAll(' ', '-')}`}
                                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
                                    >
                                        {post.postData.title}
                                    </Link>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                        <p>{post.postData.city || 'N/A'}</p>
                                        <p>● {post.postType}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                        {post.postData.description || 'No description provided'}
                                    </p>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Confirm Deletion
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-200 cursor-pointer text-gray-800 rounded hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700 transition"
                            >
                                {loading ? 'deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;
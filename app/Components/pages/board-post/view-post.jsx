'use client';

import React from 'react';
import MediaCarousel from './_components/media-carousel';
import BoardMap from './_components/board-map';

const ViewPost = ({ data }) => {
    // Helper function to render post details, handling nested objects
    const renderPostDetails = () => {
        if (!data?.postDetails || Object.keys(data.postDetails).length === 0) {
            return <p className="text-gray-500">No additional details available</p>;
        }

        // Flatten nested objects for display
        const flattenDetails = (obj, prefix = '') => {
            const result = [];
            Object.entries(obj).forEach(([key, value]) => {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    // Handle nested objects (e.g., businessHavingSale)
                    result.push(...flattenDetails(value, `${key}.`));
                } else {
                    // Handle primitive values, arrays, or booleans
                    let displayValue = value;
                    if (Array.isArray(value)) {
                        displayValue = value.length > 0 ? value.join(', ') : 'None';
                    } else if (typeof value === 'boolean') {
                        displayValue = value ? 'Yes' : 'No';
                    } else if (value === '' || value === null || value === undefined) {
                        displayValue = 'N/A';
                    }
                    result.push({ key: `${prefix}${key}`, value: displayValue });
                }
            });
            return result;
        };

        const details = flattenDetails(data.postDetails);

        return (
            <ul className="mt-2 space-y-2">
                {details.map(({ key, value }) => (
                    <li key={key} className="flex items-start">
                        <span className="font-semibold text-gray-700 capitalize min-w-[150px]">
                            {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/\./g, ' ')
                                .trim()}
                            :
                        </span>
                        <span className="text-gray-600">{value}</span>
                    </li>
                ))}
            </ul>
        );
    };

    console.log(data)

    return (
        <div className="">
            <div className=" bg-white rounded-lg shadow-lg p-6 space-y-8">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {data?.postData?.title || 'N/A'}
                </h1>

                {/* Media and Map */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-lg overflow-hidden ">
                        <MediaCarousel images={data?.media || []} />
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-md h-[400px]">
                        <BoardMap
                            address={data?.location?.address}
                            lat={data?.location?.latitude}
                            long={data?.location?.longitude}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {data?.postData?.description || 'No description provided'}
                    </p>
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Post Information */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Post Information</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <span className="font-semibold text-gray-700 min-w-[120px]">Category:</span>
                                <span className="text-gray-600">{data?.category || 'N/A'}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-semibold text-gray-700 min-w-[120px]">Subcategory:</span>
                                <span className="text-gray-600">{data?.subCategory || 'N/A'}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-semibold text-gray-700 min-w-[120px]">Post Type:</span>
                                <span className="text-gray-600">{data?.postType || 'N/A'}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-semibold text-gray-700 min-w-[120px]">Location:</span>
                                <span className="text-gray-600">{data?.location?.address || 'N/A'}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-semibold text-gray-700 min-w-[120px]">City:</span>
                                <span className="text-gray-600">{data?.postData?.city || 'N/A'}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-semibold text-gray-700 min-w-[120px]">Zip Code:</span>
                                <span className="text-gray-600">{data?.postData?.zipCode || 'N/A'}</span>
                            </li>
                            <li className="flex items-start">
                                <span className="font-semibold text-gray-700 min-w-[120px]">Price:</span>
                                <span className="text-gray-600">
                                    {data?.postData?.price
                                        ? `$${parseFloat(data.postData.price).toLocaleString()}`
                                        : 'N/A'}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Post Details */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Post Details</h2>
                        {renderPostDetails()}
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                        <ul className="space-y-3">
                            {data?.contactInfo?.emailOption === 'show' || data?.contactInfo?.emailOption === 'default' ? (
                                <li className="flex items-start">
                                    <span className="font-semibold text-gray-700 min-w-[120px]">Email:</span>
                                    <span className="text-gray-600">{data?.contactInfo?.email || 'N/A'}</span>
                                </li>
                            ) : null}
                            {data?.contactInfo?.phoneOption === 'show' || data?.contactInfo?.phoneOption === 'default' ? (
                                <li className="flex items-start">
                                    <span className="font-semibold text-gray-700 min-w-[120px]">Phone:</span>
                                    <span className="text-gray-600">{data?.contactInfo?.phone || 'N/A'}</span>
                                </li>
                            ) : null}
                            {(data?.contactInfo?.emailOption === 'hide') &&
                                (data?.contactInfo?.phoneOption === 'hide') && (
                                    <li className="text-gray-500">No contact information available</li>
                                )}
                        </ul>
                    </div>
                </div>

                {/* Metadata */}
                <div className="text-sm text-gray-500 flex justify-between">
                    <span>
                        Posted: {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <span>
                        Updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ViewPost;
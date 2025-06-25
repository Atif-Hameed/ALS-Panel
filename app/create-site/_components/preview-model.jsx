// components/preview-modal.jsx
'use client';
import React from 'react';
import { IoMdClose } from 'react-icons/io';
import MediaCarousel from './media-carousel';
import MediaGrid from './media-grid';
import PropertyDetails from './property-details';
import MoreInfo from './more-info';
import Description from './description';
import ThreeDMediaView from './threeDMedia';
import FloorPlan from './floor-plan';
import PropertyMap from './property-map';
import Videos from './videos';
import UserPropertyData from './user-property-data';
import PropertyData from './property-data';
import UserData from './user-data';
import CustomImage from '../../Components/shared/custom-image';

const PreviewModal = ({
    isOpen,
    onClose,
    data,
    layoutSettings,
    currentColors,
    currentFont,
    sectionNavs,
    scrollToSection,
    mainContentRef,
    galleryRef,
    detailsRef,
    mapRef,
    descriptionRef,
    threeDRef,
    floorPlanRef,
    homeRef,
    videoRef
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl h-[90vh] w-[90vw] relative" style={{ backgroundColor: currentColors.backgroundColor }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[100] p-2 rounded-full bg-white shadow-md"
                >
                    <IoMdClose size={24} />
                </button>

                {/* Preview content - maintaining the exact same structure */}
                <div className='w-full relative flex divide-x divide-darkGray h-[calc(100%-55px)]'>
                    {/* Main Content */}
                    <div
                        className={`flex-1 px-4 overflow-auto lg:px-6`}
                        ref={mainContentRef}
                        style={{
                            fontFamily: currentFont.fontFamily,
                            fontWeight: currentFont.fontWeight,
                            fontStyle: currentFont.fontStyle,
                            '--heading-color': currentColors.heading,
                            '--subheading-color': currentColors.subheading,
                            '--paragraph-color': currentColors.paragraph,
                            '--listitem-color': currentColors.listItem,
                            '--link-color': currentColors.link.normal,
                            '--link-hover': currentColors.link.hover,
                            '--link-visited': currentColors.link.visited,
                            '--object-key': currentColors.objectKey,
                            '--object-value': currentColors.objectValue,
                            '--object-bg': currentColors.objectBg,
                            backgroundColor: currentColors.backgroundColor
                        }}
                    >
                        <div className={`gap-4 grid grid-cols-1`}
                        >
                            {/* User Property Data */}
                            <div className='flex justify-center'>
                                <UserPropertyData data={data?.userId} />
                            </div>

                            {/* Section Navigation Bar */}
                            <div className={`sticky top-0 z-50 w-full col-span-1  bg-white border-gray-200 pt-3`}
                                style={{ backgroundColor: currentColors.backgroundColor }}
                            >
                                <ul className=" flex overflow-x-auto space-x-2 w-full justify-between hide-scrollbar">
                                    {sectionNavs.map((item, index) => (
                                        <li key={index} className='list'>
                                            <button
                                                onClick={() => scrollToSection(item.ref)}
                                                className="whitespace-nowrap p-1.5 text-sm font-medium list cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                {item.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* home */}
                            <div ref={homeRef} className='w-full bg-red-500'>
                                <CustomImage alt='' className={'w-full'} src={data?.images[0]?.propertyImages[0]} />
                            </div>

                            {/* Property Data */}
                            <div className='w-full flex justify-center'>
                                <PropertyData layoutSettings={layoutSettings} data={data} />
                            </div>

                            {/* User Data */}
                            <div className='flex justify-center'>
                                <UserData data={data?.userId} />
                            </div>

                            <div className={`col-span-1 relative`}>
                                {/* Gallery Section */}
                                <div ref={galleryRef} className="scroll-mt-20">
                                    <div className='w-full max-w-full overflow-hidden mt-4'>
                                        {/* <MediaCarousel images={data?.images[0]?.propertyImages} /> */}
                                        <MediaGrid layoutSettings={layoutSettings} data={data?.images[0]?.propertyImages} />
                                    </div>
                                </div>

                                <div className='items-start flex-wrap grid grid-cols-2 gap-4 mt-8 w-full'>
                                    {/* Property Details Section */}
                                    <div ref={detailsRef} className="scroll-mt-20 w-full">
                                        <PropertyDetails currentColors={currentColors} layoutSettings={layoutSettings} data={data?.features[0]} />
                                    </div>

                                    {/* More Info Section */}
                                    <div className="scroll-mt-20 w-full">
                                        <MoreInfo currentColors={currentColors} layoutSettings={layoutSettings} data={data?.features[0]} />
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div ref={descriptionRef} className="scroll-mt-20 my-12">
                                    <Description layoutSettings={layoutSettings} data={data} />
                                </div>

                                {/* video Section */}
                                <div ref={videoRef} className="scroll-mt-20 mt-8">
                                    <Videos layoutSettings={layoutSettings} data={data?.videos[0]?.propertyVideoUrl} />
                                </div>

                                {/* 3D Media Section */}
                                <div ref={threeDRef} className="scroll-mt-20 mt-8">
                                    <ThreeDMediaView layoutSettings={layoutSettings} data={data?.otherMedia} />
                                </div>

                                {/* Floor Plan Section */}
                                <div ref={floorPlanRef} className="scroll-mt-20 mt-8">
                                    <FloorPlan layoutSettings={layoutSettings} data={data?.floorPlans} />
                                </div>
                            </div>

                            {/* map */}
                            {(data?.address1 || data?.address2 || data?.displayAddress) && (
                                <div className='w-full flex justify-center'>
                                <div ref={mapRef} className={`w-5/6 pt-10`}>
                                    <PropertyMap layoutSettings={layoutSettings} address={data?.address1 || data?.address2 || data?.displayAddress} city={data?.city} />
                                </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
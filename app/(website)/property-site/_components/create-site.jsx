'use client'
import React, { useEffect, useRef, useState } from 'react'
import MediaCarousel from '../../../create-site/_components/media-carousel';
import PropertyDetails from '../../../create-site/_components/property-details';
import MoreInfo from '../../../create-site/_components/more-info';
import Description from '../../../create-site/_components/description';
import ThreeDMediaView from '../../../create-site/_components/threeDMedia';
import FloorPlan from '../../../create-site/_components/floor-plan';
import PropertyMap from '../../../create-site/_components/property-map';
import CustomImage from '../../../Components/shared/custom-image';
import UserData from '../../../create-site/_components/user-data';
import PropertyData from '../../../create-site/_components/property-data';
import MediaGrid from '../../../create-site/_components/media-grid';
import Videos from '../../../create-site/_components/videos';
import UserPropertyData from '../../../create-site/_components/user-property-data';

const CreateSite = ({ data, initialSettings }) => {

    // console.log(initialSettings)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    // Initialize state with initialSettings or defaults
    const [layoutSettings, setLayoutSettings] = useState(initialSettings?.layoutSettings || {
        textAlignment: 'left',
        galleryLayout: 'gridView',
        detailLayout: 'sideByside'
    });
    const [selectedTheme, setSelectedTheme] = useState(initialSettings?.currentTheme || 'light');
    const [currentFont, setCurrentFont] = useState(initialSettings?.fontSettings || {
        fontFamily: 'Inter',
        bodyFont: 'Inter',
        headlineFont: 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontImportUrl: ''
    });
    const [currentColors, setCurrentColors] = useState(initialSettings?.colorSettings || {
        heading: '#000000',
        subheading: '#000000',
        paragraph: '#000000',
        listItem: '#000000',
        link: {
            normal: '#0066cc',
            hover: '#004499',
            visited: '#551a8b'
        },
        objectKey: '#000000',
        objectValue: '#000000',
        objectBg: '#eff6ff',
        backgroundColor: '#ffffff',
    });

    // Refs for each section
    const homeRef = useRef(null);
    const galleryRef = useRef(null);
    const detailsRef = useRef(null);
    const mapRef = useRef(null);
    const descriptionRef = useRef(null);
    const threeDRef = useRef(null);
    const floorPlanRef = useRef(null);
    const mainContentRef = useRef(null);
    const videoRef = useRef(null);

    const sectionNavs = [
        { name: 'Home', ref: homeRef },
        { name: 'Gallery', ref: galleryRef },
        { name: 'Details', ref: detailsRef },
        { name: 'Description', ref: descriptionRef },
        { name: 'Video', ref: videoRef },
        { name: '3D View', ref: threeDRef },
        { name: 'Floor Plan', ref: floorPlanRef },
        { name: 'Map', ref: mapRef },
    ];

    // Check screen size and toggle mobile view state
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (currentFont?.fontImportUrl) {
            const link = document.createElement('link');
            link.href = currentFont.fontImportUrl;
            link.rel = 'stylesheet';
            document.head.appendChild(link);

            return () => {
                document.head.removeChild(link);
            };
        }
    }, [currentFont.fontImportUrl]);

    const scrollToSection = (ref) => {
        ref?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const detailStyle = layoutSettings.detailLayout === 'column' ? 'grid-cols-1' :
        layoutSettings.detailLayout === 'sideByside' ? 'sm:grid-cols-2 grid-cols-1' :
            'grid-cols-1';

    return (
        <div className='rounded-xl h-full relative'>
            <div className='w-full relative flex h-full'>
                {/* Main Content */}
                <div
                    ref={mainContentRef}
                    className={`flex-1 px-4 h-full  lg:px-6 ${isMobileView && isSidebarOpen ? 'opacity-30 pointer-events-none' : ''}`}
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
                    <div className={`gap-4 grid grid-cols-1 `}>
                        <div className='flex justify-center'>
                            <UserPropertyData data={data?.userId} />
                        </div>

                        {/* Section Navigation Bar */}
                        <div className={`sticky top-0 z-50 w-full col-span-1   bg-white border-gray-200 pt-3 pb-2`}
                            style={{ backgroundColor: currentColors.backgroundColor }}
                        >
                            <ul className="flex overflow-x-auto space-x-2 w-full justify-between hide-scrollbar">
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
                        <div ref={homeRef} className='w-full'>
                            <CustomImage alt='' className={'w-full h-screen object-cover'} src={data?.images[0]?.propertyImages[0]} />
                        </div>

                        <div className='w-full flex justify-center'>
                            <PropertyData layoutSettings={layoutSettings} data={data} />
                        </div>

                        <div className='flex justify-center'>
                            <UserData data={data?.userId} />
                        </div>

                        <div className={`col-span-1 relative `}>
                            {/* Gallery Section */}
                            <div ref={galleryRef} className={`scroll-mt-20 w-full flex justify-center `}>
                                <div className=' max-w-full overflow-hidden mt-4 md:w-5/6 w-full'>
                                    {layoutSettings?.galleryLayout === 'carouselView' ? (
                                        <MediaCarousel layoutSettings={layoutSettings} images={data?.images[0]?.propertyImages} />
                                    ) : (
                                        <MediaGrid layoutSettings={layoutSettings} data={data?.images[0]?.propertyImages} />
                                    )}
                                </div>
                            </div>

                            <div className='w-full flex justify-center'>
                                <div className={`items-start flex-wrap grid ${detailStyle} gap-4 mt-8 md:w-5/6 w-full`}>
                                    {/* Property Details Section */}
                                    <div ref={detailsRef} className="scroll-mt-20 w-full h-full">
                                        <PropertyDetails layoutSettings={layoutSettings} currentColors={currentColors} data={data?.features[0]} />
                                    </div>

                                    {/* More Info Section */}
                                    <div className="scroll-mt-20 w-full h-full">
                                        <MoreInfo layoutSettings={layoutSettings} currentColors={currentColors} data={data?.features[0]} />
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className='w-full flex justify-center'>
                                <div ref={descriptionRef} className="scroll-mt-20 my-12 md:w-5/6 w-full">
                                    <Description layoutSettings={layoutSettings} data={data} />
                                </div>
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
                        <div className='flex justify-center'>
                            {(data?.address1 || data?.address2 || data?.displayAddress) && (
                                <div ref={mapRef} className={`w-full pt-10`}>
                                    <PropertyMap layoutSettings={layoutSettings} address={data?.address1 || data?.address2 || data?.displayAddress} city={data?.city} />
                                </div>
                            )}
                        </div>

                        <style jsx>{`
                            .hide-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                            .hide-scrollbar {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateSite;
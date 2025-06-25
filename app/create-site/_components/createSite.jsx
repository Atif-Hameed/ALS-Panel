'use client'
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { IoMdArrowDropdown, IoMdClose } from 'react-icons/io'
import MediaCarousel from './media-carousel';
import PropertyDetails from './property-details';
import MoreInfo from './more-info';
import Description from './description';
import ThreeDMediaView from './threeDMedia';
import FloorPlan from './floor-plan';
import PropertyMap from './property-map';
import FontSelector from './font-selection';
import ColorSelector from './color-selection';
import LayoutSelection from './layout-selection';
import ThemeSelector from './theme-selection';
import PreviewModal from './preview-model';
import { useRouter } from 'next/navigation';
import { createPropertySite, getPropertySiteSettings } from '../../actions/property.action';
import CustomImage from '../../Components/shared/custom-image';
import UserData from './user-data';
import PropertyData from './property-data';
import MediaGrid from './media-grid';
import Videos from './videos';
import UserPropertyData from './user-property-data';

const CreateSite = ({ data, propertyId }) => {
    const [activeNav, setActiveNav] = useState('Themes');
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [layoutSettings, setLayoutSettings] = useState({
        textAlignment: 'left',
        galleryLayout: 'gridView',
        detailLayout: 'sideByside'
    });
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const router = useRouter();
    const [currentFont, setCurrentFont] = useState({
        fontFamily: 'Inter',
        bodyFont: 'Inter',
        headlineFont: 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontImportUrl: ''
    });
    const [currentColors, setCurrentColors] = useState({
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
    // State to hold the property site data
    const [siteData, setSiteData] = useState({
        currentTheme: 'light',
        layoutSettings: 'grid',
        fontSettings: {
            fontFamily: 'Inter',
            bodyFont: 'Inter',
            headlineFont: 'Inter',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontImportUrl: ''
        },
        colorSettings: {
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
            objectBg: '#ffffff',
            backgroundColor: '#ffffff',
        }
    });

    // scrol to gallery
    const scrollToGallery = () => {
        scrollToSection(galleryRef);
    };

    // scrol to details
    const scrollToDetails = () => {
        scrollToSection(detailsRef);
    };

    // Get userId from localStorage and create property site on component mount
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);

            // Call createPropertySite API
            const createSite = async () => {
                try {
                    const { data, error } = await createPropertySite(propertyId, storedUserId, siteData);
                    if (error) {
                        console.error('Error creating property site:', error);
                    } else {
                        console.log('Property site created successfully:', data);
                        // Update state with the created site settings
                        if (data?.data) {
                            setSelectedTheme(data.data.currentTheme);
                            setLayoutSettings(data.data.layoutSettings);
                            setCurrentFont(data.data.fontSettings);
                            setCurrentColors(data.data.colorSettings);
                        }
                    }
                } catch (err) {
                    console.error('Error in createSite:', err);
                }
            };

            createSite();
        }
    }, [propertyId]);

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

    const navs = [
        { name: 'Themes', value: 'Themes' },
        { name: 'Layout', value: 'Layout' },
        { name: 'Colors', value: 'Colors' },
        { name: 'Fonts', value: 'Fonts' },
        { name: 'Launch', value: 'Launch' },
    ];

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

    useEffect(() => {
        const loadInitialSettings = async () => {
            try {
                const { data, error } = await getPropertySiteSettings(propertyId);
                const settings = data?.data;
                // console.log("Colorssssssssssssssss ", settings)
                if (settings) {
                    if (settings.fontSettings) {
                        setCurrentFont(settings.fontSettings);
                    }
                    if (settings.colorSettings) {
                        setCurrentColors(settings.colorSettings);
                    }
                    if (settings.currentTheme) {
                        setSelectedTheme(settings.currentTheme);
                    }
                    if (settings.layoutSettings) {
                        setLayoutSettings(settings.layoutSettings);
                    }
                }
            } catch (error) {
                console.error('Error loading initial settings:', error);
            }
        };

        loadInitialSettings();
    }, [propertyId]);

    const renderSidebarContent = () => {
        switch (activeNav) {
            case 'Themes':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Select a Theme</h2>
                        <ThemeSelector
                            propertyId={propertyId}
                            UserId={userId}
                            currentTheme={selectedTheme}
                            setCurrentTheme={setSelectedTheme}
                            currentColors={currentColors}
                            setCurrentColors={setCurrentColors}
                            currentFont={currentFont}
                            setCurrentFont={setCurrentFont}
                        />
                    </div>
                );
            case 'Layout':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Layout Settings</h2>
                        <LayoutSelection
                            userId={userId}
                            propertyId={propertyId}
                            layoutSettings={layoutSettings}
                            setLayoutSettings={setLayoutSettings}
                            scrollToGallery={scrollToGallery}
                            scrollToDetails={scrollToDetails}
                        />
                    </div>
                );
            case 'Colors':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Color Settings</h2>
                        <ColorSelector
                            userId={userId}
                            propertyId={propertyId}
                            currentColors={currentColors}
                            setCurrentColors={setCurrentColors}
                        />
                    </div>
                );
            case 'Fonts':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Font Settings</h2>
                        <FontSelector
                            userId={userId}
                            propertyId={propertyId}
                            currentFont={currentFont}
                            setCurrentFont={setCurrentFont}
                        />
                    </div>
                );
            case 'Launch':
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Launch Your Site</h2>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-medium text-blue-800">Ready to go live?</h3>
                            <p className="text-sm text-blue-600 mt-1">Review your settings and publish your property listing.</p>
                            <button
                                onClick={() => router.push(`/property-site?id=${propertyId}`)}
                                className="mt-4 bg-blue cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
                            >
                                Publish Now
                            </button>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-800 mb-2">Settings Summary</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li><strong>Theme:</strong> {selectedTheme || 'Not selected'}</li>

                                <li>
                                    <strong>Layout:</strong>
                                    <ul className="ml-4 list-disc">
                                        <li><strong>Text Alignment:</strong> {layoutSettings?.textAlignment || 'N/A'}</li>
                                        <li><strong>Gallery Layout:</strong> {layoutSettings?.galleryLayout || 'N/A'}</li>
                                        <li><strong>Detail Layout:</strong> {layoutSettings?.detailLayout || 'N/A'}</li>
                                    </ul>
                                </li>

                                <li>
                                    <strong>Font:</strong>
                                    <ul className="ml-4 list-disc">
                                        <li><strong>Font Family:</strong> {currentFont?.fontFamily || 'N/A'}</li>
                                    </ul>
                                </li>

                                <li>
                                    <strong>Primary Colors:</strong>
                                    <ul className="ml-4 list-disc">
                                        <li><span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: currentColors?.heading }}></span>Heading: {currentColors?.heading}</li>
                                        <li><span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: currentColors?.paragraph }}></span>Paragraph: {currentColors?.paragraph}</li>
                                        <li><span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: currentColors?.backgroundColor }}></span>Background: {currentColors?.backgroundColor}</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                );

            default:
                return <p>Select an option from the menu</p>;
        }
    };

    const handleNavClick = (value) => {
        if (activeNav === value) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setActiveNav(value);
            if (isMobileView && !isSidebarOpen) {
                setIsSidebarOpen(true);
            }
        }
    };

    const scrollToSection = (ref) => {
        if (ref?.current && mainContentRef?.current) {
            const elementPosition = ref.current.getBoundingClientRect().top;
            const mainContentPosition = mainContentRef.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition - mainContentPosition - 20;

            mainContentRef.current.scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // console.log(layoutSettings)

    // console.log(data)

    const detailStyle = layoutSettings?.detailLayout === 'column' ? 'grid-cols-1' : layoutSettings?.detailLayout === 'sideByside' ? 'sm:grid-cols-2 grid-cols-1' : ' grid-cols-1'

    return (
        <div className='rounded-xl h-screen overflow-hidden relative'>
            {/* top navs */}
            <div className='flex items-center  justify-between w-full border-b border-[#CBD5E1]  gap-3 p-4 lg:px-6'>
                <div className='xs:flex grid xxs:grid-cols-3 grid-cols-2  items-center gap-3 sm:justify-between sm:w-3/5 sm:flex-nowrap flex-wrap'>
                    {navs.map((e, i) => (
                        <button
                            key={i}
                            onClick={() => handleNavClick(e.value)}
                            className={`hover:text-blue-600 text-sm ${activeNav === e.value ? 'text-blue-600 ' : 'text-black'} cursor-pointer`}
                        >
                            {e.name}
                        </button>
                    ))}
                </div>
                <button onClick={() => setIsPreviewOpen(true)} className='flex cursor-pointer hover:text-blue-600 items-center gap-2'>Preview</button>
            </div>

            <div className='w-full relative overflow-hidden flex divide-x divide-[#CBD5E1] h-[calc(100%-55px)]'>
                {/* Sidebar */}
                <div
                    className={`xl:w-3/12 md:w-4/12  transition-all h-[calc(100vh-55px)] duration-300 bg-white ease-in-out ${isMobileView
                        ? `absolute top-0  h-full w-3/4 z-10 shadow-xl transform ${isSidebarOpen ? 'translate-x-0 left-0' : '-translate-x-full -left-10'
                        }`
                        : ''
                        }`
                    }
                >
                    <div className='p-4 lg:px-6  h-full overflow-auto relative'>
                        {isMobileView && (
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-20'
                            >
                                <IoMdClose size={24} />
                            </button>
                        )}
                        {renderSidebarContent()}
                    </div>
                </div>

                {/* Main Content */}
                <div
                    ref={mainContentRef}
                    className={`flex-1 px-4 overflow-auto lg:px-6 ${isMobileView && isSidebarOpen ? 'opacity-30 pointer-events-none' : ''}`}
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

                        <div className='flex justify-center'>
                            <UserPropertyData data={data?.userId} />
                        </div>

                        {/* Section Navigation Bar */}
                        <div className={`sticky top-0 z-50 w-full col-span-1   bg-white border-gray-200 pt-3`}
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
                        <div ref={homeRef} className='w-full' >
                            {data?.images[0]?.propertyImages[0] &&
                                <CustomImage className={'!w-full'} alt='' src={data?.images[0]?.propertyImages[0]} />
                            }

                        </div>

                        <div className='w-full flex justify-center'>
                            <PropertyData layoutSettings={layoutSettings} data={data} />
                        </div>

                        <div className='flex justify-center'>
                            <UserData data={data?.userId} />
                        </div>

                        <div className={`col-span-1 relative`}>
                            {/* Gallery Section */}
                            <div ref={galleryRef} className="scroll-mt-20">
                                {/* <h1 className='lg:text-[28px] headings text-2xl font-semibold'>{data?.propertyName}</h1>
                                <p className='paragraph'>{data?.address1}</p> */}
                                <div className='w-full max-w-full overflow-hidden mt-4'>
                                    {
                                        layoutSettings?.galleryLayout === 'carouselView' ?
                                            <MediaCarousel layoutSettings={layoutSettings} images={data?.images[0]?.propertyImages} />
                                            :
                                            <MediaGrid layoutSettings={layoutSettings} data={data?.images[0]?.propertyImages} isWeb={false} />
                                    }
                                </div>
                            </div>

                            <div className={`items-start flex-wrap grid ${detailStyle} gap-4 mt-8 w-full`}>
                                {/* Property Details Section */}
                                <div ref={detailsRef} className="scroll-mt-20  w-full">
                                    <PropertyDetails layoutSettings={layoutSettings} currentColors={currentColors} data={data?.features[0]} />
                                </div>

                                {/* More Info Section */}
                                <div className="scroll-mt-20  w-full">
                                    <MoreInfo layoutSettings={layoutSettings} currentColors={currentColors} data={data?.features[0]} />
                                </div>
                            </div>

                            {/* Description Section */}
                            <div ref={descriptionRef} className="scroll-mt-20 my-12">
                                <Description layoutSettings={layoutSettings} data={data} />
                            </div>

                            {/* video Section */}
                            {
                                data?.videos[0]?.propertyVideoUrl &&
                                <div ref={videoRef} className="scroll-mt-20 mt-8">
                                    <Videos layoutSettings={layoutSettings} data={data?.videos[0]?.propertyVideoUrl} />
                                </div>
                            }


                            {/* 3D Media Section */}
                            {
                                data?.otherMedia &&
                                <div ref={threeDRef} className="scroll-mt-20 mt-8">
                                    <ThreeDMediaView layoutSettings={layoutSettings} data={data?.otherMedia} />
                                </div>
                            }


                            {/* Floor Plan Section */}
                            {
                                data?.floorPlans &&
                                <div ref={floorPlanRef} className="scroll-mt-20 mt-8">
                                    <FloorPlan layoutSettings={layoutSettings} data={data?.floorPlans} />
                                </div>
                            }

                        </div>

                        {/* map */}
                        <div className='flex justify-center'>
                            {
                                (data?.address1 || data?.address2 || data?.displayAddress) &&
                                <div ref={mapRef} className={`w-full pt-10`}>
                                    <PropertyMap layoutSettings={layoutSettings} address={data?.address1 || data?.address2 || data?.displayAddress} city={data?.city} />
                                </div>
                            }
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

            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                data={data}
                videoRef={videoRef}
                layoutSettings={layoutSettings}
                currentColors={currentColors}
                currentFont={currentFont}
                sectionNavs={sectionNavs}
                scrollToSection={scrollToSection}
                mainContentRef={mainContentRef}
                galleryRef={galleryRef}
                detailsRef={detailsRef}
                mapRef={mapRef}
                descriptionRef={descriptionRef}
                threeDRef={threeDRef}
                floorPlanRef={floorPlanRef}
                homeRef={homeRef}
            />

        </div>
    )
}

export default CreateSite;
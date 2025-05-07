'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { IoMdArrowDropdown, IoMdClose } from 'react-icons/io'

const CreateSite = ({ data, propertyId }) => {

    const [activeNav, setActiveNav] = useState('Themes');
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedFont, setSelectedFont] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    console.log(data)

    const navs = [
        { name: 'Themes', value: 'Themes' },
        { name: 'Layout', value: 'Layout' },
        { name: 'Colors', value: 'Colors' },
        { name: 'Fonts', value: 'Fonts' },
        { name: 'Launch', value: 'Launch' },
    ]

    const themes = [
        { id: 1, name: 'Modern', thumbnail: '/assets/p-1.jpg' },
        { id: 2, name: 'Classic', thumbnail: '/assets/p-2.jpg' },
        { id: 3, name: 'Minimal', thumbnail: '/assets/p-3.jpg' },
    ];

    const layouts = [
        { id: 1, name: 'Single Column', description: 'All content in one vertical column' },
        { id: 2, name: 'Two Column', description: 'Content split into two columns' },
        { id: 3, name: 'Gallery Focus', description: 'Large images with details below' },
    ];

    const colors = [
        { id: 1, name: 'Blue', value: '#3b82f6' },
        { id: 2, name: 'Green', value: '#10b981' },
        { id: 3, name: 'Red', value: '#ef4444' },
    ];

    const fonts = [
        { id: 1, name: 'Roboto', example: 'The quick brown fox' },
        { id: 2, name: 'Open Sans', example: 'The quick brown fox' },
        { id: 3, name: 'Montserrat', example: 'The quick brown fox' },
    ];

    // Check screen size and toggle mobile view state
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768); // md breakpoint is 768px in Tailwind
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const renderSidebarContent = () => {
        switch (activeNav) {
            case 'Themes':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Select a Theme</h2>
                        <div className="grid grid-cols-2 lg:gap-4 gap-2">
                            {themes.map(theme => (
                                <div
                                    key={theme.id}
                                    className={`border rounded-lg p-2 cursor-pointer ${selectedTheme === theme.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                                    onClick={() => setSelectedTheme(theme.id)}
                                >
                                    <div className="lg:h-32 h-24 rounded-md mb-2">
                                        <Image alt='' src={theme.thumbnail} className='w-full h-full object-cover rounded-md' width={500} height={500} />
                                    </div>
                                    <p className="text-center lg:text-base text-sm">{theme.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Layout':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Select a Layout</h2>
                        {layouts.map(layout => (
                            <div
                                key={layout.id}
                                className={`p-4 border rounded-lg cursor-pointer ${selectedLayout === layout.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                onClick={() => setSelectedLayout(layout.id)}
                            >
                                <h3 className="font-medium">{layout.name}</h3>
                                <p className="text-sm text-gray-600">{layout.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'Colors':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Select Color Scheme</h2>
                        <div className="flex flex-wrap gap-3">
                            {colors.map(color => (
                                <div
                                    key={color.id}
                                    className={`w-12 h-12 rounded-full cursor-pointer ${selectedColor === color.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setSelectedColor(color.id)}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'Fonts':
                return (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Select Font Family</h2>
                        {fonts.map(font => (
                            <div
                                key={font.id}
                                className={`p-3 border rounded-lg cursor-pointer ${selectedFont === font.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                onClick={() => setSelectedFont(font.id)}
                            >
                                <p className="text-lg" style={{ fontFamily: font.name }}>{font.example}</p>
                                <p className="text-sm text-gray-600 mt-1">{font.name}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'Launch':
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Launch Your Site</h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-medium text-blue-800">Ready to go live?</h3>
                            <p className="text-sm text-blue-600 mt-1">Review your settings and publish your property listing.</p>
                            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">
                                Publish Now
                            </button>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium">Settings Summary</h3>
                            <ul className="mt-2 space-y-2 text-sm">
                                <li>Theme: {themes.find(t => t.id === selectedTheme)?.name || 'Not selected'}</li>
                                <li>Layout: {layouts.find(l => l.id === selectedLayout)?.name || 'Not selected'}</li>
                                <li>Color: {colors.find(c => c.id === selectedColor)?.name || 'Not selected'}</li>
                                <li>Font: {fonts.find(f => f.id === selectedFont)?.name || 'Not selected'}</li>
                            </ul>
                        </div>
                    </div>
                );
            default:
                return <p>Select an option from the menu</p>;
        }
    };

    // Close sidebar when clicking on a nav item in mobile view
    const handleNavClick = (value) => {
        // Toggle sidebar if clicking the same nav item
        if (activeNav === value) {
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setActiveNav(value);
            // Only auto-open if in mobile view and closed
            if (isMobileView && !isSidebarOpen) {
                setIsSidebarOpen(true);
            }
        }
    };


    return (
        <div className='bg-white rounded-xl h-[78vh] relative'>
            {/* top navs */}
            <div className='flex items-center justify-between w-full gap-3 p-4 lg:px-6'>
                <div className='xs:flex grid xxs:grid-cols-3 grid-cols-2 items-center gap-3 sm:justify-between sm:w-3/5 sm:flex-nowrap flex-wrap'>
                    {navs.map((e, i) => (
                        <button
                            key={i}
                            onClick={() => handleNavClick(e.value)}
                            className={`hover:text-blue-600 ${activeNav === e.value ? 'text-blue-600 underline' : 'text-black'} cursor-pointer hover:underline`}
                        >
                            {e.name}
                        </button>
                    ))}
                </div>
                <button className='flex items-center gap-2'>Preview <IoMdArrowDropdown /></button>
            </div>

            <div className='w-full relative flex gap-4 divide-x divide-darkGray h-[calc(100%-55px)]'>
                {/* Sidebar */}
                <div
                    className={`xl:w-3/12 md:w-4/12 bg-white transition-all duration-300 ease-in-out ${
                        isMobileView
                            ? `absolute top-0  h-full w-3/4 z-10 shadow-xl transform ${
                                  isSidebarOpen ? 'translate-x-0 left-0' : '-translate-x-full -left-10'
                              }`
                            : ''
                    }`}
                >
                    <div className='p-4 lg:px-6 overflow-auto h-full relative'>
                        {/* Close button for mobile */}
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
                <div className={`flex-1 p-4 lg:px-6 ${
                    isMobileView && isSidebarOpen ? 'opacity-30 pointer-events-none' : ''
                }`}>
                    <h1>Will Work</h1>
                </div>

            </div>
        </div>
    )
}

export default CreateSite

'use client'
import React, { useEffect, useState } from 'react'
import logo from '../../../public/assets/images/logo.svg'
import CustomImage from '../shared/custom-image'
import CustomLink from '../shared/custom-link'
import Button from '../shared/custom-btn'
import Link from 'next/link'
import { useUserDetails } from '../../hooks/useUser'

const Navbar = ({ style }) => {
    const [isOpen, setIsOpen] = useState(false)
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
    const navs = [
        { name: 'Search Agents', src: '/agent-search' },
        { name: 'About', src: '#' },
        { name: 'Contact', src: '#' },
        { name: 'Login', src: '/login' },
    ]

    return (
        <div className={`w-full sm:py-6 py-4  flex items-center justify-between  ${style}`}>
            <Link href={'/'}>
                <CustomImage
                    src={logo}
                    className={'lg:h-20 h-16 w-fit'}
                />
            </Link>

            {/* Desktop Navigation (hidden on mobile) */}
            <div className='hidden md:flex items-center xl:gap-10 lg:gap-8 gap-6 bg-lightDark z-50 whitespace-nowrap rounded-full px-8 py-2.5 justify-between'>
                {navs.map((e, i) => (

                    <CustomLink
                        key={i}
                        href={e.src}
                        className={'text-white'}
                    >
                        {e.name}
                    </CustomLink>
                ))}
            </div>

            {/* Mobile Menu Button  */}
            <button
                className='md:hidden text-white focus:outline-none'
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Desktop Button (hidden on mobile) */}
            <Link href={user ? '/dashboard' : '/login'} className='hidden md:block'>
                <Button
                    label='Claim Your Listing'
                    style=' bg-black/65 !text-white rounded-full !px-4 border-none whitespace-nowrap'
                />
            </Link>

            {/* Mobile Menu (slides in from left) */}
            <div className={`
                fixed top-0 left-0 h-full w-64 bg-darkBlue z-50 transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:hidden
            `}>
                <div className="flex flex-col h-full pt-6 gap-6 px-6">
                    <Link href={'/'}>
                        <CustomImage
                            src={logo}
                            className={'lg:h-20 h-16 w-fit'}
                        />
                    </Link>
                    {navs.map((e, i) => (
                        <CustomLink
                            key={i}
                            href={e.src}
                            className={'text-white py-4 border-b border-gray-700'}
                            onClick={() => setIsOpen(false)}
                        >
                            {e.name}
                        </CustomLink>
                    ))}
                    <Link href={user ? '/dashboard' : '/login'} >
                        <Button
                            label='Claim Your Listing'
                            style='mt-4 bg-black/65 !text-white rounded-full !px-4 border-none whitespace-nowrap'
                            onClick={() => setIsOpen(false)}
                        />
                    </Link>
                </div>
            </div>

            {/* Overlay when mobile menu is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}

export default Navbar
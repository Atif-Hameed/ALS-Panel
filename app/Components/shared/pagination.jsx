'use client'
import React, { useRef, useEffect } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import Button from './custom-btn'


const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    visiblePages = 4
}) => {
    const pageListRef = useRef(null)

    // Calculate the range of visible pages
    const getVisiblePages = () => {
        let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2))
        let endPage = startPage + visiblePages - 1

        if (endPage > totalPages) {
            endPage = totalPages
            startPage = Math.max(1, endPage - visiblePages + 1)
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
    }

    // Scroll to keep current page in view
    useEffect(() => {
        if (pageListRef.current) {
            const activeButton = pageListRef.current.querySelector(
                `button[data-page="${currentPage}"]`
            )
            if (activeButton) {
                activeButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                })
            }
        }
    }, [currentPage])

    if (totalPages <= 1) return null

    return (
        <div className="flex justify-between items-center mt-2">
            <Button
                label=""
                style={`${currentPage <= 1 ? 'bg-black/60' : 'bg-black'} text-white sm:!px-4 !px-2 sm:!py-2 !py-1 rounded-md flex items-center gap-2`}
                icon={<FaArrowLeft />}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            />

            <div className=" overflow-hidden">
                <div
                    ref={pageListRef}
                    className="flex gap-2 overflow-x-auto py-2 px-4 scrollbar-hide"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {getVisiblePages().map((pageNum) => (
                        <Button
                            key={pageNum}
                            data-page={pageNum}
                            label={pageNum.toString()}
                            style={`flex-shrink-0 sm:!px-4 !px-2 sm:!py-1.5 !py-1 sm:text-base text-xs rounded-md scroll-snap-align-center ${currentPage === pageNum
                                ? 'bg-black text-white'
                                : 'bg-gray-300 text-black hover:bg-gray-300'
                                }`}
                            onClick={() => onPageChange(pageNum)}
                        />
                    ))}
                </div>
            </div>

            <Button
                label=""
                style={` ${currentPage >= totalPages ? 'bg-black/60' : 'bg-black'} text-white sm:!px-4 !px-2 sm:!py-2 !py-1 rounded-md flex items-center gap-2`}
                icon={<FaArrowRight />}
                iconPosition="right"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            />
        </div>
    )
}

export default Pagination
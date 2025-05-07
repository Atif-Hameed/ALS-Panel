'use client'
import Container from '../../shared/container'
import { AreaIcon, BathIcon, BedIcon } from '../../../../public/assets/svgs/index'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import Pagination from '../../shared/pagination'

const Properties = ({ properties = [], reviews = [], meta = {}, currentPage = 1, currentLimit = 6 }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.push(`?${params.toString()}`, { scroll: false })
    }

    // Icon mapping with improved accessibility
    const iconMap = {
        area: <AreaIcon className="w-4 h-4" aria-hidden="true" />,
        bed: <BedIcon className="w-4 h-4" aria-hidden="true" />,
        bath: <BathIcon className="w-4 h-4" aria-hidden="true" />
    }

    // Safely check pagination conditions
    const showPagination = meta?.totalPages > 1

    // Default property details configuration
    const getPropertyDetails = (property) => [
        { 
            label: property?.features?.buildingSize ? `${property.features.buildingSize} sq.ft` : 'N/A', 
            type: 'area' 
        },
        { 
            label: property?.features?.bedrooms ? `${property.features.bedrooms} Bed` : 'N/A', 
            type: 'bed' 
        },
        { 
            label: property?.features?.bathrooms ? `${property.features.bathrooms} Bath` : 'N/A', 
            type: 'bath' 
        }
    ]

    if (properties.length === 0) {
        return (
            <Container className="py-8">
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-600">
                        No property found
                    </h3>
                </div>
            </Container>
        )
    }

    return (
        <Container className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 sm:px-4 lg:grid-cols-3 gap-6">
                {properties.map((property, index) => {
                    const details = getPropertyDetails(property)
                    const mainImage = property?.images?.[0] || '/assets/images/emptyImg.png'
                    const price = property?.features?.price ? `$${property.features.price.toLocaleString()}` : 'Price not available'

                    return (
                        <div key={index} className="overflow-hidden transition-shadow duration-300">
                            <div className="relative h-72 w-full">
                                <Image
                                    src={property?.images?.[0] || '/assets/images/emptyImg.png'}
                                    alt={property?.propertyName || 'Property image'}
                                    fill
                                    className="object-cover rounded-xl"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            <div className="py-3 flex flex-col justify-between">
                                <div>
                                    <div className="text-lg font-medium text-[#3C3C3C] mb-2">
                                        {property?.features?.price ? `$${property.features.price}` : '-'}
                                    </div>
                                    <h3 className="text-xl font-medium text-black mb-4">
                                        {property?.propertyName || '-'}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {details.map((detail, i) => (
                                        <div key={i} className="flex items-center text-gray-600">
                                            <span className="mr-2">{iconMap[detail.type]}</span>
                                            <span className="text-xl">{detail.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {showPagination && (
                <div className="mt-8 flex w-full justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </Container>
    )
}

export default Properties
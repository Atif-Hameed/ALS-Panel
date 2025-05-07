'use client'
import SubHeading from '../../shared/sub-heading'
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import CustomImage from '../../shared/custom-image'
import { renderStars } from '../../../utils/renderStars'
import Button from '../../shared/custom-btn'
import { RiShareBoxFill } from "react-icons/ri";
import Container from '../../shared/container'
import { useRouter, useSearchParams } from 'next/navigation'
import Pagination from '../../shared/pagination'
import PigeonMap from './map'
import CustomLink from '../../shared/custom-link'
import Link from 'next/link'

const AgentMap = ({ data: initialData }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPage = initialData.meta?.currentPage || 1
    const totalPages = initialData.meta?.totalPages || 10
    const [hasFilters, setHasFilters] = useState(false)
    const [copiedId, setCopiedId] = useState(null)
    const [isPending, startTransition] = useTransition();
    const [filteredData, setFilteredData] = useState(initialData);
    const [mapBounds, setMapBounds] = useState(null);

    console.log(filteredData)

    const handleViewChange = useCallback((bounds) => {
        // Validate bounds before setting them
        if (
            !bounds ||
            isNaN(bounds.minLon) ||
            isNaN(bounds.minLat) ||
            isNaN(bounds.maxLon) ||
            isNaN(bounds.maxLat) ||
            Math.abs(bounds.minLon) > 180 ||
            Math.abs(bounds.maxLon) > 180 ||
            Math.abs(bounds.minLat) > 90 ||
            Math.abs(bounds.maxLat) > 90
        ) {
            return;
        }
        setMapBounds(bounds);
    }, []);

    // Filter agents based on map bounds
    useEffect(() => {
        // console.log('Filtering with bounds:', mapBounds);
        if (!mapBounds) {
            setFilteredData(initialData);
            return;
        }

        const filtered = initialData.data.filter(agent => {
            // Use logitude if longitude doesn't exist (typo in your data)
            const longitude = agent.longitude || agent.logitude;
            const latitude = agent.latitude;

            if (!longitude || !latitude) {
                return false;
            }

            const lon = parseFloat(longitude);
            const lat = parseFloat(latitude);

            if (isNaN(lon) || isNaN(lat)) {
                return false;
            }

            const isWithinBounds = (
                lon >= mapBounds.minLon &&
                lon <= mapBounds.maxLon &&
                lat >= mapBounds.minLat &&
                lat <= mapBounds.maxLat
            );

            return isWithinBounds;
        });

        setFilteredData({
            ...initialData,
            data: filtered
        });
    }, [initialData, mapBounds]);

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage)
        startTransition(() => {
            router.push(`?${params.toString()}`, { scroll: false })
        })
    }

    // Check if any filters are active
    useEffect(() => {
        const has = searchParams.has('agentName') ||
            searchParams.has('zipCode') ||
            searchParams.has('city')
        setHasFilters(has)
    }, [searchParams])

    const clearFilters = () => {
        const params = new URLSearchParams()
        params.set('page', currentPage.toString())
        if (searchParams.get('limit')) {
            params.set('limit', searchParams.get('limit'))
        }
        startTransition(() => {
            router.push(`?${params.toString()}`, { scroll: false });
        });
    }

    const handleShare = async (agentId) => {
        const host = window.location.origin;
        const url = `${host}/agent-profile/${agentId}`;

        try {
            if (navigator.clipboard && document.hasFocus()) {
                await navigator.clipboard.writeText(url);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopiedId(agentId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };


    return (
        <div className='h-full'>
            <div className='py-10'>
                <SubHeading><span className='font-medium'>Real Estate Agents in <br />Chicago, IL</span></SubHeading>
            </div>
            <Container parentStyle={'bg-lightBlue '} className='!px-0 flex md:flex-row flex-col' >
                {/* agents  */}
                <div className='xl:w-4/12 lg:w-5/12 md:w-1/2 w-full h-full p-4' >

                    <div className='flex justify-between items-center mb-4'>
                        <h1 className='sm:text-2xl text-lg font-semibold'>All Agents</h1>
                        <div className='flex items-center gap-2'>
                            {hasFilters && (
                                <Button
                                    onClick={clearFilters}
                                    label='Clear Filters'
                                    loading={isPending}
                                    disabled={isPending}
                                    loadingLabel=''
                                    loaderStyle={'!h-4 !w-4'}
                                    style='bg-red-500 text-white !px-2 !py-1 text-sm rounded-md !text-[10px] flex items-center gap-1'
                                />
                            )}
                            <span className='text-lg font-semibold text-gray-600'>
                                ({filteredData.data.length})
                            </span>
                        </div>
                    </div>

                    <div className='overflow-auto gap-4 md:h-[90vh] md:py-0 py-4 w-full flex md:flex-col flex-row' >
                        {
                            filteredData.data.length === 0 ?
                                <div className='pt-10 w-full'>
                                    <h1 className='text-lg font-semibold text-center'>No Data Found</h1>
                                    <p className='text-center'>Please try again!</p>
                                </div>
                                :
                                filteredData.data?.map((e, i) => (
                                    <div key={i} className='flex md:gap-4 md:flex-row flex-col md:w-auto lg:min-w-auto sm:min-w-[50vw] min-w-[75vw] w-full gap-2 sm:p-4 p-3 bg-white rounded-lg shadow'>
                                        <div>
                                            <CustomImage src={e.profileImage ? e.profileImage : '/assets/images/dumy.png'} className={'sm:w-16 w-12 sm:h-16 h-12 rounded-lg object-cover'} />
                                        </div>
                                        <div className='flex-1 flex flex-col gap-3 overflow-auto '>
                                            <h1 className='text-xl font-medium'>{(e.firstName || '-') + ' ' + (e.lastName || '-')}</h1>
                                            <div className='space-y-1 break-all text-[#B3B3B3] text-sm'>
                                                <div className='flex gap-2 justify-between'>
                                                    <p className='whitespace-nowrap'>License No.</p>
                                                    <p>{e.licenseNumber}</p>
                                                </div>
                                                <div className='flex gap-2 justify-between'>
                                                    <p className='whitespace-nowrap'>Mobile</p>
                                                    <p>{e.phoneNumber}</p>
                                                </div>
                                                <div className='flex gap-2 justify-between'>
                                                    <p className='whitespace-nowrap'>Email</p>
                                                    <p className='truncate'>{e.email}</p>
                                                </div>
                                                <div className='flex gap-2 justify-between items-center'>
                                                    <p className='whitespace-nowrap'>Reviews</p>
                                                    {
                                                        e.review ?
                                                            <div className='flex gap-2'>
                                                                {renderStars(e.review)}
                                                            </div>
                                                            :
                                                            '---'
                                                    }
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 '>
                                                <Link href={`/agent-profile/${e._id}`}>
                                                    <Button
                                                        label='View Listings'
                                                        style='bg-black text-sm text-white whitespace-nowrap hover:!scale-100 !px-2 !py-0.5 rounded-md'
                                                    />
                                                </Link>
                                                <div className='flex items-center gap-1 relative'>
                                                    <Button
                                                        onClick={() => handleShare(e._id)}
                                                        label='Share'
                                                        style='bg-black text-sm text-white !px-2 whitespace-nowrap !py-0.5 hover:!scale-100 rounded-md'
                                                        icon={<RiShareBoxFill className='text-white' />}
                                                        iconPosition='right'
                                                    />
                                                    {copiedId === e._id && (
                                                        <span className='text-xs text-green-500 text-center'>
                                                            Copied!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                    </div>

                    {/* Pagination Controls */}
                    <Pagination
                        currentPage={initialData.meta?.currentPage || 1}
                        totalPages={initialData.meta?.totalPages || 1}
                        onPageChange={handlePageChange}
                    />

                </div>

                {/* map */}
                <div className="flex-1 sm:overflow-hidden h-full w-full">
                    {initialData.data.length > 0 && (
                        <PigeonMap
                            data={initialData.data}
                            onViewChange={handleViewChange}
                        />
                    )}
                    {initialData.data.length === 0 && (
                        <div className='pt-20 w-full'>
                            <h1 className='text-lg font-semibold text-center'>No Data Found</h1>
                            <p className='text-center'>Please try again!</p>
                        </div>
                    )}
                </div>

            </Container>
        </div>
    )
}

export default AgentMap
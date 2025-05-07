import Container from '../../shared/container'
import CustomImage from '../../shared/custom-image'
import SubHeading from '../../shared/sub-heading'
import { renderStars } from '../../../utils/renderStars'
import React from 'react'

const ProfileDetails = ({ data, reviews }) => {

    console.log(data)

    // Personal details data
    const personalDetails = [
        { label: 'License No.', value: data.licenseNumber || '-' },
        { label: 'Reviews', value: reviews?.count || '-' },
        { label: '', value: reviews?.data[0]?.review || '-', isFullWidth: true }
    ]

    // Contact details data
    const contactDetails = [
        { label: 'Mobile', value: data.phoneNumber || '-' },
        { label: 'Email', value: data.email || '-' },
        { label: 'Sales last 12 months', value: '-' },
        { label: 'Total Sales', value: '-' },
        { label: 'Price range', value: '-' },
        { label: 'Average price', value: '-' }
    ]

    // Company details data
    const companyDetails = [
        { label: 'Company Name', value: data.agency || '-' },
        { label: 'Zip code', value: data.zipCode || '-' },
        { label: 'Country', value: data.country || '-' },
        { label: 'Latitude', value: data.latitude || '-' },
        { label: 'Longitude', value: data.logitude || '-' },
        { label: 'Address 1', value: data.address1 || '-' }
    ]

    // Office details data
    const officeDetails = [
        { label: 'Office Name', value: data.officeName || '-' },
        { label: 'City', value: data.city || '-' },
        { label: 'State', value: data.state || '-' },
        { label: 'Street', value: data.street || '-' },
        { label: 'Apartment', value: data.apartment || '-' },
        { label: 'Address 2', value: data.address2 || '-' }
    ]

    // Render function for detail cards
    const renderDetailCard = (title, items) => (
        <div className='border border-gray-200 rounded-lg p-4 h-full'>
            {title && (
                <div className='border-b border-gray-200 pb-2 mb-1'>
                    <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
                    <p>{data?.accountType}</p>
                </div>
            )}
            <div className='space-y-2'>
                {items.map((item, index) => (
                    <div key={index} className={`flex justify-between items-center gap-2 ${item.isFullWidth ? 'flex-col items-start' : ''}`}>
                        <span className='font-medium whitespace-nowrap'>{item.label}</span>
                        {item.isComponent ? (
                            item.value
                        ) : (
                            <span className={`text-darkBorder ${item.isFullWidth ? '' : 'text-end'}`}>
                                {item.value}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <Container className={' sm:py-16 py-8'}>
            <div className='sm:pb-10 pb-6'>
                <SubHeading>{(data?.firstName || '-') + ' ' + (data?.lastName || '-')}</SubHeading>
            </div>

            {/* Profile sections */}
            <div className='flex flex-col sm:px-4 md:flex-row md:items-start items-center gap-6 bg-white rounded-lg'>
                <div className='md:w-3/12 sm:w-1/2'>
                    <CustomImage
                        className={'w-full h-56 rounded-lg object-cover aspect-square'}
                        src={data?.profileImage || '/assets/images/person.png'}
                        alt="Agent profile"
                    />
                </div>

                <div className='w-full md:w-9/12 grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {renderDetailCard((data?.firstName || '-') + ' ' + (data?.lastName || '-'), personalDetails)}
                    {renderDetailCard(null, contactDetails)}
                </div>
            </div>

            {/* Company - office details */}
            <div className='sm:py-10 sm:px-4 py-6'>
                <SubHeading>Company and Office Details</SubHeading>
            </div>

            <div className='grid sm:px-4 sm:grid-cols-2 grid-cols-1 gap-6'>
                {renderDetailCard(null, companyDetails)}
                {renderDetailCard(null, officeDetails)}
            </div>

            {/* About me section */}
            {
                data.aboutMe &&
                <div className='sm:px-4'>
                    <div className='sm:py-10 py-6'>
                        <SubHeading>About Me</SubHeading>
                    </div>
                    <div className='bg-[#F4F9FD] sm:p-6 p-4 sm:px-8 rounded-lg'>
                        <p>{data.aboutMe || '-'}</p>
                    </div>
                </div>
            }

        </Container>
    )
}

export default ProfileDetails
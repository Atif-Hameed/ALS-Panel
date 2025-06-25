'use client';
import Container from '../../shared/container';
import CustomImage from '../../shared/custom-image';
import SubHeading from '../../shared/sub-heading';
import { renderStars } from '../../../utils/renderStars';
import React, { useEffect, useState } from 'react';
import { useUserDetails } from '../../../hooks/useUser';
import Button from '../../shared/custom-btn';
import { inviteReferal } from '../../../actions/agent.action';
import toast from 'react-hot-toast';

const ProfileDetails = ({ data, reviews, isConsumer }) => {
    const [userId, setUserId] = useState(null);
    const { data: user } = useUserDetails(userId);
    const [isLoading, setIsLoading] = useState(false);

    // Get userId from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            }
        }
    }, []);

    // Personal details data
    const personalDetails = [
        { label: 'License No.', value: data.licenseNumber || '-' },
        { label: 'Reviews', value: reviews?.count || '-' },
        { label: '', value: reviews?.data[0]?.review || '-', isFullWidth: true },
    ];

    // Contact details data
    const contactDetails = [
        { label: 'Mobile', value: data.phoneNumber || '-' },
        { label: 'Email', value: data.email || '-' },
        { label: 'Sales last 12 months', value: '-' },
        { label: 'Total Sales', value: '-' },
        { label: 'Price range', value: '-' },
        { label: 'Average price', value: '-' },
    ];

    // Company details data
    const companyDetails = [
        { label: 'Company Name', value: data.agency || '-' },
        { label: 'Zip code', value: data.zipCode || '-' },
        { label: 'Country', value: data.country || '-' },
        { label: 'Latitude', value: data.latitude || '-' },
        { label: 'Longitude', value: data.logitude || '-' },
        { label: 'Address 1', value: data.address1 || '-' },
    ];

    // Office details data
    const officeDetails = [
        { label: 'Office Name', value: data.officeName || '-' },
        { label: 'City', value: data.city || '-' },
        { label: 'State', value: data.state || '-' },
        { label: 'Street', value: data.street || '-' },
        { label: 'Apartment', value: data.apartment || '-' },
        { label: 'Address 2', value: data.address2 || '-' },
    ];

    // Render function for detail cards
    const renderDetailCard = (title, items) => (
        <div className="border border-gray-200 rounded-lg p-4 h-full">
            {title && (
                <div className="border-b border-gray-200 pb-2 mb-1">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <p>{data?.accountType}</p>
                </div>
            )}
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`flex justify-between items-center gap-2 ${item.isFullWidth ? 'flex-col items-start' : ''
                            }`}
                    >
                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                        {item.isComponent ? (
                            item.value
                        ) : (
                            <span
                                className={`text-darkBorder ${item.isFullWidth ? '' : 'text-end'
                                    }`}
                            >
                                {item.value}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // Handle referral invitation
    const handleAddReferal = async () => {
        if (!userId) {
            toast.error('Please log in to send a referral invitation.');
            return;
        }

        if (!data?._id) {
            toast.error('Target user ID is missing.');
            return;
        }

        setIsLoading(true);
        const referralData = {
            userId: data._id,
            referBy: userId,
        };

        try {
            const { data, error } = await inviteReferal(referralData);
            console.log(data, error)
            if (error) {
                toast.error(error || 'Failed to send referral invitation.');
            } else {
                toast.success('Referral invitation sent successfully!');
            }
        } catch (error) {
            toast.error('An error occurred while sending the referral invitation.');
            console.error('Referral error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const showButton = user && data.password && isConsumer === 'false';

    return (
        <Container className={'sm:pb-16 py-8 '}>
            {showButton && (
                <div className="flex justify-end w-full">
                    <Button
                        label={'Add As Referral'}
                        loadingLabel='Sending Invitation...'
                        loading={isLoading}
                        style="!bg-darkGray !text-white !rounded-full !px-6"
                        onClick={handleAddReferal}
                        disabled={isLoading}
                    />
                </div>
            )}

            <div className="sm:pb-10 pb-6">
                <h1 className="lg:text-5xl md:text-4xl text-3xl text-center font-medium">
                    {data?.firstName || '-'} {data?.lastName || '-'}
                </h1>
                <p className="text-center">{data?.email}</p>
            </div>

            {/* Profile sections */}
            <div className="flex flex-col sm:px-4 md:flex-row md:items-start items-center gap-6 bg-white rounded-lg">
                <div className="md:w-3/12 sm:w-1/2">
                    <CustomImage
                        className="w-full h-56 rounded-lg object-cover aspect-square"
                        src={data?.profileImage || '/assets/images/dumy.png'}
                        alt="Agent profile"
                    />
                </div>

                <div className="w-full md:w-9/12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderDetailCard(
                        (data?.firstName || '-') + ' ' + (data?.lastName || '-'),
                        personalDetails
                    )}
                    {renderDetailCard(null, contactDetails)}
                </div>
            </div>

            {/* Company - office details */}
            <div className="sm:py-10 sm:px-4 py-6">
                <SubHeading>Company and Office Details</SubHeading>
            </div>

            <div className="grid sm:px-4 sm:grid-cols-2 grid-cols-1 gap-6">
                {renderDetailCard(null, companyDetails)}
                {renderDetailCard(null, officeDetails)}
            </div>

            {/* About me section */}
            {data.aboutMe && (
                <div className="sm:px-4">
                    <div className="sm:py-10 py-6">
                        <SubHeading>About Me</SubHeading>
                    </div>
                    <div className="bg-[#F4F9FD] sm:p-6 p-4 sm:px-8 rounded-lg">
                        <p>{data.aboutMe || '-'}</p>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default ProfileDetails;
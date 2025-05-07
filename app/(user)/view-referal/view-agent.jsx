'use client'
import React, { useState, useEffect } from 'react'

const ViewAgent = ({ data }) => {
    const [userEmail, setUserEmail] = useState('N/A');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const storedEmail = localStorage.getItem('useremail');
            setUserEmail(storedEmail || 'N/A');
        }
    }, []);

    // Group fields by category 
    const fieldGroups = [
        {
            title: 'Personal Information',
            fields: [
                { label: 'First Name', value: data?.firstName },
                { label: 'Last Name', value: data?.lastName },
                { label: 'Public Name', value: data?.publicName },
                { label: 'Email', value: data?.email },
                { label: 'Phone Number', value: data?.phoneNumber },
            ]
        },
        {
            title: 'Professional Details',
            fields: [
                { label: 'Designation', value: data?.designation },
                { label: 'Role', value: data?.role },
                { label: 'Company Name', value: data?.companyName },
                { label: 'Office Name', value: data?.officeName },
                { label: 'License Type', value: data?.licenseType },
                { label: 'License Number', value: data?.licenseNumber },
                { label: 'Association', value: data?.association },
            ]
        },
        {
            title: 'Address Information',
            fields: [
                { label: 'Street', value: data?.street },
                { label: 'Apartment', value: data?.apartment },
                { label: 'City', value: data?.city },
                { label: 'State', value: data?.state },
                { label: 'Zip Code', value: data?.zipCode },
                { label: 'Country', value: data?.country },
                { label: 'Address 1', value: data?.address1 },
                { label: 'Address 2', value: data?.address2 },
            ]
        },
        {
            title: 'Other Information',
            fields: [
                { label: 'Email', value: isClient ? userEmail : 'Loading...' },
                { label: 'Latitude', value: data?.latitude },
                { label: 'Longitude', value: data?.longitude },
            ]
        }
    ];

    return (
        <div>
            <div className="mb-8 mt-4">
                <h1 className="text-3xl font-bold text-gray-800">Referral Details</h1>
            </div>

            <div className="max-w-6xl mx-auto sm:p-6 p-4 bg-white rounded-lg shadow-sm">
                <div className="grid grid-cols-1 gap-6">
                    {fieldGroups.map((group, index) => (
                        <div key={index} className="bg-gray-50 sm:p-5 p-3 rounded-lg border border-gray-200">
                            <h2 className="sm:text-xl text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                                {group.title}
                            </h2>
                            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 break-all sm:gap-4 gap-3">
                                {group.fields.map((field, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <span className="font-semibold sm:text-base text-sm text-gray-500">{field.label}</span>
                                        <span className="text-gray-800 sm:text-sm text-xs font-normal mt-1 break-all">
                                            {field.value || <span className="text-gray-400">N/A</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ViewAgent
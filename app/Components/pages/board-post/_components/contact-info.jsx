'use client'
import CustomInput from '../../../../Components/common/custom-input'
import React from 'react'

const ContactInfo = ({ formData, handleContactInfoChange, radioOptions,user }) => {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-4 underline">Contact Information</h2>

            <div className='flex sm:items-center sm:flex-row flex-col gap-6'>
                <div className='lg:w-1/2 sm:w-[70%] w-full'>
                    <CustomInput
                        inputType="email"
                        name="email"
                        value={formData.contactInfo.email}
                        onChange={(e) => handleContactInfoChange('email', e.target.value)}
                        required={true}
                        label="Email Address"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                    />
                </div>
                <div className="">
                    <h3 className="text-sm  mb-2">Email Options</h3>
                    <div className="">
                        {radioOptions.map((option, index) => (
                            <div
                                key={`emailOption-${index}`}
                                className="flex items-center "
                            >
                                <input
                                    type="radio"
                                    name="emailOption"
                                    value={option.value}
                                    checked={formData.contactInfo.emailOption === option.value}
                                    onChange={() => handleContactInfoChange('emailOption', option.value)}
                                    className="mr-3"
                                    id={`emailOption-${option.value}`}
                                />
                                <label htmlFor={`emailOption-${option.value}`} className="flex-1 cursor-pointer text-sm">
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='flex sm:items-center sm:flex-row flex-col gap-6'>
                <div className='lg:w-1/2 sm:w-[70%] w-full'>
                    <CustomInput
                        inputType="text"
                        name="phone"
                        value={formData.contactInfo.phone}
                        onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                        required={true}
                        label="Phone Number"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        className="mt-6"
                    />
                </div>
                <div className="">
                    <h3 className="text-sm  mb-2">Phone Number Options</h3>
                    <div className="">
                        {radioOptions.map((option, index) => (
                            <div
                                key={`phoneOption-${index}`}
                                className="flex items-center"
                            >
                                <input
                                    type="radio"
                                    name="phoneOption"
                                    value={option.value}
                                    checked={formData.contactInfo.phoneOption === option.value}
                                    onChange={() => handleContactInfoChange('phoneOption', option.value)}
                                    className="mr-3"
                                    id={`phoneOption-${option.value}`}
                                />
                                <label htmlFor={`phoneOption-${option.value}`} className="flex-1 cursor-pointer text-sm">
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactInfo

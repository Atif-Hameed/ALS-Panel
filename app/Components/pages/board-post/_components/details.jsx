'use client'
import CustomInput from '../../../common/custom-input';
import React from 'react'



// Define options for select fields
const employmentTypeOptions = [
    { value: '', label: 'Select Employment Type' },
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' },
];

const experienceLevelOptions = [
    { value: '', label: 'Select Experience Level' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
];

const jobOptionsList = [
    'remote',
    'hybrid',
    'on-site',
    'flexible hours',
    'benefits',
    'relocation assistance',
];

const housingTypeOptions = [
    { value: '', label: 'Select Housing Type' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
];

const conditionOptions = [
    { value: '', label: 'Select Condition' },
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
];

const providerTypeOptions = [
    { value: '', label: 'Select Provider Type' },
    { value: 'individual', label: 'Individual' },
    { value: 'agency', label: 'Agency' },
    { value: 'center', label: 'Childcare Center' },
];

const ageAcceptedOptions = [
    { value: '', label: 'Select Age Range' },
    { value: 'infant', label: 'Infant (0-2 years)' },
    { value: 'toddler', label: 'Toddler (2-5 years)' },
    { value: 'school-age', label: 'School Age (5-12 years)' },
    { value: 'all', label: 'All Ages' },
];

const educationOptions = [
    { value: '', label: 'Select Education Level' },
    { value: 'high-school', label: 'High School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: 'Bachelor’s Degree' },
    { value: 'master', label: 'Master’s Degree' },
    { value: 'doctorate', label: 'Doctorate' },
    { value: 'other', label: 'Other' },
];

const Details = ({ selectedPostType, selectedCategory, formData, handleDetailsChange }) => {

    // Determine the details structure based on postType and category
    const getDetailsForm = () => {
        if (!selectedPostType) return null;

        const postTypeName = selectedPostType.name;

        if (postTypeName === 'job offered') {
            return (
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <CustomInput
                        inputType="select"
                        name="employmentType"
                        value={formData.postDetails.employmentType || ''}
                        onChange={(e) => handleDetailsChange('employmentType', e.target.value)}
                        options={employmentTypeOptions}
                        label="Employment Type*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <CustomInput
                        inputType="select"
                        name="experienceLevel"
                        value={formData.postDetails.experienceLevel || ''}
                        onChange={(e) => handleDetailsChange('experienceLevel', e.target.value)}
                        options={experienceLevelOptions}
                        label="Experience Level*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <CustomInput
                        inputType="text"
                        name="jobTitle"
                        value={formData.postDetails.jobTitle || ''}
                        onChange={(e) => handleDetailsChange('jobTitle', e.target.value)}
                        label="Job Title*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <CustomInput
                        inputType="text"
                        name="compensation"
                        value={formData.postDetails.compensation || ''}
                        onChange={(e) => handleDetailsChange('compensation', e.target.value)}
                        label="Compensation*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <CustomInput
                        inputType="text"
                        name="companyName"
                        value={formData.postDetails.companyName || ''}
                        onChange={(e) => handleDetailsChange('companyName', e.target.value)}
                        label="Company Name"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                    />
                    <div className="sm:col-span-2">
                        <label className="block text-sm mb-2">Job Options</label>
                        <div className="flex flex-wrap gap-4">
                            {jobOptionsList.map(option => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.postDetails.jobOptions?.includes(option) || false}
                                        onChange={(e) => {
                                            const currentOptions = formData.postDetails.jobOptions || [];
                                            const newOptions = e.target.checked
                                                ? [...currentOptions, option]
                                                : currentOptions.filter(opt => opt !== option);
                                            handleDetailsChange('jobOptions', newOptions);
                                        }}
                                    />
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (postTypeName === 'gig offered') {
            return (
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <CustomInput
                        inputType="text"
                        name="jobTitle"
                        value={formData.postDetails.jobTitle || ''}
                        onChange={(e) => handleDetailsChange('jobTitle', e.target.value)}
                        label="Gig Title*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <CustomInput
                        inputType="text"
                        name="compensation"
                        value={formData.postDetails.compensation || ''}
                        onChange={(e) => handleDetailsChange('compensation', e.target.value)}
                        label="Compensation*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.postDetails.directHRContact || false}
                            onChange={(e) => handleDetailsChange('directHRContact', e.target.checked)}
                        />
                        Direct HR Contact
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.postDetails.pay || false}
                            onChange={(e) => handleDetailsChange('pay', e.target.checked)}
                        />
                        Paid Gig
                    </label>
                </div>
            );
        }

        if (postTypeName === 'resume / job wanted' && selectedCategory) {
            if (selectedCategory.name === "I'm an individual seeking employment") {
                return (
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <CustomInput
                            inputType="text"
                            name="availability"
                            value={formData.postDetails.individualSeekingEmployment?.availability || ''}
                            onChange={(e) => handleDetailsChange('availability', e.target.value, 'individualSeekingEmployment')}
                            label="Availability*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="select"
                            name="education"
                            value={formData.postDetails.individualSeekingEmployment?.education || ''}
                            onChange={(e) => handleDetailsChange('education', e.target.value, 'individualSeekingEmployment')}
                            options={educationOptions}
                            label="Education Level*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.postDetails.individualSeekingEmployment?.directHRContact || false}
                                onChange={(e) => handleDetailsChange('directHRContact', e.target.checked, 'individualSeekingEmployment')}
                            />
                            Direct HR Contact
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.postDetails.individualSeekingEmployment?.licensed || false}
                                onChange={(e) => handleDetailsChange('licensed', e.target.checked, 'individualSeekingEmployment')}
                            />
                            Licensed
                        </label>
                    </div>
                );
            }
            if (selectedCategory.name === "I'm offering a job") {
                return (
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <CustomInput
                            inputType="select"
                            name="employmentType"
                            value={formData.postDetails.offeringJob?.employmentType || ''}
                            onChange={(e) => handleDetailsChange('employmentType', e.target.value, 'offeringJob')}
                            options={employmentTypeOptions}
                            label="Employment Type*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="select"
                            name="experienceLevel"
                            value={formData.postDetails.offeringJob?.experienceLevel || ''}
                            onChange={(e) => handleDetailsChange('experienceLevel', e.target.value, 'offeringJob')}
                            options={experienceLevelOptions}
                            label="Experience Level*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="jobTitle"
                            value={formData.postDetails.offeringJob?.jobTitle || ''}
                            onChange={(e) => handleDetailsChange('jobTitle', e.target.value, 'offeringJob')}
                            label="Job Title*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="compensation"
                            value={formData.postDetails.offeringJob?.compensation || ''}
                            onChange={(e) => handleDetailsChange('compensation', e.target.value, 'offeringJob')}
                            label="Compensation*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="companyName"
                            value={formData.postDetails.offeringJob?.companyName || ''}
                            onChange={(e) => handleDetailsChange('companyName', e.target.value, 'offeringJob')}
                            label="Company Name"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                        />
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-2">Job Options</label>
                            <div className="flex flex-wrap gap-4">
                                {jobOptionsList.map(option => (
                                    <label key={option} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.postDetails.offeringJob?.jobOptions?.includes(option) || false}
                                            onChange={(e) => {
                                                const currentOptions = formData.postDetails.offeringJob?.jobOptions || [];
                                                const newOptions = e.target.checked
                                                    ? [...currentOptions, option]
                                                    : currentOptions.filter(opt => opt !== option);
                                                handleDetailsChange('jobOptions', newOptions, 'offeringJob');
                                            }}
                                        />
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }
            if (selectedCategory.name === "I'm offering childcare") {
                return (
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <CustomInput
                            inputType="select"
                            name="ageAccepted"
                            value={formData.postDetails.offeringChildcare?.ageAccepted || ''}
                            onChange={(e) => handleDetailsChange('ageAccepted', e.target.value, 'offeringChildcare')}
                            options={ageAcceptedOptions}
                            label="Age Accepted*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="availability"
                            value={formData.postDetails.offeringChildcare?.availability || ''}
                            onChange={(e) => handleDetailsChange('availability', e.target.value, 'offeringChildcare')}
                            label="Availability*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="select"
                            name="providerType"
                            value={formData.postDetails.offeringChildcare?.providerType || ''}
                            onChange={(e) => handleDetailsChange('providerType', e.target.value, 'offeringChildcare')}
                            options={providerTypeOptions}
                            label="Provider Type*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                    </div>
                );
            }
        }

        if (postTypeName === 'housing offered') {
            return (
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <CustomInput
                        inputType="text"
                        name="sqft"
                        value={formData.postDetails.sqft || ''}
                        onChange={(e) => handleDetailsChange('sqft', e.target.value)}
                        label="Square Footage"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                    />
                    <CustomInput
                        inputType="select"
                        name="housingType"
                        value={formData.postDetails.housingType || ''}
                        onChange={(e) => handleDetailsChange('housingType', e.target.value)}
                        options={housingTypeOptions}
                        label="Housing Type*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <CustomInput
                        inputType="text"
                        name="bedrooms"
                        value={formData.postDetails.bedrooms || ''}
                        onChange={(e) => handleDetailsChange('bedrooms', e.target.value)}
                        label="Bedrooms*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <CustomInput
                        inputType="text"
                        name="bathrooms"
                        value={formData.postDetails.bathrooms || ''}
                        onChange={(e) => handleDetailsChange('bathrooms', e.target.value)}
                        label="Bathrooms*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <CustomInput
                        inputType="text"
                        name="availableOn"
                        value={formData.postDetails.availableOn || ''}
                        onChange={(e) => handleDetailsChange('availableOn', e.target.value)}
                        label="Available On*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.postDetails.per || false}
                            onChange={(e) => handleDetailsChange('per', e.target.checked)}
                        />
                        Per
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.postDetails.privateRoom || false}
                            onChange={(e) => handleDetailsChange('privateRoom', e.target.checked)}
                        />
                        Private Room
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.postDetails.privateBath || false}
                            onChange={(e) => handleDetailsChange('privateBath', e.target.checked)}
                        />
                        Private Bathroom
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.postDetails.laundary || false}
                            onChange={(e) => handleDetailsChange('laundary', e.target.checked)}
                        />
                        Laundry Available
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.postDetails.parking || false}
                            onChange={(e) => handleDetailsChange('parking', e.target.checked)}
                        />
                        Parking Available
                    </label>
                </div>
            );
        }

        if (postTypeName === 'for sale by owner' || postTypeName === 'for sale by dealer' || postTypeName === 'wanted by owner' || postTypeName === 'wanted by dealer') {
            return (
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <CustomInput
                        inputType="text"
                        name="manufacturer"
                        value={formData.postDetails.manufacturer || ''}
                        onChange={(e) => handleDetailsChange('manufacturer', e.target.value)}
                        label="Manufacturer"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                    />
                    <CustomInput
                        inputType="text"
                        name="modelNumber"
                        value={formData.postDetails.modelNumber || ''}
                        onChange={(e) => handleDetailsChange('modelNumber', e.target.value)}
                        label="Model Number"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                    />
                    <CustomInput
                        inputType="text"
                        name="size"
                        value={formData.postDetails.size || ''}
                        onChange={(e) => handleDetailsChange('size', e.target.value)}
                        label="Size"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                    />
                    <CustomInput
                        inputType="select"
                        name="condition"
                        value={formData.postDetails.condition || ''}
                        onChange={(e) => handleDetailsChange('condition', e.target.value)}
                        options={conditionOptions}
                        label="Condition*"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                        required
                    />
                    <CustomInput
                        inputType="text"
                        name="langauge"
                        value={formData.postDetails.langauge || ''}
                        onChange={(e) => handleDetailsChange('langauge', e.target.value)}
                        label="Language"
                        labelStyle="!text-sm"
                        inputTextStyle="!text-sm"
                    />
                </div>
            );
        }

        if (postTypeName === 'event / class' && selectedCategory) {
            if (selectedCategory.name === "I'm selling a small number of tickets to an event") {
                return (
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <CustomInput
                            inputType="number"
                            name="numberOfTicktsAvailble"
                            value={formData.postDetails.sellingTickets?.numberOfTicktsAvailble || ''}
                            onChange={(e) => handleDetailsChange('numberOfTicktsAvailble', e.target.value, 'sellingTickets')}
                            label="Number of Tickets Available*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="venue"
                            value={formData.postDetails.sellingTickets?.venue || ''}
                            onChange={(e) => handleDetailsChange('venue', e.target.value, 'sellingTickets')}
                            label="Venue*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="eventData"
                            value={formData.postDetails.sellingTickets?.eventData || ''}
                            onChange={(e) => handleDetailsChange('eventData', e.target.value, 'sellingTickets')}
                            label="Event Date*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="langauge"
                            value={formData.postDetails.sellingTickets?.langauge || ''}
                            onChange={(e) => handleDetailsChange('langauge', e.target.value, 'sellingTickets')}
                            label="Language"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                        />
                    </div>
                );
            }
            if (selectedCategory.name === "My business is having a sale") {
                return (
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <CustomInput
                            inputType="text"
                            name="manufacturer"
                            value={formData.postDetails.businessHavingSale?.manufacturer || ''}
                            onChange={(e) => handleDetailsChange('manufacturer', e.target.value, 'businessHavingSale')}
                            label="Manufacturer"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                        />
                        <CustomInput
                            inputType="text"
                            name="modelNumber"
                            value={formData.postDetails.businessHavingSale?.modelNumber || ''}
                            onChange={(e) => handleDetailsChange('modelNumber', e.target.value, 'businessHavingSale')}
                            label="Model Number"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                        />
                        <CustomInput
                            inputType="text"
                            name="size"
                            value={formData.postDetails.businessHavingSale?.size || ''}
                            onChange={(e) => handleDetailsChange('size', e.target.value, 'businessHavingSale')}
                            label="Size"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                        />
                        <CustomInput
                            inputType="select"
                            name="condition"
                            value={formData.postDetails.businessHavingSale?.condition || ''}
                            onChange={(e) => handleDetailsChange('condition', e.target.value, 'businessHavingSale')}
                            options={conditionOptions}
                            label="Condition*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="langauge"
                            value={formData.postDetails.businessHavingSale?.langauge || ''}
                            onChange={(e) => handleDetailsChange('langauge', e.target.value, 'businessHavingSale')}
                            label="Language"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                        />
                    </div>
                );
            }
            if (selectedCategory.name === "I'm advertising a garage sale, estate sale, moving sale, flea market, or other non-corporate sale") {
                return (
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <CustomInput
                            inputType="text"
                            name="startTime"
                            value={formData.postDetails.advertisingSales?.startTime || ''}
                            onChange={(e) => handleDetailsChange('startTime', e.target.value, 'advertisingSales')}
                            label="Start Time*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="langauge"
                            value={formData.postDetails.advertisingSales?.langauge || ''}
                            onChange={(e) => handleDetailsChange('langauge', e.target.value, 'advertisingSales')}
                            label="Language"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                        />
                    </div>
                );
            }
            if (selectedCategory.name === "I'm advertising a class or training session") {
                return (
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <CustomInput
                            inputType="text"
                            name="eventStartDate"
                            value={formData.postDetails.advertisingClass?.eventStartDate || ''}
                            onChange={(e) => handleDetailsChange('eventStartDate', e.target.value, 'advertisingClass')}
                            label="Event Start Date*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="duration"
                            value={formData.postDetails.advertisingClass?.duration || ''}
                            onChange={(e) => handleDetailsChange('duration', e.target.value, 'advertisingClass')}
                            label="Duration*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                    </div>
                );
            }
            if (selectedCategory.name === "I'm advertising an event, other than the above") {
                return (
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <CustomInput
                            inputType="text"
                            name="venue"
                            value={formData.postDetails.advertisingEvent?.venue || ''}
                            onChange={(e) => handleDetailsChange('venue', e.target.value, 'advertisingEvent')}
                            label="Venue*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="eventStartDate"
                            value={formData.postDetails.advertisingEvent?.eventStartDate || ''}
                            onChange={(e) => handleDetailsChange('eventStartDate', e.target.value, 'advertisingEvent')}
                            label="Event Start Date*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <CustomInput
                            inputType="text"
                            name="duration"
                            value={formData.postDetails.advertisingEvent?.duration || ''}
                            onChange={(e) => handleDetailsChange('duration', e.target.value, 'advertisingEvent')}
                            label="Duration*"
                            labelStyle="!text-sm"
                            inputTextStyle="!text-sm"
                            required
                        />
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-2">Event Features</label>
                            <div className="flex flex-wrap gap-4">
                                {['food', 'music', 'family-friendly', 'outdoor', 'ticketed'].map(feature => (
                                    <label key={feature} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.postDetails.advertisingEvent?.eventFeatures?.includes(feature) || false}
                                            onChange={(e) => {
                                                const currentFeatures = formData.postDetails.advertisingEvent?.eventFeatures || [];
                                                const newFeatures = e.target.checked
                                                    ? [...currentFeatures, feature]
                                                    : currentFeatures.filter(f => f !== feature);
                                                handleDetailsChange('eventFeatures', newFeatures, 'advertisingEvent');
                                            }}
                                        />
                                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }
        }

        return null;
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 underline">Post Details</h2>
            {getDetailsForm() && (
                <div className="my-10">
                    <h2 className="text-lg font-semibold mb-4">Details</h2>
                    {getDetailsForm()}
                </div>
            )}
        </div>
    )
}

export default Details

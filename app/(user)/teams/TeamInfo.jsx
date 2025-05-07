'use client';
import React, { useEffect, useState } from 'react';

const TeamInfo = ({ data, onChange, errors }) => {
	const [focused, setFocused] = useState({});

	// Initialize formData with props.data
	const [formData, setFormData] = useState({
		name: data?.name || '',
		address: data?.address || '',
		website: data?.website || '',
		city: data?.city || '',
		state: data?.state || '',
		unit: data?.unit || '',
		zipCode: data?.zipCode || '',
	});

	// Update local state when parent data changes
	useEffect(() => {
		setFormData({
			name: data?.name || '',
			address: data?.address || '',
			website: data?.website || '',
			city: data?.city || '',
			state: data?.state || '',
			unit: data?.unit || '',
			zipCode: data?.zipCode || '',
		});
	}, [data]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		const updatedFormData = {
			...formData,
			[name]: value
		};

		// Update local state
		setFormData(updatedFormData);

		// Propagate changes to parent
		onChange(name, value);

		// Clear error for this field if it exists
		if (errors && errors[name]) {
			const newErrors = { ...errors };
			delete newErrors[name];
			// You may pass newErrors to the parent here if needed
		}
	};

	const handleFocus = (field) => {
		setFocused(prev => ({ ...prev, [field]: true }));
	};

	const handleBlur = (field) => {
		setFocused(prev => ({ ...prev, [field]: false }));
	};

	const renderInput = (field, placeholderText) => {
		const fieldMap = {
			teamOrCompanyName: 'name',
			websiteUrl: 'website'
		};
		const modelField = fieldMap[field] || field;

		const isRequired = modelField === 'name' || modelField === 'address';

		return (
			<div key={field} className='w-full'>
				{(focused[modelField] || formData[modelField]) && (
					<label className='text-[14px] font-[400] text-[#4A5568]'>
						{placeholderText}
						{isRequired && <span className='text-red-500'> *</span>}
					</label>
				)}
				<div className={`border-b ${focused[modelField] ? 'border-[#000113]' : 'border-[#CBD5E1]'}`}>
					<input
						type={modelField === 'website' ? 'url' : 'text'}
						name={modelField}
						placeholder={focused[modelField] ? '' : placeholderText + (isRequired ? ' *' : '')}
						value={formData[modelField] || ''}
						onChange={handleChange}
						onFocus={() => handleFocus(modelField)}
						onBlur={() => handleBlur(modelField)}
						className='w-full py-2 text-[14px] font-[400] text-[#2D3748] focus:ring-0 focus:outline-none bg-transparent placeholder-[#718096]'
					/>
				</div>
				{/* {errors && errors[modelField] && (
					<p className='text-red-500 text-[14px] font-[400] mt-1'>{errors[modelField]}</p>
				)} */}
			</div>
		);
	};

	return (
		<div className='w-full'>
			<div className='bg-[#FFFFFF] sm:p-6 p-4 rounded-lg'>
				<div className='text-[18px] font-[600] text-[#000000] mb-4'>
					Team Information
				</div>
				<form className='w-full flex flex-col gap-y-6'>
					<div className='grid lg:grid-cols-5 md:grid-cols-4 lg:gap-x-16 gap-x-8'>
						<div className='flex flex-col col-span-2 gap-6'>
							{renderInput('teamOrCompanyName', 'Team or Company Name')}
							{renderInput('address', 'Address')}
							{renderInput('websiteUrl', 'Website URL')}
						</div>

						<div className='flex flex-col col-span-2 gap-6 md:mt-0 mt-5'>
							<div className='flex gap-6'>
								<div className='w-1/2'>{renderInput('city', 'City')}</div>
								<div className='w-1/2'>{renderInput('state', 'State')}</div>
							</div>
							<div className='flex gap-6'>
								<div className='w-1/2'>{renderInput('unit', 'Unit')}</div>
								<div className='w-1/2'>{renderInput('zipCode', 'Zip Code')}</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TeamInfo;

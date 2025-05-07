'use client';

import React, { useState } from 'react';
import { API_BASE_URL } from '../../../api';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { countryOptions } from '../../../utils/countries';

const AddressInfo = ({ propertyId, property, setIsAddress }) => {

	const [formData, setFormData] = useState({
		propertyName: property?.propertyName || '',
		address1: property?.address1 || '',
		address2: property?.address2 || '',
		displayAddress: property?.displayAddress || '',
		city: property?.city || '',
		state: property?.state || '',
		country: property?.country || '',
		zipCode: property?.zipCode || '',
		headline: property?.headline || '',
		longDescription: property?.longDescription || '',
		shortDescription: property?.shortDescription || '',
	});

	const [errors, setErrors] = useState({});
	const [focused, setFocused] = useState({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');
	

	const validateForm = () => {
		const newErrors = {};

		// Required fields validation
		if (!formData.propertyName)
			newErrors.propertyName = 'Property name is required';
		if (!formData.address1) newErrors.address1 = 'Address 1 is required';
		if (!formData.displayAddress)
			newErrors.displayAddress = 'Display address is required';
		if (!formData.city) newErrors.city = 'City is required';
		if (!formData.state) newErrors.state = 'State is required';
		if (!formData.country) newErrors.country = 'Country is required';
		if (!formData.zipCode) newErrors.zipCode = 'Zip code is required';
		if (!formData.headline) newErrors.headline = 'Headline is required';
		if (!formData.longDescription)
			newErrors.longDescription = 'Long Description is required';
		if (!formData.shortDescription)
			newErrors.shortDescription = 'Short Description is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		setErrors((prevErrors) => {
			const newErrors = { ...prevErrors };
			delete newErrors[name];
			return newErrors;
		});
	};

	const handleFocus = (field) => {
		setFocused({ ...focused, [field]: true });
	};

	const handleBlur = (field) => {
		setFocused({ ...focused, [field]: false });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}
		const userId = localStorage.getItem('userId');

		if (!propertyId) {
			setErrors((prevErrors) => ({
				...prevErrors,
				submit: 'User not found. Please log in first.',
			}));
			setLoading(false);
			return;
		}
		const formDataWithUserId = { ...formData, propertyId };
		setLoading(true);
		setIsAddress(true)

		try {
			const response = await fetch(`${API_BASE_URL}/property/update-address`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formDataWithUserId),
			});

			const data = await response.json();

			if (response.ok) {
				// setSuccess('Address saved successfully');
				toast.success('Address saved successfully')


			} else {
				setSuccess('');
				setErrors({ submit: data.message || 'An error occurred' });
			}
		} catch (error) {
			setSuccess('');
			setErrors({ submit: 'An error occurred while saving' });
		} finally {
			setLoading(false);
			setIsAddress(false)

		}
	};
	const showLabel = (field) => {
		return focused[field] || formData[field];
	};
	return (
		<div className='h-full overflow-y-scroll'>
			<div className='text-[18px] font-[600] my-4 text-[#000000] '>
				Address Information
			</div>
			<form className='gap-6 w-full flex flex-col' autoComplete='off' onSubmit={handleSubmit}>
				<div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-x-20 gap-x-10 sm:gap-y-0 gap-y-6'>
					<div className='sm:col-span-2 flex flex-col gap-6'>
						<div className='flex flex-col gap-6'>
							{['propertyName', 'address2'].map((field) => (
								<div key={field}>
									{showLabel(field) && (
										<label className='text-sm text-gray-600'>
											{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
											{field === 'propertyName' && <span className='text-red-500'> *</span>}
										</label>
									)}
									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										<input
											type='text'
											name={field}
											placeholder={
												focused[field]
													? ''
													: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
											}
											value={formData[field]}
											onChange={handleChange}
											onFocus={() => handleFocus(field)}
											onBlur={() => handleBlur(field)}
											className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
										/>
									</div>
									{errors[field] && (
										<p className='text-red-500 text-sm'>{errors[field]}</p>
									)}
								</div>
							))}

						</div>
						<div className='flex sm:flex-row flex-col gap-6'>
							{['city', 'state'].map((field) => (
								<div key={field} className='sm:w-1/2'>
									{showLabel(field) && (
										<label className='text-sm text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}<span className='text-red-500'> *</span>
										</label>
									)}
									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										<input
											type='text'
											name={field}
											placeholder={
												focused[field]
													? ''
													: field.charAt(0).toUpperCase() +
													field.slice(1).replace(/([A-Z])/g, ' $1')
											}
											value={formData[field]}
											onChange={(e) => {
												if (field === 'city') {
													// Only allow alphabetic characters and spaces for city
													const alphabeticValue = e.target.value.replace(/[^A-Za-z\s]/g, '');
													e.target.value = alphabeticValue;
												}
												handleChange(e);
											}}
											onFocus={() => handleFocus(field)}
											onBlur={() => handleBlur(field)}
											className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
										/>
									</div>
									{errors[field] && (
										<p className='text-red-500 text-sm'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>
					</div>
					<div className='sm:col-span-2 flex flex-col gap-6'>
						<div className='flex flex-col gap-6'>
							{['address1', 'displayAddress'].map((field) => (
								<div key={field}>
									{showLabel(field) && (
										<label className='text-sm text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}<span className='text-red-500'> *</span>
										</label>
									)}
									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										<input
											type='text'
											name={field}
											placeholder={
												focused[field]
													? ''
													: field.charAt(0).toUpperCase() +
													field.slice(1).replace(/([A-Z])/g, ' $1')
											}
											value={formData[field]}

											onChange={handleChange}
											onFocus={() => handleFocus(field)}
											onBlur={() => handleBlur(field)}
											className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
										/>
									</div>
									{errors[field] && (
										<p className='text-red-500 text-sm'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>
						<div className='flex sm:flex-row flex-col gap-6'>
							{['country', 'zipCode'].map((field) => (
								<div key={field} className='w-full md:sm:'>
									{showLabel(field) && (
										<label className='text-sm text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}
											<span className='text-red-500'> *</span>
										</label>
									)}

									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										{field === 'country' ? (
											<Select
												id='country'
												name='country'
												options={countryOptions}
												value={countryOptions.find(
													(option) => option.value === formData.country
												)}
												onChange={(selectedOption) => {
													setFormData({
														...formData,
														country: selectedOption?.value,
													});
													setErrors((prevErrors) => {
														const newErrors = { ...prevErrors };
														delete newErrors.country;
														return newErrors;
													});
												}}
												onFocus={() => handleFocus('country')}
												onBlur={() => handleBlur('country')}
												className='react-select-container'
												classNamePrefix='react-select'
												placeholder='Country'
												styles={{
													control: (provided) => ({
														...provided,
														border: 'none',
														boxShadow: 'none',
													}),
													indicatorSeparator: () => ({ display: 'none' }),
													singleValue: (provided) => ({
														...provided,
														color: '#000113',
														fontSize: '14px',
													}),
													placeholder: (provided) => ({
														...provided,
														fontSize: '14px',
													}),
													menu: (provided) => ({
														...provided,
														color: '#000113',
													}),
													option: (provided, state) => ({
														...provided,
														color: '#000113',
														backgroundColor: state.isFocused ? '#CBD5E1' : 'white',
														'&:hover': { backgroundColor: '#CBD5E1' },
													}),
												}}
											/>
										) : (
											<input
												type='text'
												name={field}
												placeholder={
													focused[field]
														? ''
														: field.charAt(0).toUpperCase() +
														field.slice(1).replace(/([A-Z])/g, ' $1')
												}
												value={formData[field]}
												onChange={handleChange}
												onFocus={() => handleFocus(field)}
												onBlur={() => handleBlur(field)}
												className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
											/>
										)}
									</div>

									{errors[field] && (
										<p className='text-red-500 text-sm'>{errors[field]}</p>
									)}
								</div>
							))}

						</div>
					</div>
				</div>

				<div className='text-[18px] font-[600] text-[#000000]'>
					Property Information
				</div>
				<div className='text-[18px] font-[600] text-[#000000]'>Headline</div>
				<div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-20'>
					<div className='sm:col-span-2 flex flex-col gap-6'>
						<div className='flex flex-col gap-6'>
							{['headline'].map((field) => (
								<div key={field}>
									{showLabel(field) && (
										<label className='text-sm text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}<span className='text-red-500'> *</span>
										</label>
									)}
									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										<input
											type='text'
											name={field}
											placeholder={
												focused[field]
													? ''
													: field.charAt(0).toUpperCase() +
													field.slice(1).replace(/([A-Z])/g, ' $1')
											}
											value={formData[field]}
											onChange={handleChange}
											onFocus={() => handleFocus(field)}
											onBlur={() => handleBlur(field)}
											className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
										/>
									</div>
									{errors[field] && (
										<p className='text-red-500 text-sm'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='text-[18px] font-[600] text-[#000000]'>
					Long Description
				</div>
				<div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-20'>
					<div className='sm:col-span-2 flex flex-col gap-6'>
						<div className='flex flex-col gap-6'>
							{['longDescription'].map((field) => (
								<div key={field}>
									{showLabel(field) && (
										<label className='text-sm text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}<span className='text-red-500'> *</span>
										</label>
									)}
									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										<input
											type='text'
											name={field}
											placeholder={
												focused[field]
													? ''
													: field.charAt(0).toUpperCase() +
													field.slice(1).replace(/([A-Z])/g, ' $1')
											}
											value={formData[field]}
											onChange={handleChange}
											onFocus={() => handleFocus(field)}
											onBlur={() => handleBlur(field)}
											className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
										/>
									</div>
									{errors[field] && (
										<p className='text-red-500 text-sm'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='text-[18px] font-[600] text-[#000000]'>
					Short Description
				</div>
				<div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-20'>
					<div className='sm:col-span-2 flex flex-col gap-6'>
						<div className='flex flex-col gap-6'>
							{['shortDescription'].map((field) => (
								<div key={field}>
									{showLabel(field) && (
										<label className='text-sm text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}<span className='text-red-500'> *</span>
										</label>
									)}
									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										<input
											type='text'
											name={field}
											placeholder={
												focused[field]
													? ''
													: field.charAt(0).toUpperCase() +
													field.slice(1).replace(/([A-Z])/g, ' $1')
											}
											value={formData[field]}
											onChange={handleChange}
											onFocus={() => handleFocus(field)}
											onBlur={() => handleBlur(field)}
											className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none'
										/>
									</div>
									{errors[field] && (
										<p className='text-red-500 text-sm'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='mt-4'>
					{success && <p className='text-green-500'>{success}</p>}
					{errors.submit && <p className='text-red-500'>{errors.submit}</p>}
				</div>

				<button
					className='py-1 font-alice btn cursor-pointer rounded-lg px-3 text-sm h-[48px]  font-medium  min-w-fit justify-center  flex items-center hover:bg-yellow hover:text-white duration-300  transition-colors hover:bg-[#004372] text-[#FFFFFF] bg-[#002B4B]  w-[140px]'
					disabled={loading}
				>
					Save Changes
				</button>
			</form>
		</div>
	);
};

export default AddressInfo;

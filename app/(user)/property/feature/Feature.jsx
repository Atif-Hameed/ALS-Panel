'use client';
import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import axios from 'axios';
import { API_BASE_URL } from '../../../api';
import toast from 'react-hot-toast';
// import { useSearchParams } from 'next/navigation';


const isEmpty = (value) =>
	value === null || value === undefined || String(value).trim() === '';

const isPositiveNumber = (value) => {
	if (isEmpty(value)) return true; // Empty is handled by required validation
	const num = Number(value);
	return !isNaN(num) && num > 0;
};

const isValidNumber = (value) => {
	if (isEmpty(value)) return true;
	return !isNaN(Number(value));
};

const isValidYear = (value) => {
	if (isEmpty(value)) return true;
	const num = Number(value);
	const currentYear = new Date().getFullYear();
	return !isNaN(num) && num >= 1800 && num <= currentYear;
};

const Feature = ({ propertyId, propertyName }) => {

	const [formData, setFormData] = useState({
		// Price
		for: '',
		state: '',
		price: '',
		currency: '',
		displayPrice: '',
		// Beds & Baths
		bedrooms: '',
		bathrooms: '',
		// Size & Type
		buildingSize: '', // Now holds the area size value
		buildingSizeUnit: '', // Unit for buildingSize (sq ft / sq m) - Renamed
		lotSizePropertySize: '',
		customText: '',
		yearBuilt: '',
		propertyType: '', // Dropdown
		architecturalStyle: '',
		// Taxes
		annualPropertyTaxes: '',
		condoHoaAssociationFee: '',
		feeAmount: '',
		terms: '', // Dropdown
		// More info
		mlsNumber: '',
		parcelNumber: '',
		parking: '',
		storage: '',
		// Amenities
		amenities: '',
	});
	const [errors, setErrors] = useState({});
	const [formError, setFormError] = useState('');
	const [focused, setFocused] = useState({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');

	// Corrected initialFormData - Removed propertySize, Renamed propertySizeUnit
	useEffect(() => {
		if (!propertyId) return;

		const fetchFeatures = async () => {
			try {
				// setLoading(true);
				console.log(propertyId)
				const res = await axios.get(`${API_BASE_URL}/property/getfeatures/${propertyId}`);
				const data = res.data.features;

				if (Array.isArray(data) && data.length > 0) {
					const feature = data[0];

					// Map only the keys that match your form
					setFormData(prev => ({
						...prev,
						for: feature.for || '',
						state: feature.state || '',
						price: feature.price || '',
						currency: feature.currency || '',
						displayPrice: feature.displayPrice || '',
						bedrooms: feature.bedrooms || '',
						bathrooms: feature.bathrooms || '',
						buildingSize: feature.buildingSize || '',
						buildingSizeUnit: feature.buildingSizeUnit || '', // only if API has it
						lotSizePropertySize: feature.lotSizePropertySize || '',
						customText: feature.customText || '',
						yearBuilt: feature.yearBuilt || '',
						propertyType: feature.propertyType || '',
						architecturalStyle: feature.architecturalStyle || '',
						annualPropertyTaxes: feature.annualPropertyTaxes || '',
						condoHoaAssociationFee: feature.condoHoaAssociationFee || '',
						feeAmount: feature.feeAmount || '',
						terms: feature.terms || '',
						mlsNumber: feature.mlsNumber || '',
						parcelNumber: feature.parcelNumber || '',
						parking: feature.parking || '',
						storage: feature.storage || '',
						amenities: feature.amenities || '',
					}));
				}

				// setLoading(false);
			} catch (error) {
				console.error('Error fetching features:', error);

				// setLoading(false);
			}
		};

		fetchFeatures();
	}, [propertyId]);
	const initialFormData = {
		for: '',
		state: '',
		price: '',
		currency: '',
		displayPrice: '',
		bedrooms: '',
		bathrooms: '',
		buildingSize: '',
		buildingSizeUnit: '', // Renamed
		lotSizePropertySize: '',
		customText: '',
		yearBuilt: '',
		propertyType: '',
		architecturalStyle: '',
		annualPropertyTaxes: '',
		condoHoaAssociationFee: '',
		feeAmount: '',
		terms: '',
		mlsNumber: '',
		parcelNumber: '',
		parking: '',
		storage: '',
		amenities: '',
	};
	const forOptions = [
		{ value: 'Sale', label: 'Sale' },
		{ value: 'Lease', label: 'Lease' },
		{ value: 'Rent', label: 'Rent' },
	];
	const currencyOptions = [
		{ value: 'USD', label: 'USD' },
		{ value: 'EUR', label: 'EUR' },
		{ value: 'GBP', label: 'GBP' },
		{ value: 'AUD', label: 'AUD' },
		{ value: 'CAD', label: 'CAD' },
		{ value: 'MXN', label: 'MXN' },
		{ value: 'INR', label: 'INR' },
	];
	const bedroomOptions = Array.from({ length: 50 }, (_, i) => ({
		value: (i + 1).toString(),
		label: (i + 1).toString(),
	}));

	const condoHoaFeeOptions = [
		{ value: 'HOA Fees', label: 'HOA Fees' },
		{ value: 'Condo Fees', label: 'Condo Fees' },
		{ value: 'Association Fees', label: 'Association Fees' },
		{ value: 'HOA + Condo Fees', label: 'HOA + Condo Fees' },
		{ value: 'HOA + Condo + Assoc Fees', label: 'HOA + Condo + Assoc Fees' },
		{ value: 'Membership Fees', label: 'Membership Fees' },
		{ value: 'Club Membership Fees', label: 'Club Membership Fees' },
		{ value: 'Recreation Fees', label: 'Recreation Fees' },
	];

	const termsOptions = [
		{ value: 'Per Month', label: 'Per Month' },
		{ value: 'Per Quarter', label: 'Per Quarter' },
		{ value: 'Per Year', label: 'Per Year' },
	];

	const propertyTypeOptions = [
		{ value: 'House', label: 'House' },
		{ value: 'Single Family', label: 'Single Family' },
		{ value: 'Condo', label: 'Condo' },
		{ value: 'Coop', label: 'Coop' },
		{ value: 'Cooperative', label: 'Cooperative' },
		{ value: 'Loft', label: 'Loft' },
		{ value: 'Detached', label: 'Detached' },
		{ value: 'Semi-Detached', label: 'Semi-Detached' },
		{ value: 'Cottage', label: 'Cottage' },
		{ value: 'Duplex', label: 'Duplex' },
		{ value: 'Triplex', label: 'Triplex' },
		{ value: 'Fourplex', label: 'Fourplex' },
		{ value: '2 on a Lot', label: '2 on a Lot' },
		{ value: '3 on a Lot', label: '3 on a Lot' },
		{ value: '4 on a Lot', label: '4 on a Lot' },
		{ value: 'Half-Duplex', label: 'Half-Duplex' },
		{ value: 'Home with Casita', label: 'Home with Casita' },
		{ value: 'Guest House', label: 'Guest House' },
		{ value: 'Townhome', label: 'Townhome' },
		{ value: 'Townhouse', label: 'Townhouse' },
		{ value: 'Retail', label: 'Retail' },
		{ value: 'Commercial', label: 'Commercial' },
		{ value: 'Commercial & Residential', label: 'Commercial & Residential' },
		{ value: 'Commercial & Multi-Residential', label: 'Commercial & Multi-Residential' },
		{ value: 'Development', label: 'Development' },
		{ value: 'Office/Retail', label: 'Office/Retail' },
		{ value: 'Industrial', label: 'Industrial' },
		{ value: 'Apartment', label: 'Apartment' },
		{ value: 'Apartments', label: 'Apartments' },
		{ value: 'Bungalow', label: 'Bungalow' },
		{ value: 'Unit', label: 'Unit' },
		{ value: 'Units', label: 'Units' },
		{ value: 'Multiple Units', label: 'Multiple Units' },
		{ value: 'Land', label: 'Land' },
		{ value: 'Farm', label: 'Farm' },
		{ value: 'Ranch', label: 'Ranch' },
		{ value: 'Hotel', label: 'Hotel' },
		{ value: 'Motel', label: 'Motel' },
	];

	// Renamed Options array
	const buildingSizeUnitOptions = [
		{ value: 'Square Feet', label: 'Square Feet' },
		{ value: 'Square Meters', label: 'Square Meters' },
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		if (errors[name]) {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				if (Object.keys(newErrors).length === 0) {
					setFormError('');
				}
				return newErrors;
			});
		}
	};

	const handleSelectChange = (selectedOption, actionMeta) => {
		const { name } = actionMeta;
		const value = selectedOption ? selectedOption.value : '';
		setFormData({ ...formData, [name]: value });
		if (errors[name]) {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				if (Object.keys(newErrors).length === 0) {
					setFormError('');
				}
				return newErrors;
			});
		}
	};

	const handleFocus = (field) => {
		setFocused({ ...focused, [field]: true });
	};
	const handleBlur = (field) => {
		setFocused({ ...focused, [field]: false });
	};

	const formatFieldName = (field) => {
		let formatted = field.replace(/([A-Z])/g, ' $1');
		formatted = formatted.replace(/H O A/g, 'HOA');
		formatted = formatted.replace(
			/Condo Hoa Association Fee/g,
			'Condo/HOA/Assoc Fee'
		);
		formatted = formatted.replace(/Hoa/g, 'HOA');
		formatted = formatted.replace(/Mls/g, 'MLS');
		formatted = formatted.replace(/Assoc/g, 'Assoc');
		// Renamed label formatting
		formatted = formatted.replace(/Building Size Unit/g, 'Building Area Unit');
		formatted = formatted.replace(/Building Size/g, 'Building Area Size');
		// Keep other specific formats
		formatted = formatted.replace(/Property Size Unit/g, 'Area Unit'); // Keep old ones just in case, though not used
		formatted = formatted.replace(/Property Size/g, 'Area Size');
		return formatted.charAt(0).toUpperCase() + formatted.slice(1);
	};

	const customSelectStyles = { // Styles remain the same
		control: (provided, state) => ({
			...provided,
			border: 'none',
			borderRadius: 0,
			boxShadow: 'none',
			minHeight: 'auto',
			height: '38px',
			backgroundColor: 'transparent',
		}),
		valueContainer: (provided) => ({
			...provided,
			padding: '2px 0px',
			height: '100%',
			alignItems: 'center',
		}),
		input: (provided) => ({
			...provided,
			margin: '0px',
			padding: '0px',
			color: '#000113',
			fontSize: '14px',
			fontWeight: '400',
		}),
		placeholder: (provided, state) => ({
			...provided,
			color: state.isFocused ? 'transparent' : '#A0AEC0',
			fontSize: '14px',
			fontWeight: '400',
			position: 'absolute',
			top: '50%',
			transform: 'translateY(-50%)',
			left: '0px',
		}),
		singleValue: (provided) => ({
			...provided,
			color: '#000113',
			fontSize: '14px',
			fontWeight: '400',
		}),
		indicatorSeparator: () => ({ display: 'none' }),
		dropdownIndicator: (provided) => ({
			...provided,
			padding: '8px 4px',
			color: '#A0AEC0',
			'&:hover': { color: '#718096' },
		}),
		menu: (provided) => ({
			...provided,
			marginTop: '0px',
			border: '1px solid #E2E8F0',
			boxShadow:
				'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			zIndex: 10,
			maxHeight: '250px',
			overflowY: 'hidden',
		}),
		option: (provided, state) => ({
			...provided,
			fontSize: '14px',
			backgroundColor: state.isSelected
				? '#002B4B'
				: state.isFocused
					? '#E2E8F0'
					: 'white',
			color: state.isSelected ? 'white' : '#000113',
			'&:active': {
				backgroundColor: !state.isDisabled
					? state.isSelected
						? '#002B4B'
						: '#D1D5DB'
					: undefined,
			},
		}),
	};

	// --- Render Input Field ---
	const renderInputField = (
		field,
		className = 'col-span-1',
		inputType = 'text'
	  ) => (
		<div key={field} className={`${className} flex flex-col`}>
		  <label className={`text-sm pb-3 transition-opacity duration-200 ease-in-out ${focused[field] || !isEmpty(formData[field]) ? 'opacity-100 text-gray-600' : 'opacity-0'}`}>
			{formatFieldName(field)}<span className="text-red-500 ml-1">*</span>
		  </label>
		  <div
			className={`border-b ${
			  errors[field]
				? 'border-red-500'
				: focused[field]
				? 'border-[#000113]'
				: 'border-[#CBD5E1]'
			} transition-colors duration-200 ease-in-out`}
		  >
			<input
			  type={inputType}
			  name={field}
			  placeholder={focused[field] || !isEmpty(formData[field]) ? '' : formatFieldName(field)}
			  value={formData[field]}
			  onChange={handleChange}
			  onFocus={() => handleFocus(field)}
			  onBlur={() => handleBlur(field)}
			  className="w-full pb-1 pt-1 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none bg-transparent placeholder-gray-400"
			  aria-invalid={errors[field] ? 'true' : 'false'}
			  aria-describedby={errors[field] ? `${field}-error` : undefined}
			/>
		  </div>
		  {errors[field] && (
			<p id={`${field}-error`} className="text-red-500 text-sm mt-1">
			  {errors[field]}
			</p>
		  )}
		</div>
	  );
	  


	// --- Render Select Field ---
	const renderSelectField = (field, options, className = 'col-span-1') => (
		<div key={field} className={`${className} flex flex-col`}>
		  <label className={`text-sm mb-1 transition-opacity duration-200 ease-in-out ${focused[field] || !isEmpty(formData[field]) ? 'opacity-100 text-gray-600' : 'opacity-0'}`}>
			{formatFieldName(field)}<span className="text-red-500 ml-1">*</span>
		  </label>
		  <div
			className={`border-b ${
			  errors[field]
				? 'border-red-500'
				: focused[field]
				? 'border-[#000113]'
				: 'border-[#CBD5E1]'
			} transition-colors duration-200 ease-in-out`}
		  >
			<Select
			  inputId={`${field}-select`}
			  instanceId={`select-${field}`}
			  name={field}
			  options={options}
			  value={options.find((option) => option.value === formData[field]) || null}
			  onChange={handleSelectChange}
			  placeholder={focused[field] || !isEmpty(formData[field]) ? '' : formatFieldName(field)}
			  onFocus={() => handleFocus(field)}
			  onBlur={() => handleBlur(field)}
			  styles={customSelectStyles}
			  isClearable
			  classNamePrefix="react-select"
			  className="w-full" 
			  aria-invalid={errors[field] ? 'true' : 'false'}
			  aria-describedby={errors[field] ? `${field}-error` : undefined}
			/>
		  </div>
		  {errors[field] && (
			<p id={`${field}-error`} className="text-red-500 text-sm mt-1">
			  {errors[field]}
			</p>
		  )}
		</div>
	  );
	  


	// --- Render Creatable Select Field ---
	const renderCreatableSelectField = (field, options, className = 'w-full') => (
		<div key={field} className={className}>
			<label className={`text-sm transition-opacity duration-200 ease-in-out ${focused[field] || !isEmpty(formData[field]) ? 'opacity-100 text-gray-600' : 'opacity-0'}`}>
				{/* {formatFieldName(field)}<span className="text-red-500 ml-1">*</span> */}
			</label>
			<div
				className={`border-b ${errors[field]
						? 'border-red-500'
						: focused[field]
							? 'border-[#000113]'
							: 'border-[#CBD5E1]'
					} transition-colors duration-200 ease-in-out`}
			>
				<CreatableSelect
					inputId={`${field}-select`}
					instanceId={`select-${field}`}
					name={field}
					options={options}
					value={
						options.find((option) => option.value === formData[field]) ||
						(formData[field] ? { label: formData[field], value: formData[field] } : null)
					}
					onChange={handleSelectChange}
					placeholder={focused[field] || !isEmpty(formData[field]) ? '' : formatFieldName(field)} // Placeholder logic adjustment
					onFocus={() => handleFocus(field)}
					onBlur={() => handleBlur(field)}
					styles={customSelectStyles} // Apply base styles
					isClearable
					formatCreateLabel={(inputValue) => `-- Write custom: "${inputValue}" --`}
					classNamePrefix='react-select'
					className='h-[38px] -mt-1' // Adjust margin slightly for alignment with label change
					aria-invalid={errors[field] ? 'true' : 'false'}
					aria-describedby={errors[field] ? `${field}-error` : undefined}
				/>
			</div>
			{errors[field] && (
				<p id={`${field}-error`} className='text-red-500 text-sm mt-1'>
					{errors[field]}
				</p>
			)}
		</div>
	);

	const renderTextAreaField = (field, placeholder) => (
		<div key={field} className='w-full col-span-full'>
			<label className={`text-sm transition-opacity duration-200 ease-in-out ${focused[field] || !isEmpty(formData[field]) ? 'opacity-100 text-gray-600' : 'opacity-0'}`}>
				{formatFieldName(field)}<span className="text-red-500 ml-1">*</span>
			</label>
			<div
				className={`border-b ${errors[field]
						? 'border-red-500'
						: focused[field]
							? 'border-[#000113]'
							: 'border-[#CBD5E1]'
					} transition-colors duration-200 ease-in-out`}
			>
				<textarea
					name={field}
					placeholder={
						focused[field] || !isEmpty(formData[field]) ? '' : placeholder || formatFieldName(field)
					}
					value={formData[field]}
					onChange={handleChange}
					onFocus={() => handleFocus(field)}
					onBlur={() => handleBlur(field)}
					rows={1}
					className='w-full pb-1 pt-1 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none resize-none bg-transparent placeholder-gray-400'
					aria-invalid={errors[field] ? 'true' : 'false'}
					aria-describedby={errors[field] ? `${field}-error` : undefined}
				/>
			</div>
			{errors[field] && (
				<p id={`${field}-error`} className='text-red-500 text-sm mt-1'>
					{errors[field]}
				</p>
			)}
		</div>
	);

	const validateForm = () => {
		const newErrors = {};

		const requiredFields = [
			'for',
			'state',
			'price',
			'currency',
			'bedrooms',
			'bathrooms',
			'buildingSize', // Added
			'buildingSizeUnit', // Renamed/Added
			'yearBuilt',
			'propertyType',
		];

		requiredFields.forEach((field) => {
			if (isEmpty(formData[field])) {
				newErrors[field] = `${formatFieldName(field)} is required`;
			}
		});

		// --- Specific format validations ---

		if (!newErrors.price && !isPositiveNumber(formData.price)) {
			newErrors.price = 'Price must be a positive number';
		}

		if (!newErrors.bathrooms) {
			if (isNaN(Number(formData.bathrooms))) {
				// Allow text
			} else if (!isPositiveNumber(formData.bathrooms)) {
				newErrors.bathrooms = 'Bathrooms must be a positive number if specified numerically';
			}
		}

		// Validate buildingSize - added
		if (!newErrors.buildingSize && !isPositiveNumber(formData.buildingSize)) {
			newErrors.buildingSize = 'Building Area Size must be a positive number';
		}

		if (!newErrors.yearBuilt && !isValidYear(formData.yearBuilt)) {
			newErrors.yearBuilt = 'Please enter a valid year (e.g., 1800-present)';
		}

		// --- Optional fields with numeric validation ---
		const optionalNumeric = ['annualPropertyTaxes', 'feeAmount'];
		optionalNumeric.forEach((field) => {
			if (!isEmpty(formData[field]) && !isValidNumber(formData[field])) {
				newErrors[field] = `${formatFieldName(field)} must be a valid number`;
			}
		});

		setErrors(newErrors);
		console.log("Validation Errors:", newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccess('');
		setFormError('');

		const isValid = validateForm();

		if (isValid) {

			setLoading(true);
			// Payload automatically uses current formData state
			const payload = { ...formData, propertyId };

			try {
				const response = await axios.post(
					`${API_BASE_URL}/property/create-feature`,
					payload
				);
				console.log('API Response:', response.data);
				// setSuccess(response.data.message || 'Features created successfully!');
				toast.success(response.data.message || 'Features created successfully!')
				// setFormData(initialFormData);
				setErrors({});
				setFocused({});
				setTimeout(() => setSuccess(''), 4000);
			} catch (error) {
				// ... (Error handling logic remains largely the same) ...
				console.error('API Error:', error);
				let errorMessage = 'Failed to save features. Please try again.';
				if (error.response) {
					console.error('Error data:', error.response.data);
					console.error('Error status:', error.response.status);
					errorMessage =
						error.response.data.message ||
						`Server error (${error.response.status})`;
					if (error.response.status === 409) {
						errorMessage = 'Features already exist for this property.';
					} else if (
						error.response.status === 404 &&
						error.response.data.message?.includes('Property not found')
					) {
						errorMessage = 'Associated property could not be found.';
					} else if (error.response.status === 400) {
						if (error.response.data && typeof error.response.data.errors === 'object') {
							setErrors(error.response.data.errors);
							errorMessage = 'Please check the highlighted fields.';
						} else {
							errorMessage = `Submission error: ${error.response.data.message || 'Invalid data'}`;
						}
					}
				} else if (error.request) {
					console.error('Error request:', error.request);
					errorMessage = 'Network error: Could not connect to the server.';
				} else {
					console.error('Error message:', error.message);
					errorMessage = `An unexpected error occurred: ${error.message}`;
				}
				setFormError(errorMessage);
			} finally {
				setLoading(false);
			}
		} else {
			console.log('Form validation failed. Errors:', errors);
			toast.error('Please fill the mandatory fields.');
			const firstErrorKey = Object.keys(errors)[0];
			if (firstErrorKey) {
				const element =
					document.getElementById(`${firstErrorKey}-select`) ||
					document.querySelector(`[name="${firstErrorKey}"]`);
				try {
					if (element) {
						element.scrollIntoView({ behavior: 'smooth', block: 'center' });
						setTimeout(() => element.focus({ preventScroll: false }), 100);
					}
				} catch (e) {
					console.error('Focus/scroll error:', e);
				}
			}
		}
	};

	return (
		<div className='h-full overflow-y-scroll'>
			<form
				className='sm:gap-6 w-full flex flex-col'
				onSubmit={handleSubmit}
				noValidate
			>
				{/* Price Section */}
				<div className='text-[18px] font-[600] mt-4 sm:mb-2 text-[#000000] '>
					Price
				</div>
				<div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-x-8 gap-x-4 sm:gap-y-6">
					{renderSelectField('for', forOptions)}
					{renderInputField('state')}
					{renderInputField('price', 'col-span-1', 'number')}
					{renderSelectField('currency', currencyOptions)}
					{renderInputField('displayPrice', 'sm:col-span-2')}
				</div>

				{/* Beds & Baths Section */}
				<div className='text-[18px] font-[600] mt-6 sm:mb-2 text-[#000000] '>
					Beds & Baths
				</div>
				<div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-x-8 gap-x-4 sm:gap-y-6'>
					{renderSelectField('bedrooms', bedroomOptions, 'sm:col-span-2')}
					{renderSelectField('bathrooms', bedroomOptions, 'sm:col-span-2')}
				</div>

				{/* Size & Type Section - Corrected */}
				<div className='text-[18px] font-[600] mt-6 mb-2 text-[#000000] '>
					Size & Type
				</div>
				<div className='grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-x-8 gap-x-4 sm:gap-y-6'>
					{/* buildingSize input field */}
					{renderInputField('buildingSize', 'col-span-1', 'number')}
					{/* buildingSizeUnit select field - Renamed */}
					{renderSelectField(
						'buildingSizeUnit', // Renamed field name
						buildingSizeUnitOptions, // Use renamed options
						'col-span-1'
					)}

					{renderInputField('lotSizePropertySize', 'sm:col-span-2')}
					{renderInputField('customText', 'sm:col-span-2')}
					{renderInputField('yearBuilt', 'sm:col-span-2', 'number')}
					{renderSelectField('propertyType', propertyTypeOptions, 'sm:col-span-2')}
					{renderInputField('architecturalStyle', 'sm:col-span-2')}
				</div>

				{/* Taxes Section */}
				<div className='text-[18px] font-[600] mt-6 mb-2 text-[#000000] '>
					Taxes
				</div>
				<div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-x-8 gap-x-4 gap-y-6'>
					{renderInputField('annualPropertyTaxes', 'md:col-span-2 -mt-7', 'number')}
					{renderCreatableSelectField('condoHoaAssociationFee', condoHoaFeeOptions, 'md:col-span-2')}
					{renderInputField('feeAmount', 'md:col-span-2 md:-mt-0 -mt-6', 'number')}
					{renderSelectField('terms', termsOptions, 'md:col-span-2 md:-mt-0 -mt-6')}
				</div>

				{/* More info Section */}
				<div className='text-[18px] font-[600] mt-6 mb-2 text-[#000000] '>
					More info
				</div>
				<div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-x-8 gap-x-4 sm:gap-y-6'>
					{renderInputField('MlsNumber', 'col-span-1')}
					{renderInputField('parcelNumber', 'col-span-1')}
					{renderInputField('parking', 'col-span-1')}
					{renderInputField('storage', 'col-span-1')}
				</div>

				{/* Amenities Section */}
				<div className='text-[18px] font-[600] mt-6 mb-2 text-[#000000] '>
					Annemities
				</div>
				<div className='grid grid-cols-1 gap-x-20 '>
					{renderTextAreaField('annemities', 'Enter here...')}
				</div>

				{/* Submission Area */}
				<div className='flex flex-col items-end gap-2 mt-6'>
					{formError && Object.keys(errors).length > 0 && (
						<p className='text-red-500 text-sm w-full text-right'>
							{formError}
						</p>
					)}
					{formError && Object.keys(errors).length === 0 && !success && (
						<p className='text-red-500 text-sm w-full text-right'>
							{formError}
						</p>
					)}
					<div className='flex items-center justify-start w-full gap-4'>
						{/* {success && <p className='text-green-500 text-sm'>{success}</p>} */}
						<button
							type='submit'
							className=' font-alice btn cursor-pointer rounded-lg px-3 h-[48px] text-sm  font-medium  min-w-fit justify-center  flex items-center hover:bg-yellow hover:text-white duration-300  transition-colors hover:bg-[#004372] text-[#FFFFFF] bg-[#002B4B]  w-[160px]'
							disabled={loading}
						>
							{loading ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Feature;
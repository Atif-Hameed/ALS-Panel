'use client';

import { useState } from 'react';
import { useSignup } from '../SignupContext';
import Image from 'next/image';
import LeftSide from './LeftSide';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../api';
import toast from 'react-hot-toast';
const SignUpLicense = ({ setSteps, steps }) => {
	const router = useRouter();
	const {
		signupLicense,
		signupAddress,
		signupData,
		signupContact,
		setSignupLicense,
	} = useSignup();

	const [formData, setFormData] = useState({
		licenseType: signupLicense?.licenseType || '',
		licenseNumber: signupLicense?.licenseNumber || '',
		association: signupLicense?.association || '',
		agency: signupLicense?.agency || '',
		expiryDate: signupLicense?.expiryDate || '',
		accountType: signupLicense?.accountType || '',
		termsAccepted: false,
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');
	const [focused, setFocused] = useState({});

	const handleFocus = (field) => {
		setFocused((prev) => ({ ...prev, [field]: true }));
	};

	const handleBlur = (field) => {
		setFocused((prev) => ({ ...prev, [field]: false }));
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});

		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: value ? '' : prevErrors[name],
		}));
	};

	const validateForm = () => {
		let newErrors = {};
		Object.keys(formData).forEach((field) => {
			if (!formData[field] && field !== 'termsAccepted') {
				newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required`;
			}
		});
		if (!formData.termsAccepted) {
			newErrors.termsAccepted = 'You must agree to the terms & conditions';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccess('');
		setLoading(true);

		if (!validateForm()) {
			setLoading(false);
			return;
		}

		setSignupLicense(formData)

		const requestData = {
			...signupData,
			...signupAddress,
			phoneNumber: signupContact,
			...formData,
		};

		try {
			const response = await fetch(`${API_BASE_URL}/auth/create-user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestData),
			});

			// ✅ Only parse JSON if response is OK
			let result = {};
			if (response.ok) {
				result = await response.json();
			} else {
				const errorResult = await response.json();
				throw new Error(errorResult.message || 'Something went wrong');
			}

			// ✅ User created successfully
			toast.success('Your account has been registered!');
			setSteps(3);
			setTimeout(() => {
				router.push('/login');
			}, 1500);

			// Reset state correctly

		} catch (error) {
			// ✅ Set error only if there was a real issue
			setErrors({ apiError: error.message });
		} finally {
			setLoading(false);
		}
	};
	const showLabel = (field) => {

		return focused[field] || formData[field];
	};

	const isFormValid = () => {
		const requiredFields = ['licenseType', 'licenseNumber', 'association', 'agency', 'expiryDate', 'accountType'];
		const allFieldsFilled = requiredFields.every(field => !!formData[field]);
		return allFieldsFilled && formData.termsAccepted;
	};

	return (
		<div className='flex h-screen overflow-hidden'>
			<LeftSide setSteps={setSteps} steps={steps} />
			<div className='md:w-1/2 sm:w-[60%] w-full flex items-center justify-center'>
				<div className='w-full p-4'>
					<h2 className='text-[#002B4B] text-[32px] font-[800] text-center mb-10'>
						Sign up
					</h2>
					{/* {success && <p className='text-green-500 text-center mb-6'>{success}</p>} */}
					<form
						onSubmit={handleSubmit}
						autoComplete="off"
						className='gap-6 w-full flex flex-col items-center'
					>
						<div className='flex space-x-4 w-[349px]'>
							{['licenseType', 'licenseNumber'].map((field) => (
								<div key={field} className='w-1/2'>
									{showLabel(field) && (
										<label className='text-[14px] font-[400] text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}
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
										<p className='text-red-500 text-[14px] font-[400]'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>
						<div className='flex space-x-4 w-[349px]'>
							{['association', 'agency'].map((field) => (
								<div key={field} className='w-1/2'>
									{showLabel(field) && (
										<label className='text-[14px] font-[400] text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}
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
										<p className='text-red-500 text-[14px] font-[400]'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>
						<div className='flex space-x-4 w-[349px]'>
							{['expiryDate', 'accountType'].map((field) => (
								<div key={field} className='w-1/2'>
									{showLabel(field) && (
										<label className='text-[14px] font-[400] text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}
										</label>
									)}
									<div
										className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
											}`}
									>
										<input
											type={field === 'expiryDate' ? 'date' : 'text'}
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
										<p className='text-red-500 text-[14px] font-[400]'>{errors[field]}</p>
									)}
								</div>
							))}
						</div>

						<div className='flex items-center w-[349px] gap-2'>
							<input
								type='checkbox'
								className='h-[17px] w-[17px] rounded-[3px] border border-[#CBD5E1] bg-white'
								name='termsAccepted'
								checked={formData.termsAccepted}
								onChange={handleChange}
							/>
							<label className='text-[#475569] text-[14px] font-[400]'>
								I agree with your Terms & Conditions.
							</label>
						</div>
						{errors.termsAccepted && (
							<p className='text-red-500 text-[14px] font-[400]'>{errors.termsAccepted}</p>
						)}

						<button
							type='submit'
							className={`w-[349px] cursor-pointer h-[40px] text-white bg-[#002B4B] font-[500] text-[14px] p-2 rounded-[4px] hover:bg-blue-900 ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							disabled={loading || !isFormValid()}
						>
							{loading ? 'Loading...' : 'Sign Up'}
						</button>
						{errors.apiError && (
							<p className='text-red-500 text-center'>{errors.apiError}</p>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignUpLicense;

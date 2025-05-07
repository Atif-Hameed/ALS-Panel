'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSignup } from '../SignupContext';
import LeftSide from './LeftSide';
import { API_BASE_URL } from '../../api';

const SignupPersonal = ({ setSteps }) => {
	const { setSignupData, signupData } = useSignup();
	const [formData, setFormData] = useState({
		firstName: signupData?.firstName || '',
		lastName: signupData?.lastName || '',
		userName: signupData?.userName || '',
		email: signupData?.email || '',
		password: signupData?.password || '',
		confirmPassword: signupData?.confirmPassword || '',
	});

	const [errors, setErrors] = useState({});
	const [focused, setFocused] = useState({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [existingUsers, setExistingUsers] = useState([]);

	const router = useRouter();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/auth/get-user`);
				const data = await response.json();
				setExistingUsers(data);
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};
		fetchUsers();
	}, []);

	// ✅ Validate userName & email real-time
	useEffect(() => {
		let newErrors = { ...errors };

		if (formData.userName) {
			const userExists = existingUsers.some(user => user.userName === formData.userName);
			if (userExists) {
				newErrors.userName = 'Username already exists';
			} else {
				delete newErrors.userName;
			}
		}

		if (formData.email) {
			const emailExists = existingUsers.some(user => user.email === formData.email);
			if (emailExists) {
				newErrors.email = 'Email already exists';
			} else {
				delete newErrors.email;
			}
		}

		setErrors(newErrors);
	}, [formData.userName, formData.email, existingUsers]);


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

	const validateForm = () => {
		let newErrors = {};
		Object.keys(formData).forEach((field) => {
			if (!formData[field]) {
				newErrors[field] = `${field.charAt(0).toUpperCase() +
					field.slice(1).replace(/([A-Z])/g, ' $1')
					} is required`;
			}
		});

		if (formData.password.length < 6) {
			newErrors.confirmPassword = 'Password must be at least 6 characters long.';
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
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
		setSignupData(formData);
		setSteps(1);
		setLoading(false);
		setSuccess('User data saved successfully!');
	};
	const showLabel = (field) => {
		return focused[field] || formData[field];
	};
	return (
		<div className='flex h-screen overflow-hidden'>
			<LeftSide setSteps={setSteps} />
			<div className='md:w-1/2 sm:w-[60%] w-full flex items-center justify-center'>
				<div className='w-full p-4'>
					<h2 className='text-[#002B4B] text-[32px] font-[800] text-center mb-10'>
						Sign Up
					</h2>

					{errors.general && (
						<p className='text-red-500 text-center'>{errors.general}</p>
					)}
					{success && <p className='text-green-500 text-center'>{success}</p>}

					<form
						autoComplete="off"
						onSubmit={handleSubmit}
						className='gap-6 w-full flex flex-col items-center'
					>
						{/* First Name and Last Name in one row */}
						<div className='flex space-x-4 w-[349px]'>
							{['firstName', 'lastName'].map((field) => (
								<div key={field} className='w-1/2'>
									{showLabel(field) && (
										<label className='text-[14px] font-[400] text-gray-600'>
											{field.charAt(0).toUpperCase() +
												field.slice(1).replace(/([A-Z])/g, ' $1')}
												<span className="text-red-500">*</span>
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
											autoComplete="off"
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

						{/* Other input fields */}
						{['userName', 'email'].map((field) => (
							<div key={field} className='w-[349px]'>
								{showLabel(field) && (
									<label className='text-[14px] font-[400] text-gray-600'>
										{field.charAt(0).toUpperCase() +
											field.slice(1).replace(/([A-Z])/g, ' $1')}
											<span className="text-red-500">*</span>
									</label>
								)}
								<div
									className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
										}`}
								>
									<input
										type={field.includes('password') ? 'password' : 'text'}
										name={field}
										autoComplete="off"
										placeholder={
											field === 'email'
												? 'Enter your email' // Dummy email placeholder
												: focused[field]
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
						{['password', 'confirmPassword'].map((field) => (
							<div key={field} className='w-[349px] relative'>
								{showLabel(field) && (
									<label className='text-[14px] font-[400] text-gray-600'>
										{field.charAt(0).toUpperCase() +
											field.slice(1).replace(/([A-Z])/g, ' $1')}
											<span className="text-red-500">*</span>
									</label>
								)}
								<div
									className={`border-b ${focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
										} flex items-center`}
								>
									<input
										type={
											field === 'password'
												? showPassword
													? 'text'
													: 'password'
												: showConfirmPassword
													? 'text'
													: 'password'
										}
										autoComplete="off"
										name={field}
										placeholder={
											field.charAt(0).toUpperCase() +
											field.slice(1).replace(/([A-Z])/g, ' $1')
										}
										value={formData[field]}
										onChange={handleChange}
										onFocus={() => handleFocus(field)}
										onBlur={() => handleBlur(field)}
										className='w-full py-2 text-[14px] font-[400] text-[#000113] focus:ring-0 focus:outline-none pr-8'
									/>
									<span
										className='absolute right-2 cursor-pointer text-gray-600'
										onClick={() => {
											if (field === 'password') setShowPassword(!showPassword);
											else setShowConfirmPassword(!showConfirmPassword);
										}}
									>
										{field === 'password' ? (
											showPassword ? (
												<FaEyeSlash size={20} />
											) : (
												<FaEye size={20} />
											)
										) : showConfirmPassword ? (
											<FaEyeSlash size={20} />
										) : (
											<FaEye size={20} />
										)}
									</span>
								</div>
								{errors[field] && (
									<p className='text-red-500 text-[14px] font-[400]'>{errors[field]}</p>
								)}
							</div>
						))}

						<button
							type='submit'
							className='w-[349px] cursor-pointer h-[40px] text-white bg-[#002B4B] font-[500] text-[14px] p-2 rounded-[4px] hover:bg-blue-900'
							disabled={loading}
						>
							{loading ? 'loading...' : 'Continue'}
						</button>

						<div className='flex w-[349px] justify-between text-[14px] font-[400]'>
							<a
								href='/login'
								className='text-[#828282] text-[14px] font-[500] hover:underline'
							>
								Already have an account?
							</a>
							<a
								href='/login'
								className='text-[#002B4B] text-[14px] font-[500] hover:underline'
							>
								Log in
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignupPersonal;

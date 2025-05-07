'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import {  useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_BASE_URL } from '../../api';

const ConfirmPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPasswordFocused, setNewPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tokenFromParams = params.get('token');
            if (tokenFromParams) {
                setToken(tokenFromParams);
            }
        }
    }, []);

    const validatePassword = (password) => {
        // At least 6 characters
        if (password.length < 6) {
            return 'Password must be at least 6 characters long.';
        }
        // At least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter.';
        }
        // At least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter.';
        }
        // At least one number
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number.';
        }
        // At least one special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return 'Password must contain at least one special character.';
        }
        return '';
    };

    const validateForm = () => {
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            setError("Invalid token.");
            return;
        }

        // Validate before submission
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSuccess('');
        setError(''); // Clear previous errors

        try {
            const response = await fetch(`${API_BASE_URL}/auth/confirm-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setSuccess('Password reset successful. Redirecting to login...');
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            setError(err.message || 'An error occurred during password reset');
        } finally {
            setLoading(false);
        }
    };

    const showLabel = (value, isFocused) => {
        return isFocused || value;
    };
	return (
		<div className='flex h-screen overflow-hidden bg-white'>
			<div className='md:w-1/2 sm:w-[40%] hidden sm:flex relative'>
				<Image
					src='/assets/leftside.svg'
					alt='City View'
					layout='fill'
					objectFit='cover'
				/>
			</div>

			<div className='md:w-1/2 sm:w-[60%] w-full flex items-center bg-white justify-center'>
				<div className='w-full p-4'>
					<h2 className='text-[#002B4B] text-[32px] font-[800] text-center mb-6'>
						Confirm Password
					</h2>

					<form
						onSubmit={handleSubmit}
						className='gap-6 w-full flex flex-col items-center justify-center'
					>
						<div className='w-[349px]'>
							{showLabel(newPassword, newPasswordFocused) && (
								<label
									htmlFor='newPassword'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									New Password
								</label>
							)}
							<div
								className={`border-b flex ${
									newPasswordFocused ? 'border-[#000113]' : 'border-[#CBD5E1]'
								} transition-colors duration-200`}
							>
								<input
									type={showPassword1 ? 'text' : 'password'}
									id='newPassword'
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder={newPasswordFocused ? '' : 'New Password'}
									className='mt-1 w-[349px] py-2 text-[14px] font-[400] text-[#000113] rounded-md focus:ring-0 focus:outline-none bg-transparent'
									onFocus={() => setNewPasswordFocused(true)}
									onBlur={() => setNewPasswordFocused(false)}
								/>
								<button
									type='button'
									onClick={() => setShowPassword1(!showPassword1)}
									className='text-gray-500 ml-2'
								>
									{showPassword1 ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						<div className='w-[349px]'>
							{showLabel(confirmPassword, confirmPasswordFocused) && (
								<label
									htmlFor='confirmPassword'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									Confirm Password
								</label>
							)}
							<div
								className={`border-b flex ${
									confirmPasswordFocused
										? 'border-[#000113]'
										: 'border-[#CBD5E1]'
								} transition-colors duration-200`}
							>
								<input
									type={showPassword ? 'text' : 'password'}
									id='confirmPassword'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder={confirmPasswordFocused ? '' : 'Confirm Password'}
									className='mt-1 w-[349px] py-2 text-[14px] font-[400] text-[#000113] rounded-md focus:ring-0 focus:outline-none bg-transparent'
									onFocus={() => setConfirmPasswordFocused(true)}
									onBlur={() => setConfirmPasswordFocused(false)}
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='text-gray-500 ml-2'
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						{error && <p className='text-red-500 text-sm'>{error}</p>}
						{success && <p className='text-green-500 text-sm'>{success}</p>}

						<button
							type='submit'
							className='w-[349px] cursor-pointer text-[#FFFFFF] bg-[#002B4B] font-[500] text-[14px] h-[40px] rounded-[4px] hover:bg-blue-900'
							disabled={loading}
						>
							{loading ? 'Updating...' : 'Update Password'}
						</button>

						<div className='flex w-[349px] justify-between text-sm'>
							<a
								href='/forget'
								className='text-[#002B4B] text-[14px] font-[500] hover:underline'
							>
								Forgot?
							</a>
							<span className='text-[#828282] text-[14px] font-[500]'>
								Don't have an account?{' '}
								<a
									href='/signup'
									className='text-[#002B4B] text-[14px] font-[500] hover:underline'
								>
									Create now
								</a>
							</span>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ConfirmPassword;

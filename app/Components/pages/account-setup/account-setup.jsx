'use client';
import React, { useState } from 'react';
import Button from '../../shared/custom-btn';
import CustomLink from '../../shared/custom-link';
import CustomInput from '../../shared/custom-input';
import { updateUser, verifyOTP } from '../../../actions/user.action';

const AccountSetupForm = ({ initialEmail, userId,plan }) => {
    const [formData, setFormData] = useState({
        email: initialEmail || '',
        password: '',
        confirmPassword: '',
        useProvidedEmail: !!initialEmail
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [otpData, setOtpData] = useState({
        showOtpForm: false,
        otp: '',
        pendingFields: [], // ['email', 'password']
        pendingEmail: null
    });
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prev => ({ ...prev, [name]: null, submit: null }));
        setMessage(null);
    };

    const handleOtpChange = (e) => {
        const { value } = e.target;
        setOtpData(prev => ({
            ...prev,
            otp: value.replace(/\D/g, '').slice(0, 6)
        }));
        setErrors(prev => ({ ...prev, otp: null }));
        setMessage(null);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOtpForm = () => {
        if (!otpData.otp || otpData.otp.length !== 6) {
            setErrors({ otp: 'Please enter a valid 6-digit OTP' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setMessage(null);

        try {
            const updateData = {
                email: formData.email !== initialEmail ? formData.email : undefined,
                password: formData.password || undefined
            };

            const { data, error } = await updateUser(userId, updateData);

            console.log(data, error )
            if(data.message === 'Email already in use by another account' || !data.success){
                setErrors({ submit: data.message || 'Failed Update User. Please try again.' });
                return;
            }

            if (error || !data) {
                setErrors({ submit: error || 'Failed to send OTP. Please try again.' });
                return;
            }

            if (data.requiresVerification) {
                setOtpData(prev => ({
                    ...prev,
                    showOtpForm: true,
                    pendingFields: data.fields,
                    pendingEmail: updateData.email || initialEmail
                }));
                setMessage(data.message);
            } else {
                setIsSuccess(true);
                setMessage('Account updated successfully!');
            }
        } catch (error) {
            setErrors({ submit: error.message || 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (!validateOtpForm()) return;

        setIsSubmitting(true);
        setMessage(null);

        try {
            const { data, error } = await verifyOTP(userId, { otp: otpData.otp });

            if (error || !data) {
                setErrors({ otp: error || 'Invalid OTP. Please try again.' });
                return;
            }

            if (!data.success) {
                setErrors({ otp: data.message || 'OTP verification failed.' });
                return;
            }

            setIsSuccess(true);
            setMessage('Account updated successfully!');
        } catch (error) {
            setErrors({ submit: error.message || 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        setIsSubmitting(true);
        setMessage(null);

        try {
            const updateData = {
                email: otpData.pendingEmail !== initialEmail ? otpData.pendingEmail : undefined,
                password: formData.password || undefined
            };

            const { data, error } = await updateUser(userId, updateData);

            if (error || !data) {
                setErrors({ submit: error || 'Failed to resend OTP. Please try again.' });
                return;
            }

            setMessage(data.message);
        } catch (error) {
            setErrors({ submit: error.message || 'Failed to resend OTP. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-lg mx-auto p-6 my-20 bg-white rounded-lg shadow-md text-center">
                <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h2 className="text-2xl font-bold mb-2">Account Setup Complete!</h2>
                <p className="mb-6">{message}</p>
                <CustomLink
                    href={'/dashboard'}
                    className="!w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Go to Dashboard
                </CustomLink>
            </div>
        );
    }

    if (otpData.showOtpForm) {
        return (
            <div className="max-w-xl mx-auto p-8 bg-gradient-to-br from-white my-10 to-gray-50 rounded-2xl shadow-md border border-gray-100">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Verify Your Update</h2>
                    <p className="text-gray-600 mt-2">
                        We've sent a 6-digit verification code to {otpData.pendingEmail}.
                        Please check your inbox (and spam/junk folder).
                    </p>
                    {message && (
                        <p className="text-green-600 mt-2 font-medium">{message}</p>
                    )}
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            Verification Code
                        </label>
                        <CustomInput
                            inputType="text"
                            name="otp"
                            value={otpData.otp}
                            onChange={handleOtpChange}
                            inputStyle="w-full !bg-slate-50 text-center tracking-widest font-mono"
                            placeholder="123456"
                            maxLength="6"
                            error={errors.otp}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                            disabled={isSubmitting}
                        >
                            Resend OTP
                        </button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            loadingLabel="Verifying..."
                            label="Verify & Update"
                            style="rounded-lg disabled:opacity-70 disabled:cursor-not-allowed bg-darkGray"
                        />
                    </div>

                    {errors.submit && (
                        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-700 font-medium">{errors.submit}</span>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-8 bg-gradient-to-br from-white my-10 to-gray-50 rounded-2xl shadow-md border border-gray-100 transform transition-all hover:shadow-lg">
            <div className="mb-8 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white shadow-lg">
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                        <h2 className="text-2xl font-bold">{plan === 'free' ? 'Free Plan Selected' : 'Payment Successful!'}</h2>
                        <p className="text-green-100">{plan === 'free' ? 'Thank you for selecting free plan.' : 'Thank you for your purchase.'} Please complete your account setup.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {initialEmail && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg transition-all duration-200 hover:bg-blue-100">
                        <input
                            type="checkbox"
                            id="useProvidedEmail"
                            name="useProvidedEmail"
                            checked={formData.useProvidedEmail}
                            onChange={handleChange}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="useProvidedEmail" className="flex-1 ml-2">
                            <span className="block font-medium text-gray-700">Use provided email</span>
                            <span className="block text-sm text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                                {initialEmail}
                            </span>
                        </label>
                    </div>
                )}

                {(!formData.useProvidedEmail || !initialEmail) && (
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <CustomInput
                            inputType="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            inputStyle="w-full !bg-slate-50"
                            error={errors.email}
                        />
                    </div>
                )}

                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <CustomInput
                        inputType="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        inputStyle="w-full !bg-slate-50"
                        error={errors.password}
                    />
                    <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                </div>

                <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <CustomInput
                        inputType="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        inputStyle="w-full !bg-slate-50"
                        error={errors.confirmPassword}
                    />
                </div>

                {message && (
                    <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-700 font-medium">{message}</span>
                        </div>
                    </div>
                )}

                {errors.submit && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 font-medium">{errors.submit}</span>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    loadingLabel="Submitting..."
                    label="Complete Account Setup"
                    style="w-full rounded-lg disabled:opacity-70 disabled:cursor-not-allowed bg-darkGray"
                />
            </form>
        </div>
    );
};

export default AccountSetupForm;
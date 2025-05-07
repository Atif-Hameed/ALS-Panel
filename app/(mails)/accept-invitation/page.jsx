'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { inviteAccept } from '../../actions/agent.action';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const InvitationPage = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
    const [token, setToken] = useState();
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tokenFromParams = params.get('token');
            if (tokenFromParams) {
                setToken(tokenFromParams);
            }
        }
    }, []);


    // const validateForm = () => {
    //     const newErrors = {};

    //     if (!password) newErrors.password = 'Password is required';
    //     else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    //     if (password !== confirmPassword) {
    //         newErrors.confirmPassword = 'Passwords do not match';
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!validateForm()) return;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await inviteAccept(token, { password });

            console.log(data)

            if (error) {
                toast.error(error);
            } else {
                toast.success('Invitation accepted successfully! Redirecting to login...');
                setTimeout(() => router.push('/login'), 3000);
            }
        } catch (err) {
            // toast.error('An error occurred. Please try again.');
            console.log(err)
        } finally {
            setLoading(false);
        }
    };


    // const handlePasswordChange = (e) => {
    //     setPassword(e.target.value);
    //     if (passwordError) {
    //         setPasswordError('');
    //     }
    // };

    // const handleConfirmPasswordChange = (e) => {
    //     setConfirmPassword(e.target.value);
    //     if (confirmPasswordError) {
    //         setConfirmPasswordError('');
    //     }
    // };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError(null);
    //     setPasswordError('');
    //     setConfirmPasswordError('');

    //     let isValid = true;
    //     if (!password) {
    //         setPasswordError('Password is required');
    //         isValid = false;
    //     }
    //     if (!confirmPassword) {
    //         setConfirmPasswordError('Confirm Password is required');
    //         isValid = false;
    //     }

    //     if (!isValid) {
    //         return;
    //     }

    //     setLoading(true);

    //     try {
    //         const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ email, password }),
    //         });

    //         const data = await response.json();

    //         if (!response.ok) {
    //             throw new Error(data.message || 'Login failed. Please check your credentials.');
    //         }
    //         if (data.token && data.userId) {
    //             localStorage.setItem('authToken', data.token);
    //             localStorage.setItem('userId', data.userId);
    //             localStorage.setItem('useremail', email);
    //             console.log('Token and UserId saved to localStorage');

    //         }

    //         console.log('Login successful:', data);
    //         router.push("/dashboard");

    //     } catch (err) {

    //         console.error("Login error:", err);
    //         setError(err.message || 'An unexpected error occurred. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const showLabel = (field) => {

        return focused[field] || formData[field];
    };
    return (
        <div className='flex h-screen overflow-hidden bg-white'>
            <div className='md:w-1/2 sm:w-[40%] hidden sm:flex relative'>
                <Image src='/assets/leftside.svg' alt='Decorative background' layout='fill' objectFit='cover' priority />
            </div>

            <div className='md:w-1/2 sm:w-[60%] w-full flex items-center justify-center p-4'>
                <div className='w-full max-w-sm'>
                    <div className='mb-10'>
                        <h2 className='text-[#002B4B] text-[32px] font-[800] text-center'>Complete Your Registration</h2>
                        <p className="text-center text-sm text-gray-600">
                            Set your password to become an active user
                        </p>

                    </div>
                    <form className='space-y-6' autoComplete="off" onSubmit={handleSubmit}>


                        <div>
                            {passwordFocus && <label className='text-[#000000] text-[12px] block mb-1'>
                                Password
                                <span className="text-red-500">*</span>
                            </label>}

                            <div className={`border-b flex items-center ${passwordFocus ? 'border-[#000113]' : 'border-[#CBD5E1]'} ${passwordFocus ? 'border-red-500' : ''}`}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={passwordFocus ? '' : 'Password'}
                                    className='w-full py-2 text-[14px] font-[400] text-[#000113] bg-transparent focus:ring-0 focus:outline-none' // 
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setPasswordFocus(true)}
                                    onBlur={() => setPasswordFocus(password.length > 0)}
                                    aria-invalid={!!passwordError}
                                    aria-describedby={passwordError ? "password-error" : undefined}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='text-gray-500 ml-2 p-1'
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {passwordError && <p id="password-error" className='text-red-500 text-[14px] font-[400] mt-1'>{passwordError}</p>}
                        </div>

                        <div>
                            {confirmPasswordFocus && <label className='text-[#000000] text-[12px] block mb-1'>
                                Confirm Password
                                <span className="text-red-500">*</span>
                            </label>}
                            <div className={`border-b flex items-center ${confirmPasswordFocus ? 'border-[#000113]' : 'border-[#CBD5E1]'} ${confirmPasswordFocus ? 'border-red-500' : ''}`}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder={confirmPasswordFocus ? '' : 'Confirm Password'}
                                    className='flex-grow py-2 text-[14px] font-[400] text-[#000113] bg-transparent focus:ring-0 focus:outline-none' // 
                                    value={confirmPassword}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setConfirmPasswordFocus(true)}
                                    onBlur={() => setConfirmPasswordFocus(password.length > 0)}
                                    aria-invalid={!confirmPasswordError}
                                    aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='text-gray-500 ml-2 p-1'
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {confirmPasswordError && <p id="password-error" className='text-red-500 text-[14px] font-[400] mt-1'>{confirmPasswordError}</p>}
                        </div>

                        {error && <p className='text-red-500 text-[14px] font-[400] text-center'>{error}</p>}

                        <button
                            type='submit'
                            className={`w-full cursor-pointer text-[#FFFFFF] bg-[#002B4B] h-[40px] font-[500] text-[14px] p-2 rounded-[4px] hover:bg-blue-900 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </button>


                    </form>
                </div>
            </div>
        </div>
    );
};

export default InvitationPage;
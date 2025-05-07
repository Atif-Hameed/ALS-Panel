'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_BASE_URL } from '../../api';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEmailError('');
    setPasswordError('');

    let isValid = true;
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
      if (data.token && data.userId) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('useremail', email);
        console.log('Token and UserId saved to localStorage');

      }

      console.log('Login successful:', data);
      router.push("/dashboard");

    } catch (err) {

      console.error("Login error:", err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const showLabel = (field) => {

    return focused[field] || formData[field];
  };
  return (
  <div className='flex h-screen overflow-hidden bg-white'>
    {/* Left side image - hidden on mobile */}
    <div className='md:w-1/2 sm:w-[40%] hidden sm:flex relative'>
      <Image src='/assets/leftside.svg' alt='Decorative background' layout='fill' objectFit='cover' priority />
    </div>

    {/* Right side form - centered on mobile */}
    <div className='md:w-1/2 sm:w-[60%] w-full flex flex-col justify-center p-4'>
      <div className='w-full  max-w-sm  mx-auto my-auto  '> {/* Added my-auto for vertical centering */}
        {/* Heading */}
        <h2 className='text-[#002B4B] text-[32px] tiny:text-[26px] mb-10 tiny:mb-8 font-[800] text-center '>Login</h2>
        
        {/* Form */}
        <form className='space-y-6 tiny:space-y-4 ' autoComplete="off" onSubmit={handleSubmit}>
          {/* Email field */}
          <div>
            {emailFocus && <label className='text-[#000000] text-[12px] block mb-1'>
              Email
              <span className="text-red-500">*</span>
            </label>}
            <div className={`border-b ${emailFocus ? 'border-[#000113]' : 'border-[#CBD5E1]'} ${emailError ? 'border-red-500' : ''}`}>
              <input
                type='email'
                placeholder={emailFocus ? '' : 'Enter your email'}
                className='w-full py-2 text-[14px] font-[400] text-[#000113] bg-transparent focus:ring-0 focus:outline-none'
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(email.length > 0)}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
            </div>
            {emailError && <p id="email-error" className='text-red-500 text-[14px] font-[400] mt-1'>{emailError}</p>}
          </div>

          {/* Password field */}
          <div>
            {passwordFocus && <label className='text-[#000000] text-[12px] block mb-1'>
              Password
              <span className="text-red-500">*</span>
            </label>}
            <div className={`border-b flex items-center ${passwordFocus ? 'border-[#000113]' : 'border-[#CBD5E1]'} ${passwordError ? 'border-red-500' : ''}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={passwordFocus ? '' : 'Password'}
                className='flex-grow py-2 text-[14px] font-[400] text-[#000113] bg-transparent focus:ring-0 focus:outline-none'
                value={password}
                onChange={handlePasswordChange}
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

          {/* Error message */}
          {error && <p className='text-red-500 text-[14px] font-[400] text-center'>{error}</p>}

          {/* Login button */}
          <button
            type='submit'
            className={`w-full cursor-pointer text-[#FFFFFF] bg-[#002B4B] h-[40px] tiny:h-[36px] font-[500] text-[14px] p-2 rounded-[4px] hover:bg-blue-900 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          {/* Links */}
          <div className='flex justify-between tiny:flex-col tiny:gap-2 text-sm'>
            <a href='/forget' className='text-[#002B4B] text-[14px] font-[500] hover:underline'>
              Forgot Password?
            </a>
            <span className='text-[#828282] text-[14px] font-[500]'>
              Don't have an account?{' '}
              <a href='/signup' className='text-[#002B4B] text-[14px] font-[500] hover:underline'>
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

export default LoginPage;
'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../api'


const ForgotPassword = () => {
  const [emailFocused, setEmailFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Password reset link sent! Check your email.');
        // setTimeout(() => router.push('/login'), 3000); // Redirect after 3 seconds
      } else {
        setMessage(result.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen bg-white overflow-hidden'>
      {/* Left Side - Image */}
      <div className='md:w-1/2 sm:w-[40%] hidden sm:flex relative'>
        <Image src='/assets/leftside.svg' alt='City View' layout='fill' objectFit='cover' />
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className='md:w-1/2 sm:w-[60%] w-full flex items-center justify-center'>
        <div className='w-full p-4'>
          <h2 className='text-[#002B4B] text-[32px] font-[800] text-center mb-6'>Forgot Password</h2>
					{message && <p className='text-center text-sm mb-5 text-red-400 mt-2'>{message}</p>}

          <form onSubmit={handleSubmit} className='gap-4 w-full flex flex-col items-center justify-center'>
            <div className='w-[349px]'>
              {emailFocused || email ? (
                <label className='block text-[12px] font-[400] text-[#000000] mb-1'>
                  Email
                  <span className="text-red-500">*</span>
                </label>
              ) : null}
              <div className={`border-b ${emailFocused ? 'border-[#000113]' : 'border-[#CBD5E1]'} transition-colors duration-200`}>
                <input
                  type='email'
                  value={email}
                  placeholder={emailFocused ? '' : 'Enter your email'}
                  className='mt-1 w-[349px] py-2 text-[14px] font-[400] text-[#000113] rounded-md focus:ring-0 focus:outline-none bg-transparent'
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-[349px] h-[40px] cursor-pointer text-[#FFFFFF] bg-[#002B4B] font-[500] text-[14px] p-2 rounded-[4px] hover:bg-blue-900 disabled:bg-gray-400'
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>

          

            <div className='flex w-[349px] justify-between mt-4 text-sm'>
              <div className='text-[#828282] flex justify-between w-full text-[14px] font-[500]'>
                Remember your password?{' '}
                <a href='/login' className='text-[#002B4B] text-[14px] font-[500] hover:underline'>
                  Log in
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

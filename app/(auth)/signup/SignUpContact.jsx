'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useSignup } from '../SignupContext';
import LeftSide from './LeftSide';

const SignUpContact = ({ setSteps, steps }) => {
  const { signupContact, setSignupContact } = useSignup();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!phoneNumber) {
      setError('Phone number is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setSignupContact(phoneNumber);
    setSteps(3);
    setLoading(false);
    setSuccess('Phone number saved successfully!');
  };
  return (
    <div className='flex h-screen overflow-hidden'>
      <LeftSide setSteps={setSteps} steps={steps} />

      <div className='md:w-1/2 sm:w-[60%] w-full flex items-center justify-center'>
        <div className='w-full p-4'>
          <h2 className='text-[#002B4B] text-[32px] font-[800] text-center mb-10'>Sign Up</h2>
          {error && <p className='text-red-500 text-center text-[14px] font-[400]'>{error}</p>}
          {success && <p className='text-green-500 text-center text-[14px] font-[400]'>{success}</p>}

          <form onSubmit={handleSubmit} className='gap-6 w-full flex flex-col items-center'>
            <div className='w-[349px]'>
              <label className='text-[14px] font-[400] text-gray-600'>Phone Number</label>
              <PhoneInput
                country={'us'} // Default country
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value)}
                inputStyle={{
                  width: '100%',
                  height: '40px',
                  fontSize: '14px',
                  color:"#000113 ",
                  paddingLeft: '48px',
                }} 
              
                dropdownStyle={{
                  
                  color: '#000113'
                }}
                containerStyle={{ width: '100%' }}
              />
            </div>

            <button
              type='submit'
              className='w-[349px] h-[40px] cursor-pointer text-white bg-[#002B4B] font-[500] text-[14px] p-2 rounded-[4px] hover:bg-blue-900'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpContact;

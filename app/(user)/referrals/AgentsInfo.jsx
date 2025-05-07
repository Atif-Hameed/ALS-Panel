'use client';
import React, { useState } from 'react';
import Select from 'react-select'; 
import axios from 'axios';


const titleOptions = [
  { value: 'Agent', label: 'Agent' },
  { value: 'Broker', label: 'Broker' },
  { value: 'Realtor', label: 'Realtor' },
  { value: 'Landlord', label: 'Landlord' },
  { value: 'Property Owner', label: 'Property Owner' },
  { value: 'Property Manager', label: 'Property Manager' },
  { value: 'Listing Agent', label: 'Listing Agent' },
  { value: 'Seller\'s Agent', label: 'Seller\'s Agent' },
  { value: 'Building Manager', label: 'Building Manager' },
  { value: 'Commercial Broker', label: 'Commercial Broker' },
  { value: 'Commercial Agent', label: 'Commercial Agent' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Builder', label: 'Builder' },
  { value: 'Architect', label: 'Architect' },
  { value: 'Write My Own', label: '-- Write My Own --' },
];

const AgentsInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '', 
    bio: '',
    license: '',
  });

  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleTitleChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormData({ ...formData, title: value });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.title;
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
    // Validate name, bio, license as before
    ['name', 'bio', 'license'].forEach((field) => {
      if (!formData[field]) {
        const fieldName = field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());
        newErrors[field] = `${fieldName} is required`;
      }
    });
    if (!formData.title) {
       newErrors.title = 'Title is required';
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    try {
      const userId = localStorage.getItem('userId');
  
      if (!userId) {
        console.error('User ID not found in local storage');
        return;
      }
  
      const response = await axios.post('http://localhost:5000/api/agents/create-agents', {
        ...formData,
        userId: userId
      });
  
      console.log('Agent Created:', response.data);
  
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
    }
  };
  

  const renderInput = (field, placeholderText) => (
    <div key={field} className='w-full'>
      {(focused[field] || formData[field]) && (
        <label className='text-sm text-[#4A5568]'>{placeholderText}</label>
      )}
      <div
        className={`border-b ${
          focused[field] ? 'border-[#000113]' : 'border-[#CBD5E1]'
        }`}
      >
        <input
          type={field === 'websiteUrl' ? 'url' : 'text'}
          name={field}
          placeholder={focused[field] ? '' : placeholderText}
          value={formData[field]}
          onChange={handleInputChange} // Use handleInputChange here
          onFocus={() => handleFocus(field)}
          onBlur={() => handleBlur(field)}
          className='w-full py-2 text-[14px] font-[400] text-[#2D3748] focus:ring-0 focus:outline-none bg-transparent placeholder-[#718096]'
        />
      </div>
      {errors[field] && (
        <p className='text-red-500 text-xs mt-1'>{errors[field]}</p>
      )}
    </div>
  );

  // Helper to find the selected option object for react-select's value prop
  const getSelectedTitleOption = () => {
      return titleOptions.find(option => option.value === formData.title) || null;
  }

  return (
    <div className='w-full h-[58vh]'>
      <div className='text-[18px] font-[600] text-[#000000] mb-4 '>
        Team Information
      </div>
      <form className='w-full flex flex-col gap-y-6'>
        <div className='grid lg:grid-cols-5 sm:grid-cols-2 grid-cols-1 md:gap-x-16 sm:gap-6 gap-8 '>
          {/* Name Input */}
          <div className='flex flex-col lg:col-span-2 gap-6'>
            {renderInput('name', 'Name')}
          </div>

          {/* Title Dropdown */}
          <div className='flex flex-col lg:col-span-2 gap-6'>
            <div className='w-full'>
               <Select
                 name="title"
                 options={titleOptions}
                 value={getSelectedTitleOption()} 
                 onChange={handleTitleChange} 
                 placeholder=" Choose Title" 
                 classNamePrefix="react-select" 
                 styles={{ 
                    control: (base, state) => ({
                        ...base,
                        border: 0,
                        border: state.isFocused ? '1px solid #000113' : '1px solid #CBD5E1',
                        boxShadow: 'none',
                        borderRadius: 5,
                        minHeight: '38px', // Adjust height as needed
                        backgroundColor: 'transparent',
                        '&:hover': {
                           borderBottom: state.isFocused ? '1px solid #000113' : '1px solid #CBD5E1',
                        }
                    }),
                    valueContainer: (base) => ({
                        ...base,
                        padding: '2px 0px', // Adjust padding
                    }),
                    input: (base) => ({
                        ...base,
                        margin: 0,
                        padding: 0,
                         color: '#2D3748',
                    }),
                     placeholder: (base) => ({
                        ...base,
                        color: '#718096', // Match placeholder color
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: '#2D3748', // Match input text color
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        padding: '2px 8px'
                    }),
                    clearIndicator: (base) => ({
                        ...base,
                        padding: '2px 8px'
                    }),
                    menu: (base) => ({
                        ...base,
                        marginTop: '2px', // Space between control and menu
                    }),
                 }}
               />
               {errors.title && (
                 <p className='text-red-500 text-xs mt-1'>{errors.title}</p>
               )}
            </div>
          </div>
        </div>

        {/* Bio and License Inputs */}
        <div className='grid lg:grid-cols-5 md:gap-x-16 '>
          <div className='flex flex-col lg:col-span-4 gap-6'>
            {renderInput('bio', 'Bio')}
          </div>
          <div className='lg:flex hidden flex-col col-span-2 mt-6 gap-6'>
            
          </div>
        </div>

         <div className='grid lg:grid-cols-5 md:gap-x-16'>
             <div className='flex flex-col col-span-2 gap-6'>
                {renderInput('license','License')}
             </div>
             <div className='lg:lex hidden col-span-3'></div>
         </div>


        <button
           type="button" 
           onClick={() => {
               if (validateForm()) {
                   console.log('Form Data Submitted:', formData);
                   submitForm();
               } else {
                   console.log('Form Validation Failed:', errors);
               }
           }}
           className='flex shadowbtn cursor-pointer hover:bg-[#004372] text-[#FFFFFF] font-[700] text-center rounded-[14px] items-center justify-center bg-[#002B4B] w-[140px] h-[48px]'
           >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AgentsInfo;
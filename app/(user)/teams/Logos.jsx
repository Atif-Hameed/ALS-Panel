'use client'
import React, { useState } from 'react';
import ToggleCard from './ToggleCard';
import CustomInput from '../../Components/common/custom-input';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { uploadImagesToCloudinary } from '../../Components/utils/cloudinaryUploader';

const Logos = ({ logos, onAddLogo, onRemoveLogo, onSetDisplayLogo, errors }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setIsUploading(true);
      const uploadedUrls = await uploadImagesToCloudinary(files);

      // Add each uploaded logo to the parent state
      uploadedUrls.forEach((url, index) => {
        const newLogo = {
          url, // Just the URL string
          display: index === 0 && !logos.some(logo => logo.display),
          uploadedAt: new Date()
        };
        onAddLogo(newLogo);
      });
    } catch (error) {
      console.error('Error uploading logos:', error);
      // You might want to add error handling UI here
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleToggleDisplay = (logoUrl) => {
    onSetDisplayLogo(logoUrl);
  };

  const handleRemoveLogo = (logoUrl) => {
    onRemoveLogo(logoUrl);
  };

  return (
    <div className='w-full bg-[#FFFFFF] sm:p-6 p-4'>
      <div className='text-[18px] font-[600] text-[#000000] mb-4'>
        Logos
      </div>

      <div className='border border-dashed border-border rounded-xl p-5 relative flex items-center justify-center'>
        <input
          type="file"
          accept="image/*"  // Changed to accept only images
          name="file"
          onChange={handleFileUpload}
          disabled={isUploading}
          className='absolute w-full h-full left-0 opacity-0 cursor-pointer'
        />
        <div className='flex flex-col items-center'>
          <FaCloudUploadAlt className='text-3xl' />
          <p className='text-darkGray'>
            {isUploading ? 'Uploading...' : 'Click to upload logo (PNG/JPG)'}
          </p>
        </div>
      </div>

      <div className='text-[18px] font-[600] text-[#000000] my-5'>
        Your Logos
      </div>

      <div className="flex flex-col gap-4">
        {logos?.map((logo, index) => (
          <ToggleCard
            key={logo.url}
            imageSrc={logo.url}
            label={`Logo ${index + 1}`}
            defaultChecked={logo.display}
            onToggle={() => handleToggleDisplay(logo.url)}
            onRemove={() => handleRemoveLogo(logo.url)}
            uploadedAt={logo.uploadedAt}
          />
        ))}
      </div>

      {errors?.logos && (
        <p className="text-red-500 text-sm mt-2">{errors.logos}</p>
      )}
    </div>
  );
};

export default Logos;
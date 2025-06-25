'use client';
import Button from '../../../../Components/shared/custom-btn';
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import CustomInput from '../../../../Components/common/custom-input';
import ImagesUplaod from './images-uplaod';
import ContactInfo from './contact-info';
import Details from './details';

const PostDetailsForm = ({ formData, setFormData, onImageUpload, goBack, onSubmit, loading, user, selectedPostType, selectedCategory }) => {
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadError, setUploadError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploadError(null);

    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading',
    }));

    setPreviewImages(prev => [...prev, ...newPreviews]);

    try {
      await onImageUpload(acceptedFiles);
      setPreviewImages(prev =>
        prev.map(img =>
          acceptedFiles.includes(img.file)
            ? { ...img, status: 'completed' }
            : img
        )
      );
    } catch (error) {
      setUploadError(error.message);
      setPreviewImages(prev =>
        prev.map(img =>
          acceptedFiles.includes(img.file)
            ? { ...img, status: 'error' }
            : img
        )
      );
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 10,
    multiple: true,
  });

  const removeImage = (index) => {
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFormData(prev => {
      const newMedia = [...prev.media];
      newMedia.splice(index, 1);
      return { ...prev, media: newMedia };
    });
  };

  const handleContactInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleDetailsChange = (field, value, detailKey = null) => {
    setFormData(prev => {
      const updatedDetails = { ...prev.postDetails };
      if (detailKey) {
        updatedDetails[detailKey] = {
          ...updatedDetails[detailKey],
          [field]: value,
        };
      } else {
        updatedDetails[field] = value;
      }
      return { ...prev, postDetails: updatedDetails };
    });
  };

  useEffect(() => {
    return () => {
      previewImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [previewImages]);

  const radioOptions = [
    { value: 'show', label: 'Show' },
    { value: 'hide', label: 'Hide' },
    { value: 'default', label: 'Default' },
  ];

  return (
    <form onSubmit={onSubmit}>
      <div>
        <h2 className="text-xl font-semibold mb-4 underline">Basic Information</h2>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-4">
          <CustomInput
            inputType="text"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            label="Title*"
            labelStyle="!text-sm"
            inputTextStyle="!text-sm"
          />
          <CustomInput
            inputType="text"
            name="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            label="City*"
            labelStyle="!text-sm"
            inputTextStyle="!text-sm"
          />
          {/* <CustomInput
            inputType="number"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            label="Price*"
            labelStyle="!text-sm"
            inputTextStyle="!text-sm"
          /> */}
          <CustomInput
            inputType="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            required
            label="Zip Code*"
            labelStyle="!text-sm"
            inputTextStyle="!text-sm"
          />
          <div className="sm:col-span-2">
            <label className="block text-sm mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-1 border-b outline-none border-border text-sm"
              rows="4"
            />
          </div>
        </div>
      </div>

      <div>
        <Details
          selectedPostType={selectedPostType}
          selectedCategory={selectedCategory}
          formData={formData}
          handleDetailsChange={handleDetailsChange}
        />
      </div>

      <div className="my-10">
        <ContactInfo
          formData={formData}
          handleContactInfoChange={handleContactInfoChange}
          radioOptions={radioOptions}
          user={user}
        />
      </div>

      <div className="w-full">
        <ImagesUplaod
          getRootProps={getRootProps}
          isDragActive={isDragActive}
          getInputProps={getInputProps}
          uploadError={uploadError}
          previewImages={previewImages}
          removeImage={removeImage}
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button
          onClick={goBack}
          style="px-4 py-2 bg-gray-400 rounded hover:bg-gray-600"
          label="Back"
        />
        <Button
          type="submit"
          style="px-6 py-2 bg-dark text-white rounded"
          disabled={loading || previewImages.some(img => img.status === 'uploading')}
          loading={loading}
          loadingLabel="Creating..."
          label="Create Post"
        />
      </div>
    </form>
  );
};

export default PostDetailsForm;
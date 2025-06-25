'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Container from '../../shared/container';
import SelectLocation from './_components/select-location';
import SelectPostType from './_components/select-postType';
import SelectCategory from './_components/select-category';
import SelectSubCategory from './_components/select-subCategory';
import PostDetailsForm from './_components/post-details-form';
import { propertyImagesToCloudinary } from '../../utils/cloudinaryUploader';
import { createPost } from '../../../actions/boardPost.action';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CreatePost = ({ data, user }) => {
  const [step, setStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    zipCode: '',
    description: '',
    postDetails: {},
    contactInfo: {
      email: user?.email,
      emailOption: 'default',
      phone: user?.phoneNumber,
      phoneOption: 'default',
    },
    media: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const postData = data[0];
  const { location: locations, postType: postTypes } = postData;

  const hasCategories = selectedPostType?.categories?.length > 0;
  const hasSubCategories = selectedCategory?.subCategories?.length > 0;

  const handleNext = () => {
    if (step === 1 && !selectedLocation) {
      setError('Please select a location');
      return;
    }
    if (step === 2 && !selectedPostType) {
      setError('Please select a post type');
      return;
    }
    // Skip category selection if no categories exist for the post type
    if (step === 2 && !hasCategories) {
      setStep(5); // Skip directly to form
      setError(null);
      return;
    }
    if (step === 3 && !selectedCategory) {
      setError('Please select a category');
      return;
    }
    // Skip subcategory selection if no subcategories exist for the category
    if (step === 3 && !hasSubCategories) {
      setStep(5); // Skip to form
      setError(null);
      return;
    }
    if (step === 4 && hasSubCategories && !selectedSubCategory) {
      setError('Please select a subcategory');
      return;
    }

    setError(null);
    setStep(prev => prev + 1);
  };

  const goBack = () => {
    if (step > 1) {
      if (step === 5) {
        // When going back from form, determine which step to return to
        if (!hasSubCategories && !hasCategories) {
          setStep(2); // Return to postType if no categories exist
        } else if (!hasSubCategories) {
          setStep(3); // Return to category if no subcategories exist
        } else {
          setStep(4); // Return to subcategory if they exist
        }
      } else {
        setStep(prev => prev - 1);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData = {
        location: selectedLocation,
        postType: selectedPostType.name,
        category: selectedCategory?.name || null,
        subCategory: selectedSubCategory?.name || null,
        postData: {
          title: formData.title,
          price: formData.price,
          city: formData.city,
          zipCode: formData.zipCode,
          description: formData.description,
        },
        postDetails: formData.postDetails,
        contactInfo: formData.contactInfo,
        media: formData.media,
      };

      console.log('Submitting:', postData);

      const { data, error } = await createPost(user?._id, postData)
      console.log("Post Response : ", data, error)
      if (error) {
        toast.error(error || "Unable to create post")
        setLoading(false);
      } else {
        toast.success("Post Created Successfully!");

        // ✅ Reset state
        setStep(1);
        setSelectedLocation(null);
        setSelectedPostType(null);
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setFormData({
          title: '',
          price: '',
          city: '',
          zipCode: '',
          description: '',
          postDetails: {},
          contactInfo: {
            email: user?.email,
            emailOption: 'default',
            phone: user?.phoneNumber,
            phoneOption: 'default',
          },
          media: [],
        });

        // ✅ Redirect to /board-post
        router.push('/board-post');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create post');
      toast.error(err.response?.data?.message || err.message || 'Failed to create post')
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files) => {
    try {
      setLoading(true);
      const uploadedUrls = await propertyImagesToCloudinary(files);
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, ...uploadedUrls],
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total steps and progress steps
  const calculateProgressSteps = () => {
    if (!hasCategories) {
      return [1, 2, 5]; // Location, PostType, Form
    }
    if (!hasSubCategories) {
      return [1, 2, 3, 5]; // Location, PostType, Category, Form
    }
    return [1, 2, 3, 4, 5]; // All steps
  };

  const progressSteps = calculateProgressSteps();


  return (
    <Container className="w-full mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Post</h1>

      <div className="flex justify-between mb-6">
        {progressSteps.map((stepNumber, index) => (
          <button
            key={index}
            className={`w-8 h-8 cursor-pointer rounded-full flex items-center justify-center 
            ${step >= stepNumber ? 'bg-dark text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {step === 1 && (
        <SelectLocation
          locations={locations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          handleNext={handleNext}
        />
      )}

      {step === 2 && (
        <SelectPostType
          postTypes={postTypes}
          selectedPostType={selectedPostType}
          setSelectedPostType={setSelectedPostType}
          goBack={goBack}
          handleNext={handleNext}
        />
      )}

      {step === 3 && selectedPostType && hasCategories && (
        <SelectCategory
          selectedPostType={selectedPostType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          goBack={goBack}
          handleNext={handleNext}
        />
      )}

      {step === 4 && hasSubCategories && (
        <SelectSubCategory
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          goBack={goBack}
          handleNext={handleNext}
        />
      )}

      {step === 5 && (
        <PostDetailsForm
          formData={formData}
          setFormData={setFormData}
          onImageUpload={handleImageUpload}
          goBack={goBack}
          onSubmit={handleSubmit}
          loading={loading}
          user={user}
          selectedPostType={selectedPostType}
          selectedCategory={selectedCategory}
        />
      )}
    </Container>
  );
};

export default CreatePost;
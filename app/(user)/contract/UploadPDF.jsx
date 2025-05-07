'use client'
import React, { useState, useEffect } from 'react'
import CustomInput from '../../Components/common/custom-input'
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from '../../Components/common/custom-button';
import { uploadSingleContractToCloudinary } from '../../Components/utils/cloudinaryUploader';
import { API_BASE_URL } from '../../api';
import toast from 'react-hot-toast';


const UploadPDF = ({ id, onClose, addContract, setAddContract }) => {

    const [formData, setFormData] = useState({

        file: null,
    });
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setFormData(prev => ({ ...prev, file: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.file) {
                toast.error("Please upload a file.");
                setLoading(false);
                return;
            }

            const uploadedUrls = await uploadSingleContractToCloudinary(formData.file);
            const fileUrl = uploadedUrls;

            const payload = {

                signfileUrl: fileUrl,
                status: "Accepted"

            };

            const response = await fetch(`${API_BASE_URL}/contracts/update-signature/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to create contract');
            }

            console.log('Contract created successfully:', result);
            toast.success('Contract created successfully');

            // ✅ Close modal
            if (addContract) setAddContract(false);

            // ✅ Trigger refetch
            // if (setIsFetch) setIsFetch((prev) => !prev);
        } catch (error) {
            console.error('Error:', error);
            // alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className='w-full'>
            <div className='py-2 font-semibold text-xl text-center'>Accept </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-5 w-full my-4'>


                <div className='border border-dashed border-border rounded-xl p-5 relative flex items-center justify-center'>
                    <input
                        type="file"
                        accept=".doc,.docx,.pdf"
                        name="file"
                        onChange={handleChange}
                        className='absolute w-full h-full left-0 opacity-0'
                    />
                    <div className='flex flex-col items-center'>
                        <FaCloudUploadAlt className='text-3xl' />
                        <p className='text-darkGray'>
                            {formData.file ? formData.file.name : 'Upload File (pdf/docs)'}
                        </p>
                    </div>
                </div>

                <div>
                    <Button
                        type='submit'
                        label='Submit'
                        className='bg-dark text-white !h-[48px] !px-4 py-2 rounded-lg'
                        loading={loading}
                        loadingLabel='Submitting...'
                    />
                </div>
            </form>
        </div>
    );
};

export default UploadPDF;

'use client'
import React, { useState, useEffect } from 'react'
import CustomInput from '../../Components/common/custom-input'
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from '../../Components/common/custom-button';
import { uploadSingleContractToCloudinary } from '../../Components/utils/cloudinaryUploader';
import { API_BASE_URL } from '../../api';
import toast from 'react-hot-toast';

const AddContract = ({ userId, setIsState, closeModal }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        file: null,
    });
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadOption, setUploadOption] = useState('upload'); // Default to 'upload'

    // Predefined PDF URLs
    const pdfOptions = [
        { name: 'DESCRIPTION.pdf', url: 'https://firebasestorage.googleapis.com/v0/b/shedrrip.appspot.com/o/DESCRIPTION.pdf?alt=media&token=17e46238-9a81-4331-ba9e-525c9bb00e83' },
        { name: 'Denka_changes.pdf', url: 'https://firebasestorage.googleapis.com/v0/b/shedrrip.appspot.com/o/Denka_changes.pdf?alt=media&token=1836c5af-9195-462a-9f96-c8d7a668e681' },
        { name: 'Properties Detail Page.pdf', url: 'https://firebasestorage.googleapis.com/v0/b/shedrrip.appspot.com/o/Properties%20Detail%20Page.pdf%20(1)%20(1)%20(1).pdf?alt=media&token=e60155f0-9d9e-400a-80ed-34d1a7292727' },
        { name: 'download.pdf', url: 'https://firebasestorage.googleapis.com/v0/b/shedrrip.appspot.com/o/download.pdf?alt=media&token=647f1468-e36f-47ee-b71f-92a125ae8bf8' },
    ];

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/agents/get-agents/${userId}`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    setAgents(data);
                } else {
                    setAgents([]);
                    console.log(data.message || 'No agents found');
                }
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };

        fetchAgents();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file' && uploadOption === 'upload') {
            setFormData(prev => ({ ...prev, file: files[0] }));
        } else if (name === 'file' && uploadOption === 'select') {
            setFormData(prev => ({ ...prev, file: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleOptionChange = (e) => {
        setUploadOption(e.target.value);
        setFormData(prev => ({ ...prev, file: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsState(true);

        try {
            let fileUrl = '';

            if (uploadOption === 'upload') {
                if (!formData.file || typeof formData.file === 'string') {
                    toast.error("Please upload a file.");
                    setLoading(false);
                    setIsState(false);
                    return;
                }
                // Upload file to Cloudinary
                fileUrl = await uploadSingleContractToCloudinary(formData.file);
            } else {
                if (!formData.file) {
                    toast.error("Please select a PDF.");
                    setLoading(false);
                    setIsState(false);
                    return;
                }
                fileUrl = formData.file; // Use the selected PDF URL
            }

            // Prepare data to send to your backend
            const payload = {
                userId,
                name: formData.name,
                email: formData.email,
                date: formData.date,
                fileUrl,
            };

            // Send data to your backend
            const response = await fetch(`${API_BASE_URL}/contracts/create-contract`, {
                method: 'POST',
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
            closeModal();
            toast.success("Contract created successfully!");
            setFormData({ name: '', email: '', date: '', file: null });
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
            setIsState(false);
        }
    };

    return (
        <div className='w-full'>
            <div className='py-2 font-semibold text-xl text-center'>Add Contract</div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-5 w-full my-4'>
                <CustomInput
                    placeholder={'Name'}
                    name={'name'}
                    inputType={'text'}
                    onChange={handleChange}
                    value={formData.name}
                />
                <select
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="py-3 border-b outline-none border-gray-300"
                >
                    <option value="" disabled hidden>
                        Email
                    </option>
                    {agents && agents.length > 0 ? (
                        agents.map(agent => (
                            <option key={agent._id} value={agent.email}>
                                {agent.email}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>
                            No referral added
                        </option>
                    )}
                </select>
                <CustomInput
                    placeholder={'Date'}
                    name={'date'}
                    inputType={'date'}
                    value={formData.date}
                    onChange={handleChange}
                />
                <div className='flex items-center gap-5'>
                    <div className='flex items-center gap-2'>
                        <input
                            type="radio"
                            name="uploadOption"
                            value="select"
                            checked={uploadOption === 'select'}
                            onChange={handleOptionChange}
                        />
                        <p>Select Contract</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input
                            type="radio"
                            name="uploadOption"
                            value="upload"
                            checked={uploadOption === 'upload'}
                            onChange={handleOptionChange}
                        />
                        <p>Upload Own</p>
                    </div>
                </div>
                {uploadOption === 'select' ? (
                    <select
                        name="file"
                        value={formData.file || ''}
                        onChange={handleChange}
                        className="py-3 border-b outline-none border-gray-300"
                    >
                        <option value="" disabled hidden>
                            Select a PDF
                        </option>
                        {pdfOptions.map(pdf => (
                            <option key={pdf.url} value={pdf.url}>
                                {pdf.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className='border border-dashed border-border rounded-xl p-5 relative flex items-center justify-center'>
                        <input
                            type="file"
                            accept=".doc,.docx,.pdf,.png"
                            name="file"
                            onChange={handleChange}
                            className='absolute w-full h-full left-0 opacity-0'
                        />
                        <div className='flex flex-col items-center'>
                            <FaCloudUploadAlt className='text-3xl' />
                            <p className='text-darkGray'>
                                {formData.file && typeof formData.file !== 'string' ? formData.file.name : 'Upload File (pdf/docs)'}
                            </p>
                        </div>
                    </div>
                )}
                <div>
                    <Button
                        type='submit'
                        label='Submit'
                        className='bg-dark text-white !px-4 !h-[48px] rounded-lg'
                        loading={loading}
                        loadingLabel='Submitting...'
                    />
                </div>
            </form>
        </div>
    );
};

export default AddContract;
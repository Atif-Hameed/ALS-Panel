'use client'
import React, { useState,useEffect } from 'react'
import CustomInput from '../../Components/common/custom-input'
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from '../../Components/common/custom-button';
import { uploadSingleContractToCloudinary } from '../../Components/utils/cloudinaryUploader';
import { API_BASE_URL } from '../../api';
import toast from 'react-hot-toast';


const AddContract = ({ userId ,setIsState, closeModal }) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        file: null,
    });
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/agents/get-agents/${userId}`);
                const data = await response.json();
    
                // Check if data is an array
                if (Array.isArray(data)) {
                    setAgents(data);
                } else {
                    setAgents([]); // fallback if no agents found
                    console.log(data.message || 'No agents found');
                }
    
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };
    
        fetchAgents();
    }, []);

    const handleChange = (e) => {

        const { name, value, files } = e.target;
        if (name === 'file') {
            setFormData(prev => ({ ...prev, file: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    console.log(agents)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsState(true)

        try {
            if (!formData.file) {
                alert("Please upload a file.");
                setLoading(false);
                setIsState(false)
                return;
            }

            // Upload file to Cloudinary
            const uploadedUrls = await uploadSingleContractToCloudinary(formData.file )
            const fileUrl = uploadedUrls;

            // Prepare data to send to your backend
            const payload = {
                userId,
                name: formData.name,
                email: formData.email,
                date: formData.date,
                fileUrl
              
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
            toast.success("Contract created successfully!")
            setFormData({ name: '', email: '', date: '', file: null });
        
        } catch (error) {
            // console.error('Error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
            setIsState(false)
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
                    className="py-3 border-b border-gray-300"
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
                            {formData.file ? formData.file.name : 'Upload File (pdf/docs)'}
                        </p>
                    </div>
                </div>

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

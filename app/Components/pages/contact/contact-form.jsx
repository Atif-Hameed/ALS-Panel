'use client';
import React, { useState } from 'react';
import Button from '../../shared/custom-btn';
import Container from '../../shared/container';
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        inquiryType: '',
        referralSource: '',
        message: '',
        termsAccepted: false,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear error for the field being edited
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number is invalid';
        }
        if (!formData.inquiryType) {
            newErrors.inquiryType = 'Please select an inquiry type';
        }
        if (!formData.referralSource) {
            newErrors.referralSource = 'Please select a referral source';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }
        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'You must agree to the terms and privacy policy';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/contact', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response)

            setSubmitStatus({ type: 'success', message: 'Your message has been sent successfully!' });
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                inquiryType: '',
                referralSource: '',
                message: '',
                termsAccepted: false,
            });
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                'Failed to send message. Please try again.';
            setSubmitStatus({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Container className={'sm:py-20 py-12'}>
            <div className='text-center mb-10 flex flex-col items-center'>
                <h1 className='mb-3 lg:text-5xl md:text-4xl text-3xl font-semibold'>Let's Connect</h1>
                <p className='text-[#999999] sm:text-base text-sm lg:w-[80%] w-full'>
                    We're excited to connect with you and learn more about your real estate goals. Use the form below to get in touch with Estatein. Whether you're a prospective client, partner, or simply curious about our services, we're here to answer your questions and provide the assistance you need.
                </p>
            </div>
            <div className='border border-[#ABABAB] rounded-xl sm:p-10 p-4'>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {submitStatus && (
                        <div className={`p-4 rounded-md ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {submitStatus.message}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block font-medium mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter First Name"
                                className={`w-full border border-gray-300 rounded-md px-4 py-2 ${errors.firstName ? 'border-red-500' : ''}`}
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block font-medium mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter Last Name"
                                className={`w-full border border-gray-300 rounded-md px-4 py-2 ${errors.lastName ? 'border-red-500' : ''}`}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your Email"
                                className={`w-full border border-gray-300 rounded-md px-4 py-2 ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter Phone Number"
                                className={`w-full border border-gray-300 rounded-md px-4 py-2 `}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Inquiry Type */}
                        <div>
                            <label className="block font-medium mb-1">Inquiry Type</label>
                            <select
                                name="inquiryType"
                                value={formData.inquiryType}
                                onChange={handleChange}
                                className={`w-full border border-gray-300 rounded-md px-4 py-2 ${errors.inquiryType ? 'border-red-500' : ''}`}
                            >
                                <option value="" disabled>Select Inquiry Type</option>
                                <option value="General">General</option>
                                <option value="Support">Support</option>
                                <option value="Partnership">Partnership</option>
                            </select>
                            {errors.inquiryType && <p className="text-red-500 text-sm mt-1">{errors.inquiryType}</p>}
                        </div>

                        {/* How did you hear about us? */}
                        <div>
                            <label className="block font-medium mb-1">How Did You Hear About Us?</label>
                            <select
                                name="referralSource"
                                value={formData.referralSource}
                                onChange={handleChange}
                                className={`w-full border border-gray-300 rounded-md px-4 py-2 ${errors.referralSource ? 'border-red-500' : ''}`}
                            >
                                <option value="" disabled>Select</option>
                                <option value="Google">Google</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Referral">Referral</option>
                            </select>
                            {errors.referralSource && <p className="text-red-500 text-sm mt-1">{errors.referralSource}</p>}
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block font-medium mb-1">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter your Message here.."
                            className={`w-full border border-gray-300 rounded-md px-4 py-2 h-32 resize-none ${errors.message ? 'border-red-500' : ''}`}
                        />
                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className="mt-1 h-4 w-4"
                        />
                        <label className="text-[#999999]">
                            I agree with <a href="#" className="underline">Terms of Use</a> and{' '}
                            <a href="#" className="underline">Privacy Policy</a>
                        </label>
                        {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type='submit'
                            label={'Send Your Message'}
                            loading={isSubmitting}
                            loadingLabel='Sending...'
                            style="bg-[#004E92] text-white rounded-lg font-medium hover:bg-[#002e66] disabled:bg-gray-500"
                            disabled={isSubmitting || !formData.termsAccepted}
                            onClick={handleSubmit}
                        />
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default ContactForm;
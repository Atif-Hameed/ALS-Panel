'use client'
import React, { useEffect, useState } from 'react'
import { FaCopy, FaEnvelope, FaSms, FaCheck } from 'react-icons/fa';
import Button from '../../shared/custom-btn';
import { useUserDetails } from '../../../hooks/useUser';
import { shareLink, shareLinkViaEmail } from '../../../actions/agent.action';
import toast from 'react-hot-toast';
import validator from 'validator';

const ShareModal = ({ selectedAgent, filteredData, setCopiedId, copiedId, setShowShareModal, shareUrl }) => {
    const [showPhoneInput, setShowPhoneInput] = useState(false);
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [isValidPhone, setIsValidPhone] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isSent, setIsSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const { data: user } = useUserDetails(userId)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userId");
            setUserId(storedUserId);
        }
    }, []);

    // Validate phone number format
    const validatePhoneNumber = (number) => {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/;
        return phoneRegex.test(number);
    };

    // Handle phone number input change
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        setIsValidPhone(validatePhoneNumber(value) || value === '');
        setError(null); // Clear error when user types
    };

    // Handle email input change
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setIsValidEmail(validator.isEmail(value) || value === '');
        setError(null); // Clear error when user types
    };

    // Share via SMS using your API
    const shareViaSMS = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            setIsValidPhone(false);
            return;
        }

        if (!user?.firstName) {
            setError("User information not available");
            return;
        }

        setIsSending(true);
        setError(null);

        try {
            const response = await shareLink({
                phoneNumber,
                link: shareUrl,
                firstName: user.firstName,
                lastName: user.lastName || '' // Handle case where lastName might be null
            });

            if (response.error) {
                toast.error(response.error);
            } else {
                setIsSent(true);
                setTimeout(() => {
                    setShowPhoneInput(false);
                    setIsSent(false);
                    setPhoneNumber('');
                }, 2000);
            }
        } catch (err) {
            toast.error("Failed to send SMS");
            console.error('Error sharing link:', err);
        } finally {
            setIsSending(false);
        }
    };

    // Share via Email using your API
    const shareViaEmail = async () => {
        if (!validator.isEmail(email)) {
            setIsValidEmail(false);
            return;
        }

        if (!user?.firstName) {
            setError("User information not available");
            return;
        }

        setIsSending(true);
        setError(null);

        try {
            const response = await shareLinkViaEmail({
                email,
                link: shareUrl,
                firstName: user.firstName,
                lastName: user.lastName || '' // Handle case where lastName might be null
            });

            if (response.error) {
                toast.error(response.error);
            } else {
                setIsSent(true);
                setTimeout(() => {
                    setShowEmailInput(false);
                    setIsSent(false);
                    setEmail('');
                }, 2000);
            }
        } catch (err) {
            toast.error("Failed to send email");
            console.error('Error sending email:', err);
        } finally {
            setIsSending(false);
        }
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && document.hasFocus()) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopiedId(selectedAgent);
            setTimeout(() => setCopiedId(null), 2000);
            setShowShareModal(false);
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    return (
        <div className="bg-white p-3 rounded-lg w-full ">
            <h3 className="text-lg text-center font-semibold mb-4">Share Agent Profile</h3>

            {!showPhoneInput && !showEmailInput ? (
                <>
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowPhoneInput(true)}
                            className="flex items-center gap-3 w-full p-3 cursor-pointer hover:bg-gray-100 rounded transition-colors"
                        >
                            <FaSms className="text-blue-500 text-xl" />
                            <span>Share via SMS</span>
                        </button>
                        <button
                            onClick={() => setShowEmailInput(true)}
                            className="flex items-center gap-3 w-full p-3 cursor-pointer hover:bg-gray-100 rounded transition-colors"
                        >
                            <FaEnvelope className="text-blue-500 text-xl" />
                            <span>Share via Email</span>
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-3 w-full p-3 cursor-pointer hover:bg-gray-100 rounded transition-colors"
                        >
                            <FaCopy className="text-blue-500 text-xl" />
                            <span>Copy Profile Link</span>
                            {copiedId === selectedAgent && (
                                <span className="text-xs text-green-500 ml-auto">Copied!</span>
                            )}
                        </button>
                    </div>
                    <div className="mt-4">
                        <Button
                            label='Cancel'
                            onClick={() => setShowShareModal(false)}
                            style="w-full py-2 bg-dark rounded-lg"
                        />
                    </div>
                </>
            ) : showPhoneInput ? (
                <div className="space-y-4">
                    {isSent ? (
                        <div className="flex items-center justify-center gap-2 text-green-500 py-4">
                            <FaCheck className="text-xl" />
                            <span>SMS sent successfully!</span>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter recipient's phone number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="e.g. +1234567890"
                                    className={`w-full p-2 border rounded-md ${!isValidPhone ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {!isValidPhone && (
                                    <p className="text-red-500 text-xs mt-1">Please enter a valid phone number</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    label='Send SMS'
                                    loading={isSending}
                                    loadingLabel='Sending...'
                                    onClick={shareViaSMS}
                                    disabled={!phoneNumber || !isValidPhone || isSending}
                                    style="w-full py-2 bg-dark rounded-lg"
                                />
                                <Button
                                    label='Back'
                                    onClick={() => {
                                        setShowPhoneInput(false);
                                        setPhoneNumber('');
                                        setIsValidPhone(true);
                                    }}
                                    style="w-full py-2 bg-dark rounded-lg"
                                />
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {isSent ? (
                        <div className="flex items-center justify-center gap-2 text-green-500 py-4">
                            <FaCheck className="text-xl" />
                            <span>Email sent successfully!</span>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter recipient's email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="e.g. recipient@example.com"
                                    className={`w-full p-2 border rounded-md ${!isValidEmail ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {!isValidEmail && (
                                    <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    label='Send Email'
                                    loading={isSending}
                                    loadingLabel='Sending...'
                                    onClick={shareViaEmail}
                                    disabled={!email || !isValidEmail || isSending}
                                    style="w-full py-2 bg-dark rounded-lg"
                                />
                                <Button
                                    label='Back'
                                    onClick={() => {
                                        setShowEmailInput(false);
                                        setEmail('');
                                        setIsValidEmail(true);
                                    }}
                                    style="w-full py-2 bg-dark rounded-lg"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default ShareModal;
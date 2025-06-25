'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { inviteAcceptReferal } from '../../actions/agent.action';
import toast from 'react-hot-toast';

const Page = () => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Extract token from URL query parameters
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tokenFromParams = params.get('token');
            if (tokenFromParams) {
                setToken(tokenFromParams);
            } else {
                toast.error('Invalid or missing invitation token.');
                setTimeout(() => router.push('/login'), 3000);
            }
        }
    }, [router]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error('No invitation token provided.');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await inviteAcceptReferal(token);

            if (error) {
                toast.error(error);
            } else {
                toast.success('Invitation accepted successfully! Redirecting to login...');
                setTimeout(() => router.push('/login'), 3000);
            }
        } catch (err) {
            toast.error('An unexpected error occurred. Please try again.');
            console.error('Accept referral error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <div className="w-full flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="mb-10 text-center">
                        <h2 className="text-[#002B4B] text-[32px] font-[800]">
                            Complete Referal Process
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Accept your referral invitation to become a Referal.
                        </p>
                    </div>
                    <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit}>
                        <button
                            type="submit"
                            className={`w-full cursor-pointer text-white bg-[#002B4B] h-[40px] font-[500] text-[14px] p-2 rounded-[4px] hover:bg-blue-900 transition-colors duration-200 ${loading || !token ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={loading || !token}
                        >
                            {loading ? 'Processing...' : 'Accept Referal'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;
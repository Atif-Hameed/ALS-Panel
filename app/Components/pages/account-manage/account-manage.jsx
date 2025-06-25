'use client';

import { useState, useEffect } from 'react';
import Container from '../../shared/container';
import CustomLink from '../../shared/custom-link';
import { API_URL } from '../../../api';
import toast from 'react-hot-toast';

export default function AccountManage({ email, userId }) {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlan = async () => {
            const { data, error } = await fetchUserPlan({ email, userId });
            if (error) {
                console.error(error);
            } else {
                setPlan(data);
            }
            setLoading(false);
        };

        if (email && userId) {
            loadPlan();
        }
    }, [email, userId]);

    const handleManageSubscription = async () => {
        try {
            const response = await fetch(`${API_URL}/api/payment/create-portal-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Error creating portal session:', error);
            toast.error('Failed to manage subscription. Please try again.');
        }
    };

    return (
        <Container className="py-16 px-4 bg-white mx-auto text-center">
            <h1 className="text-4xl font-bold text-[#02315A] mb-4">Your Account</h1>
            {loading ? (
                <p className="text-lg text-gray-700">Loading...</p>
            ) : (
                <>
                    <p className="text-lg text-gray-700 mb-6">
                        Current Plan: {plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'None'}
                    </p>
                    {plan !== 'free' && (
                        <button
                            onClick={handleManageSubscription}
                            className="bg-[#1e3264] text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition"
                        >
                            Manage Subscription
                        </button>
                    )}
                    <CustomLink href="/plans">
                        <button className="mt-4 bg-[#1e3264] text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition">
                            Change Plan
                        </button>
                    </CustomLink>
                </>
            )}
        </Container>
    );
}
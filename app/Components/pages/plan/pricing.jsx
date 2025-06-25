'use client';
import { useEffect, useState } from 'react';
import { useUserDetails } from '../../../hooks/useUser';
import { redirectToCheckout } from '../../../utils/stripe-client';
import { createStripeCheckoutSession } from '../../../actions/strip.action';
import toast from 'react-hot-toast';
import Container from '../../shared/container';

export default function PricingPlans({ plans, email, userId }) {
    const [id, setId] = useState(null);
    const [showYearly, setShowYearly] = useState(false);
    const { data: user } = useUserDetails(id);


    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setId(storedUserId);
            }
        }
    }, []);

    const handlePlanSelection = async (priceId, planTitle) => {
        if (!user?.email || !user?._id) {
            toast.error('Please log in to select a plan.');
            return;
        }

        try {
            const result = await createStripeCheckoutSession({
                priceId,
                email: user.email,
                userId: user._id,
                targetEmail: email,
                targetId: userId,
                planTitle,
            });

            if (!result.success) {
                toast.error(result.error || 'Error initiating checkout. Please try again.');
                return;
            }

            const redirectResult = await redirectToCheckout(result.sessionId);
            if (!redirectResult.success) {
                toast.error(redirectResult.error || 'Error redirecting to checkout.');
            }
        } catch (error) {
            console.error('Plan selection error:', error);
            toast.error('An unexpected error occurred.');
        }
    };

    const filteredPlans = plans.filter(plan => {
        if (showYearly) {
            return plan.interval === 'year';
        }
        return plan.interval === 'month';
    });

    return (
        <Container className="py-16 mb-10 px-4 bg-white mx-auto text-center">
            <h4 className="text-[#9A9A9A] lg:text-3xl sm:text-2xl text-xl font-medium mb-2">PRICE PLANS</h4>
            <h2 className="md:text-4xl text-3xl lg:text-5xl font-bold text-[#02315A] mb-8">Agent Listing Plans & Pricing</h2>

            {/* Simple Toggle Button */}
            <div className="flex items-center justify-center gap-4 my-12 pb-10">
                <span className="text-xl font-medium text-gray-700">Monthly</span>
                <button
                    type="button"
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${showYearly ? 'bg-[#1e3264]' : 'bg-gray-200'}`}
                    onClick={() => setShowYearly(!showYearly)}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${showYearly ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </button>
                <span className="text-xl font-medium text-gray-700">Yearly (30% off)</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-3 gap-6">
                {filteredPlans.map((plan, idx) => {
                    const isFeaturedPlan = plan.isFeatured && filteredPlans.length > 1;
                    const isStandardPlan = plan.name.includes('Standard') && filteredPlans.length > 1;
                    const isActive = plan.isActive; // Default to true if undefined

                    return (
                        <div
                            key={plan._id}
                            className={`rounded-xl shadow-lg py-6 px-4 flex flex-col justify-between relative ${
                                isFeaturedPlan || isStandardPlan ? 'lg:-my-8' : ''
                            } ${isActive ? 'bg-[#f5f8ff]' : 'bg-gray-100 opacity-75'}`}
                        >
                            {/* Inactive badge */}
                            {!isActive && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    Inactive
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <h3 className={`text-xl font-semibold ${
                                        isActive ? 'text-[#1e3264]' : 'text-gray-500'
                                    }`}>
                                        {plan.name.replace('(Monthly)', '').replace('(Yearly)', '').trim()}
                                    </h3>
                                    <p className={`text-sm font-bold ${
                                        isActive ? 'text-[#1e3264]' : 'text-gray-500'
                                    }`}>
                                        ${Math.round(plan.price)}
                                        <span className="text-sm font-normal">/{plan.interval}</span>
                                    </p>
                                </div>

                                <ul className="text-left space-y-3 text-sm text-gray-700">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <div className={`rounded-full p-1 ${
                                                isActive ? 'bg-[#000C661A]' : 'bg-gray-300'
                                            }`}>
                                                <svg
                                                    width="14"
                                                    height="12"
                                                    viewBox="0 0 20 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M1.25 9.875L8.25 16.875L18.75 1.125"
                                                        stroke={isActive ? "#02315A" : "#6B7280"}
                                                        strokeWidth="1.75"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                            <span className={isActive ? '' : 'text-gray-500'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => isActive && handlePlanSelection(plan.stripePriceId, plan.name)}
                                disabled={!isActive}
                                className={`mt-4 w-full py-2 px-4 rounded-md font-medium transition ${
                                    isActive 
                                        ? isFeaturedPlan 
                                            ? 'border border-[#1e3264] text-[#1e3264] hover:opacity-90 cursor-pointer'
                                            : isStandardPlan 
                                                ? 'bg-[#1e3264] text-white hover:opacity-90 cursor-pointer'
                                                : 'border border-[#1e3264] text-[#1e3264] hover:opacity-90 cursor-pointer'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {isActive ? 'Get Started →' : 'Plan Unavailable'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </Container>
    );
}
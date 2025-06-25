'use client';

import { loadStripe } from '@stripe/stripe-js';
import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from './constants';

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const redirectToCheckout = async (sessionId) => {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe.js failed to load.');
    }
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error('Stripe checkout redirect error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    return { success: false, error: error.message };
  }
};
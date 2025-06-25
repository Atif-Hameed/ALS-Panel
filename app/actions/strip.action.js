'use server';

import { API_URL } from '../api';
import { fetcher } from '../utils/fetcher';

export const createStripeCheckoutSession = async ({ priceId, email, userId, targetEmail, targetId,planTitle }) => {
  try {
    console.log('Data:', priceId, email, userId, targetEmail, targetId,planTitle);

    const res = await fetcher(`${API_URL}/api/payment/create-checkout-session`, {
      method: 'POST',
      body: JSON.stringify({ priceId, email, userId, targetEmail, targetId,planTitle }),
      cacheStrategy: 'no-cache',
    });

    console.log('Response:', res);

    if (!res.sessionId) {
      console.error('No sessionId in response:', res);
      return { success: false, error: 'Invalid response from server' };
    }

    return { success: true, sessionId: res.sessionId };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return { success: false, error: error.message };
  }
};

export const selectFreePlan = async ({ email, userId }) => {
  try {
    const res = await fetcher(`${API_URL}/api/payment/select-free-plan`, {
      method: 'POST',
      body: JSON.stringify({ email, userId, plan: 'free' }),
      cacheStrategy: 'no-cache',
      defaultHeaders: true,
    });

    console.log('Free plan response:', res);

    if (!res.message) {
      console.error('Invalid free plan response:', res);
      return { success: false, error: 'Failed to select free plan' };
    }

    return { success: true, data: res };
  } catch (error) {
    console.error('Error selecting free plan:', error);
    return { success: false, error: error.message };
  }
};
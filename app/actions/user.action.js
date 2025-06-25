'use server'
import axios from "axios";
import { API_BASE_URL, API_URL } from "../api";
import { fetcher } from "../utils/fetcher";


// fetch user
export const fetchUser = async (userId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/auth/get-user/${userId}`,
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during user fetching.";
        return { data: null, error: errorMessage };
    }
};

// fetch user by agent id
export const fetchUserByAgentId = async (agentId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/auth/user-byAgentId/${agentId}`,
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during user fetching.";
        return { data: null, error: errorMessage };
    }
};


// fetch user by refer id
export const getReferuser = async (referId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/auth/get-refer-user/${referId}`,
        );

        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during user fetching.";
        return { data: null, error: errorMessage };
    }
};

// fetch  refer 
export const getRefer = async (referId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/auth/get-refer/${referId}`,
        );

        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during user fetching.";
        return { data: null, error: errorMessage };
    }
};



// Get all users with filters
export const getAllUsers = async (page, limit, filters = {}) => {
    try {
        // Build query string
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });

        const response = await fetcher(
            `/api/auth/get-all-users?${queryParams.toString()}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache",
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during users fetching.";
        return { data: null, error: errorMessage };
    }
};





// Get user suggestions for autocomplete
export const getUserSuggestions = async (field, query) => {

    console.log("Data ", field, query)
    try {
        if (!field || !query || query.length < 2) {
            return { data: [], error: null };
        }

        const response = await fetcher(
            `/api/auth/suggestions?field=${field}&query=${encodeURIComponent(query)}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache",
            }
        );

        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during suggestions fetching.";
        return { data: null, error: errorMessage };
    }
};


// Get user 
export const getUserData = async (userId) => {
    try {
        const response = await fetcher(
            `/api/auth/get-user/${userId}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache",
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during user fetching.";
        return { data: null, error: errorMessage };
    }
};



// update user
export const updateUser = async (userId, updateData) => {
    console.log('Updating user:', userId, updateData);
    try {
        const response = await fetcher(`/api/auth/update-user/${userId}`, {
            method: 'PUT',
            baseUrl: API_URL,
            body: JSON.stringify(updateData),
            cacheStrategy: "no-cache",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return { data: response, error: null };
    } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred during user update.';
        console.log(errorMessage)
        return { data: null, error: errorMessage };
    }
};



// verififcation otp
export const verifyOTP = async (userId, { otp, field }) => {
    console.log('Verifying OTP for user:', userId, { otp, field });
    try {
        const response = await fetcher(`/api/auth/verify-otp/${userId}`, {
            method: 'POST',
            baseUrl: API_URL,
            body: JSON.stringify({ otp, field }),
            cacheStrategy: "no-cache",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return { data: response, error: null };
    } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred during OTP verification.';
        console.log(errorMessage);
        return { data: null, error: errorMessage };
    }
};



export const fetchUserPlan = async ({ email, userId }) => {
    try {
        const response = await fetch(`${API_URL}/api/auth/user-plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, userId }),
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || 'Failed to fetch user plan');
        }

        return { data: data.plan, error: null };
    } catch (error) {
        console.error('Error in fetchUserPlan:', error);
        return { data: null, error: error.message || 'Unknown error' };
    }
};
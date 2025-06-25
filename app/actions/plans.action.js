'use server';
import { fetcher } from "../utils/fetcher";
import { API_URL } from "../api";


// Get all plans
export const getAllPlans = async () => {
    try {
        const response = await fetcher(
            `${API_URL}/api/all-plan`,
            {
                method: 'GET',
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response.plans, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.message ||
            "An error occurred while fetching plans.";
        return { data: null, error: errorMessage };
    }
};

// Get plan by ID
export const getPlanById = async (id) => {
    try {
        const response = await fetcher(
            `${API_URL}/api/get-plan/${id}`,
            {
                method: 'GET',
                cacheStrategy: 'no-cache'
            }
        );
        return { data: response.plan, error: null };
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            error.message ||
            "An error occurred while fetching the plan.";
        return { data: null, error: errorMessage };
    }
};

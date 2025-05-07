'use server'
import { API_URL } from "../api";
import { fetcher } from "../utils/fetcher";


// create review
export const createReview = async (reviewData) => {
    try {
        const response = await fetcher(`${API_URL}/api/reviews/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
            cacheStrategy: 'no-cache',
        });

        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during Agent's property fetching.";
        return { data: null, error: errorMessage };
    }
};


// Get property reviews
export const getPropertyReviews = async (propertyId) => {
    try {
        const response = await fetcher(
            `/api/reviews/all-property-reviews/${propertyId}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache", // optional
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during reviews fetching.";
        return { data: null, error: errorMessage };
    }
};
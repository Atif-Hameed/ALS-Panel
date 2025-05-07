'use server'
import axios from "axios";
import { API_BASE_URL, API_URL } from "../api";
import { fetcher } from "../utils/fetcher";

// get properties 
export const getProperties = async (userId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/property/get-property-name/${userId}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during properties fething.";
        return { data: null, error: errorMessage };
    }
};

// Get properties with pagination
export const getPropertiesWithPagination = async (userId, page = 1, limit = 10) => {
    try {
        const response = await fetcher(
            `/api/property/get-properties/${userId}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache",
                query: { page, limit },
            }
        );

        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during properties fetching.";
        return { data: null, error: errorMessage };
    }
};



// get property data
export const getPropertyData = async (id) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/property/get-property/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during property data.";
        return { data: null, error: errorMessage };
    }
};



// assign property
export const assignProperty = async (data) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/property/create-address`,
            data
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during assinging property.";
        return { data: null, error: errorMessage };
    }
};

// assign propety to refral
export const assignPropertyToReferal = async (propertyIds, currentUserId, assignToUserId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/property/assign-property`,
            {
                propertyIds,
                currentUserId,
                assignToUserId
            }
        );

        return {
            data: response.data,
            error: null,
            success: `Assigned ${response.data.assignedCount} properties successfully`
        };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 'Failed to assign properties';

        return {
            data: null,
            error: errorMessage,
            partialSuccess: error.response?.data?.assignedCount
                ? `Only ${error.response.data.assignedCount} properties were assigned`
                : false
        };
    }
};



// Get all referral properties images
export const getReferalPropertiesImages = async (propertyId) => {
    try {
        const response = await fetcher(
            `/api/property/property-images/${propertyId}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache",
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during Agent's property images.";
        return { data: null, error: errorMessage };
    }
};
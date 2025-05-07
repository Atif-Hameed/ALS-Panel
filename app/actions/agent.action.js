'use server'
import axios from "axios";
import { API_BASE_URL, API_URL } from "../api";
import { fetcher } from "../utils/fetcher";


// iNVITE AN AGENT
export const inviteAgent = async (data) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/agents/create-agents`,
            data
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during Agent Invitation creation.";
        return { data: null, error: errorMessage };
    }
};


// accept invitation 
export const inviteAccept = async (token, password) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/agents/accept-invitation?token=${token}`,
            password
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during Agent Invitation creation.";
        return { data: null, error: errorMessage };
    }
};


// get all refreals 
export const getAllReferals = async (referBy, page, limit) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/agents/all-agents/${referBy}?page=${page}&limit=${limit}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during Agent fething.";
        return { data: null, error: errorMessage };
    }
};

// Get all referrals
export const getAllReferalsWeb = async (page, limit) => {
    try {
        const response = await fetcher(
            `/api/agents/get-all-agents?page=${page}&limit=${limit}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache", // optional
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage =
            error?.message || "An error occurred during Agent fetching.";
        return { data: null, error: errorMessage };
    }
};


// get all active refreals 
export const getAllActiveReferal = async (referBy) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/agents/all-active-agents/${referBy}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during Agent fething.";
        return { data: null, error: errorMessage };
    }
};

// delete  refreal
export const removeReferalbyId = async (id) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/agents/remove-agent/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during Agent fething.";
        return { data: null, error: errorMessage };
    }
};


// get refreal
export const getReferalbyId = async (id) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/agents/get-agent/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during Agent fething.";
        return { data: null, error: errorMessage };
    }
};

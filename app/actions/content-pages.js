'use server'
import axios from "axios";
import { API_BASE_URL, API_URL } from "../api";

// get page 
export const getPageContent = async (slug) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/get-page/${slug}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during page fething.";
        return { data: null, error: errorMessage };
    }
};

// get  all pages  
export const getAllPages = async (slug) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/get-all-pages`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during pages fething.";
        return { data: null, error: errorMessage };
    }
};
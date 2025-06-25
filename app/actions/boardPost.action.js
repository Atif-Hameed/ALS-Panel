"use server";

import { API_URL } from '../api';
import { fetcher } from '../utils/fetcher';

// Create board post
export const createPost = async (userId, postData) => {
    try {
        const response = await fetcher(
            `/api/boardPost/create-post/${userId}`,
            {
                baseUrl: API_URL,
                method: 'POST',
                body: JSON.stringify(postData),
                cacheStrategy: "no-cache",
            }
        );

        return {
            data: response,
            error: null
        };
    } catch (error) {
        const errorMessage = error?.message || "Failed to create post";
        return {
            data: null,
            error: errorMessage
        };
    }
};

// Get post topics
export const getPostTopics = async () => {
    try {
        const response = await fetcher(
            `/api/boardPost/post-topics`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache",
            }
        );
        return {
            data: response.data || {},
            error: null
        };
    } catch (error) {
        return {
            data: {},
            error: error?.message || "Failed to fetch post types and categories"
        };
    }
};

// Get all board posts
export const getAllBoardPosts = async ({ page = 1, limit = 10, postType, category, city } = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(postType && { postType }),
            ...(category && { category }),
            ...(city && { city }),
        }).toString();

        const response = await fetcher(
            `/api/boardPost/get-all-post?${queryParams}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache",
            }
        );
        return { data: response, error: null };
    } catch (error) {
        const errorMessage = error?.message || "An error occurred while fetching posts.";
        return { data: null, error: errorMessage };
    }
};

// Get single post
export const getPost = async (id) => {
    try {
        const response = await fetcher(
            `/api/boardPost/get-post/${id}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache",
            }
        );
        return {
            data: response,
            error: null
        };
    } catch (error) {
        return {
            data: {},
            error: error?.message || "Failed to fetch post."
        };
    }
};

// Get user posts
export const getUserPosts = async (userId) => {
    try {
        const response = await fetcher(
            `/api/boardPost/get-user-posts/${userId}`,
            {
                baseUrl: API_URL,
                cacheStrategy: "no-cache",
            }
        );
        return {
            data: response,
            error: null
        };
    } catch (error) {
        return {
            data: {},
            error: error?.message || "Failed to fetch posts."
        };
    }
};




// Delete post
export const deletePost = async (id,userId) => {
    try {
        const response = await fetcher(
            `/api/boardPost/delete-post/${id}/${userId}`,
            {
                baseUrl: API_URL,
                method: 'DELETE',
                cacheStrategy: "no-cache",
            }
        );
        return {
            data: response,
            error: null
        };
    } catch (error) {
        const errorMessage = error?.message || "Failed to delete post.";
        return {
            data: null,
            error: errorMessage
        };
    }
};
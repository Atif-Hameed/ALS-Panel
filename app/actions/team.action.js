'use server'
import axios from "axios";
import { API_BASE_URL } from "../api";


// create team
export const createTeam = async (data) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/team/create-team`,
            data
        );
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during team creation.";
        return { data: null, error: errorMessage };
    }
};


// get alll teams
export const getTeams = async (ownerId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/team/all-teams/${ownerId}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during teams fething.";
        return { data: null, error: errorMessage };
    }
};


// get team
export const getTeamById = async (id) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/team/team-byId/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during team fething.";
        return { data: null, error: errorMessage };
    }
};

// delete team
export const deleteTeam = async (id) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/team/delete-team/${id}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during team deleting.";
        return { data: null, error: errorMessage };
    }
};


// update team
export const updateTeam = async (id, data) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/team/update-team/${id}`, data);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during team updating.";
        return { data: null, error: errorMessage };
    }
};


// remove agent from team
export const removeAgent = async (teamId, agentId) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/team/remove-agent/${teamId}/${agentId}`);
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "An error occurred during team updating.";
        return { data: null, error: errorMessage };
    }
};
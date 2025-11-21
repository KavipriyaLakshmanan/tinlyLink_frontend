import axios, { AxiosError } from 'axios';
import type { ApiError, CreateLinkRequest, CreateLinkResponse, Link, LinkStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const linkService = {
 createLink: async (data: CreateLinkRequest): Promise<CreateLinkResponse> => {
    try {
      const response = await api.post<CreateLinkResponse>('/links', data);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      
      // Handle duplicate URL errors
      if (error.response?.status === 409 && error.response.data.existingLink) {
        // Create a custom error object that includes the existing link info
        const errorData = {
          error: error.response.data.error,
          existingLink: error.response.data.existingLink
        };
        throw new Error(JSON.stringify(errorData));
      }
      
      // Handle custom code conflicts
      if (error.response?.status === 409) {
        throw new Error('This custom code is already taken. Please try a different one.');
      }
      
      // Handle validation errors
      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || 'Invalid input data');
      }
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw new Error('Failed to create link. Please try again.');
    }
  },
  // Get all links
  getAllLinks: async (): Promise<Link[]> => {
    const response = await api.get<Link[]>('/links');
    return response.data;
  },

  // Get link statistics
  getLinkStats: async (code: string): Promise<LinkStats> => {
    const response = await api.get<LinkStats>(`/links/${code}`);
    return response.data;
  },

  // Delete a link
  deleteLink: async (code: string): Promise<void> => {
    await api.delete(`/links/${code}`);
  },
};

export const healthService = {
  checkHealth: async (): Promise<{ ok: boolean; version: string }> => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/healthz`);
    return response.data;
  },
};
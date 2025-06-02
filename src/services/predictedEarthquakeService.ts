import axiosInstance from '@/config/axios';
import axios from 'axios';

interface FilterParams {
    startDate: string;
    endDate: string;
    city: string;  // Empty string for no city filter
    minMagnitude: number;
    maxMagnitude: number;
    page: number;
    size: number;
}

export const predictedEarthquakeService = {
    getFilteredEarthquakes: async (params: FilterParams) => {
        try {
            const startDate = params.startDate ? new Date(params.startDate).toISOString() : '';
            const endDate = params.endDate ? new Date(params.endDate).toISOString() : '';
            // Convert empty string to null for city to match backend's TurkishCity enum
            const apiParams = {
                ...params,
                city: params.city === '' ? null : params.city,
                startDate,
                endDate
            };
            const response = await axiosInstance.post('/predicted-earthquake/filter', apiParams);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 
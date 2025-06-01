import axios from 'axios';

interface FilterParams {
    startDate: string;
    endDate: string;
    city: string;
    minMagnitude: number;
    maxMagnitude: number;
}

export const predictedEarthquakeService = {
    getFilteredEarthquakes: async (params: FilterParams) => {
        try {
            const response = await axios.post('/api/predicted-earthquake/filter', params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 
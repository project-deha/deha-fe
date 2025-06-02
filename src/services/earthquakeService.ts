import axiosInstance from '@/config/axios';

interface FilterParams {
    startDate: string;
    endDate: string;
    city: string;  // Empty string for no city filter
    minMagnitude: number;
    maxMagnitude: number;
    page: number;
    size: number;
}

export const earthquakeService = {
    getFilteredEarthquakes: async (params: FilterParams) => {
        try {
            // Convert empty string to null for city to match backend's TurkishCity enum
            const city = params.city === '' ? null : params.city;

            // Format dates as ISO 8601 strings for Java Instant
            const startDate = params.startDate ? new Date(params.startDate).toISOString() : '';
            const endDate = params.endDate ? new Date(params.endDate).toISOString() : '';

            // Build query string with each parameter separately
            const queryString = [
                startDate ? `startDate=${startDate}` : '',
                endDate ? `endDate=${endDate}` : '',
                city ? `city=${city}` : '',
                `minMagnitude=${params.minMagnitude}`,
                `maxMagnitude=${params.maxMagnitude}`,
                `page=${params.page}`,
                `size=${params.size}`
            ].filter(Boolean).join('&');

            const response = await axiosInstance.get(`/earthquake/filter?${queryString}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 
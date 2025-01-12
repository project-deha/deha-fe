import axios from 'axios';
import { API_BASE_URL } from '@/config/constants';
import type { PageResponse, PredictedEarthquakeDto } from '@/store/predictions';

interface CustomDateRange {
    from: Date | null;
    to: Date | null;
}

interface FilterParams {
    dateRange?: CustomDateRange;
    selectedCity?: string;
    magnitude?: number;
    page?: number;
    size?: number;
}

export const predictionsService = {
    filterPredictions: async function ({
        dateRange,
        selectedCity,
        magnitude = 0,
        page = 0,
        size = 50,
    }: FilterParams): Promise<PageResponse> {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/predicted-earthquake/filter`,
            {
                minMagnitude: magnitude || 0,
                maxMagnitude: 10,
                city: selectedCity || null,
                startDate: dateRange?.from
                    ? new Date(dateRange.from).toISOString()
                    : null,
                endDate: dateRange?.to
                    ? new Date(dateRange.to).toISOString()
                    : null,
                page,
                size,
            }
        );

        return response.data;
    },

    getMostPossibles: async function (): Promise<PredictedEarthquakeDto[]> {
        const response = await axios.get(
            `${API_BASE_URL}/api/v1/predicted-earthquake/most-possible`
        );
        return response.data;
    },
};

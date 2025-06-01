import { create } from 'zustand';

interface LocationDto {
    latitude: number;
    longitude: number;
    city: string;
}

interface PredictedEarthquakeDto {
    id: string;
    magnitude: number;
    depth: number;
    location: LocationDto;
    occurrenceDate: string;
}

interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

interface PredictedEarthquakeState {
    earthquakes: PredictedEarthquakeDto[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    isLoading: boolean;
    error: string | null;
    setEarthquakes: (data: Page<PredictedEarthquakeDto>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const usePredictedEarthquakeStore = create<PredictedEarthquakeState>((set) => ({
    earthquakes: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    isLoading: false,
    error: null,
    setEarthquakes: (data) => set({
        earthquakes: data.content,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        currentPage: data.number,
        pageSize: data.size,
    }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
})); 
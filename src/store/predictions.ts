import { atom } from 'jotai';

interface LocationDto {
    latitude: number;
    longitude: number;
    city: string;
}

export interface PredictedEarthquakeDto {
    id: string;
    magnitude: number;
    depth: number;
    location: LocationDto;
    possibility: number;
    predictionDate: string;
}

export interface PageResponse {
    content: PredictedEarthquakeDto[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // current page number
}

export const predictionsAtom = atom<PageResponse | null>(null);

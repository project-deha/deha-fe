import { cityCoordinates } from './cityCoordinates';

export interface EarthquakePrediction {
    id: string;
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    depth: number;
    magnitude: number;
    location: string;
    probability: number;
}

const generatePredictionsForCity = (
    city: string,
    coordinates: [number, number]
): EarthquakePrediction[] => [
    {
        id: `${city}-1`,
        date: '2025-03-15',
        time: '09:30',
        latitude: coordinates[0] + 0.05,
        longitude: coordinates[1] - 0.05,
        depth: 7.2,
        magnitude: 4.5,
        location: `${city}, Merkez`,
        probability: 60,
    },
    {
        id: `${city}-2`,
        date: '2025-06-22',
        time: '14:45',
        latitude: coordinates[0] - 0.03,
        longitude: coordinates[1] + 0.03,
        depth: 5.8,
        magnitude: 3.8,
        location: `${city}, Merkez`,
        probability: 40,
    },
    {
        id: `${city}-3`,
        date: '2025-09-07',
        time: '02:15',
        latitude: coordinates[0] + 0.02,
        longitude: coordinates[1] + 0.02,
        depth: 9.1,
        magnitude: 5.2,
        location: `${city}, Merkez`,
        probability: 80,
    },
    {
        id: `${city}-4`,
        date: '2025-12-01',
        time: '18:00',
        latitude: coordinates[0] - 0.01,
        longitude: coordinates[1] - 0.01,
        depth: 6.5,
        magnitude: 4.1,
        location: `${city}, Merkez`,
        probability: 50,
    },
];

export const staticEarthquakePredictions: EarthquakePrediction[] =
    Object.entries(cityCoordinates).flatMap(([city, coordinates]) =>
        generatePredictionsForCity(city, coordinates)
    );

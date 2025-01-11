'use client';

import React, { useEffect, useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import { Tooltip } from "antd";
import { useAtomValue, useSetAtom } from 'jotai';
import { predictionsAtom, PredictedEarthquakeDto } from '@/store/predictions';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/contexts/SearchContext';
import { API_BASE_URL } from '@/config/constants'
import axios from 'axios'
// Update TooltipContent to handle navigation
function TooltipContent({ predictions, cityName }: { predictions?: PredictedEarthquakeDto[], cityName: string }) {
    const router = useRouter();
    const { setSelectedCity, setMagnitude } = useSearch();

    const handleDetailsClick = (prediction: PredictedEarthquakeDto) => {
        // Only set the city filter
        setSelectedCity(cityName);


        // Navigate to predictions page
        router.push('/predictions');
    };

    if (!predictions?.length) {
        return <div>
            <p className="text-gray-500">No prediction data available</p>
        </div>
    }

    const topPredictions = predictions
        .sort((a, b) => b.possibility - a.possibility)
        .slice(0, 1);


    return <div>
        {topPredictions.map((prediction, index) => (
            <div key={prediction.id} className=''>
                <p>Possibility: {prediction.possibility}%</p>
                <p>Magnitude: {prediction.magnitude}</p>
                <p>Depth: {prediction.depth}km</p>
                <p>Prediction Date: {new Date(prediction.predictionDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}</p>
                <Button
                    className="text-black"
                    variant="outline"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDetailsClick(prediction);
                    }}
                >
                    Detaylar
                </Button>
            </div>
        ))}
    </div>
}

// Add a new interface for city type
interface City {
    name: string;
    plateNumber: string;
}

export function Map() {
    const predictions = useAtomValue(predictionsAtom);
    const setPredictions = useSetAtom(predictionsAtom);
    // Add state to track selected city
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialPredictions = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/v1/predicted-earthquake/filter`, {
                    minMagnitude: 0,
                    maxMagnitude: 10,
                    city: null,
                    startDate: null,
                    endDate: null,
                    page: 0,
                    size: 8
                })

                setPredictions(response.data)
            } catch (error) {
                console.error('Error fetching initial predictions:', error)
            }
        }

        fetchInitialPredictions()
    }, [setPredictions])

    const cityWrapper = (cityComponent: JSX.Element, city: any) => {
        const cityPredictions = predictions?.content?.filter(
            pred => pred.location.city.toLowerCase() === city.name.toLowerCase()
        );

        const highestPossibility = cityPredictions?.length
            ? Math.max(...cityPredictions.map(p => p.possibility))
            : 0;

        return (
            <Tooltip
                title={<TooltipContent
                    predictions={cityPredictions}
                    cityName={city.name}
                />}
                key={`city-${city.plateNumber}`}
                open={selectedCity === city.name ? true : undefined}
            >
                {React.cloneElement(cityComponent, {
                    style: {
                        fill: highestPossibility ? '#ff4d4f' : '#d9d9d9',
                        opacity: highestPossibility ? 0.8 : 0.5,
                    },
                    onClick: (e: React.MouseEvent) => {
                        e.stopPropagation();
                        setSelectedCity(prevCity =>
                            prevCity === city.name ? null : city.name
                        );
                    }
                })}
            </Tooltip>
        );
    };

    // Add click handler to the container to close tooltip when clicking outside
    const handleContainerClick = () => {
        setSelectedCity(null);
    };

    return (
        <div className="relative w-full h-[600px]" onClick={handleContainerClick}>
            <TurkeyMap
                showTooltip={false}
                customStyle={{
                    idleColor: "inherit",
                    hoverColor: "pink",
                }}
                hoverable={true}
                cityWrapper={cityWrapper}
            />
        </div>
    );
} 
'use client';

import React from 'react';
import TurkeyMap from 'turkey-map-react';
import { Tooltip } from "antd";
import { useAtomValue } from 'jotai';
import { predictionsAtom, PredictedEarthquakeDto } from '@/store/predictions';

// Updated TooltipContent to show up to 3 predictions
function TooltipContent({ predictions }: { predictions?: PredictedEarthquakeDto[] }) {
    if (!predictions?.length) {
        return <div>
            <p className="text-gray-500">No prediction data available</p>
        </div>
    }
    
    // Take top 3 predictions sorted by possibility
    const topPredictions = predictions
        .sort((a, b) => b.possibility - a.possibility)
        .slice(0, 1);

    return <div>
        {topPredictions.map((prediction, index) => (
            <div key={prediction.id} className={index > 0 ? 'mt-2 pt-2 border-t border-gray-200' : ''}>
                <p>Possibility: {prediction.possibility}%</p>
                <p>Magnitude: {prediction.magnitude}</p>
                <p>Depth: {prediction.depth}km</p>
                <p>Prediction Date: {new Date(prediction.predictionDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
})  }</p>
            </div>
        ))}
    </div>
}

export function Map() {
    const predictions = useAtomValue(predictionsAtom);

    const cityWrapper = (cityComponent: JSX.Element, city: any) => {
        // Find all predictions for this city
        const cityPredictions = predictions?.content.filter(
            pred => pred.location.city.toLowerCase() === city.name.toLowerCase()
        );

        // Use the highest possibility for the city color
        const highestPossibility = cityPredictions?.length 
            ? Math.max(...cityPredictions.map(p => p.possibility))
            : 0;

        return <Tooltip title={<TooltipContent predictions={cityPredictions} />} key={`city-${city.plateNumber}`}>
            {React.cloneElement(cityComponent, {
                style: {
                    fill: highestPossibility ? '#ff4d4f' : '#d9d9d9',
                    opacity: highestPossibility ? 0.8 : 0.5,
                }
            })}
        </Tooltip>;
    };

    return (
        <div className="relative w-full h-[600px]">
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
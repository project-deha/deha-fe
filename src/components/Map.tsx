'use client';

import { useSearch } from '@/contexts/SearchContext';
import { predictionsService } from '@/services/predictionsServices';
import { isSearchAtom } from '@/store/isSearch';
import {
    PageResponse,
    PredictedEarthquakeDto,
    predictionsAtom,
} from '@/store/predictions';
import { Tooltip } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import TurkeyMap from 'turkey-map-react';
import { Button } from './ui/button';

function TooltipContent({
    predictions,
    cityName,
}: {
    predictions?: PredictedEarthquakeDto[];
    cityName: string;
}) {
    const router = useRouter();
    const { setSelectedCity } = useSearch();

    const handleDetailsClick = () => {
        setSelectedCity(cityName);
        router.push('/predictions');
    };

    if (!predictions?.length) {
        return (
            <div className="p-3 bg-card rounded-lg border border-border/50">
                <h3 className="font-semibold text-lg mb-2 text-black text-center">{cityName}</h3>
                <p className="text-muted-foreground text-center">Bu şehir için tahmin bulunmamaktadır.</p>
            </div>
        );
    }

    const topPredictions = predictions
        .sort((a, b) => b.possibility - a.possibility)
        .slice(0, 1);

    return (
        <div className="p-4 bg-card rounded-lg border border-border/50 shadow-sm">
            {topPredictions.map((prediction) => (
                <div key={prediction.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-black">{cityName}</h3>
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 ml-3 rounded-full text-sm font-medium bg-primary/10 text-primary">
                            %{(prediction.possibility * 100).toFixed(1)}
                        </span>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                            <span>Büyüklük:</span>
                            <span className="font-medium text-foreground">{prediction.magnitude.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Derinlik:</span>
                            <span className="font-medium text-foreground">{prediction.depth}km</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Tarih:</span>
                            <span className="font-medium text-foreground">
                                {new Date(prediction.predictionDate).toLocaleDateString('tr-TR')}
                            </span>
                        </div>
                    </div>

                    <button
                        className="w-full px-4 py-2 mt-2 text-sm border rounded-md text-black"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDetailsClick();
                        }}
                    >
                        Detayları Gör
                    </button>
                </div>
            ))}
        </div>
    );
}

type CustomDateRange = {
    from: Date | null;
    to: Date | null;
};

export function Map() {
    const {
        dateRange,
        selectedCity,
        magnitude,
        setDateRange,
        setSelectedCity,
        setMagnitude,
    } = useSearch();
    const predictions = useAtomValue(predictionsAtom);
    const setPredictions = useSetAtom(predictionsAtom);
    const isSearch = useAtomValue(isSearchAtom);
    const setIsSearch = useSetAtom(isSearchAtom);
    // Add state to track selected city

    useEffect(() => {
        const fetchInitialPredictions = async () => {
            try {
                const response = await predictionsService.getMostPossibles();
                setPredictions({
                    content: response as PredictedEarthquakeDto[],
                } as PageResponse);
            } catch (error) {
                console.error('Error fetching initial predictions:', error);
            }
        };

        const fetchFilteredPredictions = async () => {
            const searchParams = {
                dateRange,
                selectedCity,
                magnitude,
                page: 0,
                size: 100,
            };
            const response =
                await predictionsService.filterPredictions(searchParams);
            setPredictions(response);
        };

        if (isSearch) fetchFilteredPredictions();
        else fetchInitialPredictions();
    }, [dateRange, selectedCity, magnitude]);

    const cityWrapper = (cityComponent: JSX.Element, city: any) => {
        const cityPredictions = predictions?.content?.filter(
            (pred) => pred.location.city.toLowerCase() === city.name.toLowerCase()
        );

        const highestPossibility = cityPredictions?.length
            ? Math.max(...cityPredictions.map((p) => p.possibility))
            : 0;

        // Olasılık değerine göre renk belirleme
        const getCityColor = (possibility: number) => {
            if (possibility <= 0) return '#d9d9d9';  // Tahmin yoksa gri
            if (possibility <= 0.25) return '#22c55e';  // Yeşil
            if (possibility <= 0.50) return '#eab308';  // Sarı
            if (possibility <= 0.75) return '#f97316';  // Turuncu
            return '#ef4444';  // Kırmızı
        };

        // Hover için rengin koyulaştırılmış hali
        const getDarkerColor = (possibility: number) => {
            if (possibility <= 0) return '#bfbfbf';  // Koyu gri
            if (possibility <= 0.25) return '#16a34a';  // Koyu yeşil
            if (possibility <= 0.50) return '#ca8a04';  // Koyu sarı
            if (possibility <= 0.75) return '#ea580c';  // Koyu turuncu
            return '#dc2626';  // Koyu kırmızı
        };

        const cityColor = getCityColor(highestPossibility);
        const hoverColor = getDarkerColor(highestPossibility);

        return (
            <Tooltip
                title={
                    <TooltipContent
                        predictions={cityPredictions}
                        cityName={city.name}
                    />
                }
                key={`city-${city.plateNumber}`}
                open={selectedCity === city.name ? true : undefined}
                overlayClassName="z-[15]"
                overlayStyle={{ zIndex: 15 }}
            >
                {React.cloneElement(cityComponent, {
                    style: {
                        fill: cityColor,
                        opacity: highestPossibility <= 0 ? 0.5 : 0.8,
                    },
                    onMouseEnter: (e: React.MouseEvent) => {
                        e.currentTarget.style.fill = hoverColor;
                    },
                    onMouseLeave: (e: React.MouseEvent) => {
                        e.currentTarget.style.fill = cityColor;
                    },
                    onClick: (e: React.MouseEvent) => {
                        e.stopPropagation();
                        setSelectedCity((prevCity) =>
                            prevCity === city.name ? null : city.name
                        );
                    },
                })}
            </Tooltip>
        );
    };

    // Add click handler to the container to close tooltip when clicking outside
    const handleContainerClick = () => {
        setSelectedCity(null);
    };

    return (
        <div
            className="relative w-full h-[600px]"
            onClick={handleContainerClick}
        >
            <TurkeyMap
                showTooltip={false}
                customStyle={{
                    idleColor: 'inherit',
                }}
                hoverable={true}
                cityWrapper={cityWrapper}
            />
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useFilterStore } from '@/store/filterStore';
import HistoricalMap from '@/components/map/HistoricalMap';
import { earthquakeService } from '@/services/earthquakeService';

interface EarthquakeData {
    id: string;
    magnitude: number;
    depth: number;
    location: {
        city: string;
        latitude: number;
        longitude: number;
    };
    occurrenceDate: string;
}

interface MapData {
    city: string;
    riskLevel: number;
    magnitude: number;
    date: string;
    depth: number;
}

export default function HistoryMapPage() {
    const { startDate, endDate, city, minMagnitude, maxMagnitude, setFilters } = useFilterStore();
    const [data, setData] = useState<EarthquakeData[]>([]);
    const [filteredData, setFilteredData] = useState<EarthquakeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // İlk yüklemede most-severe, filtreler değişince filter endpointi
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Eğer filtreler default ise most-severe, değilse filter endpointi
                const isDefaultFilter = !startDate && !endDate && !city && minMagnitude === 0 && maxMagnitude === 10;
                let responseData;
                if (isDefaultFilter) {
                    responseData = await earthquakeService.getMostSevereEarthquakes();
                } else {
                    // Filter endpointi kullan
                    const response = await earthquakeService.getFilteredEarthquakes({
                        startDate,
                        endDate,
                        city,
                        minMagnitude,
                        maxMagnitude,
                        page: 0,
                        size: 500// Harita için yeterli büyüklükte bir sayı
                    });
                    // Filter endpoint returns paginated data
                    responseData = response.content || response;
                }
                setData(responseData);
            } catch (error) {
                console.error('Veri yüklenirken hata oluştu:', error);
                setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, city, minMagnitude, maxMagnitude]);

    // Filtreleme
    useEffect(() => {
        let filtered = [...data];

        // Tarih filtresi
        if (startDate) {
            filtered = filtered.filter(item => item.occurrenceDate >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(item => item.occurrenceDate <= endDate);
        }

        // Şehir filtresi
        if (city) {
            filtered = filtered.filter(item => item.location.city === city);
        }

        // Büyüklük filtresi
        if (minMagnitude > 0) {
            filtered = filtered.filter(item => item.magnitude >= minMagnitude);
        }
        if (maxMagnitude < 10) {
            filtered = filtered.filter(item => item.magnitude <= maxMagnitude);
        }

        setFilteredData(filtered);
    }, [data, startDate, endDate, city, minMagnitude, maxMagnitude]);

    // Her şehir için en yüksek büyüklüğe sahip depremi bul
    const getHighestMagnitudeEarthquakes = () => {
        const cityMap = new Map<string, EarthquakeData>();

        data.forEach(earthquake => {
            const currentCity = earthquake.location.city;
            const existingEarthquake = cityMap.get(currentCity);

            if (!existingEarthquake || earthquake.magnitude > existingEarthquake.magnitude) {
                cityMap.set(currentCity, earthquake);
            }
        });

        return Array.from(cityMap.values());
    };

    const handleCitySelect = (selectedCity: string) => {
        setFilters({
            startDate,
            endDate,
            city: selectedCity,
            minMagnitude,
            maxMagnitude
        });
    };

    // Harita için veri hazırlama
    const mapData: MapData[] = getHighestMagnitudeEarthquakes().map(earthquake => ({
        city: earthquake.location.city,
        riskLevel: earthquake.magnitude / 10, // 0-1 arası risk seviyesi
        magnitude: earthquake.magnitude,
        date: earthquake.occurrenceDate,
        depth: earthquake.depth
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">
                    Deprem Geçmişi Haritası
                </h1>
            </div>

            {/* Harita */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Harita her zaman görünsün */}
                <HistoricalMap
                    historicalData={mapData}
                    onCitySelect={handleCitySelect}
                    detailsRoute="/user/history/table"
                />

                {/* Eğer hiç marker yoksa bilgi mesajı göster */}
                {!loading && filteredData.length === 0 && (
                    <div className="flex justify-center items-center h-32">
                        <p className="text-gray-600">Gösterilecek veri bulunamadı.</p>
                    </div>
                )}
                {loading && (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {/* Renk Açıklamaları */}
                <div className="mt-4 flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#FF0000] rounded mr-2 animate-subtle-forward"></div>
                        <span className="text-sm">7.0+</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#FF4500] rounded mr-2"></div>
                        <span className="text-sm">6.0-6.9</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#FFA500] rounded mr-2"></div>
                        <span className="text-sm">5.0-5.9</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#FFD700] rounded mr-2"></div>
                        <span className="text-sm">4.0-4.9</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-[#90EE90] rounded mr-2"></div>
                        <span className="text-sm">4.0-</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 
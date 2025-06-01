'use client';

import { useEffect, useState } from 'react';
import { useFilterStore } from '@/store/filterStore';
import HistoricalMap from '@/components/map/HistoricalMap';

// Gerçekçi örnek geçmiş veri
const sampleHistoricalData = [
    {
        city: 'Istanbul',
        riskLevel: 0.8,
        magnitude: 6.1,
        date: '2023-12-15',
        depth: 12.3
    },
    {
        city: 'Ankara',
        riskLevel: 0.5,
        magnitude: 5.0,
        date: '2023-11-10',
        depth: 8.7
    },
    {
        city: 'Izmir',
        riskLevel: 0.7,
        magnitude: 5.8,
        date: '2023-10-05',
        depth: 10.2
    }
];

export default function HistoryMapPage() {
    const { startDate, endDate, city, minMagnitude, maxMagnitude, setFilters } = useFilterStore();
    const [filteredData, setFilteredData] = useState<typeof sampleHistoricalData>(sampleHistoricalData);

    useEffect(() => {
        // Filtreleme örneği
        let filtered = [...sampleHistoricalData];
        if (startDate) filtered = filtered.filter(item => item.date >= startDate);
        if (endDate) filtered = filtered.filter(item => item.date <= endDate);
        if (city) filtered = filtered.filter(item => item.city === city);
        if (minMagnitude > 0) filtered = filtered.filter(item => item.magnitude >= minMagnitude);
        if (maxMagnitude < 10) filtered = filtered.filter(item => item.magnitude <= maxMagnitude);
        setFilteredData(filtered);
    }, [startDate, endDate, city, minMagnitude, maxMagnitude]);

    // Şehir seçilince filtreleri güncelle
    const handleCitySelect = (selectedCity: string) => {
        setFilters({
            startDate,
            endDate,
            city: selectedCity,
            minMagnitude,
            maxMagnitude
        });
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">
                    Deprem Geçmişi Haritası
                </h1>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px] flex items-center justify-center">
                {/* HistoricalMap bileşeni */}
                <HistoricalMap historicalData={filteredData} detailsRoute="/user/history/table" onCitySelect={handleCitySelect} />
            </div>
        </main>
    );
} 
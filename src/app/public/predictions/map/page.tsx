'use client';

import { useEffect, useState } from 'react';
import { useFilterStore } from '@/store/filterStore';
import PredictionMap from '@/components/map/PredictionMap';
import { useRouter } from 'next/navigation';

interface PredictionData {
    occurrenceDate: string;
    location: {
        city: string;
        latitude: number;
        longitude: number;
    };
    depth: number;
    magnitude: number;
}

export default function MapPage() {
    const router = useRouter();
    const { startDate, endDate, city, minMagnitude, maxMagnitude, setFilters } = useFilterStore();
    const [data, setData] = useState<PredictionData[]>([]);
    const [filteredData, setFilteredData] = useState<PredictionData[]>([]);
    const [loading, setLoading] = useState(true);

    // Veri yükleme simülasyonu
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // TODO: API'den veri çekme işlemi burada yapılacak
                // Şimdilik örnek veri
                const mockData: PredictionData[] = [
                    // İstanbul için örnek veriler
                    {
                        occurrenceDate: '2024-03-20',
                        location: {
                            city: 'Istanbul',
                            latitude: 41.0082,
                            longitude: 28.9784
                        },
                        depth: 10.5,
                        magnitude: 5.2
                    },
                    {
                        occurrenceDate: '2024-03-20',
                        location: {
                            city: 'Istanbul',
                            latitude: 41.0082,
                            longitude: 28.9784
                        },
                        depth: 8.2,
                        magnitude: 4.8
                    },
                    {
                        occurrenceDate: '2024-03-21',
                        location: {
                            city: 'Istanbul',
                            latitude: 41.0082,
                            longitude: 28.9784
                        },
                        depth: 12.3,
                        magnitude: 5.5
                    },
                    {
                        occurrenceDate: '2024-03-21',
                        location: {
                            city: 'Istanbul',
                            latitude: 41.0082,
                            longitude: 28.9784
                        },
                        depth: 9.8,
                        magnitude: 4.2
                    },
                    {
                        occurrenceDate: '2024-03-22',
                        location: {
                            city: 'Istanbul',
                            latitude: 41.0082,
                            longitude: 28.9784
                        },
                        depth: 11.1,
                        magnitude: 5.8
                    },
                    // Diğer şehirler için örnek veriler
                    {
                        occurrenceDate: '2024-03-20',
                        location: {
                            city: 'Ankara',
                            latitude: 39.9334,
                            longitude: 32.8597
                        },
                        depth: 12.3,
                        magnitude: 5.0
                    },
                    {
                        occurrenceDate: '2024-03-20',
                        location: {
                            city: 'Ankara',
                            latitude: 39.9334,
                            longitude: 32.8597
                        },
                        depth: 9.8,
                        magnitude: 4.2
                    },
                    {
                        occurrenceDate: '2024-03-20',
                        location: {
                            city: 'İzmir',
                            latitude: 38.4237,
                            longitude: 27.1428
                        },
                        depth: 11.1,
                        magnitude: 4.5
                    }
                ];
                setData(mockData);
            } catch (error) {
                console.error('Veri yüklenirken hata oluştu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    // Her şehir için en yüksek büyüklüğe sahip tahmini bul
    const getHighestMagnitudePredictions = () => {
        const cityMap = new Map<string, PredictionData>();

        filteredData.forEach(prediction => {
            const currentCity = prediction.location.city;
            const existingPrediction = cityMap.get(currentCity);

            if (!existingPrediction || prediction.magnitude > existingPrediction.magnitude) {
                cityMap.set(currentCity, prediction);
            }
        });

        return Array.from(cityMap.values());
    };

    // Büyüklüğe göre renk belirleme
    const getColorByMagnitude = (magnitude: number) => {
        if (magnitude >= 7.0) return '#FF0000'; // Kırmızı
        if (magnitude >= 6.0) return '#FF4500'; // Turuncu-Kırmızı
        if (magnitude >= 5.0) return '#FFA500'; // Turuncu
        if (magnitude >= 4.0) return '#FFD700'; // Altın Sarısı
        return '#90EE90'; // Açık Yeşil
    };

    const handleCitySelect = (selectedCity: string) => {
        // Seçilen şehir için filtreleri güncelle
        setFilters({
            startDate: startDate,
            endDate: endDate,
            city: selectedCity,
            minMagnitude: minMagnitude,
            maxMagnitude: maxMagnitude
        });
    };

    const handleViewDetails = (selectedCity: string) => {
        // Tablo sayfasına yönlendir ve filtreleri ayarla
        setFilters({
            startDate: startDate,
            endDate: endDate,
            city: selectedCity,
            minMagnitude: minMagnitude,
            maxMagnitude: maxMagnitude
        });
        router.push('/public/predictions/table');
    };

    // Harita için veri hazırlama
    const mapData = getHighestMagnitudePredictions().map(prediction => ({
        city: prediction.location.city,
        riskLevel: prediction.magnitude / 10,
        color: getColorByMagnitude(prediction.magnitude),
        magnitude: prediction.magnitude,
        depth: prediction.depth,
        date: prediction.occurrenceDate,
        // Popup içeriği için ek bilgiler
        popupContent: (
            <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{prediction.location.city}</h3>
                <div className="space-y-1">
                    <p className="text-sm">
                        <span className="font-semibold">En Yüksek Büyüklük:</span> {prediction.magnitude.toFixed(1)}
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">Tarih:</span> {new Date(prediction.occurrenceDate).toLocaleDateString('tr-TR')}
                    </p>
                </div>
                <button
                    onClick={() => handleViewDetails(prediction.location.city)}
                    className="mt-3 w-full bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                >
                    Detayları Görüntüle
                </button>
            </div>
        )
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">
                    Deprem Tahmini Haritası
                </h1>
            </div>

            {/* Harita */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Harita her zaman görünsün */}
                <PredictionMap
                    predictionData={mapData}
                    onCitySelect={handleCitySelect}
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
                        <div className="w-4 h-4 bg-[#FF0000] rounded mr-2"></div>
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
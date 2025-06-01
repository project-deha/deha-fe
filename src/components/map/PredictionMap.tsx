'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useState } from 'react';
import { geoMercator, geoCentroid } from 'd3-geo';
import { useRouter } from 'next/navigation';

const geoUrl = '/turkey-provinces.json';

interface PredictionData {
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

interface PredictionMapProps {
    predictionData: PredictionData[];
    onCitySelect?: (city: string) => void;
    detailsRoute?: string;
}

// Şehir adlarını normalize eden fonksiyon
const normalize = (str: string) =>
    str
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g');

const projection = geoMercator()
    .center([35, 39.5])
    .scale(2700)
    .translate([1000 / 2, 500 / 2]);

export default function PredictionMap({ predictionData, onCitySelect, detailsRoute = '/public/predictions/table' }: PredictionMapProps) {
    const router = useRouter();
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ x: number, y: number } | null>(null);
    const [hoveredCity, setHoveredCity] = useState<string | null>(null);
    const [hoverPopupPosition, setHoverPopupPosition] = useState<{ x: number, y: number } | null>(null);

    const colorScale = (cityName: string) => {
        const found = predictionData.find(
            (d) => normalize(d.location.city) === normalize(cityName)
        );
        if (!found) return '#e0e0e0';
        const magnitude = found.magnitude;
        // Magnitude-based color scale
        if (magnitude >= 7.0) return '#FF0000'; // Kırmızı
        if (magnitude >= 6.0) return '#FF4500'; // Turuncu-Kırmızı
        if (magnitude >= 5.0) return '#FFA500'; // Turuncu
        if (magnitude >= 4.0) return '#FFD700'; // Altın Sarısı
        return '#90EE90'; // Açık Yeşil
    };

    const getHoverColor = (baseColor: string) => {
        // Convert hex to rgba with 0.7 opacity
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
    };

    const handleCityClick = (cityName: string, geo: any) => {
        setSelectedCity(cityName);
        setShowPopup(true);
        const centroid = geoCentroid(geo);
        if (centroid) {
            const projected = projection(centroid);
            if (projected) {
                const [x, y] = projected;
                setPopupPosition({ x, y });
            }
        }

        setTimeout(() => {
            onCitySelect?.(cityName);
        }, 100);
    };

    const handleCityHover = (cityName: string, geo: any, isHovering: boolean) => {
        if (isHovering) {
            setHoveredCity(cityName);
            const centroid = geoCentroid(geo);
            if (centroid) {
                const projected = projection(centroid);
                if (projected) {
                    const [x, y] = projected;
                    setHoverPopupPosition({ x, y });
                }
            }
        } else {
            setHoveredCity(null);
            setHoverPopupPosition(null);
        }
    };

    const handleViewDetails = (cityName: string) => {
        router.push(detailsRoute);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedCity(null);
        setPopupPosition(null);
    };

    return (
        <div className="w-full flex flex-col items-center relative">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: [35, 39.5], scale: 2700 }}
                width={1000}
                height={500}
                style={{ width: '100%', height: 'auto', maxWidth: 1000 }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const cityName = geo.properties.name || geo.properties.NAME_1;
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={() => handleCityClick(cityName, geo)}
                                    onMouseEnter={() => handleCityHover(cityName, geo, true)}
                                    onMouseLeave={() => handleCityHover(cityName, geo, false)}
                                    style={{
                                        default: {
                                            fill: colorScale(cityName),
                                            outline: 'none',
                                            stroke: selectedCity === cityName ? '#2563eb' : '#fff',
                                            strokeWidth: selectedCity === cityName ? 2 : 0.5,
                                            cursor: 'pointer',
                                        },
                                        hover: {
                                            fill: 'rgba(227, 236, 240, 0.7)',
                                            outline: 'none',
                                        },
                                        pressed: {
                                            fill: 'rgba(128, 128, 128, 0.7)',
                                            outline: 'none',
                                        },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>

            {/* Hover Popup */}
            {hoveredCity && hoverPopupPosition && (
                <div
                    className="absolute z-40"
                    style={{
                        left: hoverPopupPosition.x,
                        top: hoverPopupPosition.y,
                        transform: 'translate(-50%, -100%)',
                        pointerEvents: 'none',
                    }}
                >
                    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[180px] relative">
                        <h3 className="text-lg font-bold mb-2">{hoveredCity}</h3>
                        {(() => {
                            const found = predictionData.find(
                                (d) => normalize(d.location.city) === normalize(hoveredCity)
                            );
                            if (found) {
                                return (
                                    <div className="space-y-1">
                                        <div>
                                            <span className="font-semibold">Büyüklük:</span>{' '}
                                            <span>{found.magnitude.toFixed(1)}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Derinlik:</span>{' '}
                                            <span>{found.depth.toFixed(1)} km</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Tarih:</span>{' '}
                                            <span>{new Date(found.occurrenceDate).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <p className="text-gray-600">Bu şehir için henüz tahmin verisi bulunmamaktadır.</p>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Click Popup */}
            {showPopup && selectedCity && popupPosition && (
                <div
                    className="absolute z-50"
                    style={{
                        left: popupPosition.x,
                        top: popupPosition.y,
                        transform: 'translate(-50%, -100%)',
                        pointerEvents: 'auto',
                    }}
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[220px] relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                            onClick={handleClosePopup}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-2">{selectedCity}</h2>
                        {(() => {
                            const found = predictionData.find(
                                (d) => normalize(d.location.city) === normalize(selectedCity)
                            );
                            if (found) {
                                return (
                                    <div className="space-y-2">
                                        <div>
                                            <span className="font-semibold">En Yüksek Büyüklük:</span>{' '}
                                            <span>{found.magnitude.toFixed(1)}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Derinlik:</span>{' '}
                                            <span>{found.depth.toFixed(1)} km</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Tarih:</span>{' '}
                                            <span>{new Date(found.occurrenceDate).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                        <button
                                            onClick={() => handleViewDetails(selectedCity)}
                                            className="w-full mt-3 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                                        >
                                            Detayları Görüntüle
                                        </button>
                                    </div>
                                );
                            }
                            return (
                                <div className="space-y-2">
                                    <p className="text-gray-600">Bu şehir için henüz tahmin verisi bulunmamaktadır.</p>
                                    <button
                                        onClick={() => handleViewDetails(selectedCity)}
                                        className="w-full mt-3 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                                    >
                                        Tüm Tahminleri Görüntüle
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
} 
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import 'leaflet/dist/leaflet.css'
import { useSearch } from '@/contexts/SearchContext'
import { Button } from '@/components/ui/button'
import CustomMarker from './CustomMarker'
import { staticEarthquakePredictions, EarthquakePrediction } from '@/data/staticEarthquakePredictions'
import { cityCoordinates } from '@/data/cityCoordinates'

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
)
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
)
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
)
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
)

export function Body() {
    const [isMounted, setIsMounted] = useState(false)
    const { dateRange, selectedCity, magnitude, isSearched } = useSearch()
    const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597])
    const [mapZoom, setMapZoom] = useState(6)
    const [filteredPredictions, setFilteredPredictions] = useState<EarthquakePrediction[]>([])
    const router = useRouter()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (selectedCity) {
            const cityName = selectedCity.split(',')[0]
            if (cityCoordinates[cityName]) {
                setMapCenter(cityCoordinates[cityName])
                setMapZoom(10)
            }
        } else {
            setMapCenter([39.9334, 32.8597])
            setMapZoom(6)
        }
    }, [selectedCity])

    useEffect(() => {
        if (isSearched) {
            let filtered = staticEarthquakePredictions

            if (dateRange?.from && dateRange?.to) {
                filtered = filtered.filter(item => {
                    const itemDate = new Date(item.date)
                    return itemDate >= dateRange.from! && itemDate <= dateRange.to!
                })
            }

            if (selectedCity) {
                filtered = filtered.filter(item =>
                    item.location.toLowerCase().includes(selectedCity.toLowerCase())
                )
            }

            if (magnitude) {
                filtered = filtered.filter(item => item.magnitude >= magnitude)
            }

            setFilteredPredictions(filtered.slice(0, 3))
        } else {
            setFilteredPredictions([])
        }
    }, [dateRange, selectedCity, magnitude, isSearched])

    if (!isMounted) {
        return null
    }

    const handleDetailClick = () => {
        const params = new URLSearchParams()
        if (selectedCity) params.append('city', selectedCity)
        if (dateRange?.from) params.append('from', dateRange.from.toISOString())
        if (dateRange?.to) params.append('to', dateRange.to.toISOString())
        if (magnitude) params.append('magnitude', magnitude.toString())
        router.push(`/predictions?${params.toString()}`)
    }

    return (
        <div className="absolute inset-0 z-0">
            <MapContainer
                key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {selectedCity && filteredPredictions.length > 0 && (
                    <Marker
                        position={mapCenter}
                        icon={CustomMarker}
                    >
                        <Popup>
                            <div className="min-w-[300px] p-6 bg-white shadow-lg rounded-lg border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                                    {selectedCity}
                                </h3>
                                <div className="mb-5">
                                    <div className="grid grid-cols-3 text-sm font-semibold text-gray-600 border-b border-gray-300 pb-3">
                                        <div className="text-left">Tarih</div>
                                        <div className="text-center">Büyüklük</div>
                                        <div className="text-right">Olasılık</div>
                                    </div>
                                    {filteredPredictions.map((prediction, index) => (
                                        <div
                                            key={prediction.id}
                                            className="grid grid-cols-3 text-sm text-gray-700 py-3 border-b border-gray-100 last:border-none"
                                        >
                                            <div className="text-left">
                                                {index + 1}.{" "}
                                                {new Date(prediction.date).toLocaleDateString("tr-TR")}
                                            </div>
                                            <div className="text-center">{prediction.magnitude.toFixed(1)}</div>
                                            <div className="text-right text-green-600 font-medium">
                                                %{prediction.probability}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    onClick={handleDetailClick}
                                    className="w-full bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 text-white font-medium py-2 rounded-lg transition-colors"
                                >
                                    Detay
                                </Button>
                            </div>
                        </Popup>

                    </Marker>
                )}
            </MapContainer>
        </div>
    )
}


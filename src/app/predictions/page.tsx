'use client'

import { Header } from '@/components/Header'
import { PredictionsTable } from '@/components/PredictionsTable'
import { useSearch } from '@/contexts/SearchContext'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PredictionsPage() {
    const { dateRange, selectedCity, magnitude, setDateRange, setSelectedCity, setMagnitude } = useSearch()
    const searchParams = useSearchParams()

    // Sync URL parameters with search context when the page loads
    useEffect(() => {
        const city = searchParams.get('city')
        const from = searchParams.get('from')
        const to = searchParams.get('to')
        const mag = searchParams.get('magnitude')

        if (city) setSelectedCity(city)
        if (mag) setMagnitude(parseFloat(mag))
        if (from && to) {
            setDateRange({
                from: new Date(from),
                to: new Date(to)
            })
        }
    }, [searchParams, setSelectedCity, setDateRange, setMagnitude])

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Deprem Tahminleri</h1>
                <PredictionsTable
                    dateRange={dateRange}
                    selectedCity={selectedCity}
                    magnitude={magnitude}
                />
            </div>
        </>
    )
}


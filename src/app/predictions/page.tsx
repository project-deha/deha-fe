'use client'

import { Header } from '@/components/Header'
import { PredictionsTable } from '@/components/PredictionsTable'
import { useSearch } from '@/contexts/SearchContext'

export default function PredictionsPage() {
    const { dateRange, selectedCity, magnitude } = useSearch()

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


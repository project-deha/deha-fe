'use client'

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios'

type CustomDateRange = {
    from: Date | null;
    to: Date | null;
};

interface PredictionsTableProps {
    dateRange?: CustomDateRange;
    selectedCity?: string;
    magnitude?: number;
}

interface LocationDto {
    latitude: number
    longitude: number
    city: string
}

interface PredictedEarthquakeDto {
    id: string
    magnitude: number
    depth: number
    location: LocationDto
    possibility: number
    latitude?: number
    longitude?: number
    city?: string
    predictionDate: string
}

type SortConfig = {
    key: keyof PredictedEarthquakeDto | 'city' | null
    direction: 'asc' | 'desc'
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export function PredictionsTable({ dateRange, selectedCity, magnitude }: PredictionsTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'magnitude',
        direction: 'desc'
    })
    const [predictions, setPredictions] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPredictions(currentPage)
    }, [currentPage, dateRange, selectedCity, magnitude])

    const fetchPredictions = async (page: number) => {
        try {
            setLoading(true)
            const response = await axios.post(`${API_BASE_URL}/api/v1/predicted-earthquake/filter`, {
                minMagnitude: magnitude || 0,
                maxMagnitude: 10,
                city: selectedCity ? selectedCity : null,
                startDate: dateRange?.from ? new Date(dateRange.from).toISOString() : null,
                endDate: dateRange?.to ? new Date(dateRange.to).toISOString() : null,
                page: page - 1,
                size: itemsPerPage
            })

            setPredictions(response.data)
        } catch (error) {
            console.error('Error fetching predictions:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !predictions) {
        return (
            <div className="rounded-md border bg-white p-8 text-center">
                <p className="text-gray-500">Loading predictions...</p>
            </div>
        )
    }

    if (predictions.content.length === 0) {
        return (
            <div className="rounded-md border bg-white p-8 text-center">
                <p className="text-gray-500">No predictions found.</p>
            </div>
        )
    }

    const sortedData = [...predictions.content].sort((a, b) => {
        if (!sortConfig.key) return 0
        if (sortConfig.key === 'city') {
            return sortConfig.direction === 'asc'
                ? a.location.city.localeCompare(b.location.city)
                : b.location.city.localeCompare(a.location.city)
        }
        const aValue = sortConfig.key === 'location' ? a.location : a[sortConfig.key]
        const bValue = sortConfig.key === 'location' ? b.location : b[sortConfig.key]
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
    })

    const renderSortableHeader = (label: string, key: keyof PredictedEarthquakeDto) => (
        <div
            className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 p-2 rounded"
            onClick={() => handleSort(key)}
        >
            {label}
            {getSortIcon(key)}
        </div>
    )

    const handleSort = (key: keyof PredictedEarthquakeDto) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const getSortIcon = (key: keyof PredictedEarthquakeDto) => {
        if (sortConfig.key !== key) return <ChevronDown className="inline h-4 w-4 opacity-50" />
        return sortConfig.direction === 'asc' ?
            <ChevronUp className="inline h-4 w-4" /> :
            <ChevronDown className="inline h-4 w-4" />
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{renderSortableHeader('Enlem(N)', 'latitude')}</TableHead>
                        <TableHead>{renderSortableHeader('Boylam(E)', 'longitude')}</TableHead>
                        <TableHead>{renderSortableHeader('Derinlik(km)', 'depth')}</TableHead>
                        <TableHead>{renderSortableHeader('Büyüklük', 'magnitude')}</TableHead>
                        <TableHead>{renderSortableHeader('Şehir', 'city')}</TableHead>
                        <TableHead>{renderSortableHeader('Olasılık', 'possibility')}</TableHead>
                        <TableHead>{renderSortableHeader('Tarih', 'predictionDate')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-sky-50">
                    {sortedData.map((prediction) => (
                        <TableRow key={prediction.id}>
                            <TableCell>{prediction.location.latitude.toFixed(4)}</TableCell>
                            <TableCell>{prediction.location.longitude.toFixed(4)}</TableCell>
                            <TableCell>{prediction.depth.toFixed(1)}</TableCell>
                            <TableCell>{prediction.magnitude.toFixed(1)}</TableCell>
                            <TableCell>{prediction.location.city}</TableCell>
                            <TableCell>%{(prediction.possibility * 100).toFixed(1)}</TableCell>
                            <TableCell>{new Date(prediction.predictionDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Toplam {predictions.totalElements} tahmin
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        Sayfa {predictions.number + 1} / {predictions.totalPages}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={predictions.number === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={predictions.number === predictions.totalPages - 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


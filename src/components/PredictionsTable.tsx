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
import { useSearch } from '@/contexts/SearchContext'
import { staticEarthquakePredictions, EarthquakePrediction } from '@/data/staticEarthquakePredictions'

type CustomDateRange = {
    from: Date | null;
    to: Date | null;
};

interface PredictionsTableProps {
    dateRange?: CustomDateRange;
    selectedCity?: string;
    magnitude?: number;
}

type SortConfig = {
    key: keyof EarthquakePrediction | null
    direction: 'asc' | 'desc'
}

export function PredictionsTable({ dateRange, selectedCity, magnitude }: PredictionsTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'date',
        direction: 'asc'
    })
    const [filteredData, setFilteredData] = useState<EarthquakePrediction[]>([])
    const { selectedCity: contextSelectedCity } = useSearch()

    useEffect(() => {
        let result = staticEarthquakePredictions

        if (dateRange?.from && dateRange?.to) {
            result = result.filter(item => {
                const itemDate = new Date(item.date)
                return itemDate >= dateRange.from! && itemDate <= dateRange.to!
            })
        }

        if (selectedCity || contextSelectedCity) {
            const city = selectedCity || contextSelectedCity
            result = result.filter(item =>
                item.location.toLowerCase().includes(city.toLowerCase())
            )
        }

        if (magnitude) {
            result = result.filter(item => item.magnitude >= magnitude)
        }

        setFilteredData(result)
        setCurrentPage(1)
    }, [dateRange, selectedCity, contextSelectedCity, magnitude])

    const handleSort = (key: keyof EarthquakePrediction) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const sortData = (data: EarthquakePrediction[]) => {
        if (!sortConfig.key) return data

        return [...data].sort((a, b) => {
            if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1
            if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }

    const getSortIcon = (key: keyof EarthquakePrediction) => {
        if (sortConfig.key !== key) return <ChevronDown className="inline h-4 w-4 opacity-50" />
        return sortConfig.direction === 'asc' ?
            <ChevronUp className="inline h-4 w-4" /> :
            <ChevronDown className="inline h-4 w-4" />
    }

    const sortedData = sortData(filteredData)
    const totalPages = Math.ceil(sortedData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

    const renderSortableHeader = (label: string, key: keyof EarthquakePrediction) => (
        <div
            className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 p-2 rounded"
            onClick={() => handleSort(key)}
        >
            {label}
            {getSortIcon(key)}
        </div>
    )

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{renderSortableHeader('Tarih', 'date')}</TableHead>
                        <TableHead>{renderSortableHeader('Saat', 'time')}</TableHead>
                        <TableHead>{renderSortableHeader('Enlem(N)', 'latitude')}</TableHead>
                        <TableHead>{renderSortableHeader('Boylam(E)', 'longitude')}</TableHead>
                        <TableHead>{renderSortableHeader('Derinlik(km)', 'depth')}</TableHead>
                        <TableHead>{renderSortableHeader('Büyüklük', 'magnitude')}</TableHead>
                        <TableHead>{renderSortableHeader('Yer', 'location')}</TableHead>
                        <TableHead>{renderSortableHeader('Olasılık', 'probability')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-sky-50">
                    {paginatedData.map((prediction) => (
                        <TableRow key={prediction.id}>
                            <TableCell>{new Date(prediction.date).toLocaleDateString('tr-TR')}</TableCell>
                            <TableCell>{prediction.time}</TableCell>
                            <TableCell>{prediction.latitude.toFixed(4)}</TableCell>
                            <TableCell>{prediction.longitude.toFixed(4)}</TableCell>
                            <TableCell>{prediction.depth.toFixed(1)}</TableCell>
                            <TableCell>{prediction.magnitude.toFixed(1)}</TableCell>
                            <TableCell>{prediction.location}</TableCell>
                            <TableCell>%{prediction.probability}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Sayfa başına satır
                    </p>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                            setItemsPerPage(Number(value))
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        Sayfa {currentPage} / {totalPages}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


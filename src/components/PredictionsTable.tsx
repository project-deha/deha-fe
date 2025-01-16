'use client';

import { useState, useEffect } from 'react';
import {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { predictionsAtom } from '@/store/predictions';
import { predictionsService } from '@/services/predictionsServices';

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
    latitude: number;
    longitude: number;
    city: string;
}

interface PredictedEarthquakeDto {
    id: string;
    magnitude: number;
    depth: number;
    location: LocationDto;
    possibility: number;
    latitude?: number;
    longitude?: number;
    city?: string;
    predictionDate: string;
}

type SortConfig = {
    key: keyof PredictedEarthquakeDto | 'city' | null;
    direction: 'asc' | 'desc';
};

export function PredictionsTable({
    dateRange,
    selectedCity,
    magnitude,
}: PredictionsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'magnitude',
        direction: 'desc',
    });
    const [predictions, setPredictions] = useAtom(predictionsAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPredictions();
    }, [currentPage, dateRange, selectedCity, magnitude]);

    const fetchPredictions = async () => {
        try {
            setLoading(true);
            const searchParams = {
                dateRange,
                selectedCity,
                magnitude,
                page: currentPage - 1,
                size: itemsPerPage,
            };
            const response =
                await predictionsService.filterPredictions(searchParams);
            setPredictions(response);
        } catch (error) {
            console.error('Error fetching predictions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !predictions) {
        return (
            <div className="rounded-md border bg-white p-8 text-center">
                <p className="text-gray-500">Loading predictions...</p>
            </div>
        );
    }

    if (predictions.content.length === 0) {
        return (
            <div className="rounded-md border bg-white p-8 text-center">
                <p className="text-gray-500">No predictions found.</p>
            </div>
        );
    }

    const sortedData = [...predictions.content].sort((a, b) => {
        if (!sortConfig.key) return 0;
        if (sortConfig.key === 'city') {
            return sortConfig.direction === 'asc'
                ? a.location.city.localeCompare(b.location.city)
                : b.location.city.localeCompare(a.location.city);
        }
        const aValue =
            sortConfig.key === 'location' ? a.location : a[sortConfig.key];
        const bValue =
            sortConfig.key === 'location' ? b.location : b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const renderSortableHeader = (
        label: string,
        key: keyof PredictedEarthquakeDto
    ) => (
        <div
            className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 p-2 rounded"
            onClick={() => handleSort(key)}
        >
            {label}
            {getSortIcon(key)}
        </div>
    );

    const handleSort = (key: keyof PredictedEarthquakeDto) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    const getSortIcon = (key: keyof PredictedEarthquakeDto) => {
        if (sortConfig.key !== key)
            return <ChevronDown className="inline h-4 w-4 opacity-50" />;
        return sortConfig.direction === 'asc' ? (
            <ChevronUp className="inline h-4 w-4" />
        ) : (
            <ChevronDown className="inline h-4 w-4" />
        );
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">
                            {renderSortableHeader('Tarih', 'predictionDate')}
                        </TableHead>
                        <TableHead className="font-semibold">
                            {renderSortableHeader('Şehir', 'city')}
                        </TableHead>
                        <TableHead className="font-semibold">
                            {renderSortableHeader('Enlem(N)', 'latitude')}
                        </TableHead>
                        <TableHead className="font-semibold">
                            {renderSortableHeader('Boylam(E)', 'longitude')}
                        </TableHead>
                        <TableHead className="font-semibold">
                            {renderSortableHeader('Derinlik(km)', 'depth')}
                        </TableHead>
                        <TableHead className="font-semibold">
                            {renderSortableHeader('Büyüklük', 'magnitude')}
                        </TableHead>
                        <TableHead className="font-semibold">
                            {renderSortableHeader('Olasılık', 'possibility')}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.map((prediction) => (
                        <TableRow
                            key={prediction.id}
                            className="hover:bg-muted/50 transition-colors"
                        >
                            <TableCell className="font-medium">
                                {new Date(prediction.predictionDate).toLocaleDateString('tr-TR')}
                            </TableCell>
                            <TableCell>{prediction.location.city}</TableCell>
                            <TableCell>
                                {prediction.location.latitude.toFixed(4)}
                            </TableCell>
                            <TableCell>
                                {prediction.location.longitude.toFixed(4)}
                            </TableCell>
                            <TableCell>{prediction.depth.toFixed(1)}</TableCell>
                            <TableCell>
                                <span className="font-medium text-primary">
                                    {prediction.magnitude.toFixed(1)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                                    %{(prediction.possibility * 100).toFixed(1)}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/50">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Toplam <span className="font-medium text-foreground">{predictions.totalElements}</span> tahmin
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        Sayfa <span className="font-medium text-foreground">{predictions.number + 1}</span> /{' '}
                        <span className="font-medium text-foreground">{predictions.totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={predictions.number === 0}
                            className="hover:bg-background"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={predictions.number === predictions.totalPages - 1}
                            className="hover:bg-background"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

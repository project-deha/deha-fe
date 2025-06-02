'use client';

import { useEffect, useState } from 'react';
import { useFilterStore } from '@/store/filterStore';
import { usePredictedEarthquakeStore } from '@/store/predictedEarthquakeStore';
import { predictedEarthquakeService } from '@/services/predictedEarthquakeService';

interface EarthquakeData {
    id: string;
    occurrenceDate: string;
    location: {
        city: string;
        latitude: number;
        longitude: number;
    };
    depth: number;
    magnitude: number;
}

export default function PredictionsTablePage() {
    const { startDate, endDate, city, minMagnitude, maxMagnitude } = useFilterStore();
    const { earthquakes, totalElements, totalPages, currentPage, pageSize, isLoading, error, setEarthquakes, setLoading, setError, setCurrentPage } = usePredictedEarthquakeStore();
    const [sortConfig, setSortConfig] = useState<{
        key: keyof EarthquakeData | 'location.city' | 'location.latitude' | 'location.longitude';
        direction: 'asc' | 'desc';
    } | null>(null);

    // Fetch data when filters change
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await predictedEarthquakeService.getFilteredEarthquakes({
                    startDate,
                    endDate,
                    city,
                    minMagnitude,
                    maxMagnitude,
                    page: currentPage, // API expects 0-based index
                    size: pageSize
                });
                setEarthquakes(response);
            } catch (error) {
                console.error('Veri yüklenirken hata oluştu:', error);
                setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, city, minMagnitude, maxMagnitude, currentPage, pageSize]);

    // Sıralama
    const requestSort = (key: keyof EarthquakeData | 'location.city' | 'location.latitude' | 'location.longitude') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sıralama fonksiyonu
    const sortedData = [...earthquakes].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        let aValue, bValue;

        if (key.startsWith('location.')) {
            const locationKey = key.split('.')[1] as keyof typeof a.location;
            aValue = a.location[locationKey];
            bValue = b.location[locationKey];
        } else {
            aValue = a[key as keyof EarthquakeData];
            bValue = b[key as keyof EarthquakeData];
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handlePageChange = (pageNumber: number) => {
        // Convert 1-based UI page number to 0-based API page number
        setCurrentPage(pageNumber - 1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">
                    Deprem Tahmini Tablosu
                </h1>
            </div>

            {/* Tablo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Veriler yükleniyor...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : earthquakes.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-600">Gösterilecek veri bulunamadı.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => requestSort('occurrenceDate')}
                                        >
                                            Tarih {sortConfig?.key === 'occurrenceDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => requestSort('location.city')}
                                        >
                                            Şehir {sortConfig?.key === 'location.city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => requestSort('location.latitude')}
                                        >
                                            Enlem {sortConfig?.key === 'location.latitude' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => requestSort('location.longitude')}
                                        >
                                            Boylam {sortConfig?.key === 'location.longitude' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => requestSort('depth')}
                                        >
                                            Derinlik {sortConfig?.key === 'depth' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => requestSort('magnitude')}
                                        >
                                            Büyüklük {sortConfig?.key === 'magnitude' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(item.occurrenceDate).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.location.city}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.location.latitude.toFixed(4)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.location.longitude.toFixed(4)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.depth.toFixed(1)} km
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.magnitude.toFixed(1)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Sayfalama */}
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 0}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    İlk
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage)}
                                    disabled={currentPage === 0}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Önceki
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 2)}
                                    disabled={currentPage === totalPages - 1}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Sonraki
                                </button>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages - 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Son
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Toplam <span className="font-medium">{totalElements}</span> kayıttan{' '}
                                        <span className="font-medium">{currentPage * pageSize + 1}</span> -{' '}
                                        <span className="font-medium">
                                            {Math.min((currentPage + 1) * pageSize, totalElements)}
                                        </span> arası gösteriliyor
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 0}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">İlk</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M13 15V5a1 1 0 10-2 0v10a1 1 0 102 0zM7 15V5a1 1 0 10-2 0v10a1 1 0 102 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage)}
                                            disabled={currentPage === 0}
                                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Önceki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {/* Sayfa numaraları */}
                                        {(() => {
                                            const pageButtons = [];
                                            const maxPageButtons = 3; // Mevcut sayfa ve etrafındaki 1'er sayfa
                                            let startPage = Math.max(1, currentPage + 1 - 1);
                                            let endPage = Math.min(totalPages, currentPage + 1 + 1);
                                            if (currentPage + 1 === 1) {
                                                endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
                                            } else if (currentPage + 1 === totalPages) {
                                                startPage = Math.max(1, endPage - maxPageButtons + 1);
                                            }
                                            if (startPage > 1) {
                                                pageButtons.push(
                                                    <span key="start-ellipsis" className="px-2 py-2 text-gray-400">...</span>
                                                );
                                            }
                                            for (let i = startPage; i <= endPage; i++) {
                                                pageButtons.push(
                                                    <button
                                                        key={i}
                                                        onClick={() => handlePageChange(i)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i - 1
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {i}
                                                    </button>
                                                );
                                            }
                                            if (endPage < totalPages) {
                                                pageButtons.push(
                                                    <span key="end-ellipsis" className="px-2 py-2 text-gray-400">...</span>
                                                );
                                            }
                                            return pageButtons;
                                        })()}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 2)}
                                            disabled={currentPage === totalPages - 1}
                                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Sonraki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={currentPage === totalPages - 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Son</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7 5v10a1 1 0 102 0V5a1 1 0 10-2 0zm6 0v10a1 1 0 102 0V5a1 1 0 10-2 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 
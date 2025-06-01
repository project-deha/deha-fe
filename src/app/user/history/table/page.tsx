'use client';

import { useEffect, useState } from 'react';
import { useFilterStore } from '@/store/filterStore';

interface EarthquakeData {
    occurrenceDate: string;
    location: {
        city: string;
        latitude: number;
        longitude: number;
    };
    depth: number;
    magnitude: number;
}

export default function HistoryTablePage() {
    const { startDate, endDate, city, minMagnitude, maxMagnitude } = useFilterStore();
    const [data, setData] = useState<EarthquakeData[]>([]);
    const [filteredData, setFilteredData] = useState<EarthquakeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof EarthquakeData | 'location.city' | 'location.latitude' | 'location.longitude';
        direction: 'asc' | 'desc';
    } | null>(null);

    // Veri yükleme simülasyonu
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // TODO: API'den veri çekme işlemi burada yapılacak
                // Şimdilik örnek veri
                const mockData: EarthquakeData[] = [
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
                    // Daha fazla örnek veri eklenebilir
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
        setCurrentPage(1); // Filtreleme yapıldığında ilk sayfaya dön
    }, [data, startDate, endDate, city, minMagnitude, maxMagnitude]);

    // Sıralama
    const requestSort = (key: keyof EarthquakeData | 'location.city' | 'location.latitude' | 'location.longitude') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sıralama fonksiyonu
    const sortedData = [...filteredData].sort((a, b) => {
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

    // Sayfalama
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">
                    Geçmiş Depremler Tablosu
                </h1>
            </div>

            {/* Tablo */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Veriler yükleniyor...</p>
                    </div>
                ) : filteredData.length === 0 ? (
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
                                    {currentItems.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
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
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Önceki
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Sonraki
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Toplam <span className="font-medium">{filteredData.length}</span> kayıttan{' '}
                                        <span className="font-medium">{indexOfFirstItem + 1}</span> -{' '}
                                        <span className="font-medium">
                                            {Math.min(indexOfLastItem, filteredData.length)}
                                        </span> arası gösteriliyor
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Önceki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Sonraki</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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
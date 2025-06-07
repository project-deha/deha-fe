'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/config/axios';

interface Report {
    id: string;
    title: string;
    city: string;
    date: string;
}

type SortField = 'title' | 'city' | 'date';
type SortDirection = 'asc' | 'desc';

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<SortField>('city');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axiosInstance.get('/report');
                setReports(response.data);
                setLoading(false);
            } catch {
                console.error('Raporlar yüklenirken hata oluştu:');
                setError('Raporlar yüklenirken bir hata oluştu.');
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDownload = async (reportId: string, reportTitle: string) => {
        try {
            setDownloadingId(reportId);
            const response = await axiosInstance.get(`/report/${reportId}`, {
                responseType: 'blob'
            });

            // Create a blob from the response data
            const blob = new Blob([response.data]);

            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = `DEHA-${reportTitle}.pdf`;

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            setError('Rapor indirilirken bir hata oluştu.');
        } finally {
            setDownloadingId(null);
        }
    };

    const sortedReports = [...reports].sort((a, b) => {
        const aValue = a[sortField].toLowerCase();
        const bValue = b[sortField].toLowerCase();

        if (sortDirection === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </main>
        );
    }

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return (
            <span className="ml-1">
                {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Raporlar</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('title')}
                            >
                                <div className="flex items-center">
                                    Başlık
                                    <SortIcon field="title" />
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('city')}
                            >
                                <div className="flex items-center">
                                    Şehir
                                    <SortIcon field="city" />
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('date')}
                            >
                                <div className="flex items-center">
                                    Tarih
                                    <SortIcon field="date" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedReports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{report.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{report.city}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{report.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDownload(report.id, report.title)}
                                        disabled={downloadingId === report.id}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {downloadingId === report.id ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-white"></div>
                                                İndiriliyor...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                                </svg>
                                                İndir
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
} 
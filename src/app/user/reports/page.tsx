'use client';

import { useEffect, useState } from 'react';

interface Report {
    id: string;
    title: string;
    year: number;
    image: string;
    downloadUrl: string;
    viewUrl: string;
}

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [page, setPage] = useState(1);
    const pageSize = 8;

    // Örnek veri (backend'den fetch ile değiştirilebilir)
    useEffect(() => {
        setReports([
            {
                id: '1',
                title: 'Türkiye Ocak Ayı Deprem Verileri',
                year: 2024,
                image: '/report.jpg',
                downloadUrl: '/raporlar/ocak2024.pdf',
                viewUrl: '/raporlar/ocak2024.pdf',
            },
            {
                id: '2',
                title: 'Türkiye Şubat Ayı Deprem Verileri',
                year: 2024,
                image: '/report.jpg',
                downloadUrl: '/raporlar/subat2024.pdf',
                viewUrl: '/raporlar/subat2024.pdf',
            },
            {
                id: '3',
                title: 'Türkiye Mart Ayı Deprem Verileri',
                year: 2024,
                image: '/report.jpg',
                downloadUrl: '/raporlar/mart2024.pdf',
                viewUrl: '/raporlar/mart2024.pdf',
            },
            {
                id: '4',
                title: 'Türkiye Nisan Ayı Deprem Verileri',
                year: 2024,
                image: '/report.jpg',
                downloadUrl: '/raporlar/nisan2024.pdf',
                viewUrl: '/raporlar/nisan2024.pdf',
            },
            {
                id: '5',
                title: 'Türkiye Mayıs Ayı Deprem Verileri',
                year: 2024,
                image: '/report.jpg',
                downloadUrl: '/raporlar/mayis2024.pdf',
                viewUrl: '/raporlar/mayis2024.pdf',
            },
            {
                id: '6',
                title: 'Türkiye Haziran Ayı Deprem Verileri',
                year: 2024,
                image: '/report.jpg',
                downloadUrl: '/raporlar/haziran2024.pdf',
                viewUrl: '/raporlar/haziran2024.pdf',
            },
            {
                id: '7',
                title: 'Türkiye Temmuz Ayı Deprem Verileri',
                year: 2024,
                image: '/report.jpg',
                downloadUrl: '/raporlar/temmuz2024.pdf',
                viewUrl: '/raporlar/temmuz2024.pdf',
            },
            {
                id: '8',
                title: 'Türkiye Ağustos Ayı Deprem Verileri',
                year: 2024,
                image: '/report.jpg',
                downloadUrl: '/raporlar/agustos2024.pdf',
                viewUrl: '/raporlar/agustos2024.pdf',
            },
            {
                id: '9',
                title: 'Türkiye Eylül Ayı Deprem Verileri',
                year: 2024,
                image: '/report.jpg',
                downloadUrl: '/raporlar/eylul2024.pdf',
                viewUrl: '/raporlar/eylul2024.pdf',
            },
        ]);
    }, []);

    // Sayfalama için slice
    const pagedReports = reports.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(reports.length / pageSize);

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Raporlar</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pagedReports.map((report) => (
                    <div key={report.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                        <img src={report.image} alt={report.title} className="rounded mb-3 aspect-square object-cover" />
                        <div className="font-semibold">{report.title}</div>
                        <div className="text-gray-500 text-sm mb-2">{report.year}</div>
                        <div className="flex gap-2 mt-auto">
                            <a
                                href={report.viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded transition"
                                title="Görüntüle"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </a>
                            <a
                                href={report.downloadUrl}
                                download
                                className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded transition"
                                title="İndir"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                >{`<<`}</button>
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                >{`<`}</button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-blue-600 text-white' : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                >{`>`}</button>
                <button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="px-2 py-1 rounded border disabled:opacity-50"
                >{`>>`}</button>
            </div>
        </main>
    );
} 
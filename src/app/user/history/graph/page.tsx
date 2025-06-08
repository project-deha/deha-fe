'use client';

import { useEffect, useState } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import axiosInstance from '@/config/axios';

interface HistoricalData {
    date: string;
    count: number;
    avgMagnitude: number;
}

interface MagnitudeDistribution {
    range: string;
    count: number;
    percentage: number;
}

interface CityDistribution {
    name: string;
    value: number;
    percentage: number;
}

interface MonthlyEarthquakeStatsDto {
    date: string; // LocalDate from backend comes as ISO string
    avgMagnitude: number;
    count: number;
}

export default function HistoryGraphPage() {
    const [data, setData] = useState<HistoricalData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('10'); // Yıl cinsinden
    const [magnitudeData, setMagnitudeData] = useState<MagnitudeDistribution[]>([]);
    const [cityData, setCityData] = useState<CityDistribution[]>([]);

    // API'den aylık deprem istatistiklerini çek
    const fetchMonthlyEarthquakeStats = async (years: number) => {
        try {
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - years;
            const endYear = currentYear;

            const response = await axiosInstance.get('/earthquake/stats/monthly', {
                params: {
                    startYear,
                    endYear
                }
            });

            const monthlyStats: MonthlyEarthquakeStatsDto[] = response.data;

            // Backend'den gelen aylık veriyi yıllık veriye dönüştür
            const yearlyStats = new Map<string, { totalCount: number, magnitudeSum: number, dataPoints: number }>();

            monthlyStats.forEach(stat => {
                const year = new Date(stat.date).getFullYear().toString();

                if (!yearlyStats.has(year)) {
                    yearlyStats.set(year, { totalCount: 0, magnitudeSum: 0, dataPoints: 0 });
                }

                const yearData = yearlyStats.get(year)!;
                yearData.totalCount += stat.count;
                yearData.magnitudeSum += stat.avgMagnitude * stat.count; // Ağırlıklı ortalama için
                yearData.dataPoints += stat.count;
            });

            // Map'i HistoricalData formatına dönüştür
            const historicalData: HistoricalData[] = Array.from(yearlyStats.entries()).map(([year, data]) => ({
                date: year,
                count: data.totalCount,
                avgMagnitude: Number((data.magnitudeSum / data.dataPoints).toFixed(1))
            })).sort((a, b) => parseInt(a.date) - parseInt(b.date));

            return historicalData;
        } catch (error) {
            console.error('Aylık deprem istatistikleri alınırken hata:', error);
            throw new Error('Deprem verileri yüklenirken bir hata oluştu.');
        }
    };

    // API'den büyüklük dağılımı verilerini çek
    const fetchMagnitudeDistribution = async () => {
        try {
            const response = await axiosInstance.get('/earthquake/stats/magnitude-distribution');
            const distributionStats: MagnitudeDistribution[] = response.data;
            return distributionStats;
        } catch (error) {
            console.error('Büyüklük dağılımı verileri alınırken hata:', error);
            throw new Error('Büyüklük dağılımı verileri yüklenirken bir hata oluştu.');
        }
    };

    // API'den şehir dağılımı verilerini çek
    const fetchCityDistribution = async () => {
        try {
            const response = await axiosInstance.get('/earthquake/stats/city-distribution');
            // Backend'den gelen veriyi CityDistribution formatına dönüştür
            const cityStats = response.data.map((item: { city: string; count: number; percentage: number }) => ({
                name: item.city,
                value: item.count,
                percentage: item.percentage
            }));
            return cityStats;
        } catch (error) {
            console.error('Şehir dağılımı verileri alınırken hata:', error);
            throw new Error('Şehir dağılımı verileri yüklenirken bir hata oluştu.');
        }
    };

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Async fonksiyon için iç fonksiyon oluştur
        const loadData = async () => {
            try {
                const historicalData = await fetchMonthlyEarthquakeStats(Number(timeRange));
                const magnitudeDistData = await fetchMagnitudeDistribution();
                const cityDistData = await fetchCityDistribution();

                setData(historicalData);
                setMagnitudeData(magnitudeDistData);
                setCityData(cityDistData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Veriler yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        // Simülasyon gecikmesi ile async fonksiyon çağır
        setTimeout(() => {
            loadData();
        }, 500);
    }, [timeRange]);

    // İndirme fonksiyonları
    const downloadTimeSeriesData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Yıl,Deprem Sayısı,Ortalama Büyüklük\n"
            + data.map(row => `${row.date},${row.count},${row.avgMagnitude}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `gecmis_deprem_zaman_serisi_${timeRange}yil.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadMagnitudeData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Büyüklük Aralığı,Deprem Sayısı,Yüzde\n"
            + magnitudeData.map(row => `${row.range},${row.count},${row.percentage}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `gecmis_deprem_buyukluk_dagilimi_tum_zamanlar.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadCityData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Şehir,Deprem Sayısı,Yüzde\n"
            + cityData.map(row => `${row.name},${row.value},${row.percentage}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `gecmis_deprem_sehir_dagilimi_tum_zamanlar.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Modern mavi-kırmızı renk paleti
    const COLORS = [
        '#2563eb', // Mavi
        '#dc2626', // Kırmızı
        '#3b82f6', // Açık mavi
        '#ef4444', // Açık kırmızı
        '#1d4ed8', // Koyu mavi
        '#b91c1c', // Koyu kırmızı
        '#60a5fa', // Çok açık mavi
        '#f87171', // Çok açık kırmızı
        '#1e40af', // Daha koyu mavi
        '#991b1b', // Daha koyu kırmızı
    ];
    const BAR_GRADIENT_ID = 'barGradient';
    const LINE_GRADIENT_ID = 'lineGradient';
    const PIE_GRADIENT_ID = 'pieGradient';

    // Modern Tooltip
    const CustomTooltip = ({ active, payload, label }: {
        active?: boolean;
        payload?: Array<{
            color: string;
            name: string;
            value: number;
        }>;
        label?: string;
    }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border-2 border-blue-200 rounded-xl shadow-2xl min-w-[200px] backdrop-blur-sm">
                    <p className="font-bold text-blue-800 mb-2 text-center text-lg">{label}</p>
                    {payload.map((item, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm mb-2 p-2 rounded-lg bg-gray-50">
                            <span className="font-semibold flex items-center" style={{ color: item.color }}>
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                {item.name}:
                            </span>
                            <span className="ml-2 font-bold text-gray-800">{item.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Modern Pie Tooltip
    const PieTooltip = ({ active, payload }: {
        active?: boolean;
        payload?: Array<{
            payload: {
                name: string;
                value: number;
                percentage: number;
            };
        }>;
    }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border-2 border-red-200 rounded-xl shadow-2xl min-w-[180px] backdrop-blur-sm">
                    <p className="font-bold text-red-800 mb-3 text-center text-lg">{data.name}</p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                            <span className="font-medium text-blue-700">Deprem Sayısı:</span>
                            <span className="font-bold text-blue-900">{data.value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                            <span className="font-medium text-red-700">Oran:</span>
                            <span className="font-bold text-red-900">%{data.percentage}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 container mx-auto py-8">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Geçmiş Deprem İstatistikleri</h1>
                            <p className="text-gray-600 mt-1">Türkiye Deprem Veri Analizi</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6 justify-center">
                        <Button
                            variant={timeRange === '5' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('5')}
                        >
                            Son 5 Yıl
                        </Button>
                        <Button
                            variant={timeRange === '10' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('10')}
                        >
                            Son 10 Yıl
                        </Button>
                        <Button
                            variant={timeRange === '20' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('20')}
                        >
                            Son 20 Yıl
                        </Button>
                        <Button
                            variant={timeRange === '50' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('50')}
                        >
                            Son 50 Yıl
                        </Button>
                        <Button
                            variant={timeRange === '75' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('75')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
                        >
                            Son 75 Yıl
                        </Button>
                        <Button
                            variant={timeRange === '100' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('100')}
                            className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white border-0"
                        >
                            Son 100 Yıl
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Zaman Serisi Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <svg width="0" height="0">
                                <defs>
                                    <linearGradient id={LINE_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                                        <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.4} />
                                    </linearGradient>
                                    <linearGradient id="redLineGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#dc2626" stopOpacity={1} />
                                        <stop offset="50%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#f87171" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Yıllık Deprem Sayısının Değişimi</h2>

                                </div>
                                <Button
                                    variant="outline"
                                    onClick={downloadTimeSeriesData}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Analizi İndir
                                </Button>
                            </div>
                            {loading ? (
                                <div className="flex justify-center items-center h-[400px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col justify-center items-center h-[400px] text-center">
                                    <div className="text-red-500 mb-2">⚠️</div>
                                    <p className="text-red-600 font-semibold mb-2">Veri Yükleme Hatası</p>
                                    <p className="text-gray-600 text-sm">{error}</p>
                                </div>
                            ) : (
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={data}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                        >
                                            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 13, fill: '#374151' }}
                                            />
                                            <YAxis yAxisId="left" tick={{ fontSize: 13, fill: '#374151' }} />
                                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 13, fill: '#374151' }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#2563eb"
                                                strokeWidth={4}
                                                name="Deprem Sayısı"
                                                dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                                                activeDot={{ r: 8, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 2 }}
                                                strokeDasharray="0"
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="avgMagnitude"
                                                stroke="#dc2626"
                                                strokeWidth={3}
                                                name="Ortalama Büyüklük"
                                                dot={{ fill: '#dc2626', strokeWidth: 2, r: 5 }}
                                                activeDot={{ r: 7, fill: '#b91c1c', stroke: '#ffffff', strokeWidth: 2 }}
                                                strokeDasharray="5 5"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Analiz Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu grafik, Türkiye&apos;deki son {timeRange} yıl içindeki deprem aktivitesinin yıllık
                                    değişimini göstermektedir. Mavi çizgi yıllık deprem sayısını, kırmızı çizgi ise
                                    o yıl içindeki ortalama deprem büyüklüğünü temsil eder.
                                </p>
                            </div>
                        </div>

                        {/* Büyüklük Dağılımı Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <svg width="0" height="0">
                                <defs>
                                    <linearGradient id={BAR_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                                        <stop offset="30%" stopColor="#3b82f6" stopOpacity={0.9} />
                                        <stop offset="70%" stopColor="#60a5fa" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.5} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Deprem Büyüklük Dağılımı</h2>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={downloadMagnitudeData}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Analizi İndir
                                </Button>
                            </div>
                            {loading ? (
                                <div className="flex justify-center items-center h-[300px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="h-[450px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={magnitudeData}
                                            margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                                            barGap={2}
                                            barCategoryGap={30}
                                        >
                                            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="range"
                                                label={{
                                                    value: 'Deprem Büyüklüğü (Richter)',
                                                    position: 'bottom',
                                                    offset: 40
                                                }}
                                                tick={{ fontSize: 13, fill: '#374151' }}
                                            />
                                            <YAxis
                                                label={{
                                                    value: 'Deprem Sayısı',
                                                    angle: -90,
                                                    position: 'left',
                                                    offset: 20
                                                }}
                                                tick={{ fontSize: 13, fill: '#374151' }}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }} />
                                            <Bar
                                                dataKey="count"
                                                name="Deprem Sayısı"
                                                fill={`url(#${BAR_GRADIENT_ID})`}
                                                radius={[12, 12, 0, 0]}
                                                maxBarSize={80}
                                                minPointSize={8}
                                                stroke="#1d4ed8"
                                                strokeWidth={1}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Büyüklük Dağılımı Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu histogram, Türkiye&apos;de kaydedilen tüm depremlerin
                                    büyüklük aralıklarına göre dağılımını göstermektedir. Küçük büyüklükteki depremlerin
                                    çok daha sık olduğu, büyük depremlerin ise nadir olduğu açıkça görülmektedir.
                                </p>
                            </div>
                        </div>

                        {/* Şehir Dağılımı Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Bölgesel Deprem Dağılımı</h2>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={downloadCityData}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Analizi İndir
                                </Button>
                            </div>
                            {loading ? (
                                <div className="flex justify-center items-center h-[300px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="h-[450px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <Pie
                                                data={cityData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({
                                                    cx,
                                                    cy,
                                                    midAngle,
                                                    innerRadius,
                                                    outerRadius,
                                                    percent,
                                                    name,
                                                }) => {
                                                    // Sadece yeterince büyük dilimler için label göster
                                                    if (percent < 0.02) return null; // %2'den küçük dilimler için label gösterme

                                                    const RADIAN = Math.PI / 180;
                                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.25;
                                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            fill="#1f2937"
                                                            textAnchor={x > cx ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                            style={{
                                                                fontSize: 13,
                                                                fontWeight: 700,
                                                                textShadow: '2px 2px 4px rgba(255,255,255,0.9)'
                                                            }}
                                                        >
                                                            {`${name}`}
                                                        </text>
                                                    );
                                                }}
                                                outerRadius={170}
                                                innerRadius={0}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {cityData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                        stroke="#ffffff"
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<PieTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}



                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Bölgesel Dağılım Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu pasta grafik, Türkiye&apos;de kaydedilen tüm depremlerin
                                    şehirlere göre dağılımını göstermektedir. En çok deprem aktivitesi gösteren şehirler
                                    ayrı ayrı gösterilirken, diğer şehirler &quot;Diğer&quot; kategorisi altında toplanmıştır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 
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
    Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import axiosInstance from '@/config/axios';

interface PredictionData {
    date: string;
    predictedCount: number;
    avgMagnitude: number;
}

interface MagnitudeDistribution {
    range: string;
    count: number;
    percentage: number;
}

interface DepthMagnitudeData {
    depth: number;
    magnitude: number;
    count: number;
}

interface RegionDistribution {
    name: string;
    value: number;
    percentage: number;
}

interface MonthlyEarthquakeStatsDto {
    date: string;
    avgMagnitude: number;
    count: number;
}

// Backend'den gelen şehir dağılımı veri formatı
interface CityDistributionResponse {
    city: string;
    count: number;
    percentage: number;
}

// Backend'den gelen büyüklük dağılımı veri formatı
interface MagnitudeDistributionResponse {
    range: string;
    count: number;
    percentage: number;
}

export default function PredictionsGraphPage() {
    const [data, setData] = useState<PredictionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('12'); // Ay cinsinden
    const [magnitudeData, setMagnitudeData] = useState<MagnitudeDistribution[]>([]);
    const [depthMagnitudeData, setDepthMagnitudeData] = useState<DepthMagnitudeData[]>([]);
    const [cityData, setCityData] = useState<RegionDistribution[]>([]);

    // Backend'den aylık deprem istatistiklerini çekme
    const fetchMonthlyEarthquakeStats = async (months: number) => {
        try {
            setLoading(true);
            setError(null);

            // Başlangıç tarihi bugün, bitiş tarihi seçilen ay kadar ileri
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + months);

            // LocalDate formatına çevir (YYYY-MM-DD)
            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            const response = await axiosInstance.get('/predicted-earthquake/stats/monthly', {
                params: {
                    startDate: startDateStr,
                    endDate: endDateStr
                }
            });

            const monthlyStats: MonthlyEarthquakeStatsDto[] = response.data;

            // Backend verisini frontend formatına çevir
            const formattedData: PredictionData[] = monthlyStats.map(stat => ({
                date: stat.date.slice(0, 7), // YYYY-MM-DD'den YYYY-MM'e çevir
                predictedCount: stat.count,
                avgMagnitude: Number(stat.avgMagnitude.toFixed(1))
            }));

            setData(formattedData);
        } catch (err) {
            console.error('API hatası:', err);
            setError('Veri yüklenirken bir hata oluştu.');
            // Hata durumunda fake data kullan
            const fallbackData = generatePredictionData(months);
            setData(fallbackData);
        } finally {
            setLoading(false);
        }
    };

    // Simüle edilmiş tahmin verisi üretimi
    const generatePredictionData = (months: number) => {
        const data: PredictionData[] = [];
        const startDate = new Date('2025-03-01');
        const endDate = new Date('2025-03-01');
        endDate.setMonth(endDate.getMonth() + months);

        for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
            const predictedCount = Math.floor(Math.random() * 30) + 20;
            data.push({
                date: date.toISOString().split('T')[0].slice(0, 7),
                predictedCount: predictedCount,
                avgMagnitude: Number((Math.random() * 2 + 3).toFixed(1))
            });
        }
        return data;
    };

    // Derinlik ve büyüklük verisi üretme
    const generateDepthMagnitudeData = (months: number) => {
        const data: DepthMagnitudeData[] = [];
        const totalPoints = months * 20; // Her ay için ortalama 20 tahmin

        for (let i = 0; i < totalPoints; i++) {
            const depth = Math.floor(Math.random() * 700);
            const baseMagnitude = 2 + Math.random() * 6;
            const depthFactor = 1 - (depth / 1000);
            const magnitude = Number((baseMagnitude * (0.7 + depthFactor * 0.3)).toFixed(1));
            const count = Math.floor(Math.random() * 30) + 1;

            data.push({ depth, magnitude, count });
        }

        return data;
    };

    // Büyüklük dağılımı verilerini backend'den çekme
    const fetchMagnitudeDistribution = async () => {
        try {
            const response = await axiosInstance.get('/predicted-earthquake/stats/magnitude-distribution');
            const magnitudeDistribution: MagnitudeDistributionResponse[] = response.data;

            // Backend verisini frontend formatına çevir
            const formattedMagnitudeData: MagnitudeDistribution[] = magnitudeDistribution.map(magnitude => ({
                range: magnitude.range,
                count: magnitude.count,
                percentage: Number(magnitude.percentage.toFixed(1))
            }));

            setMagnitudeData(formattedMagnitudeData);
        } catch (err) {
            console.error('Büyüklük dağılımı API hatası:', err);
        }
    };

    // Şehir dağılımı verilerini backend'den çekme
    const fetchCityDistribution = async () => {
        try {
            const response = await axiosInstance.get('/predicted-earthquake/stats/city-distribution');
            const cityDistribution: CityDistributionResponse[] = response.data;

            // Backend verisini frontend formatına çevir
            const formattedCityData: RegionDistribution[] = cityDistribution.map(city => ({
                name: city.city,
                value: city.count,
                percentage: Number(city.percentage.toFixed(1))
            }));

            setCityData(formattedCityData);
        } catch (err) {
            console.error('Şehir dağılımı API hatası:', err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            // Gerçek veri için API çağrısı
            await fetchMonthlyEarthquakeStats(Number(timeRange));

            // Şehir dağılımı için gerçek API çağrısı
            await fetchCityDistribution();

            // Büyüklük dağılımı için gerçek API çağrısı
            await fetchMagnitudeDistribution();

            // Diğer grafikler için henüz simüle edilmiş veri kullan
            const depthMagData = generateDepthMagnitudeData(Number(timeRange));

            setDepthMagnitudeData(depthMagData);
        };

        loadData();
    }, [timeRange]);

    // İndirme fonksiyonları
    const downloadTimeSeriesData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Tarih,Tahmini Deprem Sayısı,Ortalama Büyüklük\n"
            + data.map(row => `${row.date},${row.predictedCount},${row.avgMagnitude}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `deprem_tahmin_zaman_serisi_${timeRange}ay.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadMagnitudeData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Büyüklük Aralığı,Tahmini Deprem Sayısı,Yüzde\n"
            + magnitudeData.map(row => `${row.range},${row.count},${row.percentage}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `deprem_tahmin_buyukluk_dagilimi_${timeRange}ay.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadDepthMagnitudeData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Derinlik (km),Büyüklük,Tahmin Sayısı\n"
            + depthMagnitudeData.map(row => `${row.depth},${row.magnitude},${row.count}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `deprem_tahmin_derinlik_buyukluk_${timeRange}ay.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadRegionData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Şehir,Tahmini Deprem Sayısı,Yüzde\n"
            + cityData.map(row => `${row.name},${row.value},${row.percentage}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `deprem_tahmin_sehir_dagilimi_${timeRange}ay.csv`);
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

    // Modern Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border-2 border-blue-200 rounded-xl shadow-2xl min-w-[200px] backdrop-blur-sm">
                    <p className="font-bold text-blue-800 mb-2 text-center text-lg">{label}</p>
                    {payload.map((item: any, idx: number) => (
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
    const PieTooltip = ({ active, payload }: any) => {
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
                            <h1 className="text-2xl font-bold text-gray-800">Deprem Tahmin İstatistikleri</h1>
                            <p className="text-gray-600 mt-1">Gelecek Dönem Analizi</p>
                        </div>
                    </div>



                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


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
                                <h2 className="text-xl font-bold text-gray-800">Tahmini Deprem Büyüklük Dağılımı</h2>
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
                                <div className="h-[300px]">
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
                                                    value: 'Tahmini Deprem Sayısı',
                                                    angle: -90,
                                                    position: 'left',
                                                    offset: 20
                                                }}
                                                tick={{ fontSize: 13, fill: '#374151' }}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }} />
                                            <Bar
                                                dataKey="count"
                                                name="Tahmini Deprem Sayısı"
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
                                <h3 className="font-semibold mb-2">Tahmin Dağılımı Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu histogram, gelecek {timeRange} ay için tahmin edilen depremlerin büyüklük
                                    dağılımını göstermektedir. Tahminler, geçmiş veriler ve sismik aktivite
                                    modelleri baz alınarak oluşturulmuştur.
                                </p>
                            </div>
                        </div>



                        {/* Şehir Dağılımı Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Tahmini Şehir Deprem Dağılımı</h2>
                                <Button
                                    variant="outline"
                                    onClick={downloadRegionData}
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
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
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
                                                outerRadius={130}
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
                                <h3 className="font-semibold mb-2">Şehir Tahminleri Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu pasta grafik, gelecek dönem için tahmin edilen depremlerin
                                    şehirlere göre dağılımını göstermektedir. Tahminler, şehirlerin sismik aktivite
                                    geçmişi ve fay hatları dikkate alınarak oluşturulmuştur.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 
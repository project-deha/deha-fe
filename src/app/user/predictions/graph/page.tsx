'use client';

import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Brush,
    BarChart,
    Bar,
    ScatterChart,
    Scatter,
    ZAxis,
    PieChart,
    Pie,
    Cell,
    LabelList,
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter } from 'lucide-react';
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

export default function PredictionsGraphPage() {
    const [data, setData] = useState<PredictionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('12'); // Ay cinsinden
    const [magnitudeData, setMagnitudeData] = useState<MagnitudeDistribution[]>([]);
    const [depthMagnitudeData, setDepthMagnitudeData] = useState<DepthMagnitudeData[]>([]);
    const [regionData, setRegionData] = useState<RegionDistribution[]>([]);

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

    // Büyüklük dağılımı verisi üretme
    const generateMagnitudeDistribution = (months: number) => {
        const ranges = [
            '2.0-2.9', '3.0-3.9', '4.0-4.9',
            '5.0-5.9', '6.0-6.9', '7.0+'
        ];

        // Tahminler için ağırlıklar
        const weights = [0.40, 0.35, 0.15, 0.07, 0.02, 0.01];
        const totalPredictions = months * 30; // Ay başına ortalama tahmin

        return ranges.map((range, index) => ({
            range,
            count: Math.floor(totalPredictions * weights[index]),
            percentage: Number((weights[index] * 100).toFixed(1))
        }));
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

    // Bölge dağılımı verisi üretme
    const generateRegionDistribution = (months: number) => {
        const regions = [
            { name: "Marmara", weight: 0.30 },
            { name: "Ege", weight: 0.25 },
            { name: "İç Anadolu", weight: 0.20 },
            { name: "Doğu Anadolu", weight: 0.15 },
            { name: "Diğer", weight: 0.10 }
        ];

        const totalPredictions = months * 30;

        return regions.map(region => ({
            name: region.name,
            value: Math.floor(totalPredictions * region.weight),
            percentage: Number((region.weight * 100).toFixed(1))
        }));
    };

    useEffect(() => {
        const loadData = async () => {
            // Gerçek veri için API çağrısı
            await fetchMonthlyEarthquakeStats(Number(timeRange));

            // Diğer grafikler için henüz simüle edilmiş veri kullan
            const magnitudeDistData = generateMagnitudeDistribution(Number(timeRange));
            const depthMagData = generateDepthMagnitudeData(Number(timeRange));
            const regionDistData = generateRegionDistribution(Number(timeRange));

            setMagnitudeData(magnitudeDistData);
            setDepthMagnitudeData(depthMagData);
            setRegionData(regionDistData);
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
            + "Bölge,Tahmini Deprem Sayısı,Yüzde\n"
            + regionData.map(row => `${row.name},${row.value},${row.percentage}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `deprem_tahmin_bolge_dagilimi_${timeRange}ay.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Modern renkler ve gradientler
    const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
    const BAR_GRADIENT_ID = 'barGradient';
    const LINE_GRADIENT_ID = 'lineGradient';

    // Modern Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-lg min-w-[180px]">
                    <p className="font-semibold text-blue-700 mb-1">{label}</p>
                    {payload.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm mb-1">
                            <span className="font-medium" style={{ color: item.color }}>{item.name}:</span>
                            <span className="ml-2">{item.value}</span>
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
                <div className="bg-white p-4 border rounded-lg shadow-lg min-w-[140px]">
                    <p className="font-semibold text-blue-700 mb-1">{data.name}</p>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Deprem Sayısı:</span>
                        <span>{data.value}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Oran:</span>
                        <span>%{data.percentage}</span>
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

                    <div className="flex flex-wrap gap-4 mb-6">
                        <Button
                            variant={timeRange === '3' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('3')}
                        >
                            Gelecek 3 Ay
                        </Button>
                        <Button
                            variant={timeRange === '6' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('6')}
                        >
                            Gelecek 6 Ay
                        </Button>
                        <Button
                            variant={timeRange === '8' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('8')}
                        >
                            Gelecek 8 Ay
                        </Button>
                        <Button
                            variant={timeRange === '12' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('12')}
                        >
                            Gelecek 12 Ay
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Zaman Serisi Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <svg width="0" height="0">
                                <defs>
                                    <linearGradient id={LINE_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Tahmin Edilen Deprem Sayısı</h2>
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
                                    <p className="text-gray-600 text-sm mb-4">{error}</p>
                                    <Button
                                        onClick={() => fetchMonthlyEarthquakeStats(Number(timeRange))}
                                        variant="outline"
                                        className="text-sm"
                                    >
                                        Tekrar Dene
                                    </Button>
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
                                                angle={-45}
                                                textAnchor="end"
                                                height={60}
                                                interval="preserveStartEnd"
                                                tick={{ fontSize: 13, fill: '#374151' }}
                                            />
                                            <YAxis yAxisId="left" tick={{ fontSize: 13, fill: '#374151' }} />
                                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 13, fill: '#374151' }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="predictedCount"
                                                stroke="url(#lineGradient)"
                                                strokeWidth={3}
                                                name="Tahmini Deprem Sayısı"
                                                dot={false}
                                                activeDot={false}
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="avgMagnitude"
                                                stroke="#dc2626"
                                                strokeWidth={2}
                                                name="Tahmini Ortalama Büyüklük"
                                                dot={false}
                                                activeDot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Tahminler Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu grafik, gelecek {timeRange} ay için tahmin edilen deprem aktivitesini göstermektedir.
                                    Mavi çizgi aylık tahmini deprem sayısını, kırmızı çizgi ise beklenen ortalama deprem
                                    büyüklüğünü temsil eder.
                                </p>
                            </div>
                        </div>

                        {/* Büyüklük Dağılımı Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <svg width="0" height="0">
                                <defs>
                                    <linearGradient id={BAR_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.3} />
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
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(64, 150, 255, 0.1)' }} />
                                            <Bar
                                                dataKey="count"
                                                name="Tahmini Deprem Sayısı"
                                                fill={`url(#${BAR_GRADIENT_ID})`}
                                                radius={[8, 8, 0, 0]}
                                                maxBarSize={60}
                                                minPointSize={5}
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

                        {/* Derinlik-Büyüklük İlişkisi Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Tahmini Derinlik-Büyüklük İlişkisi</h2>
                                <Button
                                    variant="outline"
                                    onClick={downloadDepthMagnitudeData}
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
                                        <ScatterChart
                                            margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                                        >
                                            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                                            <XAxis
                                                type="number"
                                                dataKey="depth"
                                                name="Derinlik"
                                                unit=" km"
                                                label={{
                                                    value: 'Tahmini Derinlik (km)',
                                                    position: 'bottom',
                                                    offset: 40
                                                }}
                                                tick={{ fontSize: 13, fill: '#374151' }}
                                            />
                                            <YAxis
                                                type="number"
                                                dataKey="magnitude"
                                                name="Büyüklük"
                                                label={{
                                                    value: 'Tahmini Büyüklük (Richter)',
                                                    angle: -90,
                                                    position: 'Left',
                                                    offset: 25
                                                }}
                                                tick={{ fontSize: 13, fill: '#374151' }}
                                            />
                                            <ZAxis
                                                type="number"
                                                dataKey="count"
                                                range={[50, 400]}
                                                name="Tahmin Sayısı"
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Scatter
                                                name="Tahmini Depremler"
                                                data={depthMagnitudeData}
                                                fill="#3b82f6"
                                                opacity={0.7}
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Tahmin Modeli Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu scatter plot, gelecek {timeRange} ay için tahmin edilen depremlerin
                                    derinlik ve büyüklük ilişkisini göstermektedir. Her nokta bir tahmin noktasını
                                    temsil eder ve noktanın boyutu o bölgedeki tahmin yoğunluğunu gösterir.
                                </p>
                            </div>
                        </div>

                        {/* Bölgesel Dağılım Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Tahmini Bölgesel Deprem Dağılımı</h2>
                                <Button
                                    variant="outline"
                                    onClick={downloadRegionData}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Veriyi İndir
                                </Button>
                            </div>
                            {loading ? (
                                <div className="flex justify-center items-center h-[300px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={regionData}
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
                                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                                                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            fill="#374151"
                                                            textAnchor={x > cx ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                            style={{ fontSize: 13, fontWeight: 500 }}
                                                        >
                                                            {`${name} (%${(percent * 100).toFixed(1)})`}
                                                        </text>
                                                    );
                                                }}
                                                outerRadius={120}
                                                dataKey="value"
                                            >
                                                {regionData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<PieTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Bölgesel Tahminler Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu pasta grafik, gelecek {timeRange} ay için tahmin edilen depremlerin
                                    bölgesel dağılımını göstermektedir. Tahminler, bölgelerin sismik aktivite
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
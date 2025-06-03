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

interface DepthMagnitudeData {
    depth: number;
    magnitude: number;
    count: number;
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
    const [depthMagnitudeData, setDepthMagnitudeData] = useState<DepthMagnitudeData[]>([]);
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
            const cityStats = response.data.map((item: any) => ({
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

    // Büyüklük dağılımı verisi üretme
    const generateMagnitudeDistribution = (years: number) => {
        const ranges = [
            '2.0-2.9', '3.0-3.9', '4.0-4.9',
            '5.0-5.9', '6.0-6.9', '7.0+'
        ];

        // Gerçekçi dağılım için ağırlıklar (küçük depremler daha sık)
        const weights = [0.45, 0.30, 0.15, 0.07, 0.02, 0.01];
        const totalEarthquakes = years * 1000; // Yıl başına ortalama deprem

        return ranges.map((range, index) => ({
            range,
            count: Math.floor(totalEarthquakes * weights[index]),
            percentage: Number((weights[index] * 100).toFixed(1))
        }));
    };

    // Derinlik ve büyüklük verisi üretme
    const generateDepthMagnitudeData = (years: number) => {
        const data: DepthMagnitudeData[] = [];
        const totalPoints = years * 100; // Her yıl için ortalama 100 veri noktası

        for (let i = 0; i < totalPoints; i++) {
            // Gerçekçi derinlik dağılımı (0-700 km)
            const depth = Math.floor(Math.random() * 700);

            // Derinliğe bağlı büyüklük dağılımı
            const baseMagnitude = 2 + Math.random() * 6;
            const depthFactor = 1 - (depth / 1000);
            const magnitude = Number((baseMagnitude * (0.7 + depthFactor * 0.3)).toFixed(1));

            // Benzer noktalarda yoğunluğu hesapla
            const count = Math.floor(Math.random() * 50) + 1;

            data.push({ depth, magnitude, count });
        }

        return data;
    };

    // Şehir dağılımı verisi üretme
    const generateCityDistribution = (years: number) => {
        const cities = [
            { name: "İzmir", weight: 0.25 },
            { name: "Van", weight: 0.20 },
            { name: "Muğla", weight: 0.15 },
            { name: "Manisa", weight: 0.12 },
            { name: "Denizli", weight: 0.10 },
            { name: "Diğer", weight: 0.18 }
        ];

        const totalEarthquakes = years * 1000; // Yıl başına ortalama deprem

        return cities.map(city => ({
            name: city.name,
            value: Math.floor(totalEarthquakes * city.weight),
            percentage: Number((city.weight * 100).toFixed(1))
        }));
    };

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Async fonksiyon için iç fonksiyon oluştur
        const loadData = async () => {
            try {
                const historicalData = await fetchMonthlyEarthquakeStats(Number(timeRange));
                const magnitudeDistData = await fetchMagnitudeDistribution();
                const depthMagData = generateDepthMagnitudeData(Number(timeRange));
                const cityDistData = await fetchCityDistribution();

                setData(historicalData);
                setMagnitudeData(magnitudeDistData);
                setDepthMagnitudeData(depthMagData);
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
        link.setAttribute("download", `gecmis_deprem_buyukluk_dagilimi_${timeRange}yil.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadDepthMagnitudeData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Derinlik (km),Büyüklük,Deprem Sayısı\n"
            + depthMagnitudeData.map(row => `${row.depth},${row.magnitude},${row.count}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `gecmis_deprem_derinlik_buyukluk_${timeRange}yil.csv`);
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
        link.setAttribute("download", `gecmis_deprem_sehir_dagilimi_${timeRange}yil.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Modern renkler ve gradientler
    const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1d4ed8', '#1e40af', '#1e3a8a'];
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
                        <span>{data.value.toLocaleString()}</span>
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
                            <h1 className="text-2xl font-bold text-gray-800">Geçmiş Deprem İstatistikleri</h1>
                            <p className="text-gray-600 mt-1">Türkiye Deprem Veri Analizi</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
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
                            variant={timeRange === '15' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('15')}
                        >
                            Son 15 Yıl
                        </Button>
                        <Button
                            variant={timeRange === '20' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('20')}
                        >
                            Son 20 Yıl
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
                                <h2 className="text-xl font-bold text-gray-800">Yıllık Deprem Sayısının Değişimi</h2>
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
                                                stroke="url(#lineGradient)"
                                                strokeWidth={3}
                                                name="Deprem Sayısı"
                                                dot={false}
                                                activeDot={false}
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="avgMagnitude"
                                                stroke="#dc2626"
                                                strokeWidth={2}
                                                name="Ortalama Büyüklük"
                                                dot={false}
                                                activeDot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Analiz Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu grafik, Türkiye'deki son {timeRange} yıl içindeki deprem aktivitesinin yıllık
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
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Deprem Büyüklük Dağılımı</h2>
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
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(64, 150, 255, 0.1)' }} />
                                            <Bar
                                                dataKey="count"
                                                name="Deprem Sayısı"
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
                                <h3 className="font-semibold mb-2">Büyüklük Dağılımı Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu histogram, son {timeRange} yıl içinde Türkiye'de meydana gelen depremlerin
                                    büyüklük aralıklarına göre dağılımını göstermektedir. Küçük büyüklükteki depremlerin
                                    çok daha sık olduğu, büyük depremlerin ise nadir olduğu açıkça görülmektedir.
                                </p>
                            </div>
                        </div>

                        {/* Şehir Dağılımı Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Bölgesel Deprem Dağılımı</h2>
                                <Button
                                    variant="outline"
                                    onClick={downloadCityData}
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
                                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            fill="#374151"
                                                            textAnchor={x > cx ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                            style={{
                                                                fontSize: 12,
                                                                fontWeight: 600,
                                                                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                                                            }}
                                                        >
                                                            {`${name}`}
                                                        </text>
                                                    );
                                                }}
                                                outerRadius={160}
                                                dataKey="value"
                                            >
                                                {cityData.map((entry, index) => (
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

                            {/* Manuel Legend */}
                            {!loading && cityData.length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold mb-3 text-center">Şehir Dağılımı</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {cityData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-sm text-gray-700 truncate">
                                                    {entry.name} ({entry.percentage}%)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Bölgesel Dağılım Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu pasta grafik, son {timeRange} yıl içinde Türkiye'de kaydedilen depremlerin
                                    şehirlere göre dağılımını göstermektedir. En çok deprem aktivitesi gösteren şehirler
                                    ayrı ayrı gösterilirken, diğer şehirler "Diğer" kategorisi altında toplanmıştır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 
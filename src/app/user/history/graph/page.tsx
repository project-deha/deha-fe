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
import axios from 'axios';

interface EarthquakeData {
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

export default function PastEarthquakesGraphPage() {
    const [data, setData] = useState<EarthquakeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('25'); // Yıl cinsinden
    const [magnitudeData, setMagnitudeData] = useState<MagnitudeDistribution[]>([]);
    const [depthMagnitudeData, setDepthMagnitudeData] = useState<DepthMagnitudeData[]>([]);
    const [cityData, setCityData] = useState<CityDistribution[]>([]);

    // Simüle edilmiş veri üretimi
    const generateData = (years: number) => {
        const data: EarthquakeData[] = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - years);

        for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
            // Gerçekçi deprem sayıları üretiyoruz
            const baseCount = Math.floor(Math.random() * 30) + 20; // 20-50 arası
            const seasonalFactor = 1 + Math.sin(date.getMonth() * Math.PI / 6) * 0.3; // Mevsimsel etki
            const count = Math.floor(baseCount * seasonalFactor);

            data.push({
                date: date.toISOString().split('T')[0].slice(0, 7), // YYYY-MM formatı
                count: count,
                avgMagnitude: Number((Math.random() * 2 + 3).toFixed(1)) // 3.0-5.0 arası
            });
        }
        return data;
    };

    // Büyüklük dağılımı verisi üretme
    const generateMagnitudeDistribution = (years: number) => {
        const ranges = [
            '2.0-2.9', '3.0-3.9', '4.0-4.9',
            '5.0-5.9', '6.0-6.9', '7.0+'
        ];

        // Gerçekçi dağılım için ağırlıklar (küçük depremler daha sık)
        const weights = [0.45, 0.30, 0.15, 0.07, 0.02, 0.01];
        const totalEarthquakes = years * 365; // Yıl başına ortalama deprem

        const distribution = ranges.map((range, index) => {
            const count = Math.floor(totalEarthquakes * weights[index]);
            return {
                range,
                count,
                percentage: Number((weights[index] * 100).toFixed(1))
            };
        });

        return distribution;
    };

    // Derinlik ve büyüklük verisi üretme
    const generateDepthMagnitudeData = (years: number) => {
        const data: DepthMagnitudeData[] = [];
        const totalPoints = years * 50; // Her yıl için ortalama 50 veri noktası

        for (let i = 0; i < totalPoints; i++) {
            // Gerçekçi derinlik dağılımı (0-700 km)
            const depth = Math.floor(Math.random() * 700);

            // Derinliğe bağlı büyüklük dağılımı
            // Yüzeye yakın depremlerde daha yüksek büyüklük olasılığı
            const baseMagnitude = 2 + Math.random() * 6;
            const depthFactor = 1 - (depth / 1000); // Derinlik arttıkça etki azalır
            const magnitude = Number((baseMagnitude * (0.7 + depthFactor * 0.3)).toFixed(1));

            // Benzer noktalarda yoğunluğu hesapla
            const count = Math.floor(Math.random() * 50) + 1;

            data.push({ depth, magnitude, count });
        }

        return data;
    };

    // Şehir dağılımı verisi üretme
    const generateCityDistribution = (years: number) => {
        // Gerçek veriler API'den gelecek, şimdilik simüle ediyoruz
        const cities = [
            { name: "İzmir", weight: 0.25 },
            { name: "Van", weight: 0.20 },
            { name: "Muğla", weight: 0.15 },
            { name: "Manisa", weight: 0.12 },
            { name: "Denizli", weight: 0.10 },
            { name: "Diğer", weight: 0.18 }
        ];

        const totalEarthquakes = years * 365; // Yıl başına ortalama deprem

        return cities.map(city => ({
            name: city.name,
            value: Math.floor(totalEarthquakes * city.weight),
            percentage: Number((city.weight * 100).toFixed(1))
        }));
    };

    // Fetch time series data from backend
    const fetchTimeSeriesData = async (years: number) => {
        try {
            setLoading(true);

            const endDate = new Date();
            const startDate = new Date();
            startDate.setFullYear(endDate.getFullYear() - years);

            const startYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();

            const response = await axios.get(`http://localhost:8080/api/v1/earthquake/stats/monthly`, {
                params: {
                    startYear,
                    endYear
                },
                withCredentials: true
            });

            // Format dates to MM-YYYY before setting the data
            const formattedData = response.data.map((item: EarthquakeData) => {
                const [year, month] = item.date.split('-');
                return {
                    ...item,
                    date: `${month}-${year}`
                };
            });

            setData(formattedData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching time series data:", err);
            setError("Zaman serisi verileri yüklenirken bir hata oluştu.");
            setLoading(false);
        }
    };

    // Fetch magnitude distribution data from backend
    const fetchMagnitudeDistributionData = async (years: number) => {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setFullYear(endDate.getFullYear() - years);

            const startYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();

            const response = await axios.get(`http://localhost:8080/api/v1/earthquake/stats/magnitude-distribution`, {
                params: {
                    startYear,
                    endYear
                },
                withCredentials: true
            });

            setMagnitudeData(response.data);
        } catch (err) {
            console.error("Error fetching magnitude distribution data:", err);
            // Fallback to simulated data if API fails
            const distributionData = generateMagnitudeDistribution(Number(timeRange));
            setMagnitudeData(distributionData);
        }
    };

    // Fetch city distribution data from backend
    const fetchCityDistributionData = async (years: number) => {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setFullYear(endDate.getFullYear() - years);

            const startYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();

            const response = await axios.get(`http://localhost:8080/api/v1/earthquake/stats/city-distribution`, {
                params: {
                    startYear,
                    endYear
                },
                withCredentials: true
            });

            // Map the API response data to match the CityDistribution interface
            const mappedData = response.data.map((item: any) => ({
                name: item.city,
                value: item.count,
                percentage: item.percentage
            }));

            setCityData(mappedData);
        } catch (err) {
            console.error("Error fetching city distribution data:", err);
            // Fallback to simulated data if API fails
            const cityDistData = generateCityDistribution(Number(timeRange));
            setCityData(cityDistData);
        }
    };

    useEffect(() => {
        // Fetch real data from API
        fetchTimeSeriesData(Number(timeRange));
        fetchMagnitudeDistributionData(Number(timeRange));
        fetchCityDistributionData(Number(timeRange));

        // Still use simulated data for depth magnitude chart until we implement that endpoint
        const depthMagData = generateDepthMagnitudeData(Number(timeRange));

        setDepthMagnitudeData(depthMagData);
    }, [timeRange]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-lg">
                    <p className="font-semibold">{label}</p>
                    <p className="text-blue-600">
                        Deprem Sayısı: {payload[0].value}
                    </p>
                    <p className="text-gray-500 text-sm">
                        Ortalama Büyüklük: {payload[1].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    // İndirme fonksiyonları
    const downloadTimeSeriesData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Tarih,Deprem Sayısı,Ortalama Büyüklük\n"
            + data.map(row => `${row.date},${row.count},${row.avgMagnitude}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `deprem_zaman_serisi_${timeRange}yil.csv`);
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
        link.setAttribute("download", `deprem_buyukluk_dagilimi_${timeRange}yil.csv`);
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
        link.setAttribute("download", `deprem_derinlik_buyukluk_${timeRange}yil.csv`);
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
        link.setAttribute("download", `deprem_sehir_dagilimi_${timeRange}yil.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const MagnitudeTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-lg">
                    <p className="font-semibold">Büyüklük: {label}</p>
                    <p className="text-blue-600">
                        Deprem Sayısı: {payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm">
                        Oran: %{payload[0].payload.percentage}
                    </p>
                </div>
            );
        }
        return null;
    };

    const DepthMagnitudeTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border rounded-lg shadow-lg">
                    <p className="font-semibold">Derinlik: {data.depth} km</p>
                    <p className="text-blue-600">Büyüklük: {data.magnitude}</p>
                    <p className="text-gray-500 text-sm">Deprem Sayısı: {data.count}</p>
                </div>
            );
        }
        return null;
    };

    // Pie chart için renkler
    const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

    const CityTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border rounded-lg shadow-lg">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-blue-600">
                        Deprem Sayısı: {data.value.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm">
                        Oran: %{data.percentage}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Büyüklük dağılımı grafiği için yapılandırmalar
    const magnitudeChartConfig = {
        width: "100%",
        height: 400,
        margin: {
            top: 20,
            right: 30,
            left: 60,
            bottom: 40
        }
    };

    const magnitudeXAxisConfig = {
        dataKey: "range",
        label: {
            value: 'Deprem Büyüklüğü (Richter)',
            position: 'bottom',
            offset: 20
        },
        tick: { fontSize: 12 }
    };

    const magnitudeYAxisConfig = {
        label: {
            value: 'Deprem Sayısı',
            angle: -90,
            position: 'insideLeft',
            offset: -45
        },
        tickFormatter: (value: number) => value.toLocaleString('tr-TR'),
        domain: [0, 'auto'] as [number, 'auto'],
        allowDataOverflow: true,
        scale: 'linear' as 'linear' | 'pow' | 'sqrt' | 'log' | 'identity' | 'time' | 'band' | 'point' | 'ordinal' | 'quantile' | 'quantize' | 'utc' | 'sequential' | 'threshold'
    };

    const magnitudeBarConfig = {
        dataKey: "count",
        name: "Deprem Sayısı",
        fill: "#4096ff",
        radius: [4, 4, 0, 0] as [number, number, number, number],
        maxBarSize: 60,
        minPointSize: 5
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">

            <main className="flex-1 container mx-auto py-8">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Türkiye Deprem İstatistikleri</h1>
                            <p className="text-gray-600 mt-1">Zaman Serisi Analizi</p>
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
                        <Button
                            variant={timeRange === '25' ? 'default' : 'outline'}
                            onClick={() => setTimeRange('25')}
                        >
                            Son 25 Yıl
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Zaman Serisi Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Deprem Sayısının Zamanla Değişimi</h2>
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
                                <div className="flex justify-center items-center h-[600px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-[600px] text-red-500">
                                    {error}
                                </div>
                            ) : (
                                <div className="h-[600px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={data}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                angle={-45}
                                                textAnchor="end"
                                                height={60}
                                                interval="preserveStartEnd"
                                            />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend verticalAlign="top" height={36} />
                                            <Line
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#2563eb"
                                                strokeWidth={2}
                                                name="Deprem Sayısı"
                                                dot={false}
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="avgMagnitude"
                                                stroke="#dc2626"
                                                strokeWidth={2}
                                                name="Ortalama Büyüklük"
                                                dot={false}
                                            />
                                            <Brush
                                                dataKey="date"
                                                height={30}
                                                stroke="#8884d8"
                                                startIndex={data.length - 12}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Grafik Hakkında</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu grafik, Türkiye'deki deprem aktivitesinin zaman içindeki değişimini göstermektedir.
                                    Mavi çizgi aylık deprem sayısını, kırmızı çizgi ise ortalama deprem büyüklüğünü temsil eder.
                                    Grafiğin alt kısmındaki kaydırma çubuğu ile belirli bir zaman aralığına odaklanabilirsiniz.
                                </p>
                            </div>
                        </div>

                        {/* Büyüklük Dağılımı Grafiği */}
                        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
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
                                <div className="flex justify-center items-center h-[400px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-[400px] text-red-500">
                                    {error}
                                </div>
                            ) : (
                                <div className="h-[400px]">
                                    <ResponsiveContainer {...magnitudeChartConfig}>
                                        <BarChart
                                            data={magnitudeData}
                                            margin={magnitudeChartConfig.margin}
                                            barGap={2}
                                            barCategoryGap={30}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                horizontal={true}
                                                vertical={false}
                                            />
                                            <XAxis {...magnitudeXAxisConfig} />
                                            <YAxis {...magnitudeYAxisConfig} />
                                            <Tooltip
                                                content={<MagnitudeTooltip />}
                                                cursor={{ fill: 'rgba(64, 150, 255, 0.1)' }}
                                            />
                                            <Legend
                                                verticalAlign="top"
                                                height={36}
                                                formatter={(value) => <span className="text-gray-600">{value}</span>}
                                            />
                                            <Bar {...magnitudeBarConfig}>
                                                {/* Her bar için özel etiket ekleyelim */}
                                                {magnitudeData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill="#4096ff"
                                                    />
                                                ))}
                                                <LabelList
                                                    dataKey="count"
                                                    position="top"
                                                    formatter={(value: number) => value.toLocaleString('tr-TR')}
                                                    style={{ fontSize: '12px', fill: '#666' }}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Deprem Büyüklük Dağılımı</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu histogram, 1900 yılından günümüze kadar Türkiye'de meydana gelen depremlerin büyüklük
                                    dağılımını göstermektedir. Her bir çubuk, belirli bir büyüklük aralığındaki toplam deprem
                                    sayısını temsil eder. Grafik, ülkemizin depremsellik karakterini yansıtmakta olup, küçük ve
                                    orta ölçekli depremlerin sıklığını ve büyük depremlerin görece azlığını net bir şekilde
                                    ortaya koymaktadır.
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
                                    Analizi İndir
                                </Button>
                            </div>
                            {loading ? (
                                <div className="flex justify-center items-center h-[400px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-[400px] text-red-500">
                                    {error}
                                </div>
                            ) : (
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
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
                                                        >
                                                            {`${name} (%${(percent * 100).toFixed(1)})`}
                                                        </text>
                                                    );
                                                }}
                                                outerRadius={140}
                                                dataKey="value"
                                            >
                                                {cityData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CityTooltip />} />
                                            <Legend
                                                layout="vertical"
                                                align="right"
                                                verticalAlign="middle"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Bölgesel Deprem Dağılımı</h3>
                                <p className="text-gray-600 text-sm">
                                    Bu pasta grafik, 1900 yılından günümüze kadar Türkiye'de kaydedilen depremlerin
                                    şehirlere göre dağılımını göstermektedir. En çok deprem aktivitesi gösteren 5 şehir
                                    ayrı ayrı gösterilirken, diğer şehirler "Diğer" kategorisi altında toplanmıştır.
                                    Bu uzun dönemli veri, Türkiye'nin sismik açıdan en aktif bölgelerini ve deprem
                                    riskinin coğrafi dağılımını ortaya koymaktadır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 
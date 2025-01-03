"use client"

import { useState, useEffect } from 'react'
import 'react-day-picker/dist/style.css';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, CalendarIcon, MapPin, Activity, Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CircularProgress } from '@/components/ui/circular-progress'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

const cities = [
    "Adana", "Adıyaman", "Afyon", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "İçel (Mersin)", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
]

type CustomDateRange = {
    from: Date | null;
    to: Date | null;
};

interface SearchBarProps {
    onSearch: (params: { dateRange?: CustomDateRange, selectedCity?: string, magnitude?: number }) => void;
    initialDateRange?: CustomDateRange;
    initialCity?: string;
    initialMagnitude?: number;
}

export function SearchBar({
    onSearch,
    initialDateRange,
    initialCity,
    initialMagnitude = 0.0
}: SearchBarProps) {
    const [dateType, setDateType] = useState<'days' | 'months'>('days')
    const [dateRange, setDateRange] = useState<CustomDateRange | undefined>(initialDateRange)
    const [confirmedDateRange, setConfirmedDateRange] = useState<CustomDateRange | undefined>(initialDateRange)
    const [selectedCity, setSelectedCity] = useState<string>(initialCity || '')
    const [confirmedCity, setConfirmedCity] = useState<string>(initialCity || '')
    const [cityInput, setCityInput] = useState<string>('')
    const [monthCount, setMonthCount] = useState(1)
    const [confirmedMonthCount, setConfirmedMonthCount] = useState(0)
    const [magnitude, setMagnitude] = useState(initialMagnitude)
    const [confirmedMagnitude, setConfirmedMagnitude] = useState(initialMagnitude)

    useEffect(() => {
        setDateRange(initialDateRange)
        setConfirmedDateRange(initialDateRange)
        setSelectedCity(initialCity || '')
        setConfirmedCity(initialCity || '')
        setMagnitude(initialMagnitude)
        setConfirmedMagnitude(initialMagnitude)
    }, [initialDateRange, initialCity, initialMagnitude])

    const handleSearch = () => {
        onSearch({
            dateRange: confirmedDateRange,
            selectedCity: confirmedCity,
            magnitude: confirmedMagnitude
        })
    }

    const getDateRangeText = () => {
        if (dateType === 'days' && confirmedDateRange?.from) {
            return confirmedDateRange.to
                ? `${format(confirmedDateRange.from, "d LLL", { locale: tr })} - ${format(confirmedDateRange.to, "d LLL", { locale: tr })}`
                : format(confirmedDateRange.from, "d LLL", { locale: tr })
        } else if (dateType === 'months' && confirmedMonthCount > 0) {
            return `${confirmedMonthCount} Ay`
        }
        return "Tarih Seç"
    }

    return (
        <div className="flex items-center w-full max-w-4xl gap-4 p-2 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Tarih Seçimi */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start text-left font-normal bg-gray-50 hover:bg-gray-100 py-2">
                        <CalendarIcon className="mr-2 h-5 w-5 text-black" />
                        {getDateRangeText()}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[480px] p-0" align="start">
                    <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Tarih Aralığı Seçin</h3>
                            <p className="text-sm text-gray-600">Deprem verilerini görüntülemek istediğiniz tarih aralığını veya ay sayısını seçin.</p>
                        </div>
                    </div>
                    <Tabs defaultValue={dateType} onValueChange={(value) => setDateType(value as 'days' | 'months')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="days">Günler</TabsTrigger>
                            <TabsTrigger value="months">Aylar</TabsTrigger>
                        </TabsList>
                        <TabsContent value="days" className="p-0">
                            <Calendar
                                mode="range"
                                defaultMonth={dateRange?.from || undefined}
                                selected={dateRange as any}
                                onSelect={(range) => {
                                    if (range?.from || range?.to) {
                                        setDateRange({ from: range.from || null, to: range.to || null });
                                    }
                                }}
                                numberOfMonths={1}
                                locale={tr}
                            />
                        </TabsContent>
                        <TabsContent value="months" className="p-4">
                            <div className="flex flex-col items-center">
                                <CircularProgress
                                    value={monthCount}
                                    maxValue={12}
                                    label={`${monthCount} ay`}
                                    size={120}
                                    className="mb-4"
                                />
                                <input
                                    type="range"
                                    min="1"
                                    max="12"
                                    value={monthCount}
                                    onChange={(e) => setMonthCount(parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                    <div className="p-4 bg-gray-100 border-t">
                        <Button
                            className="w-full"
                            onClick={() => {
                                if (dateType === 'days') {
                                    setConfirmedDateRange(dateRange);
                                    setConfirmedMonthCount(0);
                                } else {
                                    setConfirmedDateRange(undefined);
                                    setConfirmedMonthCount(monthCount);
                                }
                            }}
                        >
                            <Check className="mr-2 h-4 w-4" /> Onayla
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Şehir Seçimi */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start text-left font-normal bg-gray-50 hover:bg-gray-100 py-2">
                        <MapPin className="mr-2 h-5 w-5 text-black" />
                        {confirmedCity || 'Şehir Seç'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-4">
                    <div className="mb-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Şehir Seçin</h3>
                            <p className="text-sm text-gray-600">Deprem verilerini görüntülemek istediğiniz şehri seçin veya arayın.</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Input
                            placeholder="Şehir ara..."
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            className="bg-gray-50"
                        />
                        <div className="max-h-40 overflow-y-auto mb-4">
                            {cities
                                .filter((city) =>
                                    city.toLowerCase().includes(cityInput.toLowerCase())
                                )
                                .map((city) => (
                                    <div
                                        key={city}
                                        className="p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                                        onClick={() => {
                                            setSelectedCity(city);
                                            setCityInput('');
                                        }}
                                    >
                                        {city}
                                    </div>
                                ))}
                        </div>
                        <Button
                            className="w-full"
                            onClick={() => { setConfirmedCity(selectedCity) }}
                        >
                            <Check className="mr-2 h-4 w-4" /> Onayla
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Büyüklük Seçimi */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1 justify-start text-left font-normal bg-gray-50 hover:bg-gray-100 py-2">
                        <Activity className="mr-2 h-5 w-5 text-black" />
                        Büyüklük: {confirmedMagnitude.toFixed(1)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px]">
                    <div className="mb-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Deprem Büyüklüğü</h3>
                            <p className="text-sm text-gray-600">Görmek istediğiniz minimum deprem büyüklüğünü seçin.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <CircularProgress
                            value={magnitude}
                            maxValue={10}
                            label={magnitude.toFixed(1)}
                            size={120}
                            className="mb-4"
                        />
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={magnitude}
                            onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                            className="w-full mb-4"
                        />
                        <Button
                            className="w-full"
                            onClick={() => { setConfirmedMagnitude(magnitude) }}
                        >
                            <Check className="mr-2 h-4 w-4" /> Onayla
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Arama Butonu */}
            <Button
                type="button"
                className="w-auto px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
                onClick={handleSearch}
            >
                <Search className="h-5 w-5" />
            </Button>
        </div>
    )
}


'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from '@/lib/utils';
import { predictionsService } from '@/services/predictionsServices';
import { isSearchAtom } from '@/store/isSearch';
import { predictionsAtom } from '@/store/predictions';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useSetAtom } from 'jotai';
import { Activity, CalendarIcon, Check, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import 'react-day-picker/dist/style.css';

// Türkiye şehirleri listesi
const cities = [
    'Adana',
    'Adıyaman',
    'Afyonkarahisar',
    'Ağrı',
    'Amasya',
    'Ankara',
    'Antalya',
    'Artvin',
    'Aydın',
    'Balıkesir',
    'Bilecik',
    'Bingöl',
    'Bitlis',
    'Bolu',
    'Burdur',
    'Bursa',
    'Çanakkale',
    'Çankırı',
    'Çorum',
    'Denizli',
    'Diyarbakır',
    'Edirne',
    'Elazığ',
    'Erzincan',
    'Erzurum',
    'Eskişehir',
    'Gaziantep',
    'Giresun',
    'Gümüşhane',
    'Hakkari',
    'Hatay',
    'Isparta',
    'Mersin',
    'İstanbul',
    'İzmir',
    'Kars',
    'Kastamonu',
    'Kayseri',
    'Kırklareli',
    'Kırşehir',
    'Kocaeli',
    'Konya',
    'Kütahya',
    'Malatya',
    'Manisa',
    'Kahramanmaraş',
    'Mardin',
    'Muğla',
    'Muş',
    'Nevşehir',
    'Niğde',
    'Ordu',
    'Rize',
    'Sakarya',
    'Samsun',
    'Siirt',
    'Sinop',
    'Sivas',
    'Tekirdağ',
    'Tokat',
    'Trabzon',
    'Tunceli',
    'Şanlıurfa',
    'Uşak',
    'Van',
    'Yozgat',
    'Zonguldak',
    'Aksaray',
    'Bayburt',
    'Karaman',
    'Kırıkkale',
    'Batman',
    'Şırnak',
    'Bartın',
    'Ardahan',
    'Iğdır',
    'Yalova',
    'Karabük',
    'Kilis',
    'Osmaniye',
    'Düzce',
];

interface CustomDateRange {
    from: Date | null;
    to: Date | null;
}

interface SearchBarProps {
    onSearch: (params: {
        dateRange?: CustomDateRange;
        selectedCity?: string;
        magnitude?: number;
    }) => void;
    initialDateRange?: CustomDateRange;
    initialCity?: string;
    initialMagnitude?: number;
}

export function SearchBar({
    onSearch,
    initialDateRange,
    initialCity,
    initialMagnitude = 0.0,
}: SearchBarProps) {
    const [dateType, setDateType] = useState<'days' | 'months'>('days');
    const [confirmedDateRange, setConfirmedDateRange] = useState<
        CustomDateRange | undefined
    >(initialDateRange);
    const [confirmedCity, setConfirmedCity] = useState<string>(
        initialCity || ''
    );
    const [cityInput, setCityInput] = useState<string>('');
    const [confirmedMagnitude, setConfirmedMagnitude] =
        useState(initialMagnitude);
    const [isOpen, setIsOpen] = useState({
        date: false,
        city: false,
        magnitude: false,
    });

    const {
        dateRange,
        selectedCity,
        magnitude,
        setDateRange,
        setSelectedCity,
        setMagnitude,
    } = useSearch();
    const setPredictions = useSetAtom(predictionsAtom);
    const setIsSearch = useSetAtom(isSearchAtom);

    useEffect(() => {
        setDateRange(initialDateRange);
        setConfirmedDateRange(initialDateRange);
        setSelectedCity(initialCity || '');
        setConfirmedCity(initialCity || '');
        setMagnitude(initialMagnitude);
        setConfirmedMagnitude(initialMagnitude);
    }, [initialDateRange, initialCity, initialMagnitude]);

    const fetchPredictions = async (params: {
        dateRange?: CustomDateRange;
        selectedCity?: string;
        magnitude?: number;
        page?: number;
    }) => {
        try {
            const data = await predictionsService.filterPredictions(params);
            setPredictions(data);
        } catch (error) {
            console.error('Error fetching predictions:', error);
        }
    };

    const handleSearch = async () => {
        const searchParams = {
            dateRange: confirmedDateRange,
            selectedCity: confirmedCity,
            magnitude: confirmedMagnitude,
        };

        await fetchPredictions(searchParams);
        onSearch(searchParams);
    };

    const getDateRangeText = () => {
        if (dateType === 'days' && confirmedDateRange?.from) {
            return confirmedDateRange.to
                ? `${format(confirmedDateRange.from, 'd LLL', { locale: tr })} - ${format(confirmedDateRange.to, 'd LLL', { locale: tr })}`
                : format(confirmedDateRange.from, 'd LLL', { locale: tr });
        }
        return 'Tarih Seç';
    };
    // Temizleme fonksiyonları
    const clearDate = async () => {
        setDateRange(undefined);
        setConfirmedDateRange(undefined);
        setDateType('days');
        setIsOpen((prev) => ({ ...prev, date: false }));

        const params = {
            selectedCity: confirmedCity,
            magnitude: confirmedMagnitude,
        };
        //await fetchPredictions(params)
        onSearch(params);
    };

    const clearCity = async () => {
        setSelectedCity('');
        setConfirmedCity('');
        setCityInput('');
        setIsOpen((prev) => ({ ...prev, city: false }));

        const params = {
            dateRange: confirmedDateRange,
            magnitude: confirmedMagnitude,
        };
        //await fetchPredictions(params)
        onSearch(params);
    };

    const clearMagnitude = async () => {
        setMagnitude(0.0);
        setConfirmedMagnitude(0.0);
        setIsOpen((prev) => ({ ...prev, magnitude: false }));

        const params = {
            dateRange: confirmedDateRange,
            selectedCity: confirmedCity,
        };
        //await fetchPredictions(params)
        onSearch(params);
    };

    return (
        <div className="flex items-center w-full max-w-4xl gap-4 p-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg">
            {/* Tarih Seçimi */}
            <Popover
                open={isOpen.date}
                onOpenChange={(open) =>
                    setIsOpen((prev) => ({ ...prev, date: open }))
                }
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'flex-1 justify-start text-left font-normal',
                            'hover:bg-gray-50 active:scale-[0.98] transition-all',
                            confirmedDateRange && 'text-primary border-primary'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {getDateRangeText()}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg">
                                Tarih Aralığı
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Deprem tahminleri için tarih aralığı seçiniz.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearDate}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-4">
                        <Calendar
                            mode="range"
                            selected={{
                                from: confirmedDateRange?.from || undefined,
                                to: confirmedDateRange?.to || undefined,
                            }}
                            onSelect={(range) => {
                                if (range) {
                                    setConfirmedDateRange({
                                        from: range.from || null,
                                        to: range.to || null,
                                    });
                                } else {
                                    setConfirmedDateRange(undefined);
                                }
                            }}
                            numberOfMonths={1}
                            locale={tr}
                        />
                    </div>
                    <div className="flex items-center gap-2 p-4 bg-gray-50 border-t">
                        <Button
                            className="w-full"
                            onClick={async () => {
                                setDateRange(confirmedDateRange);
                                setIsOpen((prev) => ({ ...prev, date: false }));
                                const params = {
                                    dateRange: confirmedDateRange || undefined,
                                    selectedCity: confirmedCity,
                                    magnitude: confirmedMagnitude,
                                };
                                //await fetchPredictions(params)
                                onSearch(params);
                                setIsSearch(true);
                            }}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Onayla
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Şehir Seçimi */}
            <Popover
                open={isOpen.city}
                onOpenChange={(open) =>
                    setIsOpen((prev) => ({ ...prev, city: open }))
                }
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'flex-1 justify-start text-left font-normal',
                            'hover:bg-gray-50 active:scale-[0.98] transition-all',
                            confirmedCity && 'text-primary border-primary'
                        )}
                    >
                        <MapPin className="mr-2 h-5 w-5" />
                        {confirmedCity || 'Şehir Seç'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg">
                                Şehir Seçimi
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Deprem tahminleri için şehir seçiniz.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearCity}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-4 pt-2">
                        <Input
                            placeholder="Şehir ara..."
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            className="mb-2"
                        />
                        <div className="max-h-[200px] overflow-y-auto space-y-1">
                            {cities
                                .filter((city) =>
                                    city
                                        .toLowerCase()
                                        .includes(cityInput.toLowerCase())
                                )
                                .map((city) => (
                                    <Button
                                        key={city}
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-start font-normal',
                                            selectedCity === city &&
                                            'bg-primary/10'
                                        )}
                                        onClick={() => setConfirmedCity(city)}
                                    >
                                        {city}
                                    </Button>
                                ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-4 bg-gray-50 border-t">
                        <Button
                            className="w-full"
                            onClick={async () => {
                                setSelectedCity(confirmedCity);
                                setIsOpen((prev) => ({ ...prev, city: false }));
                                const params = {
                                    dateRange: confirmedDateRange,
                                    selectedCity: selectedCity || undefined,
                                    magnitude: confirmedMagnitude,
                                };
                                //await fetchPredictions(params)
                                onSearch(params);
                                setIsSearch(true);
                            }}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Onayla
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Büyüklük Seçimi */}
            <Popover
                open={isOpen.magnitude}
                onOpenChange={(open) =>
                    setIsOpen((prev) => ({ ...prev, magnitude: open }))
                }
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'flex-1 justify-start text-left font-normal',
                            'hover:bg-gray-50 active:scale-[0.98] transition-all',
                            confirmedMagnitude > 0 &&
                            'text-primary border-primary'
                        )}
                    >
                        <Activity className="mr-2 h-5 w-5" />
                        Büyüklük: {confirmedMagnitude.toFixed(1)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg">
                                Deprem Büyüklüğü
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Minimum deprem büyüklüğünü seçiniz.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearMagnitude}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-4 pt-2">
                        <div className="flex flex-col items-center gap-4">
                            <CircularProgress
                                value={confirmedMagnitude}
                                maxValue={10}
                                label={confirmedMagnitude.toFixed(1)}
                                size={120}
                                strokeWidth={12}
                            />
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={confirmedMagnitude}
                                onChange={(e) =>
                                    setConfirmedMagnitude(
                                        parseFloat(e.target.value)
                                    )
                                }
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-4 bg-gray-50 border-t">
                        <Button
                            className="w-full"
                            onClick={() => {
                                setMagnitude(confirmedMagnitude);
                                setIsOpen((prev) => ({
                                    ...prev,
                                    magnitude: false,
                                }));
                                const params = {
                                    dateRange: confirmedDateRange,
                                    selectedCity: confirmedCity,
                                    magnitude: confirmedMagnitude || undefined,
                                };
                                onSearch(params);
                                setIsSearch(true);
                            }}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Onayla
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

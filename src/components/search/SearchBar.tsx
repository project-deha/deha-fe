'use client';

import { useState, useEffect, ReactElement } from 'react';
import { useFilterStore } from '@/store/filterStore';
import { usePathname } from 'next/navigation';

interface SearchBarProps {
    onFilterChange?: (filters: {
        startDate: string;
        endDate: string;
        city: string;
        minMagnitude: number;
        maxMagnitude: number;
    }) => void;
    mode?: 'prediction' | 'history';
}

const SearchBar = ({ onFilterChange, mode = 'prediction' }: SearchBarProps) => {
    const today = new Date().toISOString().split('T')[0];

    const {
        startDate,
        endDate,
        city,
        minMagnitude,
        maxMagnitude,
        setFilters
    } = useFilterStore();

    const [tempFilters, setTempFilters] = useState({
        startDate,
        endDate,
        city,
        minMagnitude,
        maxMagnitude
    });

    const [activeDropdown, setActiveDropdown] = useState<'date' | 'city' | 'magnitude' | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setTempFilters({
            startDate,
            endDate,
            city,
            minMagnitude,
            maxMagnitude
        });
    }, [startDate, endDate, city, minMagnitude, maxMagnitude]);

    const cities = [
        'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana',
        'Gaziantep', 'Konya', 'Mersin', 'Diyarbakır', 'Kayseri',
        'Eskişehir', 'Samsun', 'Denizli', 'Şanlıurfa', 'Malatya'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        if (onFilterChange) {
            onFilterChange(tempFilters);
        }
        setActiveDropdown(null);
    };

    const getActiveFiltersCount = (type: 'date' | 'city' | 'magnitude') => {
        switch (type) {
            case 'date':
                return (startDate ? 1 : 0) + (endDate ? 1 : 0);
            case 'city':
                return city ? 1 : 0;
            case 'magnitude':
                return (minMagnitude > 0 ? 1 : 0) + (maxMagnitude < 10 ? 1 : 0);
            default:
                return 0;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDateLabel = () => {
        if (!startDate && !endDate) return 'Tarih';
        if (startDate && endDate) {
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
        if (startDate) return `Başlangıç: ${formatDate(startDate)}`;
        if (endDate) return `Bitiş: ${formatDate(endDate)}`;
        return 'Tarih';
    };

    const getMagnitudeLabel = () => {
        if (minMagnitude === 0 && maxMagnitude === 10) return 'Büyüklük';
        if (minMagnitude > 0 && maxMagnitude < 10) {
            return `${minMagnitude} - ${maxMagnitude}`;
        }
        if (minMagnitude > 0) return `Min: ${minMagnitude}`;
        if (maxMagnitude < 10) return `Max: ${maxMagnitude}`;
        return 'Büyüklük';
    };

    const FilterButton = ({ type, icon, label, count, showClear }: { type: 'date' | 'city' | 'magnitude', icon: ReactElement, label: string, count: number, showClear: boolean }) => (
        <div className="relative flex items-center">
            <button
                onClick={() => setActiveDropdown(activeDropdown === type ? null : type)}
                className={`flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 ${activeDropdown === type
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                    } border border-gray-200 ${type === 'date' ? 'rounded-l-lg' :
                        type === 'magnitude' ? 'rounded-r-lg' : ''
                    } w-full pr-8`}
                style={{ minWidth: 0 }}
            >
                <span className="text-blue-500 mr-2">{icon}</span>
                <span className="max-w-[120px] truncate">{label}</span>
                {/* Sadece filtre aktif değilse badge göster */}
                {count > 0 && !showClear && (
                    <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {count}
                    </span>
                )}
            </button>
            {/* Çarpı ikonunu sağa hizala ve metinden uzaklaştır */}
            {showClear && (
                <button
                    onClick={
                        type === 'date' ? clearDate :
                            type === 'city' ? clearCity :
                                clearMagnitude
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 focus:outline-none z-10"
                    tabIndex={-1}
                    aria-label={`${type} temizle`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );

    // Filtreleri sıfırlama fonksiyonları
    const clearDate = () => setFilters({ startDate: '', endDate: '' });
    const clearCity = () => setFilters({ city: '' });
    const clearMagnitude = () => setFilters({ minMagnitude: 0, maxMagnitude: 10 });

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-3xl">
                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-0`}>
                    {/* Tarih Filtresi */}
                    <div className="relative flex items-center">
                        <FilterButton
                            type="date"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                            label={getDateLabel()}
                            count={getActiveFiltersCount('date')}
                            showClear={!!(startDate || endDate)}
                        />
                        {activeDropdown === 'date' && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-100 w-full min-w-[300px]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Başlangıç Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={tempFilters.startDate}
                                            onChange={handleChange}
                                            max={mode === 'prediction' ? undefined : today}
                                            min={mode === 'prediction' ? today : undefined}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bitiş Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={tempFilters.endDate}
                                            onChange={handleChange}
                                            max={mode === 'prediction' ? undefined : today}
                                            min={mode === 'prediction' ? today : undefined}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Şehir Filtresi */}
                    <div className="relative flex items-center">
                        <FilterButton
                            type="city"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                            label={city || 'Şehir'}
                            count={getActiveFiltersCount('city')}
                            showClear={!!city}
                        />
                        {activeDropdown === 'city' && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-100 w-full min-w-[200px]">
                                <select
                                    name="city"
                                    value={tempFilters.city}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="">Tüm Şehirler</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    {/* Büyüklük Filtresi */}
                    <div className="relative flex items-center">
                        <FilterButton
                            type="magnitude"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            }
                            label={getMagnitudeLabel()}
                            count={getActiveFiltersCount('magnitude')}
                            showClear={minMagnitude > 0 || maxMagnitude < 10}
                        />
                        {activeDropdown === 'magnitude' && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-100 w-full min-w-[300px]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Büyüklük
                                        </label>
                                        <input
                                            type="number"
                                            name="minMagnitude"
                                            value={tempFilters.minMagnitude}
                                            onChange={handleChange}
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Maksimum Büyüklük
                                        </label>
                                        <input
                                            type="number"
                                            name="maxMagnitude"
                                            value={tempFilters.maxMagnitude}
                                            onChange={handleChange}
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Filtrele Butonu */}
                    <button
                        onClick={handleApplyFilters}
                        className="flex items-center justify-center px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm ml-2"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filtrele
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar; 
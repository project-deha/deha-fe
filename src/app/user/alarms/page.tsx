'use client';

import { turkishCities } from '@/constants/TurkishCities';
import { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import axiosInstance from '@/config/axios';

const cityOptions = [
    { value: 'SELECT_ALL', label: '🔸 Tümünü Seç' },
    ...turkishCities.map(city => ({ value: city, label: city }))
];

interface UserDto {
    id: string;
    email: string;
    username: string;
}

interface Alarm {
    id: string;
    owner: UserDto;
    minimumMagnitude: number;
    maximumMagnitude: number;
    city: string;
    isActive?: boolean;  // Backend'den gelebilecek alan isimleri
    active?: boolean;
    enabled?: boolean;
    isAktif?: boolean;
}

interface CityOption {
    value: string;
    label: string;
}

export default function AlarmsPage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [minMagnitude, setMinMagnitude] = useState<string>('3');
    const [maxMagnitude, setMaxMagnitude] = useState<string>('7');
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

    // Şehir seçimini yönet
    const handleCityChange = (opts: MultiValue<CityOption>) => {
        if (!Array.isArray(opts)) return;

        const selectedValues = opts.map(opt => opt.value);
        const hasSelectAll = selectedValues.includes('SELECT_ALL');
        const actualCities = turkishCities;

        if (hasSelectAll) {
            // Eğer "Tümünü Seç" seçildiyse
            if (selectedCities.length === actualCities.length) {
                // Tüm şehirler zaten seçiliyse, hepsini kaldır
                setSelectedCities([]);
            } else {
                // Tüm şehirleri seç
                setSelectedCities([...actualCities]);
            }
        } else {
            // Normal şehir seçimi
            const validCities = selectedValues.filter(city => city !== 'SELECT_ALL');
            setSelectedCities(validCities);
        }
    };

    // Select bileşeni için value'yu hazırla
    const getSelectValue = () => {
        // Eğer tüm şehirler seçiliyse sadece "Tümünü Seç"i göster
        if (selectedCities.length === turkishCities.length && selectedCities.length > 0) {
            return [{ value: 'SELECT_ALL', label: '🔸 Tümünü Seç' }];
        }

        // Kısmi seçimde sadece seçili şehirleri göster
        return cityOptions.filter(opt =>
            opt.value !== 'SELECT_ALL' && selectedCities.includes(opt.value)
        );
    };

    // Alarm aktiflik durumunu belirlemek için yardımcı fonksiyon
    const getAlarmActiveStatus = (alarm: Alarm): boolean => {
        // Backend'den gelebilecek farklı alan isimlerini kontrol et
        if (typeof alarm.isAktif === 'boolean') return alarm.isAktif;
        if (typeof alarm.isActive === 'boolean') return alarm.isActive;
        if (typeof alarm.active === 'boolean') return alarm.active;
        if (typeof alarm.enabled === 'boolean') return alarm.enabled;

        // Hiçbiri yoksa varsayılan olarak true (aktif) kabul et
        return true;
    };

    const fetchAlarms = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axiosInstance.get('/alarm/me');
            console.log('Backend alarm verisi:', response.data);
            setAlarms(response.data);
        } catch (err) {
            setError('Alarmlar yüklenirken bir hata oluştu.');
            console.error('Error fetching alarms:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAlarms();
    }, []);

    const handleAddAlarm = async () => {
        if (selectedCities.length === 0) return;

        try {
            setIsLoading(true);
            setError(null);

            const min = minMagnitude === '' ? 0 : Number(minMagnitude);
            const max = maxMagnitude === '' ? 0 : Number(maxMagnitude);

            await axiosInstance.post('/alarm', {
                minimumMagnitude: min,
                maximumMagnitude: max,
                cities: selectedCities
            });

            // Refresh alarms after successful creation
            await fetchAlarms();

            setShowModal(false);
            setSelectedCities([]);
            setMinMagnitude('3');
            setMaxMagnitude('7');
        } catch (err) {
            setError('Alarm oluşturulurken bir hata oluştu.');
            console.error('Error creating alarm:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAlarm = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await axiosInstance.delete(`/alarm/${id}`);
            await fetchAlarms();
        } catch (err) {
            setError('Alarm silinirken bir hata oluştu.');
            console.error('Error deleting alarm:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleAlarmStatus = async (alarm: Alarm) => {
        const currentStatus = getAlarmActiveStatus(alarm);

        try {
            setIsLoading(true);
            setError(null);

            // Alarmın güncellenmiş halini Spring RequestBody olarak gönder
            const updatedAlarm = {
                ...alarm,
                // Farklı backend alan isimleriyle güncellenmiş durumu ekle
                isAktif: !currentStatus,
                isActive: !currentStatus,
                active: !currentStatus,
                enabled: !currentStatus
            };

            await axiosInstance.put('/alarm', updatedAlarm);

            // Alarmları yeniden yükle
            await fetchAlarms();
        } catch (err) {
            setError('Alarm durumu güncellenirken bir hata oluştu.');
            console.error('Error updating alarm status:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAllAlarms = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Tüm alarmları tek tek sil
            for (const alarm of alarms) {
                await axiosInstance.delete(`/alarm/${alarm.id}`);
            }

            await fetchAlarms();
            setShowDeleteAllModal(false);
        } catch (err) {
            setError('Alarmlar silinirken bir hata oluştu.');
            console.error('Error deleting all alarms:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-8 text-center w-full">Deprem Alarmı Oluştur</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-xl">
                    {error}
                </div>
            )}

            {/* Bilgilendirme Kutusu */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 w-full max-w-xl">
                <div className="flex items-start space-x-3">
                    <div className="text-blue-600 text-xl">📧</div>
                    <div>
                        <h3 className="text-blue-800 font-semibold mb-2">E-posta Alarm Sistemi</h3>
                        <p className="text-blue-700 text-sm leading-relaxed">
                            Sistem, AFAD (Afet ve Acil Durum Yönetimi Başkanlığı)'dan deprem verilerini sürekli takip eder.
                            Kurduğunuz alarm kriterlerine uygun deprem tespit edildiğinde,
                            e-posta adresinize anında bildirim gönderilir. Alarmlar 7/24 aktif olarak çalışır ve
                            belirlediğiniz şehir ve büyüklük aralığındaki depremler için size resmi veriler ışığında haber verir.
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition text-lg font-semibold mb-8"
                disabled={isLoading}
            >
                {isLoading ? 'Yükleniyor...' : 'Yeni Alarm Ekle'}
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-2 relative animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
                            onClick={() => setShowModal(false)}
                            aria-label="Kapat"
                            disabled={isLoading}
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Yeni Alarm Ekle</h2>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Şehirler</label>
                            <Select
                                isMulti
                                options={cityOptions}
                                value={getSelectValue()}
                                onChange={handleCityChange}
                                className="mb-2"
                                placeholder="Şehir seçiniz..."
                                isDisabled={isLoading}
                            />
                        </div>
                        <div className="mb-4 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block font-medium mb-1">Minimum Büyüklük</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    step={0.1}
                                    value={minMagnitude}
                                    onChange={e => setMinMagnitude(e.target.value)}
                                    className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-medium mb-1">Maksimum Büyüklük</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    step={0.1}
                                    value={maxMagnitude}
                                    onChange={e => setMaxMagnitude(e.target.value)}
                                    className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleAddAlarm}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Yükleniyor...' : 'Onayla'}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-base"
                                disabled={isLoading}
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tümünü Sil Onay Modal */}
            {showDeleteAllModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-2 relative animate-fadeIn">
                        <div className="text-center">
                            <div className="text-red-600 text-4xl mb-4">⚠️</div>
                            <h2 className="text-xl font-bold mb-2 text-gray-900">Tüm Alarmları Sil</h2>
                            <p className="text-gray-600 mb-6">
                                Bu işlem geri alınamaz. Tüm alarmlarınız ({alarms.length} adet) kalıcı olarak silinecek.
                                Emin misiniz?
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleDeleteAllAlarms}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold text-base"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Siliniyor...' : 'Evet, Tümünü Sil'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteAllModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-base"
                                    disabled={isLoading}
                                >
                                    İptal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Alarm Listesi */}
            <div className="mt-8 w-full max-w-xl">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">Alarmlarınız</h2>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {alarms.length}
                        </span>
                    </div>
                    {alarms.length > 0 && (
                        <button
                            onClick={() => setShowDeleteAllModal(true)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition"
                            disabled={isLoading}
                        >
                            Tümünü Temizle
                        </button>
                    )}
                </div>
                {isLoading && <div className="text-gray-400">Yükleniyor...</div>}
                {!isLoading && alarms.length === 0 && <div className="text-gray-400">Henüz alarm eklenmedi.</div>}
                <ul>
                    {alarms.map((alarm) => (
                        <li key={alarm.id} className="mb-2 p-3 border rounded-lg bg-white shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <b>Şehir:</b> {alarm.city}
                                    <span className={`px-2 py-1 text-xs rounded-full ${getAlarmActiveStatus(alarm)
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {getAlarmActiveStatus(alarm) ? 'Aktif' : 'Pasif'}
                                    </span>
                                </div>
                                <div>
                                    <b>Büyüklük:</b> {alarm.minimumMagnitude} - {alarm.maximumMagnitude}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                {/* Switch kontrolü */}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={getAlarmActiveStatus(alarm)}
                                        onChange={() => handleToggleAlarmStatus(alarm)}
                                        disabled={isLoading}
                                        className="sr-only"
                                    />
                                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${getAlarmActiveStatus(alarm) ? 'bg-blue-600' : 'bg-gray-200'
                                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${getAlarmActiveStatus(alarm) ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">
                                        {getAlarmActiveStatus(alarm) ? 'Aktif' : 'Pasif'}
                                    </span>
                                </label>

                                {/* Silme butonu */}
                                <button
                                    onClick={() => handleDeleteAlarm(alarm.id)}
                                    className="text-red-600 hover:text-red-800 flex items-center justify-center"
                                    aria-label="Alarmı Sil"
                                    disabled={isLoading}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
} 
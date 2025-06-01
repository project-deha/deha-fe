'use client';

import { useState } from 'react';
import Select from 'react-select';

const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana',
    'Gaziantep', 'Konya', 'Mersin', 'Diyarbakır', 'Kayseri',
    'Eskişehir', 'Samsun', 'Denizli', 'Şanlıurfa', 'Malatya'
];

const cityOptions = cities.map(city => ({ value: city, label: city }));

export default function AlarmsPage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [minMagnitude, setMinMagnitude] = useState<string>('3');
    const [maxMagnitude, setMaxMagnitude] = useState<string>('7');
    const [alarms, setAlarms] = useState<
        { cities: string[]; min: number; max: number }[]
    >([]);

    const handleAddAlarm = () => {
        if (selectedCities.length === 0) return;
        const min = minMagnitude === '' ? 0 : Number(minMagnitude);
        const max = maxMagnitude === '' ? 0 : Number(maxMagnitude);
        setAlarms([...alarms, { cities: selectedCities, min, max }]);
        setShowModal(false);
        setSelectedCities([]);
        setMinMagnitude('3');
        setMaxMagnitude('7');
    };

    const handleDeleteAlarm = (idx: number) => {
        setAlarms(alarms => alarms.filter((_, i) => i !== idx));
    };

    return (
        <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-8 text-center w-full">Deprem Alarmı Oluştur</h1>
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition text-lg font-semibold mb-8"
            >
                Yeni Alarm Ekle
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-2 relative animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
                            onClick={() => setShowModal(false)}
                            aria-label="Kapat"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Yeni Alarm Ekle</h2>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Şehirler</label>
                            <Select
                                isMulti
                                options={cityOptions}
                                value={cityOptions.filter(opt => selectedCities.includes(opt.value))}
                                onChange={(opts: any) => setSelectedCities(Array.isArray(opts) ? opts.map((opt: any) => opt.value) : [])}
                                className="mb-2"
                                placeholder="Şehir seçiniz..."
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
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleAddAlarm}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-base"
                            >
                                Onayla
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-base"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alarm Listesi */}
            <div className="mt-8 w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-2">Alarmlarınız</h2>
                {alarms.length === 0 && <div className="text-gray-400">Henüz alarm eklenmedi.</div>}
                <ul>
                    {alarms.map((alarm, idx) => (
                        <li key={idx} className="mb-2 p-3 border rounded-lg bg-white shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <b>Şehirler:</b> {alarm.cities.join(', ')}<br />
                                <b>Büyüklük:</b> {alarm.min} - {alarm.max}
                            </div>
                            <button
                                onClick={() => handleDeleteAlarm(idx)}
                                className="mt-2 sm:mt-0 sm:ml-4 text-red-600 hover:text-red-800 flex items-center justify-center"
                                aria-label="Alarmı Sil"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
} 
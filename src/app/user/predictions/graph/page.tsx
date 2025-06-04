'use client';

import { useEffect, useState } from 'react';

export default function PredictionsGraphPage() {
    const [timeRange] = useState('12'); // Ay cinsinden

    useEffect(() => {
        // Placeholder for future implementation
    }, [timeRange]);

    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-bold">Deprem Tahmin Grafikleri</h1>
            <p>Bu sayfa henüz geliştirilme aşamasındadır.</p>
        </div>
    );
}
import { Header } from '@/components/Header';
import { Map } from '@/components/Map';

export default function HomePage() {
    return (
        <>
            <Header />
            <Map />
            <div className="ml-auto">
                <img
                    src="/lejyant.png"
                    alt="Deprem Olasılığı"
                    style={{ width: '400px', height: 'auto' }}
                />
            </div>
        </>
    );
}

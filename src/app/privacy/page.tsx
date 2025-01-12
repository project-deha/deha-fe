import { Header } from '@/components/Header';

export default function PrivacyPage() {
    return (
        <>
            <Header showSearch={false} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Gizlilik Politikası</h1>
                <p>Bu sayfada DEHA'nın gizlilik politikası yer alacaktır.</p>
                {/* Gizlilik politikası içeriği buraya eklenecek */}
            </div>
        </>
    );
}

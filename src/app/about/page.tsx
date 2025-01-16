import { Header } from '@/components/Header';
import { Building2, Shield, Target, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <>
            <Header showSearch={false} />

            {/* Hero Section with Back Button */}
            <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href="/settings"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Ayarlara Dön</span>
                        </Link>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                        DEHA Hakkında
                    </h1>
                    <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto">
                        Modern veri analitiği ve yapay zeka teknolojilerini kullanarak,
                        deprem tahminleme konusunda öncü bir platform oluşturuyoruz.
                    </p>
                </div>
            </div>
            {/* Features Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Target className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-3">Misyonumuz</h2>
                        <p className="text-muted-foreground">
                            Deprem tahminleme teknolojilerini geliştirerek toplumun afetlere karşı
                            hazırlıklı olmasına katkıda bulunmak ve can kayıplarını minimize etmek.
                        </p>
                    </div>

                    <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-3">Değerlerimiz</h2>
                        <p className="text-muted-foreground">
                            Bilimsel doğruluk, güvenilirlik ve erişilebilirlik değerlerini temel alarak,
                            topluma daha güvenli bir gelecek sunmak için çalışıyoruz.
                        </p>
                    </div>

                    <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-3">Kullanıcı Odaklı</h2>
                        <p className="text-muted-foreground">
                            Kullanıcılarımız, DEHA sayesinde deprem riski olan bölgeler hakkında bilgi edinebilir
                            ve güvenlik önlemlerini daha etkili bir şekilde planlayabilir.
                        </p>
                    </div>

                    <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-3">Teknoloji</h2>
                        <p className="text-muted-foreground">
                            En son teknolojileri kullanarak, deprem tahminleme konusunda sürekli gelişen
                            ve kendini yenileyen bir platform sunuyoruz.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

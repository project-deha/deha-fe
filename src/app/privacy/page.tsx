import { Header } from '@/components/Header';
import { Shield, Lock, Eye, FileText, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
                        Gizlilik Politikası
                    </h1>
                    <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto">
                        DEHA olarak kişisel verilerinizin güvenliği ve gizliliği bizim için çok önemlidir.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-card hover:bg-accent/50 p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md border border-border/50">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Veri Güvenliği</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            En güncel güvenlik protokolleri ile verilerinizi koruyoruz.
                        </p>
                    </div>
                    <div className="bg-card hover:bg-accent/50 p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md border border-border/50">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Şeffaflık</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Verilerinizin nasıl kullanıldığı konusunda tam şeffaflık sağlıyoruz.
                        </p>
                    </div>
                    <div className="bg-card hover:bg-accent/50 p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md border border-border/50">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Eye className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Veri Kontrolü</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Verileriniz üzerinde tam kontrol sizde.
                        </p>
                    </div>
                </div>

                {/* Policy Sections */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Her section için yeni tasarım */}
                    <div className="bg-card rounded-xl p-8 border border-border/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-semibold">Toplanan Veriler</h2>
                        </div>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            DEHA platformunda aşağıdaki kişisel veriler toplanmaktadır:
                        </p>
                        <ul className="space-y-3">
                            {['Ad ve soyad bilgileri', 'E-posta adresi', 'Kullanıcı tercihleri ve ayarları'].map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                    <ChevronRight className="h-4 w-4 text-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-card rounded-xl p-8 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-6">Verilerin Kullanımı</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:
                        </p>
                        <ul className="space-y-3">
                            {[
                                'Hesabınızın güvenliğini sağlamak',
                                'Size özelleştirilmiş deprem tahmin bildirimleri sunmak',
                                'Hizmet kalitemizi iyileştirmek',
                                'Yasal yükümlülüklerimizi yerine getirmek'
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                    <ChevronRight className="h-4 w-4 text-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-card rounded-xl p-8 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-6">Veri Güvenliği</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Verilerinizin güvenliği için aldığımız önlemler:
                        </p>
                        <ul className="space-y-3">
                            {[
                                'SSL/TLS şifreleme protokolleri',
                                'Düzenli güvenlik denetimleri',
                                'Erişim kontrolü ve yetkilendirme',
                                'Veri yedekleme ve kurtarma protokolleri'
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                    <ChevronRight className="h-4 w-4 text-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-card rounded-xl p-8 border border-border/50">
                        <h2 className="text-2xl font-semibold mb-6">Çerezler Politikası</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            DEHA, hizmet kalitesini artırmak için çerezler kullanmaktadır. Bu çerezler:
                        </p>
                        <ul className="space-y-3">
                            {[
                                'Oturum yönetimi',
                                'Tercihlerinizin hatırlanması',
                                'Güvenlik doğrulamaları',
                                'Performans iyileştirmeleri'
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                                    <ChevronRight className="h-4 w-4 text-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Last Update Info */}
                <div className="mt-16 text-center">
                    <div className="inline-block bg-muted px-6 py-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Son güncelleme: 06/01/2024</p>
                    </div>
                </div>
            </div>
        </>
    );
}

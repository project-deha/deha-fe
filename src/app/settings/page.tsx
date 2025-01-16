'use client';

import { useState } from 'react';
import {
    ChevronRight,
    Languages,
    FileText,
    HelpCircle,
    Info,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { Header } from '@/components/Header';

export default function SettingsPage() {
    const [language, setLanguage] = useState('tr');

    return (
        <>
            <Header showSearch={false} />
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Ayarlar</h1>
                    <p className="text-muted-foreground">
                        Hesap ayarlarınızı buradan yönetebilirsiniz
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
                    {/* Dil Seçimi */}
                    <div className="p-6 hover:bg-accent/50 transition-colors first:rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Languages className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-lg font-medium">Dil</div>
                                    <div className="text-sm text-muted-foreground">
                                        Dili seçiniz
                                    </div>
                                </div>
                            </div>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Dil seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tr">Türkçe</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Gizlilik Politikası */}
                    <Link href="/privacy" className="block">
                        <div className="p-6 hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-medium">
                                            Gizlilik politikası
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Gizlilik ve veri kullanımı
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-muted-foreground" />
                            </div>
                        </div>
                    </Link>

                    {/* Yardım/SSS */}
                    <Link href="/help" className="block">
                        <div className="p-6 hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <HelpCircle className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-medium">
                                            Yardım/SSS
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Sıkça sorulan sorular
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-muted-foreground" />
                            </div>
                        </div>
                    </Link>

                    {/* Hakkında */}
                    <Link href="/about" className="block">
                        <div className="p-6 hover:bg-accent/50 transition-colors last:rounded-b-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Info className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-medium">
                                            Hakkında
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            DEHA hakkında bilgi
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-muted-foreground" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}

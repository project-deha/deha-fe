'use client';

import { useState, useEffect } from 'react';
import EmailVerificationModal from './EmailVerificationModal';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        acceptTerms: false
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        acceptTerms: ''
    });

    // Modal kapandığında form verilerini sıfırla
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                surname: '',
                acceptTerms: false
            });
            setErrors({
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                surname: '',
                acceptTerms: ''
            });
            setShowVerification(false);
            setRegisteredEmail('');
        }
    }, [isOpen]);

    // initialMode değiştiğinde mode'u güncelle
    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            surname: '',
            acceptTerms: ''
        };

        // Email validasyonu
        if (!formData.email) {
            newErrors.email = 'Email adresi gereklidir';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Geçerli bir email adresi giriniz';
        }

        // Şifre validasyonu
        if (!formData.password) {
            newErrors.password = 'Şifre gereklidir';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Şifre en az 6 karakter olmalıdır';
        }

        // Kayıt modunda ek validasyonlar
        if (mode === 'register') {
            if (!formData.name) {
                newErrors.name = 'Ad gereklidir';
            }
            if (!formData.surname) {
                newErrors.surname = 'Soyad gereklidir';
            }
            if (!formData.acceptTerms) {
                newErrors.acceptTerms = 'Kullanım koşullarını kabul etmelisiniz';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Şifreler eşleşmiyor';
            }
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (mode === 'register') {
            // Kayıt başarılı, doğrulama modalını göster
            setRegisteredEmail(formData.email);
            setShowVerification(true);
        } else {
            try {
                // Test için basit giriş kontrolü
                if (formData.email === 'test@test.com' && formData.password === '123456') {
                    // Kullanıcı bilgilerini localStorage'a kaydet
                    const user = {
                        name: 'Test',
                        surname: 'Kullanıcı',
                        email: 'test@test.com',
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    onClose();
                    // Yönlendirme öncesi kısa bir gecikme ekle
                    await new Promise(resolve => setTimeout(resolve, 100));
                    router.push('/user/home');
                } else {
                    setErrors(prev => ({
                        ...prev,
                        email: 'Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.'
                    }));
                }
            } catch (error) {
                console.error('Giriş hatası:', error);
                setErrors(prev => ({
                    ...prev,
                    email: 'Bir hata oluştu. Lütfen tekrar deneyin.'
                }));
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value
        }));
        // Hata mesajını temizle
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleVerificationSuccess = () => {
        setShowVerification(false);
        setMode('login');
        // Giriş formunda email'i otomatik doldur
        setFormData(prev => ({
            ...prev,
            email: registeredEmail
        }));
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {mode === 'login' && (
                        <div className="mb-4 p-4 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-600">
                                Test için giriş bilgileri:<br />
                                Email: test@test.com<br />
                                Şifre: 123456
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Ad
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                                        Soyad
                                    </label>
                                    <input
                                        type="text"
                                        id="surname"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border ${errors.surname ? 'border-red-500' : 'border-gray-300'
                                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.surname && (
                                        <p className="mt-1 text-sm text-red-600">{errors.surname}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                E-posta
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Şifre
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {mode === 'register' && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Şifre Tekrarı
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}

                        {mode === 'register' && (
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="acceptTerms"
                                        name="acceptTerms"
                                        type="checkbox"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        className={`h-4 w-4 border ${errors.acceptTerms ? 'border-red-500' : 'border-gray-300'
                                            } rounded focus:ring-blue-500`}
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                                        Kullanım koşullarını kabul ediyorum
                                    </label>
                                    {errors.acceptTerms && (
                                        <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            {mode === 'login'
                                ? 'Hesabınız yok mu? Kayıt olun'
                                : 'Zaten hesabınız var mı? Giriş yapın'}
                        </button>
                    </div>
                </div>
            </div>

            <EmailVerificationModal
                isOpen={showVerification}
                onClose={() => setShowVerification(false)}
                email={registeredEmail}
                onVerificationSuccess={handleVerificationSuccess}
            />
        </>
    );
} 
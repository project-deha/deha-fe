'use client';

import { useState, useEffect } from 'react';
import EmailVerificationModal from './EmailVerificationModal';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import axiosInstance from '@/config/axios';
import { useUserStore } from '@/store/userStore';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);
    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [resetEmailSent, setResetEmailSent] = useState(false);
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
            try {
                const registerResponse = await axiosInstance.post('/auth/register', {
                    email: formData.email,
                    firstName: formData.name,
                    lastName: formData.surname,
                    password: formData.password
                });

                // Kayıt başarılı, otomatik giriş yap
                try {
                    const loginResponse = await axiosInstance.post('/auth/login', {
                        email: formData.email,
                        password: formData.password
                    });

                    // GenericResponse'dan UserDto'yu al ve store'a kaydet
                    const userData = loginResponse.data.data;
                    useUserStore.getState().setUser(userData);

                    // Doğrulama modalını göster
                    setRegisteredEmail(formData.email);
                    setShowVerification(true);
                } catch (loginError: any) {
                    console.error('Otomatik giriş hatası:', loginError);
                    // Kayıt başarılı ama giriş başarısız olsa bile doğrulama modalını göster
                    setRegisteredEmail(formData.email);
                    setShowVerification(true);
                }
            } catch (error: any) {
                console.error('Kayıt hatası:', error);
                let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';

                if (error.response) {
                    // Backend'den gelen hata mesajını kullan
                    if (error.response.data?.error) {
                        const errorMap = error.response.data.error;
                        errorMessage = Object.values(errorMap)[0] as string;
                    } else {
                        switch (error.response.status) {
                            case 400:
                                errorMessage = 'Geçersiz kayıt bilgileri.';
                                break;
                            case 409:
                                errorMessage = 'Bu email adresi zaten kullanımda.';
                                break;
                            case 429:
                                errorMessage = 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.';
                                break;
                            case 500:
                                errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
                                break;
                        }
                    }
                } else if (error.request) {
                    errorMessage = 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.';
                }

                setErrors(prev => ({
                    ...prev,
                    email: errorMessage
                }));
            }
        } else if (mode === 'login') {
            try {
                const response = await axiosInstance.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                // GenericResponse'dan UserDto'yu al ve store'a kaydet
                const userData = response.data.data;
                useUserStore.getState().setUser(userData);
                onClose();
                // Yönlendirme öncesi kısa bir gecikme ekle
                await new Promise(resolve => setTimeout(resolve, 100));
                router.push('/user/home');
            } catch (error: any) {
                console.error('Giriş hatası:', error);
                let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';

                if (error.response) {
                    // Backend'den gelen hata mesajını kullan
                    if (error.response.data?.error) {
                        const errorMap = error.response.data.error;
                        errorMessage = Object.values(errorMap)[0] as string;
                    } else {
                        switch (error.response.status) {
                            case 401:
                                errorMessage = 'Geçersiz email veya şifre.';
                                break;
                            case 403:
                                errorMessage = 'Hesabınız aktif değil.';
                                break;
                            case 404:
                                errorMessage = 'Kullanıcı bulunamadı.';
                                break;
                            case 429:
                                errorMessage = 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.';
                                break;
                            case 500:
                                errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
                                break;
                        }
                    }
                } else if (error.request) {
                    errorMessage = 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.';
                }

                setErrors(prev => ({
                    ...prev,
                    email: errorMessage
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

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) {
            setErrors(prev => ({
                ...prev,
                email: 'Email adresi gereklidir'
            }));
            return;
        }

        try {
            await axiosInstance.post('/auth/forgot-my-password', formData.email, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            setResetEmailSent(true);
        } catch (error: any) {
            console.error('Şifre sıfırlama hatası:', error);
            let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';

            if (error.response?.data?.error) {
                const errorMap = error.response.data.error;
                errorMessage = Object.values(errorMap)[0] as string;
            }

            setErrors(prev => ({
                ...prev,
                email: errorMessage
            }));
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 text-center">
                            {mode === 'login' ? 'Giriş Yap' : mode === 'register' ? 'Kayıt Ol' : 'Şifremi Unuttum'}
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

                    {mode === 'forgot-password' ? (
                        resetEmailSent ? (
                            <div className="text-center py-6">
                                <div className="mb-4 text-green-600">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Gönderildi</h3>
                                <p className="text-gray-600 mb-4">
                                    Şifreniz {formData.email} adresine gönderildi.
                                    Lütfen email kutunuzu kontrol edin.
                                </p>
                                <button
                                    onClick={() => {
                                        setMode('login');
                                        setResetEmailSent(false);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Giriş sayfasına dön
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotPassword} className="space-y-4">
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

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Şifremi Sıfırla
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setMode('login')}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Giriş sayfasına dön
                                    </button>
                                </div>
                            </form>
                        )
                    ) : (
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
                    )}

                    {mode === 'login' && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setMode('forgot-password')}
                                className="text-blue-600 text-center hover:text-blue-800 mb-4 block"
                            >
                                Şifremi Unuttum
                            </button>
                            <button
                                onClick={() => setMode('register')}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Hesabınız yok mu? Kayıt olun
                            </button>
                        </div>
                    )}

                    {mode === 'register' && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setMode('login')}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Zaten hesabınız var mı? Giriş yapın
                            </button>
                        </div>
                    )}
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
'use client';

import { useState } from 'react';
import axiosInstance from '@/config/axios';

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onVerificationSuccess: () => void;
}

export default function EmailVerificationModal({ isOpen, onClose, email, onVerificationSuccess }: EmailVerificationModalProps) {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await axiosInstance.post('/auth/verify', {
                verificationCode: parseInt(verificationCode)
            });

            onVerificationSuccess();
        } catch (error: unknown) {
            console.error('Doğrulama hatası:', error);
            setError('Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        setError('');
        try {
            await axiosInstance.post('/auth/verify-email/resend', { email });
            // Could show success message here if needed
        } catch (error: unknown) {
            console.error('Kod tekrar gönderme hatası:', error);
            setError('Kod tekrar gönderilirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Email Doğrulama
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

                <div className="mb-6">
                    <p className="text-gray-600">
                        {email} adresine gönderilen 6 haneli doğrulama kodunu giriniz.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Doğrulama Kodu
                        </label>
                        <input
                            type="text"
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="6 haneli kod"
                            maxLength={6}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={verificationCode.length !== 6 || isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isLoading}
                            className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Yeni kod gönder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
'use client';

import { useState } from 'react';

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onVerificationSuccess: () => void;
}

export default function EmailVerificationModal({ isOpen, onClose, email, onVerificationSuccess }: EmailVerificationModalProps) {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Statik doğrulama kodu: 123456
        if (verificationCode === '123456') {
            onVerificationSuccess();
        } else {
            setError('Doğrulama kodu hatalı. Lütfen tekrar deneyin.');
        }
    };

    const handleResendCode = () => {
        setError('');
        setVerificationCode('');
        alert('Yeni doğrulama kodu gönderildi! (Test için kod: 123456)');
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
                    <p className="text-sm text-gray-500 mt-2">
                        (Test için doğrulama kodu: 123456)
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
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={verificationCode.length !== 6}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Doğrula
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Yeni kod gönder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import axiosInstance from '@/config/axios';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
}

export default function ProfilePage() {
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState<UserData>({ firstName: '', lastName: '', email: '' });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        if (user) {
            setEditData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        }
    }, [user]);

    const handleEdit = () => {
        setShowModal(true);
        if (user) {
            setEditData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        }
    };

    const handleSave = async () => {
        if (user) {
            try {
                const response = await axiosInstance.patch('user/me', {
                    email: editData.email,
                    firstName: editData.firstName,
                    lastName: editData.lastName,
                    isVerified: user.isVerified
                });

                // Zustand store'u güncelle - tüm gerekli alanları koru
                const updatedUser = {
                    ...user, // Mevcut tüm alanları koru (id, authorities, isVerified vs.)
                    firstName: editData.firstName,
                    lastName: editData.lastName,
                    email: editData.email
                };
                setUser(updatedUser);

                // Backward compatibility için localStorage'ı da güncelle
                if (typeof window !== 'undefined') {
                    const legacyUser = {
                        name: editData.firstName,
                        surname: editData.lastName,
                        email: editData.email
                    };
                    localStorage.setItem('user', JSON.stringify(legacyUser));
                }
                setShowModal(false);
            } catch (error) {
                console.error('Kullanıcı bilgileri güncellenirken hata oluştu:', error);
                // TODO: Hata mesajını kullanıcıya göster
            }
        }
    };

    const handleOpenPasswordModal = () => {
        setShowPasswordModal(true);
        setCurrentPassword('');
        setNewPassword('');
        setRepeatPassword('');
        setPasswordError('');
        setPasswordSuccess('');
    };

    const handlePasswordSave = async () => {
        if (newPassword.length < 6) {
            setPasswordError('Şifre en az 6 karakter olmalı.');
            setPasswordSuccess('');
            return;
        }
        if (newPassword !== repeatPassword) {
            setPasswordError('Şifreler eşleşmiyor.');
            setPasswordSuccess('');
            return;
        }

        try {
            await axiosInstance.patch(`user/me/password?password=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`);

            setPasswordError('');
            setPasswordSuccess('Şifre başarıyla değiştirildi!');
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess('');
                setCurrentPassword('');
                setNewPassword('');
                setRepeatPassword('');
            }, 1200);
        } catch (error) {
            setPasswordError('Şifre değiştirme işlemi başarısız oldu. Lütfen mevcut şifrenizi kontrol edin.');
            setPasswordSuccess('');
        }
    };

    return (
        <>
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Profilim</h1>
                <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                            {user ? user.firstName.charAt(0) + user.lastName.charAt(0) : 'U'}
                        </div>
                        <div>
                            <div className="text-lg font-semibold">{user ? user.firstName + ' ' + user.lastName : 'Kullanıcı Adı'}</div>
                            <div className="text-gray-500 text-sm">{user ? user.email : 'kullanici@email.com'}</div>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div className="font-medium mb-1">Ad</div>
                        <div className="text-gray-700">{user ? user.firstName : 'Adınız'}</div>
                    </div>
                    <div>
                        <div className="font-medium mb-1">Soyad</div>
                        <div className="text-gray-700">{user ? user.lastName : 'Soyadınız'}</div>
                    </div>
                    <div>
                        <div className="font-medium mb-1">E-posta</div>
                        <div className="text-gray-700">{user ? user.email : 'kullanici@email.com'}</div>
                    </div>
                    <button onClick={handleEdit} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">Bilgilerimi Düzenle</button>
                </div>
            </main>

            {/* Bilgilerimi Düzenle Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-2 relative animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
                            onClick={() => setShowModal(false)}
                            aria-label="Kapat"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Profil Bilgilerini Düzenle</h2>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Ad</label>
                            <input
                                type="text"
                                value={editData.firstName}
                                onChange={e => setEditData({ ...editData, firstName: e.target.value })}
                                className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Soyad</label>
                            <input
                                type="text"
                                value={editData.lastName}
                                onChange={e => setEditData({ ...editData, lastName: e.target.value })}
                                className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">E-posta</label>
                            <input
                                type="email"
                                value={editData.email}
                                onChange={e => setEditData({ ...editData, email: e.target.value })}
                                className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            onClick={handleOpenPasswordModal}
                            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-base mb-4"
                        >
                            Şifre Değiştir
                        </button>
                        <div className="flex gap-4 mt-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-base"
                            >
                                Kaydet
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-base"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Şifre Değiştir Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-2 relative animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
                            onClick={() => setShowPasswordModal(false)}
                            aria-label="Kapat"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Şifre Değiştir</h2>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Mevcut Şifre</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                                placeholder="Mevcut şifreniz"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Yeni Şifre</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                                placeholder="Yeni şifre"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Yeni Şifre (Tekrar)</label>
                            <input
                                type="password"
                                value={repeatPassword}
                                onChange={e => setRepeatPassword(e.target.value)}
                                className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
                                placeholder="Yeni şifre tekrar"
                            />
                        </div>
                        {passwordError && <div className="text-red-500 mb-2 text-sm">{passwordError}</div>}
                        {passwordSuccess && <div className="text-green-600 mb-2 text-sm">{passwordSuccess}</div>}
                        <div className="flex gap-4 mt-2">
                            <button
                                onClick={handlePasswordSave}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-base"
                            >
                                Kaydet
                            </button>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-base"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 
"use client";

import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Users, DollarSign, Building2, Send, CheckCircle } from 'lucide-react';
import { submitNewEvent, submitEventUpdate } from '@/lib/eventSubmissionService';

interface EventSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'NEW_EVENT' | 'UPDATE_EVENT';
    existingEventId?: string;
    existingEventTitle?: string;
}

export default function EventSubmissionModal({
    isOpen,
    onClose,
    initialTab = 'NEW_EVENT',
    existingEventId,
    existingEventTitle
}: EventSubmissionModalProps) {
    const [activeTab, setActiveTab] = useState<'NEW_EVENT' | 'UPDATE_EVENT'>(initialTab);
    const [citiesData, setCitiesData] = useState<Record<string, Record<string, string[]>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    // NEW_EVENT states
    const [eventName, setEventName] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');
    const [isOneTimeEvent, setIsOneTimeEvent] = useState(false);
    const [eventDate, setEventDate] = useState('');
    const [daysOpen, setDaysOpen] = useState('');
    const [price, setPrice] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [unknownOrganizer, setUnknownOrganizer] = useState(false);

    // UPDATE_EVENT states
    const [updateMessage, setUpdateMessage] = useState('');

    // Fetch cities.json dynamically to avoid bloating initial bundle
    useEffect(() => {
        if (isOpen) {
            import('@/data/cities.json').then(module => {
                setCitiesData(module.default || module);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const citiesList = Object.keys(citiesData);
    const districtsList = city && citiesData[city] ? Object.keys(citiesData[city]) : [];

    const handleNewEventSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!eventName || !city || !district || !address) {
            setError('Lütfen tüm zorunlu alanları (Ad, İl, İlçe, Adres) doldurun.');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitNewEvent({
                eventName,
                city,
                district,
                address,
                isOneTimeEvent,
                eventDate: isOneTimeEvent ? eventDate : undefined,
                daysOpen: isOneTimeEvent ? undefined : daysOpen,
                price,
                organizer: unknownOrganizer ? 'Bilinmiyor' : organizer
            });
            setSuccessMessage('Öneriniz başarıyla alındı. Teşekkür ederiz!');
            setTimeout(() => {
                onClose();
                resetForm();
            }, 2500);
        } catch (err) {
            setError('Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!updateMessage) {
            setError('Lütfen bir mesaj yazın.');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitEventUpdate({
                eventId: existingEventId,
                eventTitle: existingEventTitle,
                updateMessage
            });
            setSuccessMessage('Bilgileriniz başarıyla gönderildi. İnceleyip güncelleyeceğiz. Teşekkürler!');
            setTimeout(() => {
                onClose();
                resetForm();
            }, 2500);
        } catch (err) {
            setError('Gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEventName('');
        setCity('');
        setDistrict('');
        setAddress('');
        setIsOneTimeEvent(false);
        setEventDate('');
        setDaysOpen('');
        setPrice('');
        setOrganizer('');
        setUnknownOrganizer(false);
        setUpdateMessage('');
        setSuccessMessage('');
        setError('');
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid var(--card-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>
                        Oto Pazarı & Etkinlik Desteği
                    </h2>
                    <button onClick={onClose} style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex'
                    }}>
                        <X style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', background: 'var(--secondary)' }}>
                    <button 
                        onClick={() => { setActiveTab('NEW_EVENT'); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '16px',
                            background: activeTab === 'NEW_EVENT' ? 'transparent' : 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'NEW_EVENT' ? '3px solid var(--primary)' : '3px solid transparent',
                            color: activeTab === 'NEW_EVENT' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Yeni Pazar / Etkinlik Ekle
                    </button>
                    <button 
                        onClick={() => { setActiveTab('UPDATE_EVENT'); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '16px',
                            background: activeTab === 'UPDATE_EVENT' ? 'transparent' : 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'UPDATE_EVENT' ? '3px solid var(--primary)' : '3px solid transparent',
                            color: activeTab === 'UPDATE_EVENT' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Mevcut Etkinliği Güncelle
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', overflowY: 'auto' }}>
                    {successMessage ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <CheckCircle style={{ width: '48px', height: '48px', color: '#22c55e', margin: '0 auto 16px' }} />
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                Başarılı!
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{successMessage}</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div style={{ 
                                    padding: '12px', 
                                    background: 'rgba(239, 68, 68, 0.1)', 
                                    color: '#ef4444', 
                                    borderRadius: '10px',
                                    marginBottom: '20px',
                                    fontSize: '14px'
                                }}>
                                    {error}
                                </div>
                            )}

                            {activeTab === 'NEW_EVENT' && (
                                <form onSubmit={handleNewEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>Oto Pazarı / Etkinlik Adı <span style={{color: '#ef4444'}}>*</span></label>
                                        <input 
                                            type="text" 
                                            value={eventName}
                                            onChange={(e) => setEventName(e.target.value)}
                                            placeholder="Örn: Rami Açık Oto Pazarı"
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={labelStyle}>İl <span style={{color: '#ef4444'}}>*</span></label>
                                            <select 
                                                value={city} 
                                                onChange={(e) => { setCity(e.target.value); setDistrict(''); }}
                                                style={inputStyle}
                                            >
                                                <option value="">İl Seçiniz</option>
                                                {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>İlçe <span style={{color: '#ef4444'}}>*</span></label>
                                            <select 
                                                value={district} 
                                                onChange={(e) => setDistrict(e.target.value)}
                                                style={inputStyle}
                                                disabled={!city}
                                            >
                                                <option value="">İlçe Seçiniz</option>
                                                {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Açık Adres / Konum <span style={{color: '#ef4444'}}>*</span></label>
                                        <textarea 
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Açık adres veya bilindik bir konum tarif ediniz..."
                                            style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <label style={{ ...labelStyle, marginBottom: 0 }}>
                                                    {isOneTimeEvent ? 'Etkinlik Tarihi' : 'Hangi Günler Açık?'}
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isOneTimeEvent} 
                                                        onChange={(e) => setIsOneTimeEvent(e.target.checked)} 
                                                    />
                                                    Tek Seferlik
                                                </label>
                                            </div>
                                            {isOneTimeEvent ? (
                                                <input 
                                                    type="date" 
                                                    value={eventDate}
                                                    onChange={(e) => setEventDate(e.target.value)}
                                                    style={inputStyle}
                                                />
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    value={daysOpen}
                                                    onChange={(e) => setDaysOpen(e.target.value)}
                                                    placeholder="Örn: Sadece Pazar Günleri"
                                                    style={inputStyle}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Giriş Ücreti</label>
                                            <input 
                                                type="text" 
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="Örn: 250 TL veya Ücretsiz"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Organizatör / İşletmeci</label>
                                        <input 
                                            type="text" 
                                            value={organizer}
                                            onChange={(e) => setOrganizer(e.target.value)}
                                            placeholder="Örn: İstanbul Büyükşehir Belediyesi"
                                            style={{...inputStyle, opacity: unknownOrganizer ? 0.5 : 1}}
                                            disabled={unknownOrganizer}
                                        />
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={unknownOrganizer} 
                                                onChange={(e) => setUnknownOrganizer(e.target.checked)} 
                                            />
                                            Bilinmiyor
                                        </label>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        style={{
                                            marginTop: '8px',
                                            padding: '14px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            opacity: isSubmitting ? 0.7 : 1
                                        }}
                                    >
                                        {isSubmitting ? 'Gönderiliyor...' : (
                                            <>
                                                <Send style={{ width: '18px', height: '18px' }} />
                                                Gönder
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {activeTab === 'UPDATE_EVENT' && (
                                <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>Hangi Etkinlik/Pazar Hakkında?</label>
                                        <div style={{
                                            padding: '14px',
                                            background: 'var(--secondary)',
                                            borderRadius: '10px',
                                            border: '1px solid var(--card-border)',
                                            color: 'var(--foreground)',
                                            fontWeight: '600'
                                        }}>
                                            {existingEventTitle || "Belirtilmemiş Etkinlik"}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Güncellemek İstediğiniz Bilgi <span style={{color: '#ef4444'}}>*</span></label>
                                        <textarea 
                                            value={updateMessage}
                                            onChange={(e) => setUpdateMessage(e.target.value)}
                                            placeholder="Örn: Bu pazarın giriş ücreti artık 300 TL oldu ve saat 18:00'da kapanıyor..."
                                            style={{...inputStyle, minHeight: '120px', resize: 'vertical'}}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        style={{
                                            marginTop: '8px',
                                            padding: '14px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            opacity: isSubmitting ? 0.7 : 1
                                        }}
                                    >
                                        {isSubmitting ? 'Gönderiliyor...' : (
                                            <>
                                                <Send style={{ width: '18px', height: '18px' }} />
                                                Bilgiyi Gönder
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    marginBottom: '8px'
};

const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--background)',
    border: '1px solid var(--card-border)',
    borderRadius: '10px',
    color: 'var(--foreground)',
    fontSize: '14px',
    outline: 'none',
};

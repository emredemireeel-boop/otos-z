"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function IletisimPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <main style={{ padding: '60px 24px', minHeight: '60vh' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: '900', color: 'var(--foreground)', marginBottom: '16px', letterSpacing: '-1px' }}>
                            Bize Ulaşın
                        </h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
                            Soru, görüş, öneri ve reklam ortaklıkları için bizimle iletişime geçebilirsiniz.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        
                        {/* İletişim Bilgileri */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ 
                                background: 'var(--card-bg)', 
                                border: '1px solid var(--card-border)', 
                                borderRadius: '24px', 
                                padding: '32px', 
                                boxShadow: 'var(--card-shadow)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px'
                            }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(0, 90, 226, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail style={{ width: '28px', height: '28px', color: 'var(--primary)' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>E-Posta</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>otosoz.destek@gmail.com</p>
                                </div>
                            </div>

                            <div style={{ 
                                background: 'var(--card-bg)', 
                                border: '1px solid var(--card-border)', 
                                borderRadius: '24px', 
                                padding: '32px', 
                                boxShadow: 'var(--card-shadow)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px'
                            }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MapPin style={{ width: '28px', height: '28px', color: 'var(--success)' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>Ofis / Konum</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>İzmir, Türkiye</p>
                                </div>
                            </div>

                        </div>

                        {/* İletişim Formu */}
                        <div style={{ 
                            background: 'var(--card-bg)', 
                            border: '1px solid var(--card-border)', 
                            borderRadius: '24px', 
                            padding: '40px', 
                            boxShadow: 'var(--card-shadow)',
                        }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '24px' }}>
                                Mesaj Gönder
                            </h2>
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => {
                                e.preventDefault();
                                window.location.href = "mailto:otosoz.destek@gmail.com?subject=Destek Talebi";
                            }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Ad Soyad</label>
                                    <input type="text" placeholder="Adınız Soyadınız" required style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--card-border)',
                                        background: 'var(--secondary)',
                                        color: 'var(--foreground)',
                                        outline: 'none',
                                        fontSize: '15px'
                                    }}/>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>E-Posta Adresiniz</label>
                                    <input type="email" placeholder="ornek@email.com" required style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--card-border)',
                                        background: 'var(--secondary)',
                                        color: 'var(--foreground)',
                                        outline: 'none',
                                        fontSize: '15px'
                                    }}/>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Mesajınız</label>
                                    <textarea placeholder="Konu ve detaylar..." required rows={5} style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--card-border)',
                                        background: 'var(--secondary)',
                                        color: 'var(--foreground)',
                                        outline: 'none',
                                        fontSize: '15px',
                                        resize: 'vertical'
                                    }}/>
                                </div>
                                <button type="submit" style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    marginTop: '10px',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 4px 15px rgba(0, 90, 226, 0.3)'
                                }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}>
                                    <Send style={{ width: '20px', height: '20px' }} />
                                    Gönder
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

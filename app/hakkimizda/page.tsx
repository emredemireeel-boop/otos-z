"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HakkimizdaPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <main style={{ padding: '60px 24px', minHeight: '60vh' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '42px', fontWeight: '900', color: 'var(--foreground)', marginBottom: '16px', letterSpacing: '-1px' }}>
                            Hakkımızda
                        </h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
                            "Tek renk değil çok renk"
                        </p>
                    </div>

                    <div style={{ 
                        background: 'var(--card-bg)', 
                        border: '1px solid var(--card-border)', 
                        borderRadius: '24px', 
                        padding: '40px', 
                        boxShadow: 'var(--card-shadow)',
                        color: 'var(--text-muted)', 
                        lineHeight: '1.8', 
                        fontSize: '16px' 
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', marginTop: '0' }}>
                            Biz Kimiz?
                        </h2>
                        <p style={{ marginBottom: '24px' }}>
                            Otosöz, otomotiv dünyasına dair tüm verileri, araç detaylarını, pazar araştırmalarını ve teknik kütüphaneyi tek bir dijital platformda birleştirmek üzere kurulmuş premium bir otomotiv ekosistemidir. Amacımız, ister sıradan bir kullanıcı ister profesyonel bir satıcı olsun, herkese Şeffaf, hızlı ve doğru otomotiv bilgisine anında erişim sağlamaktır.
                        </p>

                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', marginTop: '32px' }}>
                            Vizyonumuz
                        </h2>
                        <p style={{ marginBottom: '24px' }}>
                            Türkiye'deki ve küresel çaptaki otomobil sektörünün dinamiklerini anlık olarak takip edebileceğiniz, pazar analizlerinden gösterge ışıklarının anlamına, ikinci el fiyat analizlerinden detaylı araç DNA'sına kadar tüm süreçlerde tek referans kaynağı olmak.
                        </p>

                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', marginTop: '32px' }}>
                            Şeffaf Pazaryeri (Otosöz Pazarı)
                        </h2>
                        <p style={{ marginBottom: '0' }}>
                            Geliştirdiğimiz pazar modülü, var olan diğer sitelerin aksine "Sadece gerçeği ve tamamen Şeffaf" bilgileri sunmayı amaçlar. Araçların gerçek boya durumunu grafiksel olarak listeler ve yanıltıcı açıklamalar arasına saklanmış Tramer/Kaza bilgilerini net iİstatistiklerle ortaya çıkarır. Sürprizlere yer bırakmayan bir alışveriş deneyimi bizim için standarttır.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

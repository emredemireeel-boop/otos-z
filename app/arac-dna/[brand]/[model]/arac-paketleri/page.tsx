"use client";

import { useParams } from "next/navigation";
import { vehicleDNAData, createSlug } from "@/data/vehicle-dna";
import { trimLevelsData } from "@/data/trim-levels";
import TrimLevelsTable from "@/components/TrimLevelsTable";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

export default function TrimLevelsPage() {
    const params = useParams();
    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = createSlug(v.brand);
        const vModelSlug = createSlug(v.model);
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    if (!vehicle) {
        return (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Araç bulunamadı.
            </div>
        );
    }

    const trimData = trimLevelsData.find(t => t.vehicleId === vehicle.id);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Link href={`/arac-dna/${brandSlug}/${modelSlug}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '15px',
                    marginBottom: '16px'
                }}>
                    <ArrowLeft size={18} /> DNA Özetine Dön
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--primary)', borderRadius: '12px', color: 'white' }}>
                        <Layers size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: 'var(--foreground)' }}>
                            Araç Paketleri Kıyaslaması
                        </h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                            {vehicle.brand} {vehicle.model.replace(/\([^)]+\)/, '').trim()} donanım seviyeleri arasındaki farkları inceleyin.
                        </p>
                    </div>
                </div>
            </div>

            {trimData ? (
                <TrimLevelsTable data={trimData} />
            ) : (
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    marginTop: '24px'
                }}>
                    <Layers size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Veri Hazırlanıyor</h3>
                    <p>Bu aracın donanım paketi verileri henüz uzmanlarımız tarafından eklenmemiştir.</p>
                </div>
            )}

            {/* SEO Content Depth Expansion for Trim Page */}
            <div style={{
                marginTop: '48px',
                padding: '32px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                textAlign: 'left',
                color: 'var(--text-muted)',
                lineHeight: '1.7'
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px' }}>
                    {vehicle.brand} {vehicle.model} Donanım Paketleri ve Özellik Karşılaştırması
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    İkinci el veya sıfır kilometre bir <strong>{vehicle.brand} {vehicle.model}</strong> alırken, aracın hangi donanım paketine sahip olduğu fiyatını, sürüş konforunu ve ikinci eldeki değerini doğrudan etkiler. Aynı aracın giriş seviyesi (boş paket) versiyonu ile en dolu (full paket) versiyonu arasında iç tasarım kalitesi, multimedya sistemleri, güvenlik asistanları ve dış görünüm özellikleri açısından çok büyük uçurumlar bulunabilir. Araç alırken bütçenizi en doğru şekilde yönlendirebilmeniz için, her pakette standart olarak sunulan ve opsiyonel olan donanımları dikkatlice analiz etmelisiniz.
                </p>
                <p style={{ marginBottom: '16px' }}>
                    Yukarıdaki tabloda, <strong>{vehicle.brand} {vehicle.model}</strong> için sunulan başlıca donanım seviyelerini (örneğin baz donanım, orta donanım ve üst donanım) kıyaslayabilirsiniz. Boş paketlerde manuel klima ve halojen farlar standartken, üst donanımlara çıktıkça otomatik dijital klima, LED/Matrix farlar, açılır cam tavan veya panoramik cam tavan, gelişmiş sürüş destek sistemleri (şerit takip, kör nokta uyarı vb.) standart hale gelmektedir.
                </p>
                <p>
                    OtoAsfalt olarak donanım paketlerini detaylı bir şekilde analiz ediyor ve ikinci el piyasasındaki değer kaybı durumuna göre en mantıklı paketi (Fiyat/Performans Paketi) belirlemenize yardımcı oluyoruz. Aracı satın almadan önce hangi donanımların sizin için olmazsa olmaz olduğuna karar vermek, uzun vadeli kullanıcı memnuniyetini garantileyen en önemli adımlardan biridir.
                </p>
            </div>
        </div>
    );
}

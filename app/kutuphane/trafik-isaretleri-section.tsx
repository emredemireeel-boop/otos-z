import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';
import signsData from '@/data/trafik_isaretleri.json';

export default function TrafikIsaretleriSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const filteredCategories = signsData.categories.map(cat => ({
        ...cat,
        signs: cat.signs.filter(sign => 
            sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sign.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => 
        (activeCategory === 'all' || cat.id === activeCategory) && cat.signs.length > 0
    );

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--card-bg), var(--bg))', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid var(--card-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', color: 'var(--foreground)' }}>
                    Türkiye Trafik İşaretleri ve Anlamları
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                    Trafik işaretleri hayat kurtarır. Sürücülerin yoldaki tehlikeleri önceden fark etmesi, trafik kurallarına uyması ve yolculuklarını güvenle tamamlaması için tüm işaretlerin anlamlarını bilmesi şarttır.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={20} />
                        <input
                            type="text"
                            placeholder="Trafik işareti ara... (Örn: yaya geçidi, sollama)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                borderRadius: '12px',
                                border: '1px solid var(--card-border)',
                                background: 'var(--bg)',
                                color: 'var(--foreground)',
                                outline: 'none',
                                fontSize: '15px'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                        <button
                            onClick={() => setActiveCategory('all')}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '10px',
                                border: '1px solid',
                                borderColor: activeCategory === 'all' ? 'var(--primary)' : 'var(--card-border)',
                                background: activeCategory === 'all' ? 'var(--primary)' : 'var(--bg)',
                                color: activeCategory === 'all' ? '#fff' : 'var(--text-secondary)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            Tümü
                        </button>
                        {signsData.categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    border: '1px solid',
                                    borderColor: activeCategory === cat.id ? 'var(--primary)' : 'var(--card-border)',
                                    background: activeCategory === cat.id ? 'var(--primary)' : 'var(--bg)',
                                    color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {cat.name.split(' ')[0]} {cat.name.split(' ')[1]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredCategories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                    <Search size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px' }} />
                    <h4 style={{ fontSize: '18px', color: 'var(--foreground)', marginBottom: '8px' }}>Sonuç Bulunamadı</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>Arama kriterlerinize uygun trafik işareti bulunamadı.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {filteredCategories.map(category => (
                        <div key={category.id}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '4px', marginTop: '4px' }}></div>
                                <div>
                                    <h4 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>
                                        {category.name}
                                    </h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {category.signs.map(sign => (
                                    <div key={sign.id} style={{ 
                                        background: 'var(--card-bg)', 
                                        borderRadius: '16px', 
                                        border: '1px solid var(--card-border)', 
                                        overflow: 'hidden',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    >
                                        <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg)' }}>
                                            <img src={sign.image} alt={sign.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }} />
                                        </div>
                                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <h5 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', lineHeight: '1.4' }}>
                                                    {sign.name}
                                                </h5>
                                                <span style={{ fontSize: '12px', fontWeight: '800', background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: '8px' }}>
                                                    {sign.id}
                                                </span>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginTop: 'auto' }}>
                                                {sign.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

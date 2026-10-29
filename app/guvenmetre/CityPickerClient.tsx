"use client";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {MapPin,X,Search} from 'lucide-react';
export default function CityPickerClient({children,cities}:{children:React.ReactNode;cities:string[]}){
 const[cityModal,setCityModal]=useState<{categoryId:string;title:string}|null>(null),[citySearch,setCitySearch]=useState('');const router=useRouter();
 const filteredCities=cities.filter(city=>city.toLocaleLowerCase('tr').includes(citySearch.toLocaleLowerCase('tr')));
 return <div onClick={event=>{const target=(event.target as Element).closest<HTMLElement>('[data-city-required]');if(target){event.preventDefault();setCityModal({categoryId:target.dataset.categoryId!,title:target.dataset.categoryTitle!});setCitySearch('');}}}>{children}
            {/* Şehir Seçim Modalı */}
            {cityModal && (
                <>
                    <div
                        onClick={() => setCityModal(null)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1100, backdropFilter: 'blur(3px)' }}
                    />
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        width: '480px', maxWidth: '95vw',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                        zIndex: 1200, overflow: 'hidden',
                    }}>
                        {/* Header */}
                        <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid var(--card-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--secondary)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={18} color="var(--foreground)" />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--foreground)' }}>Şehir Seçin</h2>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{cityModal.title} · Bölgenizi seçerek devam edin</p>
                                    </div>
                                </div>
                                <button onClick={() => setCityModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--background)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0 12px', marginTop: '12px' }}>
                                <Search size={14} color="var(--text-muted)" />
                                <input
                                    autoFocus
                                    value={citySearch}
                                    onChange={e => setCitySearch(e.target.value)}
                                    placeholder="Şehir ara... (İstanbul, Ankara...)"
                                    style={{ flex: 1, padding: '10px 0', border: 'none', background: 'transparent', outline: 'none', color: 'var(--foreground)', fontSize: '13px' }}
                                />
                                {citySearch && (
                                    <button onClick={() => setCitySearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Şehir Grid */}
                        <div style={{ padding: '12px 16px', maxHeight: '340px', overflowY: 'auto' }}>
                            {filteredCities.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px', fontSize: '13px' }}>
                                    &quot;{citySearch}&quot; bulunamadı.
                                </p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                                    {filteredCities.map(sehir => (
                                        <button
                                            key={sehir}
                                            onClick={() => {
                                                setCityModal(null);
                                                router.push(`/guvenmetre/${cityModal.categoryId}?sehir=${encodeURIComponent(sehir)}`);
                                            }}
                                            style={{
                                                padding: '9px 12px', borderRadius: '9px',
                                                border: '1px solid var(--border-subtle)',
                                                background: 'var(--background)', color: 'var(--foreground)',
                                                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                                                textAlign: 'left', transition: 'all 0.15s',
                                                display: 'flex', alignItems: 'center', gap: '5px',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                                e.currentTarget.style.background = 'rgba(255,107,0,0.06)';
                                                e.currentTarget.style.color = 'var(--primary)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                                e.currentTarget.style.background = 'var(--background)';
                                                e.currentTarget.style.color = 'var(--foreground)';
                                            }}
                                        >
                                            <MapPin size={10} style={{ flexShrink: 0, opacity: 0.5 }} />
                                            {sehir}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '12px 24px', borderTop: '1px solid var(--card-border)', background: 'var(--background)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{filteredCities.length} Şehir listeleniyor</span>
                            <button
                                onClick={() => setCityModal(null)}
                                style={{ padding: '7px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                İptal
                            </button>
                        </div>
                    </div>
                </>
            )}


</div>;
}

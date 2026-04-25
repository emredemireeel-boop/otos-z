"use client";

import { useState } from "react";
import { ClipboardCheck, CalendarDays, Clock, SearchCheck, FileSignature, AlertCircle, Info, CheckCircle2, AlertTriangle, ShieldCheck, ExternalLink, HelpCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import tuvturkData from "@/data/tuvturk_verileri.json";
import tuvturkFaq from "@/data/tuvturk_faq.json";

export default function TuvturkMuayeneSection() {
    const [activeTab, setActiveTab] = useState<'surec' | 'agir_kusur' | 'hafif_kusur' | 'faq'>('surec');
    const [faqSearch, setFaqSearch] = useState("");

    const getIcon = (name: string) => {
        switch (name) {
            case "ClipboardCheck": return <ClipboardCheck size={24} color="var(--primary)" />;
            case "CalendarDays": return <CalendarDays size={24} color="var(--primary)" />;
            case "Clock": return <Clock size={24} color="var(--primary)" />;
            case "SearchCheck": return <SearchCheck size={24} color="var(--primary)" />;
            case "FileSignature": return <FileSignature size={24} color="var(--primary)" />;
            default: return <Info size={24} color="var(--primary)" />;
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{
                background: 'linear-gradient(135deg, #006C4C, #00C9B8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                boxShadow: '0 10px 30px rgba(0, 108, 76, 0.2)'
            }}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.3)'
                }}>
                    <ShieldCheck size={32} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>TÜVTÜRK Araç Muayenesi Rehberi 2026</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                        Araç muayene süreci, randevu alımı ve istasyonda yapılacak işlemler hakkında bilmeniz gereken her şey. Muayeneye gitmeden önce ağır ve hafif kusur tablolarını inceleyerek hazırlığınızı tam yapın.
                    </p>
                </div>
            </div>

            {/* İç Menü */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', overflowX: 'auto' }}>
                <button
                    onClick={() => setActiveTab('surec')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'surec' ? 'var(--primary)' : 'var(--card-bg)',
                        color: activeTab === 'surec' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'surec' ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <ClipboardCheck size={16} /> Adım Adım Muayene Süreci
                </button>
                <button
                    onClick={() => setActiveTab('agir_kusur')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'agir_kusur' ? '#EF4444' : 'var(--card-bg)',
                        color: activeTab === 'agir_kusur' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'agir_kusur' ? '1px solid #EF4444' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <AlertTriangle size={16} /> Ağır Kusurlar Listesi
                </button>
                <button
                    onClick={() => setActiveTab('hafif_kusur')}
                    style={{
                        padding: '10px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
                        background: activeTab === 'hafif_kusur' ? '#F59E0B' : 'var(--card-bg)',
                        color: activeTab === 'hafif_kusur' ? 'white' : 'var(--foreground)',
                        border: activeTab === 'hafif_kusur' ? '1px solid #F59E0B' : '1px solid var(--card-border)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'
                    }}>
                    <AlertCircle size={16} /> Hafif Kusurlar Listesi
                </button>
            </div>

            {/* Süreç Tab'ı */}
            {activeTab === 'surec' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {tuvturkData.steps.map((step, idx) => (
                        <div key={step.id} style={{
                            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                            borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'var(--primary)' }} />
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px', background: 'var(--secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    {getIcon(step.icon)}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Adım {idx + 1}:</span> {step.title}
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>{step.description}</p>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                        {step.points.map((point, pIdx) => (
                                            <div key={pIdx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                <CheckCircle2 size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                                <span style={{ fontSize: '13px', color: 'var(--foreground)', lineHeight: '1.5' }}>{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {(step as any).actionLink && (
                                        <div style={{ marginTop: '20px' }}>
                                            <a 
                                                href={(step as any).actionLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '10px 20px',
                                                    background: 'var(--primary)',
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    borderRadius: '8px',
                                                    fontWeight: '700',
                                                    fontSize: '14px',
                                                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 6px 14px rgba(16, 185, 129, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(16, 185, 129, 0.3)';
                                                }}
                                            >
                                                {(step as any).actionText} <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ağır Kusur Tab'ı */}
            {activeTab === 'agir_kusur' && (
                <div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                        <AlertTriangle size={24} color="#EF4444" style={{ flexShrink: 0 }} />
                        <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                            <strong style={{ color: '#EF4444' }}>Ağır Kusur Nedir?</strong> Araç muayenesinde tespit edilen ve aracın trafiğe çıkmasını emniyetsiz veya tehlikeli kılan kusurlardır. Ağır kusuru olan araçlar muayeneden <strong>geçemez</strong>. Arızanın 30 gün içinde giderilip ücretsiz muayene tekrarına gelinmesi gerekir.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {tuvturkData.heavyDefects.map((defectGroup, idx) => (
                            <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                    {defectGroup.category}
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {defectGroup.issues.map((issue, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', marginTop: '6px', flexShrink: 0 }} />
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{issue}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hafif Kusur Tab'ı */}
            {activeTab === 'hafif_kusur' && (
                <div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                        <AlertCircle size={24} color="#F59E0B" style={{ flexShrink: 0 }} />
                        <p style={{ fontSize: '14px', color: 'var(--foreground)', lineHeight: '1.5' }}>
                            <strong style={{ color: '#F59E0B' }}>Hafif Kusur Nedir?</strong> Aracın sürüş güvenliğini doğrudan tehlikeye atmayan ancak giderilmesi tavsiye edilen eksikliklerdir. Hafif kusuru olan araçlar muayeneden <strong>geçer</strong> ancak bu kusurların raporlanması aracın durumunu gösterir.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {tuvturkData.lightDefects.map((defectGroup, idx) => (
                            <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                    {defectGroup.category}
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {defectGroup.issues.map((issue, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', marginTop: '6px', flexShrink: 0 }} />
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{issue}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SSS (FAQ) Tab'ı */}
            {activeTab === 'faq' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>TÜVTÜRK muayenesi hakkında en çok merak edilen <strong>{tuvturkFaq.length} soru</strong> ve cevabı.</p>
                        <input 
                            type="text" 
                            placeholder="Soru veya konu ara..." 
                            value={faqSearch}
                            onChange={(e) => setFaqSearch(e.target.value)}
                            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '14px', outline: 'none', minWidth: '250px' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {tuvturkFaq.filter(f => f.question.toLowerCase().includes(faqSearch.toLowerCase()) || f.tags.some(t => t.toLowerCase().includes(faqSearch.toLowerCase()))).map((faq) => (
                            <Link key={faq.id} href={`/kutuphane/tuvturk/${faq.slug}--${faq.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{ 
                                    background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', height: '100%',
                                    transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#3B82F6';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--card-border)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <HelpCircle size={16} color="#3B82F6" />
                                        </div>
                                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', lineHeight: '1.4' }}>{faq.question}</h3>
                                    </div>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {faq.answer}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--background)', padding: '4px 8px', borderRadius: '4px' }}>{faq.category}</span>
                                        <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>Cevabı Oku <ChevronRight size={14} /></span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {tuvturkFaq.filter(f => f.question.toLowerCase().includes(faqSearch.toLowerCase()) || f.tags.some(t => t.toLowerCase().includes(faqSearch.toLowerCase()))).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Aradığınız kritere uygun soru bulunamadı.</div>
                    )}
                </div>
            )}
        </div>
    );
}

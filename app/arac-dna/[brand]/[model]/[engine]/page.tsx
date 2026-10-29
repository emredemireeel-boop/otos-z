import {vehicleDNAData} from '@/data/vehicle-dna';
import {createSlug} from '@/lib/vehicle-presentation';
import {isVehicleIndexable} from '@/lib/indexability';
import {isEngineRouteIndexable} from '@/lib/engine-quality';
import { notFound } from 'next/navigation';
import { engineDNAData } from '@/data/engine-dna';
import { findVehicleByRoute } from '@/lib/aracDnaSeo';
import { getDNAScoreColor,getDNAScoreLabel } from '@/lib/vehicle-presentation';
import { Shield, Star, Info, AlertCircle, TrendingUp, TrendingDown, Wrench } from 'lucide-react';
import { getTopSellingVehicleGuide } from '@/data/top-selling-vehicle-guides';
import TopSellingVehicleGuide from '@/components/TopSellingVehicleGuide';
import AracDNAShell from '../AracDNAShell';
import EngineReportClient from './EngineReportClient';
import EngineVoteClient from '@/components/EngineVoteClient';
export default async function EngineDetailedPage({params}:{params:Promise<{brand:string;model:string;engine:string}>}) {
    const {brand:brandSlug,model:modelSlug,engine:engineParam}=await params;
    const vehicle=findVehicleByRoute(brandSlug,modelSlug);
    if (!vehicle) notFound();
    let baseEngineSlug=engineParam, currentTab='genel-bakis';
    for (const [tab,suffix] of Object.entries({artilar:'-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri',kronik:'-kronik-sorunlari'})) {
        if(engineParam.endsWith(suffix)){baseEngineSlug=engineParam.slice(0,-suffix.length);currentTab=tab;break;}
    }
    const specificEngine=engineDNAData.find(record=>record.vehicleId===vehicle.id)?.engines.find(engine=>engine.slug===baseEngineSlug);
    if (!specificEngine) notFound();
    const activeScore=specificEngine.score, scoreColor=getDNAScoreColor(activeScore),scoreLabel=getDNAScoreLabel(activeScore);
    const marketGuide=getTopSellingVehicleGuide(brandSlug,modelSlug);
    const issues=[...vehicle.chronicIssues,...specificEngine.chronicIssues.map((issue,index)=>({...issue,id:`${baseEngineSlug}-${index}`}))].sort((a,b)=>b.reportCount-a.reportCount);
    return (<AracDNAShell vehicle={vehicle} engineParam={engineParam}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Overview Section */}
            {currentTab === 'genel-bakis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div id="genel-bakis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {/* DNA Score Card */}
                        <div style={{
                            background: `linear-gradient(135deg, ${scoreColor}15, ${scoreColor}05)`,
                            border: `2px solid ${scoreColor}`,
                            borderRadius: '16px',
                            padding: '32px',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                DNA SKORU
                            </h2>
                            <div style={{ fontSize: '64px', fontWeight: '800', color: scoreColor, marginBottom: '16px' }}>
                                {activeScore}<span style={{ fontSize: '32px', opacity: 0.6 }}>/100</span>
                            </div>
                            <div style={{
                                width: '100%',
                                maxWidth: '300px',
                                height: '12px',
                                background: 'var(--secondary)',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                margin: '0 auto 16px'
                            }}>
                                <div style={{
                                    width: `${activeScore}%`,
                                    height: '100%',
                                    background: scoreColor,
                                    transition: 'width 0.5s ease'
                                }} />
                            </div>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: scoreColor
                            }}>
                                {scoreLabel}
                            </div>
                        </div>

                        {/* Euro NCAP Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.05))',
                            border: '2px solid #2563eb',
                            borderRadius: '16px',
                            padding: '32px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Shield size={20} />
                                EURO NCAP GÜVENLİK
                            </h2>
                            {vehicle.ncapStars ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={40}
                                                fill={i < (vehicle.ncapStars || 0) ? '#EAB308' : 'var(--secondary)'}
                                                color={i < (vehicle.ncapStars || 0) ? '#EAB308' : '#666'}
                                            />
                                        ))}
                                    </div>
                                    <div style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#EAB308',
                                        marginBottom: '8px'
                                    }}>
                                        {vehicle.ncapStars} Yıldız
                                    </div>
                                    {vehicle.ncapYear && (
                                        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                            Test Yılı: {vehicle.ncapYear}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ color: 'var(--text-muted)' }}>
                                    NCAP verisi bulunamadı
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Summary Alert */}
                    <div style={{
                        background: 'rgba(59, 130, 246, 0.05)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderLeft: '4px solid #3b82f6',
                        borderRadius: '12px',
                        padding: '24px'
                    }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '700', color: '#3b82f6', marginBottom: '12px' }}>
                            <Info size={20} /> Motor Seçeneği Özeti
                        </h3>
                        <p style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.6', marginBottom: specificEngine.description ? '12px' : 0 }}>
                            {vehicle.brand} {vehicle.model} <strong>{specificEngine.name}</strong> seçeneğine ait katalog verilerini aşağıda inceleyebilirsiniz. Satın alma kararında aracın bakım geçmişini ve bağımsız ekspertiz sonucunu da değerlendirin.
                        </p>
                        {specificEngine.description && <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>{specificEngine.description}</p>}
                    </div>
                    {marketGuide && <TopSellingVehicleGuide guide={marketGuide} />}
                    <div className="dna-overview-columns">
                        <article>
                            <h3><TrendingUp size={19} /> Güçlü yönlerden kısa liste</h3>
                            <ul>{(specificEngine.pros?.length ? specificEngine.pros : vehicle.strengths).slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
                        </article>
                        <article>
                            <h3><AlertCircle size={19} /> Dikkat edilmesi gerekenler</h3>
                            <ul>{(specificEngine.cons?.length ? specificEngine.cons : vehicle.weaknesses).slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
                        </article>
                    </div>
                </div>
            )}

            {/* Pros and Cons */}
            {currentTab === 'artilar' && (
                <div id="artilar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: '#10b981', marginBottom: '20px' }}>
                            <TrendingUp size={24} /> Güçlü Yönler
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {specificEngine.pros ? specificEngine.pros.map((strength, index) => (
                                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '6px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>{strength}</span>
                                </div>
                            )) : vehicle.strengths.map((strength, index) => (
                                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '6px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>{strength}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: '#ef4444', marginBottom: '20px' }}>
                            <TrendingDown size={24} /> Dikkat Noktaları
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {specificEngine.cons ? specificEngine.cons.map((weakness, index) => (
                                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>{weakness}</span>
                                </div>
                            )) : vehicle.weaknesses.map((weakness, index) => (
                                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0 }} />
                                    <span style={{ fontSize: '15px', color: 'var(--foreground)', lineHeight: '1.5' }}>{weakness}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Chronic Issues */}
            {currentTab === 'kronik' && (
                <div id="kronik" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                            <Wrench size={24} />
                            Kronik Sorunlar (Mekanik & Donanımsal)
                        </h2>
                        <EngineReportClient brandSlug={brandSlug} modelSlug={modelSlug} brandName={vehicle.brand} modelName={vehicle.model} engineName={specificEngine.name} />
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Bu araca (ve özellikle seçilen {specificEngine.name} motor/şanzıman kombinasyonuna) ait bildirilen yaygın arızalar en çok karşılaşılana göre sıralanmıştır.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {issues.slice(0, 15).map((issue) => (
                            <div key={issue.id} style={{
                                display: 'flex', gap: '16px', padding: '20px',
                                background: 'var(--secondary)', borderRadius: '12px',
                                borderLeft: `4px solid ${issue.severity === 'high' ? '#ef4444' : issue.severity === 'medium' ? '#f59e0b' : '#eab308'}`,
                                transition: 'transform 0.3s ease'
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                                    background: issue.severity === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <AlertCircle size={20} color={issue.severity === 'high' ? '#ef4444' : '#f59e0b'} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>
                                        {issue.title}
                                    </h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
                                        {issue.description}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                                            {issue.reportCount} Kullanıcı Raporu
                                        </span>
                                        <EngineVoteClient brandSlug={brandSlug} modelSlug={modelSlug} issueId={String(issue.id)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div></AracDNAShell>);
}

export const revalidate=1800;
export const dynamic='force-static';
export const dynamicParams=true;
export function generateStaticParams({params}:{params:{brand:string}}){
 return vehicleDNAData.filter(vehicle=>isVehicleIndexable(vehicle)&&createSlug(vehicle.brand)===params.brand).flatMap(vehicle=>
  (engineDNAData.find(record=>record.vehicleId===vehicle.id)?.engines||[]).flatMap(engine=>
   ([['genel-bakis',''],['kronik','-kronik-sorunlari'],['artilar','-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri']] as const)
    .filter(([section])=>isEngineRouteIndexable(vehicle,engine,section))
    .map(([,suffix])=>({brand:params.brand,model:createSlug(vehicle.model),engine:engine.slug+suffix}))));
}

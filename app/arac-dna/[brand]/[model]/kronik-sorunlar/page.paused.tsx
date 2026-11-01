import {getVehicleCommunity} from '@/lib/vehicle-community-server';
import { staticVehicleParams } from '@/lib/vehicle-index';
import AracDNAShell from '../AracDNAShell';
import { notFound } from 'next/navigation';
import { findVehicleByRoute } from '@/lib/aracDnaSeo';
import { getSeverityColor, getSeverityLabel } from '@/lib/vehicle-presentation';
import { isVehicleSectionIndexable } from '@/lib/indexability';
import { Wrench, AlertCircle } from 'lucide-react';
import ChronicInteractions, { ChronicReportButton, StaticIssueVote, StaticIssueCount } from './ChronicInteractionsClient';
export default async function ChronicIssuesPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
    const {brand: brandSlug, model: modelSlug} = await params;
    const vehicle = findVehicleByRoute(brandSlug, modelSlug);
    if (!vehicle) notFound();
    const community=await getVehicleCommunity(brandSlug,modelSlug);
    const mainModelName = vehicle.model.replace(/\s*\([^)]+\)/, '').trim();
    return <AracDNAShell vehicle={vehicle} section="kronik">

        <ChronicInteractions initialIssues={community.issues} initialVotes={community.votes} brandSlug={brandSlug} modelSlug={modelSlug} brandName={vehicle.brand} modelName={vehicle.model} staticIssueCount={vehicle.chronicIssues.length}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Wrench size={28} color="var(--primary)" />
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                            {vehicle.brand} {mainModelName} Kronik Sorunları
                        </h2>
                    </div>
                    <ChronicReportButton />
                </div>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
                    Bu bölümde araç kataloğundaki sorun açıklamaları ve kontrol noktaları yer alır. Kullanıcıların gönderdiği sorun bildirimleri ayrıca gösterilir; aracın bakım geçmişi ve bağımsız ekspertiz sonucu birlikte değerlendirilmelidir.
                </p>

                {vehicle.chronicIssues.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {vehicle.chronicIssues.map((issue) => {
                            const severityColor = getSeverityColor(issue.severity);
                            const severityLabel = getSeverityLabel(issue.severity);


                            return (
                                <div key={issue.id} style={{
                                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderLeft: `4px solid ${severityColor}`,
                                    borderRadius: '12px',
                                    padding: '24px',
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{ flex: 1, minWidth: '250px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
                                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                                {issue.title}
                                            </h3>
                                            <span style={{
                                                padding: '6px 16px',
                                                background: `${severityColor}15`,
                                                color: severityColor,
                                                fontSize: '13px',
                                                borderRadius: '8px',
                                                fontWeight: '700',
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <AlertCircle size={16} />
                                                {severityLabel} Risk
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
                                            {issue.description}
                                        </p>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--foreground)', background: 'var(--card-bg)', padding: '12px 16px', borderRadius: '8px' }}>
                                            <span style={{ fontSize: '18px' }}>📊</span>
                                            <span>Bugüne kadar</span>
                                            <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{<StaticIssueCount issueId={String(issue.id)} baseCount={issue.reportCount} />}</strong>
                                            <span>kullanıcı bu sorunu raporladı.</span>
                                        </div>
                                    </div>
                                    <StaticIssueVote issueId={String(issue.id)} severityColor={severityColor} />
                                </div>
                            );
                        })}
                    </div>
                ) : null}

        </ChronicInteractions>
    </AracDNAShell>;
}

export const revalidate = 1800;
export const dynamic = 'force-static';
export const dynamicParams = true;
export function generateStaticParams({params}:{params:{brand:string}}) {return staticVehicleParams('kronik-sorunlar',params.brand);}

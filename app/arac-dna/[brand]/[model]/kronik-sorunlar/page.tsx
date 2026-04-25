"use client";

import { useParams } from "next/navigation";
import { vehicleDNAData, getSeverityColor, getSeverityLabel } from "@/data/vehicle-dna";
import { Wrench, AlertCircle } from "lucide-react";
import Script from "next/script";

export default function ChronicIssuesPage() {
    const params = useParams();

    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";

    const vehicle = vehicleDNAData.find(v => {
        const vBrandSlug = v.brand.toLowerCase().replace(/\s+/g, '-');
        const vModelSlug = v.model.toLowerCase().replace(/\s+/g, '-');
        return vBrandSlug === brandSlug && vModelSlug === modelSlug;
    });

    if (!vehicle) return null;

    // Generate FAQ Schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": vehicle.chronicIssues.map(issue => ({
            "@type": "Question",
            "name": `${vehicle.brand} ${vehicle.model} modelinde ${issue.title} sorunu var mı?`,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": `${issue.description} Bu sorun Otosöz veritabanında ${issue.reportCount} kullanıcı tarafından raporlanmış olup, ${getSeverityLabel(issue.severity).toLowerCase()} düzeyde bir sorundur.`
            }
        }))
    };

    return (
        <div>
            {/* Inject FAQ Schema for Google Rich Snippets */}
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Wrench size={28} color="var(--primary)" />
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                        {vehicle.brand} {vehicle.model} Kronik Sorunları
                    </h2>
                </div>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
                    Bu sayfada, Otosöz kullanıcıları ve servis verileri tarafından toplanan, {vehicle.brand} {vehicle.model} modeline ait en yaygın kronik hastalıklar ve arızalar listelenmektedir. İkinci el alım öncesi bu listeyi dikkatle incelemenizi öneririz.
                </p>

                {vehicle.chronicIssues.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {vehicle.chronicIssues.map((issue) => {
                            const severityColor = getSeverityColor(issue.severity);
                            const severityLabel = getSeverityLabel(issue.severity);

                            return (
                                <div key={issue.id} style={{
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderLeft: `4px solid ${severityColor}`,
                                    borderRadius: '12px',
                                    padding: '24px'
                                }}>
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
                                        <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{issue.reportCount}</strong>
                                        <span>kullanıcı bu sorunu raporladı.</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', background: 'var(--secondary)', borderRadius: '12px', border: '1px dashed var(--card-border)' }}>
                        <span style={{ fontSize: '40px', marginBottom: '16px', display: 'block' }}>✅</span>
                        <h3 style={{ fontSize: '18px', color: 'var(--foreground)', marginBottom: '8px' }}>Bilinen Kronik Sorun Yok</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Bu araç için henüz kaydedilmiş yaygın bir kronik arıza verisi bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const fs = require('fs');

let f = fs.readFileSync('app/kutuphane/page.tsx', 'utf8');

const startMarker = '{/* Header */}';
const endMarker = '                        </div>\r\n                    )}';

const startIdx = f.lastIndexOf(startMarker);
if (startIdx === -1) { console.log('START MARKER NOT FOUND'); process.exit(1); }

const endIdx = f.indexOf(endMarker, startIdx);
if (endIdx === -1) { console.log('END MARKER NOT FOUND'); process.exit(1); }

const before = f.slice(0, startIdx);
const after = f.slice(endIdx + endMarker.length);

const nl = '\r\n';
const i = '                            '; // 28 spaces base indent

const newContent = [
`{/* Header */}`,
`${i}<div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>`,
`${i}    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>`,
`${i}        <div>`,
`${i}            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: '0 0 4px 0' }}>2026 Trafik Ceza\u0131lar\u0131</h2>`,
`${i}            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>G\u00fcncel ceza tutarlar\u0131, ehliyet yapt\u0131r\u0131mlar\u0131 ve ara\u00e7 men durumlar\u0131</p>`,
`${i}        </div>`,
`${i}        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.3px' }}>`,
`${i}            \u{1F512} Otosöz \u2014 Kopyalanamaz`,
`${i}        </span>`,
`${i}    </div>`,
`${i}</div>`,
``,
`${i}{/* Table sections */}`,
`${i}{[`,
`${i}    { id: 'hiz', kategori: 'HIZ (\u015eehir \u0130\u00e7i)', rows: [`,
`${i}        { ihlal: '6 \u2013 45 km/s aras\u0131 a\u015f\u0131m (Kademeli)', ceza: '2.000 \u2013 15.000 TL', ehliyet: '10 - 20 Ceza Puan\u0131', arac: 'Yok' },`,
`${i}        { ihlal: '46 \u2013 55 km/s aras\u0131 a\u015f\u0131m', ceza: '20.000 TL', ehliyet: '30 G\u00fcn El Koyma', arac: 'Yok' },`,
`${i}        { ihlal: '56 \u2013 65 km/s aras\u0131 a\u015f\u0131m', ceza: '25.000 TL', ehliyet: '60 G\u00fcn El Koyma', arac: 'Yok' },`,
`${i}        { ihlal: '66 km/s ve \u00fczeri a\u015f\u0131m', ceza: '30.000 TL', ehliyet: '90 G\u00fcn El Koyma', arac: 'Yok' },`,
`${i}    ]},`,
`${i}    { id: 'alkol', kategori: 'ALKOL & MADDE', rows: [`,
`${i}        { ihlal: 'Alkol Testini Reddetme', ceza: '150.000 TL', ehliyet: '5 Y\u0131l El Koyma', arac: 'Men Edilir' },`,
`${i}        { ihlal: 'Alkoll\u00fc Ara\u00e7 (1. Kez / 0.50 Promil \u00dcst\u00fc)', ceza: '25.000 TL', ehliyet: '6 Ay El Koyma', arac: 'Men (Yedek \u015fof\u00f6r yok)' },`,
`${i}        { ihlal: 'Alkoll\u00fc Ara\u00e7 (3. Kez ve Sonras\u0131)', ceza: '150.000 TL', ehliyet: '5 Y\u0131l El Koyma', arac: 'Kesin Men' },`,
`${i}        { ihlal: 'Uyu\u015fturucu Etkisinde Ara\u00e7', ceza: '150.000 TL', ehliyet: 'Ehliyet \u0130ptali', arac: 'Kesin Men' },`,
`${i}    ]},`,
`${i}    { id: 'zorbalik', kategori: 'TRAF\u0130K ZORBALI\u011eI', rows: [`,
`${i}        { ihlal: 'Sald\u0131rgan S\u00fcr\u00fc\u015f / Israrl\u0131 Takip', ceza: '180.000 TL', ehliyet: '60 G\u00fcn El Koyma', arac: '30-60 G\u00fcn Men' },`,
`${i}        { ihlal: 'Drift Yapmak', ceza: '140.000 TL', ehliyet: '60 G\u00fcn El Koyma', arac: '60 G\u00fcn Men' },`,
`${i}        { ihlal: 'Makas Atmak', ceza: '90.000 TL', ehliyet: '60 G\u00fcn El Koyma', arac: 'Yok' },`,
`${i}        { ihlal: '"Dur" \u0130htar\u0131na Uymay\u0131p Ka\u00e7ma', ceza: '200.000 TL', ehliyet: '60 G\u00fcn El Koyma', arac: '60 G\u00fcn Men' },`,
`${i}    ]},`,
`${i}    { id: 'plaka', kategori: 'PLAKA & BELGE', rows: [`,
`${i}        { ihlal: 'Sahte Plaka Kullanma', ceza: '140.000 TL', ehliyet: 'Adli Soru\u015fturma', arac: '30 G\u00fcn Men' },`,
`${i}        { ihlal: 'Plakas\u0131n\u0131 Okunmaz Hale Getirme', ceza: '140.000 TL', ehliyet: 'Tekerde 280.000 TL', arac: '30 G\u00fcn Men' },`,
`${i}        { ihlal: 'Ehliyetsiz Ara\u00e7 Kullanma', ceza: '40.000 TL', ehliyet: '\u2014', arac: 'Men (\u015eoftor yok)' },`,
`${i}        { ihlal: 'Ehliyeti Al\u0131nm\u0131\u015fken Ara\u00e7', ceza: '200.000 TL', ehliyet: '+40.000 TL (\u0130\u015fletene)', arac: 'Kesin Men' },`,
`${i}    ]},`,
`${i}    { id: 'guvenlik', kategori: 'G\u00dcVENL\u0130K', rows: [`,
`${i}        { ihlal: 'K\u0131rm\u0131z\u0131 I\u015f\u0131k (6. Tekrar)', ceza: '80.000 TL', ehliyet: 'Ehliyet \u0130ptali', arac: 'Yok' },`,
`${i}        { ihlal: 'Cep Telefonu (3. Tekrar+)', ceza: '20.000 TL', ehliyet: '30 G\u00fcn El Koyma', arac: 'Yok' },`,
`${i}        { ihlal: 'Emniyet \u015eeridi \u0130hlali', ceza: '11.631 TL', ehliyet: '20 Ceza Puan\u0131', arac: 'Yok' },`,
`${i}        { ihlal: 'Ters Y\u00f6nde Ara\u00e7 (Otoyol)', ceza: '90.000 TL', ehliyet: '60 G\u00fcn El Koyma', arac: 'Men Edilir' },`,
`${i}        { ihlal: 'Yayaya Yol Vermemek', ceza: '5.661 TL', ehliyet: '20 Ceza Puan\u0131', arac: 'Yok' },`,
`${i}        { ihlal: '\u00c7ocuk Koltuu Kullanmamak', ceza: '5.000 TL', ehliyet: '10 Ceza Puan\u0131', arac: 'Yok' },`,
`${i}    ]},`,
`${i}    { id: 'park', kategori: 'PARK & S\u0130GORTA', rows: [`,
`${i}        { ihlal: 'Trafik Sigortasz Gezmek', ceza: '1.246 TL', ehliyet: '\u2014', arac: 'An\u0131nda Men' },`,
`${i}        { ihlal: 'Muayenesiz Ara\u00e7la Trafi\u011fe \u00c7\u0131kma', ceza: '2.719 TL', ehliyet: '10 Ceza Puan\u0131', arac: '\u0130zin Belgesi' },`,
`${i}        { ihlal: 'Engelli Park Yerini \u0130\u015fgal', ceza: '2.492 TL', ehliyet: '15 Ceza Puan\u0131', arac: 'An\u0131nda \u00c7ekilir' },`,
`${i}        { ihlal: 'Hatal\u0131 Park Etmek', ceza: '1.246 TL', ehliyet: '10 Ceza Puan\u0131', arac: 'Engelse \u00c7ekilir' },`,
`${i}    ]},`,
`${i}    { id: 'ticari', kategori: 'T\u0130CAR\u0130', rows: [`,
`${i}        { ihlal: 'Takograf Veri M\u00fcdahalesi', ceza: '185.000 TL', ehliyet: '30-90 G\u00fcn El Koyma', arac: 'Yok' },`,
`${i}        { ihlal: 'Taksimetre Bulundurmamak', ceza: '46.000 TL', ehliyet: '\u2014', arac: 'Men Edilir' },`,
`${i}    ]},`,
`${i}].map((section, sIdx) => (`,
`${i}    <div key={section.id} style={{ marginBottom: '12px', position: 'relative', zIndex: 1, borderRadius: '12px', border: '1px solid var(--card-border)', overflow: 'hidden', background: 'var(--card-bg)' }}>`,
`${i}        <div style={{ padding: '9px 16px', background: 'var(--secondary)', borderBottom: '1px solid var(--card-border)' }}>`,
`${i}            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{section.kategori}</span>`,
`${i}        </div>`,
`${i}        <div style={{ overflowX: 'auto' }}>`,
`${i}            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>`,
`${i}                {sIdx === 0 && (`,
`${i}                    <thead>`,
`${i}                        <tr style={{ borderBottom: '1px solid var(--card-border)' }}>`,
`${i}                            {['İhlal Türü', 'Ceza Tutarı', 'Ehliyet / Puan', 'Araç Men'].map((h) => (`,
`${i}                                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>`,
`${i}                            ))}`,
`${i}                        </tr>`,
`${i}                    </thead>`,
`${i}                )}`,
`${i}                <tbody>`,
`${i}                    {section.rows.map((row, idx) => (`,
`${i}                        <tr key={idx}`,
`${i}                            style={{ borderBottom: idx < section.rows.length - 1 ? '1px solid var(--card-border)' : 'none', transition: 'background 0.1s' }}`,
`${i}                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}`,
`${i}                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}`,
`${i}                        >`,
`${i}                            <td style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--foreground)', fontWeight: '400', lineHeight: '1.4', width: '40%' }}>{row.ihlal}</td>`,
`${i}                            <td style={{ padding: '11px 16px', fontSize: '13px', color: 'var(--foreground)', fontWeight: '600', whiteSpace: 'nowrap' }}>{row.ceza}</td>`,
`${i}                            <td style={{ padding: '11px 16px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{row.ehliyet}</td>`,
`${i}                            <td style={{ padding: '11px 16px' }}>`,
`${i}                                <span style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: '600', background: row.arac === 'Yok' ? 'var(--secondary)' : 'rgba(59,130,246,0.1)', color: row.arac === 'Yok' ? 'var(--text-muted)' : '#60A5FA', border: '1px solid ' + (row.arac === 'Yok' ? 'var(--card-border)' : 'rgba(59,130,246,0.25)'), whiteSpace: 'nowrap' }}>{row.arac}</span>`,
`${i}                            </td>`,
`${i}                        </tr>`,
`${i}                    ))}`,
`${i}                </tbody>`,
`${i}            </table>`,
`${i}        </div>`,
`${i}    </div>`,
`${i}))}`,
``,
`${i}{/* Footer */}`,
`${i}<div style={{ marginTop: '8px', padding: '12px 16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>`,
`${i}    <span style={{ fontSize: '14px', opacity: 0.5 }}>\u2139\uFE0F</span>`,
`${i}    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>`,
`${i}        Bu tablo <strong style={{ color: 'var(--foreground)', fontWeight: '600' }}>Otosöz</strong> taraf\u0131ndan 2026 y\u0131l\u0131 g\u00fcncel mevzuat\u0131 kapsam\u0131nda haz\u0131rlanm\u0131\u015ft\u0131r. Kesin bilgi i\u00e7in yetkili makamlara ba\u015fvurunuz.`,
`${i}    </p>`,
`${i}</div>`,
`                        </div>`,
`                    )}`
].join(nl);

const result = before + newContent + after;
fs.writeFileSync('app/kutuphane/page.tsx', result, 'utf8');
console.log('DONE. Total lines: ' + result.split('\n').length);

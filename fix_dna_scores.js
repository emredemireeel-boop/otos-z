const fs = require('fs');

const filepath = 'c:\\\\Users\\\\GAMER\\\\Desktop\\\\otoasfalt-web\\\\app\\\\arac-dna\\\\page.tsx';

let content = fs.readFileSync(filepath, 'utf-8');

// Highest Rated Replacements
const old_high_title = `<Star fill="#22c55e" color="#22c55e" size={24} />
                                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>En Yüksek Puanlılar</h3>`;
const new_high_title = `<Star fill="#22c55e" color="#22c55e" size={16} />
                                <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: 'var(--foreground)' }}>En Yüksek Puanlılar</h3>`;
content = content.replace(old_high_title, new_high_title);

const old_high_list = `<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {topCars.map((item, idx) => {
                                    const slug = \`\${createSlug(item.vehicle.brand)}/\${createSlug(item.vehicle.model)}/\${item.engine.slug}\`;
                                    return (
                                        <Link key={idx} href={\`/arac-dna/\${slug}\`} style={{ textDecoration: 'none', color: 'var(--foreground)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--secondary)', borderRadius: '10px', transition: 'background 0.2s' }}
                                                 onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg, rgba(0,0,0,0.05))'}
                                                 onMouseLeave={(e) => e.currentTarget.style.background = 'var(--secondary)'}>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{item.vehicle.brand} {item.vehicle.model}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.engine.name}</div>
                                                </div>
                                                <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '8px', fontWeight: '800', fontSize: '14px' }}>
                                                    {item.engine.score}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>`;

const new_high_list = `<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {topCars.map((item, idx) => {
                                    const slug = \`\${createSlug(item.vehicle.brand)}/\${createSlug(item.vehicle.model)}/\${item.engine.slug}\`;
                                    return (
                                        <li key={idx}>
                                            <Link href={\`/arac-dna/\${slug}\`} style={{ textDecoration: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 6px', borderRadius: '6px', transition: 'background 0.2s' }}
                                                 onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.vehicle.brand} {item.vehicle.model}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.engine.name}</div>
                                                </div>
                                                <div style={{ color: '#22c55e', fontWeight: '700', fontSize: '13px', paddingLeft: '8px', flexShrink: 0 }}>
                                                    {item.engine.score}
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>`;
content = content.replace(old_high_list, new_high_list);

// Lowest Rated Replacements
const old_low_title = `<TrendingDown color="#ef4444" size={24} />
                                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>En Düşük Puanlılar</h3>`;
const new_low_title = `<TrendingDown color="#ef4444" size={16} />
                                <h3 style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: 'var(--foreground)' }}>En Düşük Puanlılar</h3>`;
content = content.replace(old_low_title, new_low_title);

const old_low_list = `<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {bottomCars.map((item, idx) => {
                                    const slug = \`\${createSlug(item.vehicle.brand)}/\${createSlug(item.vehicle.model)}/\${item.engine.slug}\`;
                                    return (
                                        <Link key={idx} href={\`/arac-dna/\${slug}\`} style={{ textDecoration: 'none', color: 'var(--foreground)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--secondary)', borderRadius: '10px', transition: 'background 0.2s' }}
                                                 onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg, rgba(0,0,0,0.05))'}
                                                 onMouseLeave={(e) => e.currentTarget.style.background = 'var(--secondary)'}>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{item.vehicle.brand} {item.vehicle.model}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.engine.name}</div>
                                                </div>
                                                <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '4px 8px', borderRadius: '8px', fontWeight: '800', fontSize: '14px' }}>
                                                    {item.engine.score}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>`;

const new_low_list = `<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {bottomCars.map((item, idx) => {
                                    const slug = \`\${createSlug(item.vehicle.brand)}/\${createSlug(item.vehicle.model)}/\${item.engine.slug}\`;
                                    return (
                                        <li key={idx}>
                                            <Link href={\`/arac-dna/\${slug}\`} style={{ textDecoration: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 6px', borderRadius: '6px', transition: 'background 0.2s' }}
                                                 onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                                 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.vehicle.brand} {item.vehicle.model}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.engine.name}</div>
                                                </div>
                                                <div style={{ color: '#ef4444', fontWeight: '700', fontSize: '13px', paddingLeft: '8px', flexShrink: 0 }}>
                                                    {item.engine.score}
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>`;
content = content.replace(old_low_list, new_low_list);

fs.writeFileSync(filepath, content, 'utf-8');
console.log('Fixed dna scores typography in arac-dna/page.tsx');

const fs = require('fs');

let c = fs.readFileSync('app/kutuphane/page.tsx', 'utf8');

// The marker strings to locate the broken block
const startMarker = '{/* Checklists */}';
const endMarker = '{/* Do & Don\\'t */}';

const startIndex = c.indexOf(startMarker);
const endIndex = c.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.log('Could not find markers');
    process.exit(1);
}

const validBlock = `{/* Checklists */}
                            {filteredInteresting.checklists.length > 0 && <SectionCarousel title="Kontrol Listeleri" icon={<CheckCircle color="#43E97B" />}>
                                {filteredInteresting.checklists.map((checklist) => {
                                    const isExpanded = expandedChecklists.has(checklist.id);
                                    return (
                                        <div key={checklist.id} style={{
                                            minWidth: '350px', flex: '0 0 auto', scrollSnapAlign: 'start',
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '14px',
                                            overflow: 'hidden'
                                        }}>
                                                <button
                                                    onClick={() => toggleChecklist(checklist.id)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '20px 24px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        cursor: 'pointer',
                                                        color: 'var(--foreground)'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '10px',
                                                            background: \`linear-gradient(135deg, \${checklist.gradient[0]}, \${checklist.gradient[1]})\`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <CheckCircle size={20} color="white" />
                                                        </div>
                                                        <div style={{ textAlign: 'left' }}>
                                                            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{checklist.title}</h4>
                                                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{checklist.items.length} madde</p>
                                                        </div>
                                                    </div>
                                                    {isExpanded ? <ChevronUp style={{ width: '20px', height: '20px' }} /> : <ChevronDown style={{ width: '20px', height: '20px' }} />}
                                                </button>
                                                {isExpanded && (
                                                    <div style={{ padding: '0 24px 24px 24px' }}>
                                                        <div style={{ height: '1px', background: 'var(--card-border)', marginBottom: '16px' }} />
                                                        <div style={{ display: 'grid', gap: '8px' }}>
                                                            {checklist.items.map((item, idx) => (
                                                                <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                                                                    <CheckCircle style={{ width: '16px', height: '16px', color: '#43E97B', flexShrink: 0, marginTop: '2px' }} />
                                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </SectionCarousel>}

                            `;

c = c.substring(0, startIndex) + validBlock + c.substring(endIndex);

fs.writeFileSync('app/kutuphane/page.tsx', c, 'utf8');
console.log('Restored Checklists block!');

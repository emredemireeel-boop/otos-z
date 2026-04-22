const fs = require('fs');
const path = require('path');

const R = '\uFFFD';

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix ?🟢 mojibake globally
    content = content.replace(new RegExp(R + '🟢', 'g'), '🟢');
    content = content.replace(new RegExp(R + '\\s*🟢', 'g'), '🟢');
    content = content.replace(new RegExp(R + '🔴', 'g'), '🔴');
    content = content.replace(new RegExp(R + '⚠️', 'g'), '⚠️');
    content = content.replace(new RegExp(R + '👤', 'g'), '👤');
    content = content.replace(new RegExp(R + '🚩', 'g'), '🚩');
    
    // Some specific replacements just in case
    content = content.replace('Otosöz Admin ' + R, 'Otosöz Admin ');

    fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Fix Admin Sidebar
fixFile('components/admin/AdminSidebar.tsx');

// 2. Fix Yayin Page
fixFile('app/admin/yayin/page.tsx');

// 3. Fix Reklamlar Page
fixFile('app/admin/reklamlar/page.tsx');

// 4. Fix Moderatorler Page
fixFile('app/admin/moderatorler/page.tsx');

// 5. Fix Kutuphane JSX syntax error
let kPath = 'app/kutuphane/page.tsx';
let kContent = fs.readFileSync(kPath, 'utf8');
// Fix deleted lines! My last replace_file_content deleted from `width: '40px'` to `</button>`.
// Oh wait, my attempt to `replace_file_content` resulted in:
/*
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                    </div>
                                                    {isExpanded ? <ChevronUp style={{ width: '20px', height: '20px' }} /> : <ChevronDown style={{ width: '20px', height: '20px' }} />}
                                                </button>
*/
// Let's replace that exact broken block with the correct block
const brokenBlock = `                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                    </div>
                                                    {isExpanded ? <ChevronUp style={{ width: '20px', height: '20px' }} /> : <ChevronDown style={{ width: '20px', height: '20px' }} />}
                                                </button>`;

const fixedBlock = `                                                        <div style={{
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
                                                </button>`;

kContent = kContent.replace(brokenBlock, fixedBlock);

fs.writeFileSync(kPath, kContent, 'utf8');

console.log('Fixed everything');

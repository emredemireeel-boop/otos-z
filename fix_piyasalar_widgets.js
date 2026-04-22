const fs = require('fs');

const path = 'app/piyasalar/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
content = content.replace(/import \{ Search, Trophy, BarChart3, Car, Target, TrendingUp \} from "lucide-react";/, 'import { Search, Trophy, BarChart3, Car, Target, TrendingUp, Sparkles } from "lucide-react";\nimport Link from "next/link";\nimport { sampleListings, formatListingPrice } from "@/data/listings";\nimport { useEffect } from "react";');

// 2. Add state and effect
const stateToAdd = `    const [randomListings, setRandomListings] = useState<any[]>([]);

    useEffect(() => {
        const shuffled = [...sampleListings].sort(() => 0.5 - Math.random());
        setRandomListings(shuffled.slice(0, 3));
    }, []);`;

content = content.replace(/const \[searchQuery, setSearchQuery\] = useState\(""\);/, `const [searchQuery, setSearchQuery] = useState("");\n\n${stateToAdd}`);

// 3. Define the widgets block
const widgetsBlock = `                                        {/* Vitrin Widget */}
                                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--card-shadow)', marginTop: '24px' }}>
                                            <div style={{ padding: '16px', borderBottom: '1px solid var(--card-border)', background: 'rgba(255,107,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Car size={18} color="var(--primary)" />
                                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)' }}>Pazar Vitrini</h3>
                                            </div>
                                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {randomListings.map(listing => (
                                                    <Link href="/pazar" key={listing.id} style={{ textDecoration: 'none' }}>
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }}
                                                             onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                                             onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>{listing.brand} {listing.model}</div>
                                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{listing.year} • {listing.km.toLocaleString()} km</div>
                                                            </div>
                                                            <div style={{ fontSize: '14px', fontWeight: '800', color: '#10B981' }}>
                                                                {formatListingPrice(listing.price)}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            <Link href="/pazar" style={{ display: 'block', padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: 'var(--primary)', borderTop: '1px solid var(--card-border)', textDecoration: 'none', background: 'var(--secondary)' }}>
                                                Tüm İlanları Gör
                                            </Link>
                                        </div>
                                        
                                        {/* Reklam Alani */}
                                        <div style={{ 
                                            background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px', 
                                            height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: '24px', textAlign: 'center', marginTop: '24px'
                                        }}
                                             onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                             onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                                <Sparkles size={24} color="currentColor" />
                                            </div>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Buraya Reklam Ver</h3>
                                            <p style={{ fontSize: '13px', lineHeight: '1.5' }}>Günde 10.000+ otomotiv tutkununa markanızı ulaştırın.</p>
                                        </div>`;

// Insert the block below Market Leaders
// Locate the closing div of "Pazar Liderleri" which is around line 208
const marketLeadersCloseStr = `                                            ))}
                                        </div>
                                    </div>`;

content = content.replace(marketLeadersCloseStr, marketLeadersCloseStr + '\n' + widgetsBlock);

// Insert the block below Trending Models
// Locate the closing div of "En Çok Talep Görenler" which is around line 256
const trendingModelsCloseStr = `                                                </div>
                                            ))}
                                        </div>
                                    </div>`;

// Notice there might be multiple matches of `</div>` and similar, let's use a very specific string:
const trendingModelsCloseStrSpecific = `                                        </div>
                                    </div>
                                </div>
                            </aside>`;

// This is safer. The structure is:
// <div style={{ background: 'var(--card-bg)', ... }}> ... </div>
// So if we find the end of the `background: 'var(--card-bg)'` div for Trending Models.

let modifiedContent = content;

// Replace for Market Leaders (Brands Tab)
const brandsSidebarEndRegex = /Pazar Liderleri.*?\}\}\)\}\s*<\/div>\s*<\/div>/s;
const matchBrands = content.match(brandsSidebarEndRegex);
if(matchBrands) {
    modifiedContent = modifiedContent.replace(matchBrands[0], matchBrands[0] + '\n' + widgetsBlock);
}

// Replace for Trending Models (Models Tab)
const modelsSidebarEndRegex = /En Çok Talep Görenler.*?\}\}\)\}\s*<\/div>\s*<\/div>/s;
const matchModels = modifiedContent.match(modelsSidebarEndRegex);
if(matchModels) {
    modifiedContent = modifiedContent.replace(matchModels[0], matchModels[0] + '\n' + widgetsBlock);
}

fs.writeFileSync(path, modifiedContent, 'utf8');
console.log('Fixed piyasalar page widgets');

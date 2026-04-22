const fs = require('fs');

let path = 'app/uzmana-sor/page.tsx';
let txt = fs.readFileSync(path, 'utf8');

const regex = /\/\/ Her kategoriye \?zel renk[\s\S]*?};/;

const newColors = `// Her kategoriye özel profesyonel (minimalist) renk
const CATEGORY_COLORS: Record<string, { gradient: string; bg: string; text: string; border: string }> = {
    "Tümü":       { gradient: "linear-gradient(135deg, var(--primary), #ff8533)", bg: "rgba(255,255,255,0.03)", text: "var(--text-muted)", border: "rgba(255,255,255,0.08)" },
    "Motor":       { gradient: "linear-gradient(135deg, var(--primary), #ff8533)", bg: "rgba(255,255,255,0.03)", text: "var(--text-muted)", border: "rgba(255,255,255,0.08)" },
    "Şanzıman":    { gradient: "linear-gradient(135deg, var(--primary), #ff8533)", bg: "rgba(255,255,255,0.03)", text: "var(--text-muted)", border: "rgba(255,255,255,0.08)" },
    "Lastik":      { gradient: "linear-gradient(135deg, var(--primary), #ff8533)", bg: "rgba(255,255,255,0.03)", text: "var(--text-muted)", border: "rgba(255,255,255,0.08)" },
    "Bakım":       { gradient: "linear-gradient(135deg, var(--primary), #ff8533)", bg: "rgba(255,255,255,0.03)", text: "var(--text-muted)", border: "rgba(255,255,255,0.08)" },
    "Elektrik":    { gradient: "linear-gradient(135deg, var(--primary), #ff8533)", bg: "rgba(255,255,255,0.03)", text: "var(--text-muted)", border: "rgba(255,255,255,0.08)" },
    "Fren":        { gradient: "linear-gradient(135deg, var(--primary), #ff8533)", bg: "rgba(255,255,255,0.03)", text: "var(--text-muted)", border: "rgba(255,255,255,0.08)" },
    "Süspansiyon": { gradient: "linear-gradient(135deg, var(--primary), #ff8533)", bg: "rgba(255,255,255,0.03)", text: "var(--text-muted)", border: "rgba(255,255,255,0.08)" },
};`;

txt = txt.replace(regex, newColors);
fs.writeFileSync(path, txt, 'utf8');
console.log("Replaced CATEGORY_COLORS array with clean palette.");

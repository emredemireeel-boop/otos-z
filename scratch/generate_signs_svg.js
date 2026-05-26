const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/signs');

// --- SVG TEMPLATES ---

function warningTriangle(innerSvg, opts = {}) {
    // Red-bordered white triangle (pointing up) 
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <polygon points="100,12 188,180 12,180" fill="white" stroke="#CC0000" stroke-width="10" stroke-linejoin="round"/>
  <g transform="translate(100,115)">${innerSvg}</g>
</svg>`;
}

function prohibitoryCircle(innerSvg, opts = {}) {
    // Red-bordered white circle (prohibition sign)
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="90" fill="white" stroke="#CC0000" stroke-width="10"/>
  ${opts.slash !== false ? '<line x1="40" y1="40" x2="160" y2="160" stroke="#CC0000" stroke-width="8" stroke-linecap="round"/>' : ''}
  <g transform="translate(100,100)">${innerSvg}</g>
</svg>`;
}

function mandatoryCircle(innerSvg) {
    // Blue circle with white icon (mandatory/direction signs)
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="90" fill="#2563EB" stroke="#1e40af" stroke-width="6"/>
  <g transform="translate(100,100)">${innerSvg}</g>
</svg>`;
}

function infoRect(innerSvg) {
    // Blue rectangle
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect x="10" y="10" width="180" height="180" rx="12" fill="#2563EB" stroke="#1e40af" stroke-width="6"/>
  <g transform="translate(100,100)">${innerSvg}</g>
</svg>`;
}

function yieldTriangle(innerSvg) {
    // Red-bordered inverted triangle
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <polygon points="100,185 12,20 188,20" fill="white" stroke="#CC0000" stroke-width="10" stroke-linejoin="round"/>
  <g transform="translate(100,90)">${innerSvg}</g>
</svg>`;
}

function stopOctagon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <polygon points="60,10 140,10 190,60 190,140 140,190 60,190 10,140 10,60" fill="#CC0000" stroke="#8B0000" stroke-width="6" stroke-linejoin="round"/>
  <polygon points="65,18 135,18 182,65 182,135 135,182 65,182 18,135 18,65" fill="none" stroke="white" stroke-width="3"/>
  <text x="100" y="112" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="52" fill="white">DUR</text>
</svg>`;
}

function endRestrictionCircle(innerSvg) {
    // White circle with gray border and diagonal gray lines (end of restriction)
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="90" fill="white" stroke="#666" stroke-width="6"/>
  <line x1="35" y1="35" x2="165" y2="165" stroke="#666" stroke-width="5"/>
  <line x1="45" y1="30" x2="170" y2="155" stroke="#666" stroke-width="3"/>
  <line x1="30" y1="45" x2="155" y2="170" stroke="#666" stroke-width="3"/>
  <g transform="translate(100,100)">${innerSvg}</g>
</svg>`;
}

function parkSign(innerSvg, opts = {}) {
    if (opts.prohibited) {
        // Red circle with blue background and cross
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="90" fill="#2563EB" stroke="#CC0000" stroke-width="10"/>
  ${opts.doubleCross ? 
    '<line x1="40" y1="40" x2="160" y2="160" stroke="#CC0000" stroke-width="8"/><line x1="160" y1="40" x2="40" y2="160" stroke="#CC0000" stroke-width="8"/>' :
    '<line x1="40" y1="40" x2="160" y2="160" stroke="#CC0000" stroke-width="8"/>'}
  <g transform="translate(100,100)">${innerSvg}</g>
</svg>`;
    }
    // Blue square with white P
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect x="10" y="10" width="180" height="180" rx="12" fill="#2563EB" stroke="#1e40af" stroke-width="6"/>
  <g transform="translate(100,100)">${innerSvg}</g>
</svg>`;
}


// ---------- SIGN DEFINITIONS ----------
const signs = {
    // ===== TEHLIKE UYARI (WARNING) SIGNS =====
    'T-1': warningTriangle(`
        <path d="M-25,-10 Q-25,-25 -10,-25 L-10,0 Q-10,15 -25,25" fill="none" stroke="#222" stroke-width="6" stroke-linecap="round"/>
    `),
    'T-2': warningTriangle(`
        <path d="M25,-10 Q25,-25 10,-25 L10,0 Q10,15 25,25" fill="none" stroke="#222" stroke-width="6" stroke-linecap="round"/>
    `),
    'T-3': warningTriangle(`
        <path d="M-30,10 Q-15,-15 0,10 Q15,-15 30,10" fill="none" stroke="#222" stroke-width="6" stroke-linecap="round"/>
    `),
    'T-4': warningTriangle(`
        <path d="M-30,10 Q-15,-15 0,10 Q15,-15 30,10" fill="none" stroke="#222" stroke-width="6" stroke-linecap="round"/>
    `),
    'T-5': warningTriangle(`
        <line x1="-25" y1="-20" x2="-25" y2="20" stroke="#222" stroke-width="5"/>
        <line x1="-25" y1="-20" x2="25" y2="20" stroke="#222" stroke-width="5"/>
        <line x1="-25" y1="20" x2="25" y2="20" stroke="#222" stroke-width="5"/>
        <text x="0" y="10" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="18" fill="#CC0000">10%</text>
    `),
    'T-6': warningTriangle(`
        <line x1="25" y1="-20" x2="25" y2="20" stroke="#222" stroke-width="5"/>
        <line x1="-25" y1="20" x2="25" y2="-20" stroke="#222" stroke-width="5"/>
        <line x1="-25" y1="20" x2="25" y2="20" stroke="#222" stroke-width="5"/>
        <text x="0" y="10" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="18" fill="#CC0000">10%</text>
    `),
    'T-7': warningTriangle(`
        <line x1="-25" y1="-10" x2="-5" y2="-10" stroke="#222" stroke-width="5"/>
        <line x1="5" y1="-10" x2="25" y2="-10" stroke="#222" stroke-width="5"/>
        <line x1="-20" y1="10" x2="20" y2="10" stroke="#222" stroke-width="5"/>
        <line x1="-5" y1="-10" x2="-20" y2="10" stroke="#222" stroke-width="4"/>
        <line x1="5" y1="-10" x2="20" y2="10" stroke="#222" stroke-width="4"/>
    `),
    'T-8': warningTriangle(`
        <line x1="-20" y1="-10" x2="5" y2="-10" stroke="#222" stroke-width="5"/>
        <line x1="-20" y1="10" x2="20" y2="10" stroke="#222" stroke-width="5"/>
        <line x1="5" y1="-10" x2="20" y2="10" stroke="#222" stroke-width="4"/>
        <line x1="-20" y1="-10" x2="-20" y2="10" stroke="#222" stroke-width="4"/>
    `),
    'T-11': warningTriangle(`
        <path d="M-25,15 Q-12,-5 0,15 Q12,-5 25,15" fill="none" stroke="#222" stroke-width="5" stroke-linecap="round"/>
    `),
    'T-12': warningTriangle(`
        <path d="M-15,20 Q-25,-5 -5,-15 Q15,-25 15,0 Q15,10 5,20" fill="none" stroke="#222" stroke-width="5" stroke-linecap="round"/>
        <circle cx="-15" cy="20" r="3" fill="#222"/>
    `),
    'T-13': warningTriangle(`
        <circle cx="-10" cy="-5" r="4" fill="#222"/>
        <circle cx="10" cy="5" r="3" fill="#222"/>
        <circle cx="0" cy="10" r="5" fill="#222"/>
        <circle cx="15" cy="-10" r="3" fill="#222"/>
        <circle cx="-5" cy="15" r="3" fill="#222"/>
    `),
    'T-14': warningTriangle(`
        <path d="M-20,20 L-20,-10 L0,-20 L20,-10 L20,20" fill="none" stroke="#222" stroke-width="4"/>
        <circle cx="-5" cy="5" r="4" fill="#888"/>
        <circle cx="8" cy="10" r="5" fill="#888"/>
        <circle cx="0" cy="18" r="3" fill="#888"/>
    `),
    'T-15': warningTriangle(`
        <line x1="-15" y1="20" x2="-15" y2="-15" stroke="#222" stroke-width="4"/>
        <line x1="-15" y1="-15" x2="-5" y2="-25" stroke="#222" stroke-width="4"/>
        <circle cx="-12" cy="-25" r="6" fill="none" stroke="#222" stroke-width="3"/>
        <line x1="-20" y1="-5" x2="-10" y2="-5" stroke="#222" stroke-width="3"/>
        <line x1="-18" y1="5" x2="-12" y2="5" stroke="#222" stroke-width="3"/>
        <line x1="-25" y1="20" x2="25" y2="20" stroke="#222" stroke-width="4"/>
        <line x1="-5" y1="20" x2="5" y2="15" stroke="#FFF" stroke-width="3"/>
        <line x1="5" y1="15" x2="15" y2="20" stroke="#FFF" stroke-width="3"/>
    `),
    'T-16': warningTriangle(`
        <line x1="-10" y1="20" x2="-10" y2="-10" stroke="#222" stroke-width="3"/>
        <line x1="-10" y1="-10" x2="-2" y2="-20" stroke="#222" stroke-width="3"/>
        <circle cx="-6" cy="-22" r="5" fill="none" stroke="#222" stroke-width="2.5"/>
        <line x1="-15" y1="0" x2="-5" y2="0" stroke="#222" stroke-width="2.5"/>
        <line x1="-15" y1="20" x2="15" y2="20" stroke="#222" stroke-width="3"/>
        <rect x="7" y="-8" width="16" height="8" fill="#222" rx="1"/>
        <text x="15" y="-2" text-anchor="middle" font-family="Arial" font-size="7" fill="white" font-weight="bold">OKUL</text>
    `),
    'T-18': warningTriangle(`
        <path d="M-5,20 L-5,0 Q-5,-15 5,-15 Q15,-15 15,-5 L15,5" fill="none" stroke="#222" stroke-width="4"/>
        <line x1="15" y1="5" x2="15" y2="20" stroke="#222" stroke-width="4"/>
        <line x1="0" y1="5" x2="-10" y2="15" stroke="#222" stroke-width="3"/>
        <line x1="10" y1="10" x2="20" y2="15" stroke="#222" stroke-width="3"/>
    `),
    'T-19': warningTriangle(`
        <path d="M0,-25 L5,-15 L15,-15 L7,-8 L10,2 L0,-4 L-10,2 L-7,-8 L-15,-15 L-5,-15 Z" fill="#222" transform="translate(0,10) scale(1.2)"/>
    `),
    'T-20': warningTriangle(`
        <line x1="-5" y1="20" x2="-5" y2="-5" stroke="#222" stroke-width="4"/>
        <circle cx="-5" cy="-12" r="7" fill="none" stroke="#222" stroke-width="3"/>
        <line x1="-12" y1="5" x2="2" y2="5" stroke="#222" stroke-width="3"/>
        <rect x="5" y="5" width="20" height="15" fill="none" stroke="#222" stroke-width="3" rx="1"/>
        <line x1="10" y1="8" x2="10" y2="17" stroke="#222" stroke-width="2"/>
        <line x1="15" y1="8" x2="15" y2="17" stroke="#222" stroke-width="2"/>
        <line x1="20" y1="8" x2="20" y2="17" stroke="#222" stroke-width="2"/>
    `),
    'T-21': warningTriangle(`
        <rect x="-10" y="-30" width="20" height="55" fill="#333" rx="3"/>
        <circle cx="0" cy="-20" r="6" fill="#CC0000"/>
        <circle cx="0" cy="-3" r="6" fill="#EAB308"/>
        <circle cx="0" cy="14" r="6" fill="#16A34A"/>
    `),
    'T-23': warningTriangle(`
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#222" stroke-width="5"/>
        <polygon points="-8,-20 0,-28 8,-20" fill="#CC0000"/>
        <polygon points="-8,20 0,28 8,20" fill="#CC0000"/>
    `),
    'T-24': warningTriangle(`
        <text x="0" y="8" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="42" fill="#222">!</text>
    `),
    'T-26': warningTriangle(`
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#222" stroke-width="4"/>
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#222" stroke-width="4"/>
    `),
    'T-27': warningTriangle(`
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#222" stroke-width="5"/>
        <line x1="-15" y1="0" x2="0" y2="0" stroke="#222" stroke-width="3"/>
        <line x1="0" y1="0" x2="15" y2="0" stroke="#222" stroke-width="3"/>
    `),
    'T-28': warningTriangle(`
        <circle cx="0" cy="0" r="18" fill="none" stroke="#222" stroke-width="4"/>
        <polygon points="-3,-18 3,-18 3,-25 10,-15 3,-15 3,-12" fill="#222"/>
    `),
    'T-30': warningTriangle(`
        <rect x="-20" y="-5" width="40" height="10" fill="#222"/>
        <line x1="-15" y1="15" x2="15" y2="15" stroke="#222" stroke-width="4"/>
        <line x1="0" y1="10" x2="0" y2="20" stroke="#222" stroke-width="3"/>
        <line x1="-20" y1="-15" x2="20" y2="-15" stroke="#222" stroke-width="3"/>
    `),
    'T-31': warningTriangle(`
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#222" stroke-width="5"/>
        <line x1="-12" y1="-12" x2="12" y2="-12" stroke="#222" stroke-width="5" stroke-dasharray="6,6"/>
        <text x="0" y="18" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14" fill="#CC0000">✕</text>
    `),

    // ===== TRAFIK TANZIM (REGULATORY) SIGNS =====
    'TT-1': yieldTriangle(`
        <text x="0" y="12" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="22" fill="#CC0000">YOL VER</text>
    `),
    'TT-2': stopOctagon(),
    'TT-3': prohibitoryCircle(`
        <polygon points="-8,-15 8,-15 8,15 -8,15" fill="#CC0000"/>
        <polygon points="-8,-15 -20,0 -8,15" fill="#CC0000"/>
        <polygon points="8,-15 20,0 8,15" fill="none" stroke="#222" stroke-width="2"/>
        <polygon points="15,0 25,5 25,-5" fill="#222"/>
    `, { slash: false }),
    'TT-4': prohibitoryCircle(`
        <rect x="-20" y="-8" width="40" height="16" fill="#CC0000" rx="2"/>
    `, { slash: false }),
    'TT-5': prohibitoryCircle(`
        <rect x="-20" y="-12" width="40" height="24" fill="#CC0000" rx="2"/>
    `, { slash: false }),
    'TT-6': prohibitoryCircle(`
        <rect x="-18" y="-6" width="36" height="12" fill="#222" rx="2"/>
        <circle cx="-8" cy="8" r="5" fill="none" stroke="#222" stroke-width="2"/>
        <circle cx="12" cy="8" r="5" fill="none" stroke="#222" stroke-width="2"/>
    `),
    'TT-8': prohibitoryCircle(`
        <circle cx="0" cy="-10" r="5" fill="#222"/>
        <line x1="0" y1="-5" x2="0" y2="10" stroke="#222" stroke-width="3"/>
        <line x1="0" y1="10" x2="-8" y2="22" stroke="#222" stroke-width="3"/>
        <line x1="0" y1="10" x2="8" y2="22" stroke="#222" stroke-width="3"/>
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#222" stroke-width="3"/>
        <circle cx="-10" cy="22" r="8" fill="none" stroke="#222" stroke-width="2"/>
        <circle cx="10" cy="22" r="8" fill="none" stroke="#222" stroke-width="2"/>
    `),
    'TT-9': prohibitoryCircle(`
        <circle cx="0" cy="5" r="15" fill="none" stroke="#222" stroke-width="3"/>
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#222" stroke-width="3"/>
        <line x1="-8" y1="-5" x2="8" y2="-5" stroke="#222" stroke-width="3"/>
    `),
    'TT-16': prohibitoryCircle(`
        <circle cx="0" cy="-18" r="7" fill="#222"/>
        <line x1="0" y1="-11" x2="0" y2="5" stroke="#222" stroke-width="4"/>
        <line x1="0" y1="5" x2="-10" y2="22" stroke="#222" stroke-width="4"/>
        <line x1="0" y1="5" x2="10" y2="22" stroke="#222" stroke-width="4"/>
        <line x1="-12" y1="-3" x2="12" y2="-3" stroke="#222" stroke-width="3"/>
    `),
    'TT-21': prohibitoryCircle(`
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#222" stroke-width="3"/>
        <polygon points="-3,-30 3,-30 3,30 -3,30" fill="none" stroke="#222" stroke-width="1"/>
        <text x="15" y="5" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="18" fill="#222">m</text>
    `, { slash: false }),
    'TT-22': prohibitoryCircle(`
        <line x1="-25" y1="-25" x2="25" y2="-25" stroke="#222" stroke-width="4"/>
        <line x1="-25" y1="-25" x2="-25" y2="25" stroke="#222" stroke-width="3"/>
        <line x1="25" y1="-25" x2="25" y2="25" stroke="#222" stroke-width="3"/>
        <text x="0" y="5" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="18" fill="#222">m</text>
    `, { slash: false }),
    'TT-25': prohibitoryCircle(`
        <rect x="-25" y="-15" width="22" height="30" fill="#CC0000" rx="3"/>
        <rect x="3" y="-15" width="22" height="30" fill="#222" rx="3"/>
    `, { slash: false }),
    'TT-26': prohibitoryCircle(`
        <rect x="-28" y="-15" width="25" height="30" fill="#CC0000" rx="3"/>
        <rect x="3" y="-18" width="25" height="36" fill="#222" rx="3"/>
    `, { slash: false }),
    'TT-27': prohibitoryCircle(`
        <text x="0" y="15" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="50" fill="#222">50</text>
    `, { slash: false }),
    'TT-28': prohibitoryCircle(`
        <path d="M-15,0 Q-15,-20 0,-20 Q15,-20 15,0 Q15,15 5,20" fill="none" stroke="#222" stroke-width="4"/>
        <line x1="-5" y1="20" x2="15" y2="20" stroke="#222" stroke-width="3"/>
    `),
    'TT-30': endRestrictionCircle(`
        <rect x="-25" y="-12" width="22" height="24" fill="#888" rx="2" opacity="0.4"/>
        <rect x="3" y="-12" width="22" height="24" fill="#444" rx="2" opacity="0.4"/>
    `),
    'TT-31': endRestrictionCircle(`
        <text x="0" y="12" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="40" fill="#888" opacity="0.5">50</text>
    `),
    'TT-32': endRestrictionCircle(``),
    'TT-34': mandatoryCircle(`
        <polygon points="10,-30 30,0 10,30 10,10 -30,10 -30,-10 10,-10" fill="white"/>
    `),
    'TT-35': mandatoryCircle(`
        <polygon points="-10,-30 -30,0 -10,30 -10,10 30,10 30,-10 -10,-10" fill="white"/>
    `),
    'TT-36': mandatoryCircle(`
        <polygon points="-10,10 10,10 10,30 0,30 0,30 -10,30 -10,10" fill="white"/>
        <polygon points="-10,-30 10,-30 10,10 -10,10" fill="white"/>
        <polygon points="-8,-30 8,-30 0,-42" fill="white"/>
    `),
    'TT-39': mandatoryCircle(`
        <circle cx="0" cy="0" r="25" fill="none" stroke="white" stroke-width="5"/>
        <polygon points="15,-22 22,-12 8,-12" fill="white"/>
    `),

    // ===== BİLGİ (INFO) SIGNS =====
    'B-1': infoRect(`
        <line x1="-10" y1="30" x2="-10" y2="-10" stroke="white" stroke-width="4"/>
        <circle cx="-10" cy="-18" r="8" fill="none" stroke="white" stroke-width="3"/>
        <line x1="-18" y1="5" x2="-2" y2="5" stroke="white" stroke-width="3"/>
        <line x1="-25" y1="30" x2="25" y2="30" stroke="white" stroke-width="4"/>
        <polygon points="-5,30 5,25 15,30" fill="white" opacity="0.5"/>
    `),
    'B-2': infoRect(`
        <line x1="-10" y1="30" x2="-10" y2="-5" stroke="white" stroke-width="3"/>
        <circle cx="-10" cy="-13" r="6" fill="none" stroke="white" stroke-width="2.5"/>
        <line x1="-15" y1="5" x2="-5" y2="5" stroke="white" stroke-width="2.5"/>
        <line x1="-25" y1="30" x2="25" y2="30" stroke="white" stroke-width="3"/>
        <rect x="8" y="-5" width="18" height="10" fill="none" stroke="white" stroke-width="2" rx="1"/>
        <text x="17" y="3" text-anchor="middle" font-family="Arial" font-size="7" fill="white" font-weight="bold">OKUL</text>
    `),
    'B-3': infoRect(`
        <text x="0" y="5" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="55" fill="white">H</text>
    `),
    'B-4': infoRect(`
        <polygon points="0,-35 25,0 0,35 -25,0" fill="none" stroke="white" stroke-width="0"/>
        <polygon points="0,-40 0,40" fill="none" stroke="white" stroke-width="5"/>
        <polygon points="-8,-40 8,-40 0,-50" fill="white"/>
    `),
    'B-5': infoRect(`
        <rect x="-35" y="-30" width="70" height="60" fill="#16A34A" rx="5"/>
        <line x1="-20" y1="0" x2="20" y2="0" stroke="white" stroke-width="4"/>
        <line x1="-20" y1="-15" x2="-20" y2="15" stroke="white" stroke-width="3"/>
        <line x1="20" y1="-15" x2="20" y2="15" stroke="white" stroke-width="3"/>
        <path d="M-10,-10 Q0,-20 10,-10" fill="none" stroke="white" stroke-width="3"/>
        <text x="0" y="22" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14" fill="white">OTOYOL</text>
    `),
    'B-6': (() => {
        // Yellow diamond
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <polygon points="100,15 185,100 100,185 15,100" fill="#EAB308" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
  <polygon points="100,40 160,100 100,160 40,100" fill="white" stroke="none"/>
  <polygon points="100,40 160,100 100,160 40,100" fill="#EAB308" stroke="none" opacity="0.3"/>
</svg>`;
    })(),
    'B-7': (() => {
        // Yellow diamond with gray lines
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <polygon points="100,15 185,100 100,185 15,100" fill="#EAB308" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
  <polygon points="100,40 160,100 100,160 40,100" fill="white" stroke="none"/>
  <polygon points="100,40 160,100 100,160 40,100" fill="#EAB308" stroke="none" opacity="0.3"/>
  <line x1="55" y1="55" x2="145" y2="145" stroke="#333" stroke-width="6"/>
  <line x1="55" y1="145" x2="145" y2="55" stroke="#333" stroke-width="6"/>
</svg>`;
    })(),

    // ===== DURAKLAMA / PARK SIGNS =====
    'P-1': parkSign(``, { prohibited: true, doubleCross: true }),
    'P-2': parkSign(``, { prohibited: true, doubleCross: false }),
    'P-3': parkSign(`
        <text x="0" y="22" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="80" fill="white">P</text>
    `),
    'P-4': (() => {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect x="10" y="10" width="180" height="180" rx="12" fill="#2563EB" stroke="#1e40af" stroke-width="6"/>
  <text x="100" y="90" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="60" fill="white">P</text>
  <g transform="translate(100,145)">
    <circle cx="0" cy="0" r="20" fill="white"/>
    <circle cx="0" cy="-8" r="5" fill="#2563EB"/>
    <line x1="0" y1="-3" x2="0" y2="5" stroke="#2563EB" stroke-width="3"/>
    <line x1="-7" y1="5" x2="0" y2="5" stroke="#2563EB" stroke-width="3"/>
    <line x1="7" y1="5" x2="0" y2="5" stroke="#2563EB" stroke-width="3"/>
    <line x1="-5" y1="5" x2="-8" y2="15" stroke="#2563EB" stroke-width="3"/>
    <line x1="5" y1="5" x2="8" y2="15" stroke="#2563EB" stroke-width="3"/>
    <circle cx="0" cy="0" r="20" fill="none" stroke="white" stroke-width="2"/>
  </g>
</svg>`;
    })(),
};

// Write all SVG files
let count = 0;
for (const [id, svg] of Object.entries(signs)) {
    const filePath = path.join(outDir, `${id}.svg`);
    fs.writeFileSync(filePath, svg);
    count++;
    console.log(`✓ ${id}.svg`);
}

// Now update the JSON data file to point to local paths
const dataFile = path.join(__dirname, '../data/trafik_isaretleri.json');
let data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

for (let cat of data.categories) {
    for (let sign of cat.signs) {
        sign.image = `/signs/${sign.id}.svg`;
    }
}

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
console.log(`\n✅ ${count} SVG dosyası oluşturuldu ve JSON güncellendi.`);

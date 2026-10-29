export function createSlug(text: string): string {
    if (!text) return '';
    const trMap: Record<string, string> = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
    };
    return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => trMap[m] || m)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export function getDNAScoreColor(score: number): string {
    if (score >= 80) return '#22C55E'; // Yeşil - Mükemmel
    if (score >= 70) return '#F59E0B'; // Sarı - İyi
    if (score >= 50) return '#F97316'; // Turuncu - Orta
    return '#EF4444'; // Kırmızı - Düşük
}

export function getDNAScoreLabel(score: number): string {
    if (score >= 80) return 'Mükemmel';
    if (score >= 70) return 'İyi';
    if (score >= 50) return 'Orta';
    return 'Dikkatli Olun';
}

export function getSeverityColor(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
        case 'low': return '#3B82F6'; // Mavi
        case 'medium': return '#F59E0B'; // Sarı
        case 'high': return '#EF4444'; // Kırmızı
    }
}

export function getSeverityLabel(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
        case 'low': return 'Düşük';
        case 'medium': return 'Orta';
        case 'high': return 'Yüksek';
    }
}

import library from '../public/data/library_guides.json';
import { createSeoSlug } from './slug';

// Kaynak dosyada category alanı yok; mevcut etiketlerden yalnızca gezinme grubu türetilir.
export const articleCategories = [
    { slug: 'alim-satim', name: 'Alım Satım ve Araç Seçimi', tags: ['satın alma', 'ikinci el', 'oto galeri', 'ticaret', 'dolandırıcılık', 'finans', 'ekspertiz'] },
    { slug: 'bakim-ariza', name: 'Bakım ve Arıza', tags: ['bakım', 'motor', 'arıza', 'otomatik vites', 'turbo', 'akü', 'temizlik', 'mekanik', 'oto bakım', 'diy'] },
    { slug: 'surus-guvenlik', name: 'Sürüş ve Güvenlik', tags: ['sürüş', 'sürüş teknikleri', 'acemi', 'güvenlik', 'uzun yol', 'kış lastiği', 'seyahat'] },
    { slug: 'yakit-ekonomi', name: 'Yakıt ve Ekonomi', tags: ['yakıt', 'yakıt tüketimi', 'yakıt tasarrufu', 'akaryakıt', 'ekonomi', 'tasarruf'] },
    { slug: 'sigorta-islemler', name: 'Sigorta ve Resmî İşlemler', tags: ['sigorta', 'hukuk', 'kaza', 'araç değer kaybı', 'muayene', 'tüvtürk'] },
    { slug: 'modifiye-performans', name: 'Modifiye ve Performans', tags: ['modifiye', 'performans', 'hız', 'spor otomobil'] },
    { slug: 'otomobil-kulturu', name: 'Otomobil Kültürü ve Teknoloji', tags: ['otomotiv grupları', 'markalar', 'tarihçe', 'gelecek', 'uçan araba', 'ilginç', 'araç rengi', 'gizli özellik', 'ipuçları'] },
];

function categoryFor(tags: string[]) {
    for (const tag of tags) {
        const category = articleCategories.find(item => item.tags.some(value => createSeoSlug(value) === createSeoSlug(tag)));
        if (category) return category.slug;
    }
    return 'otomobil-kulturu';
}

export const articles = library.guides.map(guide => ({
    id: String(guide.id), title: guide.title, description: guide.description,
    path: `/makale/${createSeoSlug(guide.title)}--${guide.urlId || guide.id}`,
    minutes: guide.minutes, category: categoryFor(guide.tags || []),
}));

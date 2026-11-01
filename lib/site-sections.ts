import sections from '../data/site-sections.json';

/** Publication switches, shared by navigation, HTTP handling and SEO discovery. */
export const siteSections = sections;
export const VEHICLE_RESEARCH_URL = 'https://otokusur.com/';
export function pausedSection(value: string): keyof typeof sections | null {
    const path = new URL(value, 'https://otosoz.com').pathname.toLowerCase().replace(/\/$/, '') || '/';
    const within = (prefix: string) => path === prefix || path.startsWith(prefix + '/');
    if (!sections.vehicleDna && (within('/arac-dna') || within('/api/arac-dna'))) return 'vehicleDna';
    if (!sections.library && (within('/kutuphane') || within('/makale') || path === '/data/library_guides.json')) return 'library';
    if (!sections.news && (within('/haberler') || path === '/news-sitemap.xml' || path === '/data/news_posts.json')) return 'news';
    return null;
}
export const isPublishedPath = (value: string) => pausedSection(value) === null;

/** Standalone library helpers remain useful at old URLs, without search promotion. */
export function isSearchDiscoverablePath(value: string) {
    const path = new URL(value, 'https://otosoz.com').pathname.toLowerCase();
    return isPublishedPath(value) && (sections.library || !/^\/(?:nasil-yapilir|gosterge|sozluk|bakim-rehberi|ikinci-el-rehberi)(?:\/|$)/.test(path));
}

/** No guessed model mappings or bulk redirects to another site's home page. */
export function sectionHttpDecision(value: string) {
    const section = pausedSection(value);
    if (!section) return null;
    const path = new URL(value, 'https://otosoz.com').pathname.toLowerCase().replace(/\/$/, '');
    return section === 'vehicleDna' && path === '/arac-dna'
        ? { status: 307, location: VEHICLE_RESEARCH_URL }
        : { status: 404, location: null };
}

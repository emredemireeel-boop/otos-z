import {SITEMAP_TYPES} from '@/lib/seoRoutes';
import {sitemapResponse,xmlEscape} from '@/lib/sitemap-xml';
export const revalidate=900;
export function GET(){return sitemapResponse(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${SITEMAP_TYPES.map(type=>`<sitemap><loc>${xmlEscape(`https://otosoz.com/sitemaps/${type}.xml`)}</loc></sitemap>`).join('')}</sitemapindex>`);}

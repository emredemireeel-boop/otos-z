import {getIndexableUrls,SITEMAP_TYPES,type SitemapType} from '@/lib/seoRoutes';
import {sitemapResponse,urlset} from '@/lib/sitemap-xml';
export const revalidate=900;
export async function GET(_request:Request,{params}:{params:Promise<{file:string}>}){const {file}=await params;const type=file.slice(0,-4) as SitemapType;if(!file.endsWith('.xml')||!SITEMAP_TYPES.includes(type))return new Response('Not found',{status:404});return sitemapResponse(urlset(await getIndexableUrls(type)));}

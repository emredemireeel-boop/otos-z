import {notFound} from 'next/navigation';
import LibraryHub,{libraryMetadata} from '../../LibraryHub';
import {CATEGORIES,libraryCategoryPath} from '@/lib/library-categories';
type Props={params:Promise<{slug:string}>};
function category(slug:string){return CATEGORIES.find(cat=>cat.slug===slug&&libraryCategoryPath(slug)===`/kutuphane/kategori/${slug}`);}
export async function generateMetadata({params}:Props){const {slug}=await params;if(!category(slug))notFound();return libraryMetadata(slug);}
export default async function Page({params}:Props){const {slug}=await params;if(!category(slug))notFound();return <LibraryHub kategori={slug}/>;}
export const revalidate=900;

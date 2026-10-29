import {notFound} from 'next/navigation';
import {getBrandsForCategory} from '@/data/guvenmetre';
import {GET as getReviews} from '@/app/api/guvenmetre/reviews/route';
import BrandDetailClient from './BrandDetailClient';
import BrandHeader from './BrandHeader';
export default async function Page({params}:{params:Promise<{categoryId:string;brandId:string}>}){
 const {categoryId,brandId}=await params;
 const brand=getBrandsForCategory(categoryId).find(brand=>brand.id===brandId);if(!brand)notFound();
 const response=await getReviews(new Request(`https://otosoz.com/api/guvenmetre/reviews?categoryId=${encodeURIComponent(categoryId)}&brandId=${encodeURIComponent(brandId)}`));
 const result=await response.json();
 return <BrandDetailClient categoryId={categoryId} brandId={brandId} brandRecord={brand} initialReviews={result.success?result.reviews:[]} header={<BrandHeader brand={brand} categoryId={categoryId}/>}/>;
}

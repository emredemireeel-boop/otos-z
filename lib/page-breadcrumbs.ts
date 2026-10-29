import 'server-only';
import {CATEGORIES} from './library-categories';
import {vehicleDNAData,createSlug} from '../data/vehicle-dna';
import {engineDNAData} from '../data/engine-dna';
import {articles} from './article-catalog';
import {OTOHESAP_META} from '../data/otohesap-meta';
import {OTOBUTCE_CATEGORIES} from '../data/otobutce-data';
import library from '../public/data/library_guides.json';
import facts from '../public/data/interesting_information.json';
import tolls from '../public/data/otoyol_ucretleri.json';
import news from '../public/data/news_posts.json';
import howto from '../data/nasil-yapilir.json';
import {OPEN_CAR_MARKETS,TURKEY_PROVINCES,getMarketPath} from '../data/open-car-markets';
import type {BreadcrumbItem} from './schema';
const SITE='https://otosoz.com';
const names:Record<string,string>={
 '/':'Ana Sayfa','/arac-dna':'Araç DNA','/obd':'OBD-II Arıza Kodları','/makale':'Makaleler','/kutuphane':'Kütüphane','/haberler':'Haberler','/forum':'Forum',
 '/otohesap':'OtoHesap','/otobutce':'OtoBütçe','/trafik-cezasi':'Trafik Cezaları','/acik-oto-pazari':'Açık Oto Pazarları',
 '/karsilastirma':'Araç Karşılaştırma','/uzmana-sor':'Uzmana Sor','/guvenmetre':'Güvenmetre','/piyasalar':'Piyasalar','/anket':'Anketler','/etkinlikler':'Etkinlikler',
 '/altin-anahtar':'Altın Anahtar','/hakkimizda':'Hakkımızda','/iletisim':'İletişim','/gizlilik-politikasi':'Gizlilik Politikası','/kullanim-sartlari':'Kullanım Şartları','/cerez-politikasi':'Çerez Politikası',
 '/kutuphane/kasko-deger':'Kasko Değer Sorgulama',
};
for(const category of CATEGORIES)names['/kutuphane/kategori/'+category.slug]=category.name;
for(const vehicle of vehicleDNAData){const brand='/arac-dna/'+createSlug(vehicle.brand),model=brand+'/'+createSlug(vehicle.model);names[brand]??=vehicle.brand;names[model]??=vehicle.model;
 for(const engine of engineDNAData.find(item=>item.vehicleId===vehicle.id)?.engines||[])names[model+'/'+engine.slug]??=engine.name;
}
for(const article of articles)names[article.path]=article.title;
for(const post of news.posts)names['/haberler/'+post.slug]=post.title;
for(const module of Object.entries(OTOHESAP_META))names['/otohesap/'+module[0]]=module[1].title;
for(const category of OTOBUTCE_CATEGORIES)names['/otobutce/'+category.slug]=category.title;
for(const province of TURKEY_PROVINCES)names['/acik-oto-pazari/'+province.slug]=province.name;
for(const market of OPEN_CAR_MARKETS)names[getMarketPath(market)]=market.name;
for(const toll of tolls)names['/kutuphane/otoyol-ucretleri/'+toll.id]=toll.name;
for(const cat of howto.categories)for(const guide of cat.guides||[])names['/nasil-yapilir/'+guide.slug]=guide.title;
const sectionNames:Record<string,string>={'kronik-sorunlar':'Kronik Sorunlar','neden-alinir':'Güçlü Yönler ve Dikkat Noktaları','arac-paketleri':'Araç Paketleri','kullanici-deneyimleri':'Kullanıcı Deneyimleri'};
const libraryParents:Record<string,string>={'ilginc':'ilginc-bilgiler','otoyol-ucretleri':'otoyol-ve-kopru-ucretleri','efsane-avcilari':'efsane-avcilari','ehliyet':'ehliyet-siniflari','plaka':'plaka-kodlari','segment':'arac-segmentleri','kasa':'arac-segmentleri','tuvturk':'tuvturk-muayene','noter':'noter-islemleri'};
export function pageBreadcrumbItems(value:string,label?:string):BreadcrumbItem[]{
 const url=new URL(value,SITE);if(url.origin!==SITE)throw new Error('Breadcrumb URL must use canonical host');
 const path=url.pathname.replace(/\/$/,'')||'/',parts=path.split('/').filter(Boolean),items:BreadcrumbItem[]=[{name:names['/'],url:SITE+'/'}];
 const push=(p:string,name=names[p])=>{if(name&&items.at(-1)?.url!==SITE+p)items.push({name,url:SITE+p});};
 if(path==='/')return items;
 if(parts.length>1){push('/'+parts[0]);if(parts[0]==='arac-dna'){if(parts[1])push('/arac-dna/'+parts[1]);if(parts.length>3)push('/'+parts.slice(0,3).join('/'));}
 if(parts[0]==='acik-oto-pazari'&&parts.length>2)push('/acik-oto-pazari/'+parts[1]);
 if(parts[0]==='kutuphane'&&libraryParents[parts[1]])push('/kutuphane/kategori/'+libraryParents[parts[1]]);
 }
 let name=label||names[path]||sectionNames[parts.at(-1)!];
 if(!name&&parts[0]==='arac-dna'){
  const suffix=parts.at(-1)!;if(suffix.endsWith('-kronik-sorunlari'))name='Motorun Kronik Sorunları';else if(suffix.endsWith('-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri'))name='Motorun Artıları ve Eksileri';
 }
 if(!name&&parts[0]==='forum'&&parts[1]==='sayfa')name=`Sayfa ${parts[2]}`;
 if(!name)name=parts.at(-1)!.replace(/--\d+$/,'').replace(/-/g,' ');
 push(path,name);return items;
}

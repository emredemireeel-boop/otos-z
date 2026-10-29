let brands:string[]=[];
const models=new Map<string,string[]>(),requested=new Set<string>(),pending=new Set<string>();
const listeners=new Set<()=>void>();
let version=0,brandsLoaded=false;
function changed(){version++;listeners.forEach(listener=>listener());}
export const getAllBrands=()=>brands;
export function getModelsForBrand(brand:string){if(brand&&brand!=='Tümü')requested.add(brand);return models.get(brand)||[];}
export function subscribeCarModels(listener:()=>void){listeners.add(listener);return()=>{listeners.delete(listener);};}
export const carModelsVersion=()=>version;
export async function loadRequestedCarModels(){
    if(!brandsLoaded&&!pending.has('brands')){
        pending.add('brands');
        try{const response=await fetch('/api/car-options');if(!response.ok)throw new Error('options');const data=await response.json();brands=data.brands;brandsLoaded=true;changed();}finally{pending.delete('brands');}
    }
    await Promise.all([...requested].filter(brand=>!models.has(brand)&&!pending.has(brand)).map(async brand=>{
        pending.add(brand);
        try{const response=await fetch('/api/car-options?brand='+encodeURIComponent(brand));if(!response.ok)throw new Error('models');const data=await response.json();models.set(brand,data.models);changed();}finally{pending.delete(brand);}
    }));
}

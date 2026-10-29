// Only documented boundary relationships used by the market navigation.
// Not a complete map of all 81 provinces. Each pair is symmetric.
export const verifiedProvinceBorders=[
    {province:'kayseri',neighbors:['adana'],source:'https://kayseri.ktb.gov.tr/TR-54966/cografi-yapi.html'},
    {province:'konya',neighbors:['ankara','eskisehir','antalya'],source:'https://konya.ktb.gov.tr/TR-370533/cografi-konum.html'},
    {province:'kutahya',neighbors:['bursa','eskisehir','manisa','balikesir'],source:'https://kutahya.ktb.gov.tr/TR-69488/cografi-bilgiler.html'},
    {province:'manisa',neighbors:['balikesir'],source:'https://manisa.ktb.gov.tr/TR-72961/cografya.html'},
    {province:'ordu',neighbors:['samsun'],source:'https://ordu.ktb.gov.tr/TR-106499/cografya.html'},
];
export function provinceNeighbors(slug:string){return [...new Set(verifiedProvinceBorders.flatMap(row=>row.province===slug?row.neighbors:row.neighbors.includes(slug)?[row.province]:[]))];}

export interface ObdCode {
    code: string;
    title: string;
    description: string;
    type: string;
    isGeneric: boolean;
    severity: string;
    systems: string[];
    symptoms: string[];
    causes: string[];
    fixes: string[];
    lastReviewed?: string;
    sources?: { title: string; url: string }[];
}

export function getObdFaq(code: ObdCode) {
    return [
        { question: `${code.code} arıza kodu nedir?`, answer: `${code.description} ${code.isGeneric ? 'Kodun genel tanımı standarttır; teşhis yöntemi araç ve motora göre değişir.' : 'Üreticiye özel kodların anlamını aracın marka, model ve motoruna ait servis dokümanıyla doğrulayın.'}` },
        ...(code.symptoms.length ? [{ question: `${code.code} arıza kodunun belirtileri nelerdir?`, answer: code.symptoms.join('; ') }] : []),
        ...(code.causes.length ? [{ question: `${code.code} arıza kodu neden oluşur?`, answer: code.causes.join('; ') }] : []),
        ...(code.fixes.length ? [{ question: `${code.code} arıza kodu nasıl giderilir?`, answer: `Kontrol sırası: ${code.fixes.join('; ')}` }] : []),
        { question: `${code.code} arıza kodu ile araç kullanmak güvenli mi?`, answer: 'Yalnızca arıza koduna bakarak sürüş güvenliği belirlenemez. Yanıp sönen motor arıza lambası, şiddetli tekleme, hararet veya fren/direksiyon sorunu varsa güvenli bir yerde durun ve servis desteği alın. Diğer durumlarda da belirtilerle birlikte teşhis yaptırın.' },
        { question: `${code.code} onarımı ne kadar tutar?`, answer: 'Kod tek başına fiyat belirlemez. Önce arızanın kaynağı ölçümle doğrulanmalı; ardından araç, motor, parça ve işçilik belirtilen bir servis teklifi alınmalıdır.' },
    ];
}

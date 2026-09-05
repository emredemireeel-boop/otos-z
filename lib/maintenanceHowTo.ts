export interface MaintenanceStep {
    name: string;
    text: string;
}

export function buildMaintenanceSteps(title: string, interval: string): MaintenanceStep[] {
    return [
        { name: "Üretici periyodunu doğrulayın", text: `${title} için araç el kitabındaki kilometre ve süre sınırını kontrol edin. OtoSöz'deki genel aralık: ${interval}.` },
        { name: "Belirti ve servis geçmişini kontrol edin", text: "Değişim tarihini, kilometreyi, uyarı ışıklarını ve önceki servis kayıtlarını birlikte değerlendirin." },
        { name: "Doğru parça ve işlemi seçin", text: "Şasi numarasıyla uyumlu, üretici standardını karşılayan parçayı seçin; güvenlik veya özel ekipman gerektiren işlemleri yetkin servise yaptırın." },
        { name: "İşlemi kaydedin ve sonraki tarihi planlayın", text: "Fatura ve parça bilgisini saklayın; yeni kilometre veya tarih hedefini OtoSöz Bakım Ajandası'na ekleyin." },
    ];
}

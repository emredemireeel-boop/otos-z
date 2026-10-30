# Mobil performans

Aynı yerel production sunucusunda Lighthouse 13.6 mobil gezinme ölçümü. TBT laboratuvar metriğidir; INP sonucu değildir. JavaScript aktarımı sıkıştırılmış ağ boyutudur.

| Şablon | Önce puan | Sonra puan | JS önce KB | JS sonra KB | Azalma | LCP sn | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| home | 74 | 92 | 814.4 | 231.2 | %71.61 | 1.24 | 0.0001 |
| obd | 91 | 95 | 890.6 | 296.8 | %66.68 | 1.34 | 0.0004 |
| dna-model | 93 | 96 | 814.4 | 199.0 | %75.57 | 1.28 | 0.0003 |
| dna-chronic | 92 | 96 | 819.8 | 203.3 | %75.2 | 1.26 | 0.0000 |
| library-category | 90 | 93 | 805.0 | 365.5 | %54.6 | 1.34 | 0.0001 |
| forum-thread | 85 | 94 | 840.7 | 219.2 | %73.93 | 1.18 | 0.0000 |

Altı şablonun anonim ağ kayıtlarında yüklenen Firebase SDK ve tarayıcı Firebase isteği sayısı: 0. İstek URLleri ve yüklenen yerel chunk SHA-256 değerleri JSON karşılaştırma raporunda saklanır.

INP için yayından sonra gerçek kullanıcı verisi gerekir; bu rapor INP <200 ms kanıtı olarak kullanılamaz.

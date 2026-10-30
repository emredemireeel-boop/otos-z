# Canlı mobil performans — 30.10.2026

Yerel sonuçlar ile Cloudflare üzerinden canlı sonuçlar ayrı tutulur. Her şablonun üç geçerli ölçümünde ortanca performans çalıştırması kullanılır. Önceki tek ölçüm ve tüm tekrarlar korunur.

| Şablon | Yerel puan | Canlı puan | Canlı LCP sn | Canlı TBT ms | CLS | Hedef |
|---|---:|---:|---:|---:|---:|---|
| home | 92 | 87 | 1.36 | 507 | 0.0001 | Geçti |
| obd | 95 | 88 | 1.34 | 463 | 0.0004 | Geçti |
| dna-model | 96 | 88 | 1.73 | 428 | 0.0003 | Geçti |
| dna-chronic | 96 | 91 | 1.29 | 375 | 0.0000 | Geçti |
| library-category | 93 | 88 | 1.36 | 479 | 0.0001 | Geçti |
| forum-thread | 94 | 87 | 1.28 | 511 | 0.0000 | Geçti |

Canlı kabul: geçti.

Cloudflare tarafından eklenen doğrulama betiğinin CPU ölçümü ve yüklenen uygulama dosyalarının SHA-256 kanıtı JSON raporundadır. Bu betik tüm farkın nedeni olarak gösterilmez. Güvenlik ayarı bu çalışma sırasında değiştirilmedi. [Cloudflare JavaScript Detections belgesi](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/).

TBT, gerçek kullanıcı INP değeri değildir. Alan INP doğrulaması yayından sonra gerekir.

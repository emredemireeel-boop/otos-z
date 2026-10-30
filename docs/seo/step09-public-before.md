# Canlı mobil performans — 30.10.2026

Yerel sonuçlar ile Cloudflare üzerinden canlı sonuçlar ayrı tutulur. Her şablonun üç geçerli ölçümünde ortanca performans çalıştırması kullanılır. Önceki tek ölçüm ve tüm tekrarlar korunur.

| Şablon | Yerel puan | Canlı puan | Canlı LCP sn | Canlı TBT ms | CLS | Hedef |
|---|---:|---:|---:|---:|---:|---|
| home | 92 | 77 | 2.84 | 523 | 0.0001 | Karşılanmadı |
| obd | 91 | 77 | 3.07 | 460 | 0.0004 | Karşılanmadı |
| dna-model | 92 | 81 | 2.82 | 420 | 0.0003 | Karşılanmadı |
| dna-chronic | 93 | 82 | 2.76 | 393 | 0.0000 | Karşılanmadı |
| library-category | 91 | 74 | 3.03 | 564 | 0.0001 | Karşılanmadı |
| forum-thread | 94 | 77 | 2.63 | 633 | 0.0000 | Karşılanmadı |

Canlı kabul: henüz karşılanmadı. Yerel yeşil sonuç, canlı hedefin geçtiği anlamına gelmez.

Cloudflare tarafından eklenen doğrulama betiğinin CPU ölçümü ve yüklenen uygulama dosyalarının SHA-256 kanıtı JSON raporundadır. Bu betik tüm farkın nedeni olarak gösterilmez. Güvenlik ayarı bu çalışma sırasında değiştirilmedi. [Cloudflare JavaScript Detections belgesi](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/).

TBT, gerçek kullanıcı INP değeri değildir. Alan INP doğrulaması yayından sonra gerekir.

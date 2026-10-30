# HTTP www için kalan alan adı yönlendirmesi

30.10.2026 tarihinde gerçek HTTP GET ile gözlenen durum:

| Kaynak | Adımlar |
|---|---|
| `http://otosoz.com/` | 301 → `https://otosoz.com/` → 200 |
| `https://www.otosoz.com/` | 301 → `https://otosoz.com/` → 200 |
| `http://www.otosoz.com/` | 301 → `https://www.otosoz.com/` → 301 → `https://otosoz.com/` → 200 |

Kanıt: `step09-canonical-hosts.json`. Canonical hosta giden iç linklerde yönlendirme yok; 691 sitemap URL'si de doğrudan 200 dönüyor. İki adımlı normalizasyon dışarıdan kullanılan HTTP www adresinde kaldı. Bu nedenle bütün altyapıda yönlendirme zinciri sıfır diye raporlanmaz.

Her iki 301 yanıtında da Cloudflare başlığı görülüyor. İlk yönlendirmenin hangi edge kuralından geldiği, hesapta **Cloudflare Trace** ile doğrulanmalıdır; response başlığı tek başına ayarın adını kanıtlamaz. Çalışma ortamında Cloudflare hesap/zone yetkisi veya API kimliği sağlanmadığından bu ayar uygulanmadı. Kullanıcının güvenliği koruma talimatına uyuldu.

Panelde incelenip uygulanacak aday **Single Redirect**:

```json
{
  "expression": "http.host eq \"www.otosoz.com\"",
  "action": "redirect",
  "action_parameters": {
    "from_value": {
      "target_url": {
        "expression": "concat(\"https://otosoz.com\", http.request.uri.path)"
      },
      "status_code": 301,
      "preserve_query_string": true
    }
  }
}
```

Kuralın HTTP www isteğinde ilk eşleşen yönlendirme olduğu Trace ile kontrol edilmeli; mevcut çakışan yönlendirme varsa önceliği incelenmelidir. HTTPS zorlaması, TLS, WAF ve bot koruması kapatılmamalıdır. Sonrasında kök adres, `/obd/p0420` ve query içeren bir örnek için redirect takip etmeden ilk `Location` değerinin doğrudan HTTPS apex olduğu; bu hedefin 200 döndüğü doğrulanmalıdır. Bu dosya uygulanmış bir Cloudflare değişikliği değildir.

Resmî dayanaklar: [Single Redirects ayarları](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/), [Single Redirects ve Trace](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/), [Always Use HTTPS davranışı](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/).

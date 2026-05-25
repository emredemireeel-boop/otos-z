const text = "Tüm bu komisyon... Mutlaka sitemizdeki **[OtoHesap Al-Sat Kâr/Zarar Hesaplama](/otohesap/al-sat)** aracını kullanın!";
let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--primary); text-decoration: underline; font-weight: 600;">$1</a>');
console.log(html);

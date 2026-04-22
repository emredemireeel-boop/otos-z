const fs = require('fs');

const path = 'app/kayit/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Move the terms block
const termsBlockRegex = /\s*\{\/\* Terms \*\/\}\s*<div style=\{\{\s*padding: '16px',\s*background: isDark \? 'rgba\(255,107,0,0\.06\)' : 'rgba\(0,90,226,0\.04\)',\s*border: `1px solid \$\{isDark \? 'rgba\(255,107,0,0\.15\)' : 'rgba\(0,90,226,0\.1\)'\}`,\s*borderRadius: '14px',\s*\}\}>\s*<label style=\{\{\s*display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', userSelect: 'none' \}\}>\s*<div\s*onClick=\{\(\) => setAcceptTerms\(!acceptTerms\)\}\s*style=\{\{\s*width: '22px', height: '22px', borderRadius: '7px',\s*border: `2px solid \$\{acceptTerms \? 'var\(--primary\)' : 'var\(--card-border\)'\}`,\s*background: acceptTerms \? 'var\(--primary\)' : 'transparent',\s*display: 'flex', alignItems: 'center', justifyContent: 'center',\s*transition: 'all 0\.2s', flexShrink: 0, marginTop: '1px',\s*\}\}\s*>\s*\{acceptTerms && \(\s*<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">\s*<polyline points="20 6 9 17 4 12" \/>\s*<\/svg>\s*\)\}\s*<\/div>\s*<span style=\{\{ fontSize: '13px', color: 'var\(--text-muted\)', lineHeight: 1\.5 \}\}>\s*<Link href="\/kullanim-sartlari" target="_blank" style=\{\{ color: 'var\(--primary\)', textDecoration: 'none', fontWeight: '700' \}\}>\s*Kullanım Şartlarını\s*<\/Link>\s*\{" "\}ve\{" "\}\s*<Link href="\/gizlilik-politikasi" target="_blank" style=\{\{ color: 'var\(--primary\)', textDecoration: 'none', fontWeight: '700' \}\}>\s*Gizlilik Politikasını\s*<\/Link>\s*\{" "\}okudum ve kabul ediyorum\.\s*<\/span>\s*<\/label>\s*<\/div>/;

const termsMatch = content.match(termsBlockRegex);
if (termsMatch) {
    const termsBlock = termsMatch[0];
    content = content.replace(termsBlockRegex, '');
    
    // Insert before <button type="button" className="reg-btn" disabled={!canProceedStep1}
    const buttonRegex = /(\s*<button\s*type="button"\s*className="reg-btn"\s*disabled=\{!canProceedStep1\})/g;
    content = content.replace(buttonRegex, termsBlock + '$1');
} else {
    console.log("Terms block not found!");
}

// 2. Update variables
content = content.replace(
    /const canProceedStep1 = formData\.username\.length >= 3 && formData\.email\.includes\('@'\) && formData\.city\.length > 0;/,
    "const canProceedStep1 = formData.username.length >= 3 && formData.email.includes('@') && formData.city.length > 0 && acceptTerms;"
);

content = content.replace(
    /const canProceedStep2 = formData\.password\.length >= 6 && passwordsMatch && acceptTerms;/,
    "const canProceedStep2 = formData.password.length >= 6 && passwordsMatch;"
);

// 3. Update handleGoogleRegister
const googleRegisterCode = `    const handleGoogleRegister = async () => {
        if (!acceptTerms) {
            setRegisterError("Devam etmek için Gizlilik Politikası ve Kullanım Koşullarını kabul etmelisiniz.");
            return;
        }
        setIsLoading(true);
        setRegisterError("");
        const result = await loginWithGoogle();
        if (result.success) {
            router.push("/profil-tamamla");
        } else {
            setIsLoading(false);
        }
    };`;

content = content.replace(/const handleGoogleRegister = async \(\) => \{[\s\S]*?router\.push\("\/profil-tamamla"\);\s*\} else \{\s*setIsLoading\(false\);\s*\}\s*\};/, googleRegisterCode);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Kayit page terms logic.');

const fs = require('fs');

// Fix Gizlilik Politikası
const gizlilikPath = 'app/gizlilik-politikasi/page.tsx';
if (fs.existsSync(gizlilikPath)) {
    let content = fs.readFileSync(gizlilikPath, 'utf8');
    content = content.replace(/Ã„ş/g, 'ğ');
    content = content.replace(/Ã„Ş/g, 'Ğ');
    content = content.replace(/İŞbu/g, 'İşbu');
    content = content.replace(/Ã§/g, 'ç');
    content = content.replace(/Ã‡/g, 'Ç');
    content = content.replace(/Ã¶/g, 'ö');
    content = content.replace(/Ã–/g, 'Ö');
    content = content.replace(/Ã¼/g, 'ü');
    content = content.replace(/Ãœ/g, 'Ü');
    content = content.replace(/Ä±/g, 'ı');
    content = content.replace(/Ä°/g, 'İ');
    content = content.replace(/ÅŸ/g, 'ş');
    content = content.replace(/Åž/g, 'Ş');
    fs.writeFileSync(gizlilikPath, content, 'utf8');
    console.log('Fixed Turkish characters in Gizlilik Politikası.');
}

// Fix Kayıt
const kayitPath = 'app/kayit/page.tsx';
if (fs.existsSync(kayitPath)) {
    let content = fs.readFileSync(kayitPath, 'utf8');
    content = content.replace(/Zaten hesab[^ ]+ var mı\?/g, 'Zaten hesabınız var mı?');
    
    // Check if terms are required for social login (step 1). 
    // The user wants to force accepting privacy policy / terms of use for registration.
    // Currently, it's checked in step 2. If the user registers via Google/Apple, they bypass step 2!
    // So we should add a checkbox to Step 1 for social logins or just require acceptTerms in Step 1.
    // Let's modify step 1 to include the terms checkbox.
    
    fs.writeFileSync(kayitPath, content, 'utf8');
    console.log('Fixed Kayıt page text.');
}

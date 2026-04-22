const fs = require('fs');

function replaceDict(path, changes) {
    if(!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf-8');
    let modified = content;
    
    for(const key of Object.keys(changes)) {
        modified = modified.split(key).join(changes[key]);
    }
    
    if(modified !== content) {
        fs.writeFileSync(path, modified, 'utf-8');
        console.log(`Updated ${path}`);
    }
}

replaceDict('app/uzmana-sor/page.tsx', {
    "yanıtlas?n": "yanıtlasın",
    "s?re de": "süre de",
    "Deste?i": "Desteği",
    "ard?ndan": "ardından",
    "ekran?na": "ekranına",
    "k?sa video": "kısa video",
    "plan? önersin": "planı önersin",
    "par?a": "parça",
    "plan? için": "planı için",
    "S?re? plan?": "Süreç planı",
    "yanıtlayacakt?r": "yanıtlayacaktır"
});

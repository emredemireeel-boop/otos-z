const fs = require('fs');
const file = 'app/pazar/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/rgba\(255, 255, 255, 0\.6\)/g, "var(--text-muted)");
content = content.replace(/rgba\(255, 255, 255, 0\.06\)/g, "var(--secondary)");
content = content.replace(/rgba\(255, 255, 255, 0\.12\)/g, "var(--card-border)");
content = content.replace(/color: 'white'/g, "color: 'var(--foreground)'");
content = content.replace(/background: '#1a1a1a'/g, "background: 'var(--card-bg)'");
content = content.replace(/color: brand \? 'white' : 'rgba\(255, 255, 255, 0\.3\)'/g, "color: brand ? 'var(--foreground)' : 'var(--text-muted)'");
content = content.replace(/color: city \? 'white' : 'rgba\(255, 255, 255, 0\.3\)'/g, "color: city ? 'var(--foreground)' : 'var(--text-muted)'");
content = content.replace(/background: 'rgba\(255, 255, 255, 0\.04\)'/g, "background: 'var(--secondary)'");
content = content.replace(/color: 'rgba\(255, 255, 255, 0\.8\)'/g, "color: 'var(--foreground)'");

fs.writeFileSync(file, content);
console.log("Done");

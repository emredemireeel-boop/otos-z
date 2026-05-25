const fs = require('fs');
const path = './public/data/library_guides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Convert Markdown to HTML in all strings recursively
function convertMarkdownToHTML(obj) {
  if (typeof obj === 'string') {
    let html = obj;
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--foreground);">$1</strong>');
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--primary); font-weight: 700; text-decoration: underline;">$1</a>');
    return html;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => convertMarkdownToHTML(item));
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = convertMarkdownToHTML(obj[key]);
    }
    return newObj;
  }
  return obj;
}

const guide = data.guides.find(g => g.id === "guide_nasil_galerici_olunur");

if (guide) {
  // Add kasko link
  const step16 = guide.sections.find(s => s.title && s.title.includes('Adım 16'));
  if (step16) {
    const bddkSub = step16.subsections.find(s => s.subtitle.includes('BDDK'));
    if (bddkSub) {
      bddkSub.text = bddkSub.text.replace('kasko veya rayiç bedeli', '[kasko veya rayiç bedeli](/otohesap/kasko)');
      bddkSub.text = bddkSub.text.replace('kasko değeri veya rayiç bedeli', '[kasko değeri veya rayiç bedeli](/otohesap/kasko)');
    }
  }

  const step16Sub2 = step16.subsections.find(s => s.subtitle.includes('Araç Yaş Sınırları'));
  if (step16Sub2) {
      step16Sub2.text = step16Sub2.text.replace('kasko', '[kasko](/otohesap/kasko)');
  }

  // Convert all markdown to HTML directly
  guide.sections = convertMarkdownToHTML(guide.sections);

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log('Markdown completely converted to HTML in JSON!');
}

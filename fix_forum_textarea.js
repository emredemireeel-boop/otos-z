const fs = require('fs');
let content = fs.readFileSync('app/forum/[id]/ForumThreadClient.tsx', 'utf8');

// The replacement text
const replacement = `<MarkdownEditor
                                    value={newEntry}
                                    onChange={(val) => setNewEntry(val)}
                                    placeholder="Dusuncelerinizi paylasin..."
                                    minRows={4}
                                />`;

// Regex to find the exact textarea block
const regex = /<textarea[\s\S]*?ref=\{textareaRef\}[\s\S]*?value=\{newEntry\}[\s\S]*?onChange=\{\(e\) => \{[\s\S]*?setNewEntry\(e\.target\.value\);[\s\S]*?e\.target\.style\.height = 'auto';[\s\S]*?e\.target\.style\.height = e\.target\.scrollHeight \+ 'px';[\s\S]*?\}\}[\s\S]*?placeholder="Dusuncelerinizi paylasin..."[\s\S]*?style=\{\{[\s\S]*?\}\}[\s\S]*?onFocus=\{\(e\) => e\.target\.style\.borderColor = 'var\(--primary\)'\}[\s\S]*?onBlur=\{\(e\) => e\.target\.style\.borderColor = 'var\(--card-border\)'\}[\s\S]*?\/>/g;

content = content.replace(regex, replacement);

fs.writeFileSync('app/forum/[id]/ForumThreadClient.tsx', content);
console.log("Fixed textarea in forum client");

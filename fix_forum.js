const fs = require('fs');
let content = fs.readFileSync('app/forum/[id]/ForumThreadClient.tsx', 'utf8');

// Import MarkdownEditor and MarkdownRenderer
if (!content.includes('MarkdownEditor')) {
    content = content.replace(
        "import AutoLinkText from '@/components/AutoLinkText';",
        "import AutoLinkText from '@/components/AutoLinkText';\nimport MarkdownEditor from '@/components/MarkdownEditor';\nimport MarkdownRenderer from '@/components/MarkdownRenderer';"
    );
}

// Replace AutoLinkText with MarkdownRenderer for entries
content = content.replace(
    /<AutoLinkText text=\{description\} style=\{\{ whiteSpace: 'pre-wrap' \}\} \/>/g,
    "<MarkdownRenderer content={description} />"
);

// Replace textarea with MarkdownEditor for new entry form
content = content.replace(
    /<textarea[\s\S]*?ref=\{textareaRef\}[\s\S]*?value=\{newEntry\}[\s\S]*?onChange=\{\(e\) => { setNewEntry\(e\.target\.value\);[^}]*\}\}[\s\S]*?placeholder="Entry'nizi buraya yazın..."[\s\S]*?rows=\{4\}[\s\S]*?style=\{\{[^}]*\}\}[\s\S]*?\/>/g,
    `<MarkdownEditor
                                    value={newEntry}
                                    onChange={(val) => setNewEntry(val)}
                                    placeholder="Entry'nizi buraya yazın..."
                                    minRows={4}
                                />`
);

// There is another textarea for quick reply / guest mode maybe? Let's check the regex.
// Wait, the guest mode might not have the same structure. We'll just replace the main one first.

fs.writeFileSync('app/forum/[id]/ForumThreadClient.tsx', content);
console.log("Fixed forum client");

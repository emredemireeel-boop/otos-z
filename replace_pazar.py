import os

files = [
    'app/page.tsx',
    'app/uzmana-sor/page.tsx',
    'app/guvenmetre/[categoryId]/page.tsx',
    'app/guvenmetre/page.tsx',
    'app/karsilastirma/[id]/page.tsx',
    'app/karsilastirma/page.tsx',
    'app/forum/[id]/ForumThreadClient.tsx',
    'app/etkinlikler/page.tsx',
    'app/anket/page.tsx'
]

for filepath in files:
    full_path = os.path.join('c:\\Users\\GAMER\\Desktop\\otoasfalt-web', filepath)
    if not os.path.exists(full_path):
        print(f'File not found: {full_path}')
        continue
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = content.find('{/* Pazar Vitrini */}')
    if start_idx == -1:
        start_idx = content.find('<h3>Pazar Vitrini</h3>')
        if start_idx == -1:
            start_idx = content.find('<h3 style={{ fontSize: \'16px\', fontWeight: \'700\', color: \'var(--foreground)\' }}>Pazar Vitrini</h3>')
            if start_idx == -1:
                print(f'Could not find Pazar Vitrini in {filepath}')
                continue
            else:
                div_start = content.rfind('<div', 0, start_idx)
                start_idx = div_start

    line_start = content.rfind('\n', 0, start_idx)
    if line_start != -1:
        start_idx = line_start + 1
        
    div_start = content.find('<div', start_idx)
    
    count = 0
    i = div_start
    while i < len(content):
        next_open = content.find('<div', i)
        next_close = content.find('</div', i)
        
        if next_open != -1 and next_open < next_close:
            count += 1
            i = next_open + 4
        elif next_close != -1:
            count -= 1
            i = next_close + 5
            if count == 0:
                break
        else:
            break
            
    end_idx = i + 1
    
    if count == 0:
        replacement = ' ' * (div_start - start_idx) + '{/* Pazar Vitrini (Gizlendi) */}\n' + ' ' * (div_start - start_idx) + '<LatestThreadsWidget />\n'
        new_content = content[:start_idx] + replacement + content[end_idx:]
        
        if 'LatestThreadsWidget' not in new_content[:start_idx]:
            import_statement = 'import LatestThreadsWidget from "@/components/LatestThreadsWidget";\n'
            last_import = new_content.rfind('import ')
            if last_import != -1:
                import_end = new_content.find('\n', last_import) + 1
                new_content = new_content[:import_end] + import_statement + new_content[import_end:]
            else:
                new_content = import_statement + new_content
            
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Replaced in {filepath}')
    else:
        print(f'Failed to parse divs in {filepath}')

import os

filepath = 'app/page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (
"""                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '20px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                            }}>""",
"""                            <div className="survey-card">"""
    ),
    (
"""                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '60px 24px', textAlign: 'center' }}>""",
"""                    <div className="expert-empty-state">"""
    ),
    (
"""                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 20px var(--primary-glow)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >""",
"""                            <div className="expert-card">"""
    ),
    (
"""                        <div
                            style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '24px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: '20px',
                            }}
                            className="topic-card"
                        >""",
"""                        <div className="topic-card">"""
    )
]

for old_str, new_str in replacements:
    content = content.replace(old_str, new_str)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactoring complete.")

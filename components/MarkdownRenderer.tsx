"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';

interface MarkdownRendererProps {
    content: string;
    style?: React.CSSProperties;
}

export default function MarkdownRenderer({ content, style }: MarkdownRendererProps) {
    const parsedContent = useMemo(() => {
        if (!content) return null;

        // Satır satır işleyip sonra birleştireceğiz
        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeContent = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Code block toggle
            if (line.trim().startsWith('```')) {
                if (inCodeBlock) {
                    elements.push(
                        <pre key={`code-${i}`} style={{
                            background: '#1e1e1e', color: '#d4d4d4', padding: '12px',
                            borderRadius: '8px', overflowX: 'auto', margin: '8px 0', fontSize: '13px'
                        }}>
                            <code>{codeContent.join('\n')}</code>
                        </pre>
                    );
                    codeContent = [];
                    inCodeBlock = false;
                } else {
                    inCodeBlock = true;
                }
                continue;
            }

            if (inCodeBlock) {
                codeContent.push(line);
                continue;
            }

            // Blockquote
            if (line.trim().startsWith('>')) {
                elements.push(
                    <blockquote key={`quote-${i}`} style={{
                        borderLeft: '4px solid var(--primary)',
                        paddingLeft: '12px',
                        margin: '8px 0',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                        background: 'var(--secondary)',
                        padding: '8px 12px',
                        borderRadius: '0 8px 8px 0'
                    }}>
                        {parseInlineMarkdown(line.substring(1).trim(), i)}
                    </blockquote>
                );
                continue;
            }

            // Normal text line
            elements.push(
                <span key={`line-${i}`}>
                    {parseInlineMarkdown(line, i)}
                    {i < lines.length - 1 && <br />}
                </span>
            );
        }

        return elements;
    }, [content]);

    return (
        <div style={{ ...style, lineHeight: '1.6', wordBreak: 'break-word' }}>
            {parsedContent}
        </div>
    );
}

// Inline Markdown (Bold, Italic, Link)
function parseInlineMarkdown(text: string, lineIndex: number): React.ReactNode[] {
    let elements: React.ReactNode[] = [text];

    // 1. Links: [Title](URL)
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    elements = elements.flatMap((el, index) => {
        if (typeof el !== 'string') return [el];
        const parts = el.split(linkRegex);
        if (parts.length === 1) return [el];

        const result: React.ReactNode[] = [];
        for (let i = 0; i < parts.length; i += 3) {
            result.push(parts[i]); // Text before link
            if (i + 1 < parts.length && i + 2 < parts.length) {
                const linkTitle = parts[i + 1];
                const linkUrl = parts[i + 2];
                result.push(
                    <a
                        key={`link-${lineIndex}-${index}-${i}`}
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}
                    >
                        {linkTitle}
                    </a>
                );
            }
        }
        return result;
    });

    // 2. Bold: **text**
    const boldRegex = /\*\*([^\*]+)\*\*/g;
    elements = elements.flatMap((el, index) => {
        if (typeof el !== 'string') return [el];
        const parts = el.split(boldRegex);
        if (parts.length === 1) return [el];

        const result: React.ReactNode[] = [];
        for (let i = 0; i < parts.length; i += 2) {
            result.push(parts[i]);
            if (i + 1 < parts.length) {
                result.push(<strong key={`bold-${lineIndex}-${index}-${i}`}>{parts[i + 1]}</strong>);
            }
        }
        return result;
    });

    // 3. Italic: *text*
    const italicRegex = /\*([^\*]+)\*/g;
    elements = elements.flatMap((el, index) => {
        if (typeof el !== 'string') return [el];
        const parts = el.split(italicRegex);
        if (parts.length === 1) return [el];

        const result: React.ReactNode[] = [];
        for (let i = 0; i < parts.length; i += 2) {
            result.push(parts[i]);
            if (i + 1 < parts.length) {
                result.push(<em key={`italic-${lineIndex}-${index}-${i}`}>{parts[i + 1]}</em>);
            }
        }
        return result;
    });

    return elements;
}

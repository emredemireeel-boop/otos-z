"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { dictionaryTerms } from '@/data/dictionary';
import obdCodes from '@/data/obd-codes.json';
import { getCanonicalDictionaryId } from '@/lib/seoUrls';

type Keyword = { keyword: string; id: string; type: 'dict' | 'obd'; tooltip: string };

function htmlToPlainText(value: string): string {
    return value
        .replace(/<\s*br\s*\/?\s*>/gi, '\n')
        .replace(/<\s*\/\s*(p|div|li|h[1-6])\s*>/gi, '\n')
        .replace(/<\s*li(?:\s[^>]*)?>/gi, '• ')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#(?:0*39|x0*27);/gi, "'");
}

function linkKeywords(text: string, keywords: Keyword[], keyPrefix: string): React.ReactNode[] {
    if (!text) return [];
    const pattern = keywords.map(k => k.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!pattern) return [text];
    const regex = new RegExp(`(^|[\\s.,!?;:()\\[\\]{}])(${pattern})(?=$|[\\s.,!?;:()\\[\\]{}])`, 'giu');
    const nodes: React.ReactNode[] = [];
    let cursor = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
        const boundary = match[1] || '';
        const term = match[2];
        const termStart = match.index + boundary.length;
        if (termStart > cursor) nodes.push(text.slice(cursor, termStart));
        const keyword = keywords.find(k => k.keyword.toLocaleLowerCase('tr-TR') === term.toLocaleLowerCase('tr-TR'));
        if (!keyword) {
            nodes.push(term);
        } else {
            const href = keyword.type === 'dict' ? `/sozluk/${getCanonicalDictionaryId(keyword.id)}` : `/obd/${keyword.id}`;
            const color = keyword.type === 'dict' ? '#3b82f6' : '#ef4444';
            nodes.push(<Link key={`${keyPrefix}-${termStart}`} href={href} title={`${keyword.keyword} Nedir?\n${keyword.tooltip}`} style={{ color, fontWeight: 600, textDecoration: 'none', borderBottom: `1px dashed ${color}`, padding: '0 2px' }}>{term}</Link>);
        }
        cursor = termStart + term.length;
        if (regex.lastIndex === match.index) regex.lastIndex++;
    }
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
}

function renderSafeInline(text: string, keywords: Keyword[], keyPrefix: string): React.ReactNode[] {
    return text.split(/(\*\*[^*]+\*\*)/g).reduce<React.ReactNode[]>((nodes, part, index) => {
        const bold = part.startsWith('**') && part.endsWith('**');
        const value = bold ? part.slice(2, -2) : part;
        const linked = linkKeywords(value, keywords, `${keyPrefix}-${index}`);
        if (bold) {
            nodes.push(<strong key={`${keyPrefix}-bold-${index}`} style={{ color: 'var(--foreground)', fontWeight: 700 }}>{linked}</strong>);
        } else {
            nodes.push(...linked);
        }
        return nodes;
    }, []);
}

export default function AutoLinkText({ text, style }: { text: string; style?: React.CSSProperties }) {
    const linkedElements = useMemo(() => {
        if (!text) return [];
        const keywords: Keyword[] = [
            ...dictionaryTerms.map(t => ({ keyword: t.term.split('(')[0].trim(), id: t.id, type: 'dict' as const, tooltip: t.description })),
            ...(obdCodes as Array<{ code: string; title: string }>).map(c => ({ keyword: c.code, id: c.code.toLowerCase(), type: 'obd' as const, tooltip: c.title })),
        ].filter(k => k.keyword.length > 2).sort((a, b) => b.keyword.length - a.keyword.length);

        const safeText = htmlToPlainText(text);
        return safeText.split(/\n{2,}/).filter(Boolean).map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} style={{ margin: 0, lineHeight: '1.8', marginBottom: '16px', whiteSpace: 'pre-line' }}>
                {renderSafeInline(paragraph, keywords, `p-${paragraphIndex}`)}
            </p>
        ));
    }, [text]);

    return <div style={{ ...style }}>{linkedElements}</div>;
}

"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { dictionaryTerms } from '@/data/dictionary';
import obdCodes from '@/data/obd-codes.json';

// Utility component that parses text and automatically links keywords
export default function AutoLinkText({ text, style }: { text: string; style?: React.CSSProperties }) {
    
    const linkedElements = useMemo(() => {
        if (!text) return [];

        // Pre-process markdown **bold** to HTML
        let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--foreground); font-weight: 700;">$1</strong>');

        // Check if text contains HTML tags
        const hasHtml = /<[a-z][\s\S]*>/i.test(processedText);

        // 1. Prepare dictionary terms
        const dictKeywords = dictionaryTerms.map(t => ({
            keyword: t.term.split('(')[0].trim(),
            id: t.id,
            type: 'dict',
            tooltip: t.description
        })).filter(k => k.keyword.length > 2);

        // 2. Prepare OBD terms
        const obdKeywords = (obdCodes as any[]).map(c => ({
            keyword: c.code,
            id: c.code.toLowerCase(),
            type: 'obd',
            tooltip: c.title
        }));

        const allKeywords = [...dictKeywords, ...obdKeywords].sort((a, b) => b.keyword.length - a.keyword.length);

        if (hasHtml) {
            // String-based replacement for HTML content
            // We create a master regex that matches HTML tags OR keywords
            // This prevents replacing keywords inside href="..." or style="..."
            
            // Build keyword alternation group safely
            const keywordPattern = allKeywords.map(k => k.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            
            // Match HTML tags OR (boundary + keyword + boundary)
            // Turkish characters need special boundary handling, so we use (^|\s|[.,!?;:])(keyword)([.,!?;:]|\s|$)
            const masterRegex = new RegExp(`(<[^>]+>)|(^|\\s|[.,!?;:]|>|<)(${keywordPattern})([.,!?;:]|\\s|>|<|$)`, 'gi');

            let finalHtml = processedText.replace(masterRegex, (match, htmlTag, before, keyword, after) => {
                if (htmlTag) {
                    return htmlTag; // Don't touch HTML tags
                }
                
                if (keyword) {
                    const kw = allKeywords.find(k => k.keyword.toLowerCase() === keyword.toLowerCase());
                    if (kw) {
                        const href = kw.type === 'dict' ? `/sozluk/${kw.id}` : `/obd/${kw.id}`;
                        const color = kw.type === 'dict' ? '#3b82f6' : '#ef4444';
                        const bgHover = kw.type === 'dict' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)';
                        // Note: inline hover styles in raw HTML don't work natively without CSS classes, 
                        // but we provide the base styling. The visual will be good enough.
                        const linkHtml = `<a href="${href}" title="${kw.keyword} Nedir?&#10;${kw.tooltip}" style="color: ${color}; font-weight: 600; text-decoration: none; border-bottom: 1px dashed ${color}; padding: 0 2px; transition: all 0.2s;">${keyword}</a>`;
                        return `${before}${linkHtml}${after}`;
                    }
                }
                return match;
            });

            // Split by \n\n for paragraph breaks
            const paragraphs = finalHtml.split('\n\n').filter(p => p.trim());
            return paragraphs.map((para, idx) => (
                <p key={idx} style={{ margin: 0, lineHeight: '1.8', marginBottom: idx < paragraphs.length - 1 ? '16px' : '0' }} dangerouslySetInnerHTML={{ __html: para.replace(/\n/g, '<br/>') }} />
            ));
        }

        // --- NON-HTML PATH (React Node building) ---
        const paragraphs = processedText.split('\n\n').filter(p => p.trim());

        return paragraphs.map((paraText, paraIdx) => {
            let elements: React.ReactNode[] = [paraText];

            allKeywords.forEach((kw) => {
                const regex = new RegExp(`(^|\\s|[.,!?;:])(${kw.keyword})([.,!?;:]|\\s|$)`, 'gi');

                elements = elements.flatMap((el, elIndex) => {
                    if (typeof el !== 'string') return [el];

                    const parts = el.split(regex);
                    if (parts.length === 1) return [el];

                    const result: React.ReactNode[] = [];
                    let i = 0;
                    while (i < parts.length) {
                        if (i === 0) {
                            if (parts[i]) result.push(parts[i]);
                            i++;
                        } else {
                            const beforeBoundary = parts[i];
                            const matchedTerm = parts[i+1];
                            const afterBoundary = parts[i+2];

                            if (beforeBoundary) result.push(beforeBoundary);
                            
                            if (matchedTerm) {
                                const href = kw.type === 'dict' ? `/sozluk/${kw.id}` : `/obd/${kw.id}`;
                                result.push(
                                    <Link 
                                        key={`${kw.id}-${paraIdx}-${elIndex}-${i}`} 
                                        href={href}
                                        title={`${kw.keyword} Nedir?\n${kw.tooltip}`}
                                        style={{
                                            color: kw.type === 'dict' ? '#3b82f6' : '#ef4444',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            borderBottom: `1px dashed ${kw.type === 'dict' ? '#3b82f6' : '#ef4444'}`,
                                            padding: '0 2px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = kw.type === 'dict' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        {matchedTerm}
                                    </Link>
                                );
                            }
                            
                            if (afterBoundary) result.push(afterBoundary);
                            
                            i += 4;
                            if (i - 1 < parts.length && parts[i-1]) {
                                result.push(parts[i-1]);
                            }
                        }
                    }
                    return result;
                });
            });

            return <p key={paraIdx} style={{ margin: 0, lineHeight: '1.8', marginBottom: paraIdx < paragraphs.length - 1 ? '16px' : '0' }}>{elements}</p>;
        });
    }, [text]);

    return <div style={{ ...style }}>{linkedElements}</div>;
}

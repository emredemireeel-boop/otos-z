"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { dictionaryTerms } from '@/data/dictionary';
import obdCodes from '@/data/obd-codes.json';

// Utility component that parses text and automatically links keywords
export default function AutoLinkText({ text, style }: { text: string; style?: React.CSSProperties }) {
    
    const linkedElements = useMemo(() => {
        if (!text) return [];

        // 1. Prepare dictionary terms
        const dictKeywords = dictionaryTerms.map(t => ({
            keyword: t.term.split('(')[0].trim(), // Extract "EGR Valfi" from "EGR Valfi (Egzoz...)"
            id: t.id,
            type: 'dict',
            tooltip: t.description
        })).filter(k => k.keyword.length > 2); // Ignore very short words

        // 2. Prepare OBD terms (We only take the codes like "P0101", "P0171")
        const obdKeywords = (obdCodes as any[]).map(c => ({
            keyword: c.code,
            id: c.code.toLowerCase(),
            type: 'obd',
            tooltip: c.title
        }));

        // 3. Combine and sort by length descending (so "EGR Valfi" matches before "EGR")
        const allKeywords = [...dictKeywords, ...obdKeywords].sort((a, b) => b.keyword.length - a.keyword.length);

        // 4. Parse the text
        let elements: React.ReactNode[] = [text];

        allKeywords.forEach((kw) => {
            // regex for whole word, case-insensitive.
            // \b doesn't work well with Turkish characters (like Ş, Ç), so we use a custom boundary check.
            const regex = new RegExp(`(^|\\s|[.,!?;:])(${kw.keyword})([.,!?;:]|\\s|$)`, 'gi');

            elements = elements.flatMap((el, elIndex) => {
                if (typeof el !== 'string') return [el];

                const parts = el.split(regex);
                if (parts.length === 1) return [el];

                const result: React.ReactNode[] = [];
                let i = 0;
                while (i < parts.length) {
                    // Because of capturing groups (^|\s|[.,!?;:]) and ([.,!?;:]|\s|$), 
                    // split returns: [textBefore, beforeBoundary, matchedTerm, afterBoundary, textAfter, ...]
                    
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
                                    key={`${kw.id}-${elIndex}-${i}`} 
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
                        
                        i += 4; // Skip the captured groups and move to next text chunk
                        if (i - 1 < parts.length && parts[i-1]) {
                            result.push(parts[i-1]);
                        }
                    }
                }
                return result;
            });
        });

        return elements;
    }, [text]);

    return <p style={{ ...style, lineHeight: '1.8' }}>{linkedElements}</p>;
}

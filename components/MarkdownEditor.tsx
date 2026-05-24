"use client";

import React, { useRef, useState } from 'react';
import { Bold, Italic, Code, Quote, Link as LinkIcon } from 'lucide-react';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minRows?: number;
}

export default function MarkdownEditor({ value, onChange, placeholder = "İçeriğinizi yazın...", minRows = 4 }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = (before: string, after: string = "", defaultText: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const selectedText = text.substring(start, end) || defaultText;
        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
        
        onChange(newText);
        
        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 0);
    };

    const handleLinkClick = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        const linkTitle = prompt("Link Başlığı (Köprü metni):", selectedText || "Tıklayın");
        if (!linkTitle) return;

        const linkUrl = prompt("URL (Örn: https://...):", "https://");
        if (!linkUrl) return;

        // Validasyon basit
        if (!linkUrl.startsWith("http://") && !linkUrl.startsWith("https://")) {
            alert("Hata: URL 'http://' veya 'https://' ile başlamalıdır.");
            return;
        }

        const linkMarkdown = `[${linkTitle}](${linkUrl})`;
        const newText = textarea.value.substring(0, start) + linkMarkdown + textarea.value.substring(end);
        
        onChange(newText);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + linkMarkdown.length, start + linkMarkdown.length);
        }, 0);
    };

    const toolbarStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
        padding: '8px 12px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderBottom: 'none',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
    };

    const buttonStyle: React.CSSProperties = {
        background: 'transparent',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    };

    return (
        <div className="markdown-editor-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={toolbarStyle}>
                <button 
                    type="button"
                    title="Kalın (Bold)"
                    style={buttonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => insertText("**", "**", "Kalın Metin")}
                >
                    <Bold size={16} />
                </button>
                <button 
                    type="button"
                    title="Eğik (Italic)"
                    style={buttonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => insertText("*", "*", "Eğik Metin")}
                >
                    <Italic size={16} />
                </button>
                <button 
                    type="button"
                    title="Alıntı (Quote)"
                    style={buttonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => insertText("\n> ", "\n", "Alıntı Metin")}
                >
                    <Quote size={16} />
                </button>
                <button 
                    type="button"
                    title="Kod (Code)"
                    style={buttonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => insertText("\n```\n", "\n```\n", "Kod Parçası")}
                >
                    <Code size={16} />
                </button>
                <div style={{ width: '1px', background: 'var(--card-border)', margin: '0 4px' }}></div>
                <button 
                    type="button"
                    title="Link Ekle (Köprü)"
                    style={{ ...buttonStyle, color: 'var(--primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={handleLinkClick}
                >
                    <LinkIcon size={16} />
                </button>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}
                placeholder={placeholder}
                rows={minRows}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--secondary)',
                    border: '1px solid var(--card-border)',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                    color: 'var(--foreground)',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                }}
            />
        </div>
    );
}

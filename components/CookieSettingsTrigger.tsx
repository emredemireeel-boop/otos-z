"use client";

import type { ReactNode } from "react";

interface CookieSettingsTriggerProps {
    children?: ReactNode;
    className?: string;
}

export default function CookieSettingsTrigger({ children = "Çerez tercihleri", className }: CookieSettingsTriggerProps) {
    return (
        <button
            type="button"
            className={className}
            onClick={() => window.dispatchEvent(new Event("otosoz:open-cookie-settings"))}
        >
            {children}
        </button>
    );
}

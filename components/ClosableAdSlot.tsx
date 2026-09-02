"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AdPlaceholder from "@/components/AdPlaceholder";

const dismissedAdSlots = new Set<string>();

interface ClosableAdSlotProps {
    position: string;
    dismissKey?: string;
    className?: string;
    style?: React.CSSProperties;
    adStyle?: React.CSSProperties;
    fallbackTitle?: string;
    fallbackDesc?: string;
    variant?: "square" | "banner" | "rail";
}

export default function ClosableAdSlot({
    position,
    dismissKey,
    className,
    style,
    adStyle,
    fallbackTitle,
    fallbackDesc,
    variant = "square",
}: ClosableAdSlotProps) {
    const slotKey = dismissKey ?? position;
    const [dismissed, setDismissed] = useState(() => dismissedAdSlots.has(slotKey));

    const dismiss = () => {
        dismissedAdSlots.add(slotKey);
        setDismissed(true);
    };

    if (dismissed) return null;

    return (
        <div className={`closable-ad-slot ${className ?? ""}`} style={style}>
            <button
                type="button"
                className="closable-ad-slot-close"
                aria-label="Reklamı kapat"
                title="Reklamı kapat"
                onClick={dismiss}
            >
                <X size={15} strokeWidth={2.4} />
            </button>
            <AdPlaceholder
                position={position}
                variant={variant}
                style={adStyle}
                fallbackTitle={fallbackTitle}
                fallbackDesc={fallbackDesc}
            />
        </div>
    );
}

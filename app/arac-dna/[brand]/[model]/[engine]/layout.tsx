import type { Metadata } from "next";
import { createEngineMetadata } from "@/lib/aracDnaSeo";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ brand: string; model: string; engine: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { brand, model, engine } = await params;
    return createEngineMetadata(brand, model, engine);
}

export default function EngineLayout({ children }: LayoutProps) {
    return children;
}

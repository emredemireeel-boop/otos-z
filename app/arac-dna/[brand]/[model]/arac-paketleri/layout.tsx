import type { Metadata } from "next";
import { createVehicleSectionMetadata } from "@/lib/aracDnaSeo";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ brand: string; model: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { brand, model } = await params;
    return createVehicleSectionMetadata(brand, model, "arac-paketleri");
}

export default function TrimLevelsLayout({ children }: LayoutProps) {
    return children;
}

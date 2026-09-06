import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mobil oturum | OtoSöz",
    robots: { index: false, follow: false },
};

export default function MobileLoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}

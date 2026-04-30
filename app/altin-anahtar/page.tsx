import { Metadata } from "next";
import AltinAnahtarClient from "./AltinAnahtarClient";

export const metadata: Metadata = {
    title: "Altın Anahtar — Türkiye'nin En İyi Oto Ustaları | OtoSöz",
    description: "Türkiye'nin ilk yıldızlı usta rehberi. Şehir şehir en güvenilir oto tamircileri, motor ustaları, kaportacılar ve elektrikçileri keşfedin. Altın Anahtar derecelendirmesiyle kaliteli hizmet garantisi.",
    openGraph: {
        title: "Altın Anahtar — Türkiye'nin En İyi Oto Ustaları",
        description: "Güvenilir usta bulmak artık çok kolay. Haritadan şehrinizi seçin, Altın Anahtar'lı ustaları keşfedin.",
        type: "website",
        url: "https://www.otosoz.com/altin-anahtar",
    },
    alternates: { canonical: "https://www.otosoz.com/altin-anahtar" },
};

export default function AltinAnahtarPage() {
    return <AltinAnahtarClient />;
}

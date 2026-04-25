import { Metadata } from "next";
import EhliyetHarclariClient from "./EhliyetHarclariClient";

export const metadata: Metadata = {
    title: "2026 Ehliyet Harç Ücretleri | B Sınıfı Ehliyet Ne Kadar? | OtoSöz",
    description: "2026 güncel ehliyet harçları, değerli kağıt bedeli ve vakıf payı ücretleri. B sınıfı, A2 motosiklet ehliyeti ve yenileme fiyatları OtoSöz'de.",
};

export default function EhliyetHarclariPage() {
    return <EhliyetHarclariClient />;
}

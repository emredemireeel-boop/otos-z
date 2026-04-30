import { Metadata } from "next";
import UlkePlakalariClient from "./UlkePlakalariClient";

export const metadata: Metadata = {
    title: 'Ülke Plaka Kodları Listesi | OtoSöz Kütüphane',
    description: 'Dünya genelindeki ülkelerin araç plaka kodları (TR, D, GB, vs.). Hangi plaka kodu hangi ülkeye ait öğrenin.',
};

export default function UlkePlakalariPage() {
    return <UlkePlakalariClient />;
}

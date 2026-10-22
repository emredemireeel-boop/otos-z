import Link from "next/link";
import { BadgeCheck, CarFront, CheckCircle2, ClipboardCheck, ExternalLink, ShieldAlert } from "lucide-react";
import { topSellingSourceUrl, type TopSellingVehicleGuide as Guide } from "@/data/top-selling-vehicle-guides";

export default function TopSellingVehicleGuide({ guide }: { guide: Guide }) {
    return (
        <section className="dna-buying-guide" aria-labelledby="dna-buying-guide-title">
            <div className="dna-buying-guide__head">
                <div>
                    <span><BadgeCheck size={15} /> Türkiye satış listesi · #{guide.rank}</span>
                    <h2 id="dna-buying-guide-title">Karar vermeden önce bilmeniz gerekenler</h2>
                    <p>{guide.decision}</p>
                </div>
                <div className="dna-buying-guide__metric">
                    <strong>{guide.registrations.toLocaleString("tr-TR")}</strong>
                    <small>{guide.period} satışı</small>
                </div>
            </div>

            <div className="dna-buying-guide__fit">
                <article>
                    <h3><CheckCircle2 size={18} /> Kimler için uygun?</h3>
                    <ul>{guide.idealFor.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
                <article>
                    <h3><ShieldAlert size={18} /> Satın almadan önce</h3>
                    <ul>{guide.attention.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
            </div>

            <div className="dna-buying-guide__categories">
                {guide.categories.map((category) => (
                    <article key={category.title}>
                        <CarFront size={19} />
                        <h3>{category.title}</h3>
                        <p>{category.detail}</p>
                    </article>
                ))}
            </div>

            <div className="dna-buying-guide__foot">
                <span><ClipboardCheck size={16} /> Jenerasyon: {guide.generation}</span>
                <span className="dna-buying-guide__sources"><Link href={topSellingSourceUrl} target="_blank" rel="noopener noreferrer">Satış verisi: ODMD <ExternalLink size={14} /></Link><Link href={guide.officialSource} target="_blank" rel="noopener noreferrer">Üretici teknik verisi <ExternalLink size={14} /></Link></span>
            </div>
        </section>
    );
}

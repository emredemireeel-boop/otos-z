"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2, Edit3, ExternalLink, KeyRound, Loader2, MapPin, Navigation,
  Plus, RefreshCw, Save, Search, Star, Trash2, X,
} from "lucide-react";
import { getCities } from "turkey-neighbourhoods";

import { adminGet, adminPost } from "@/lib/adminFetch";
import styles from "./page.module.css";

const RouteMap = dynamic(() => import("@/components/RouteMap"), { ssr: false });

type Master = {
  id: string; name: string; workshop: string; goldenKeys: number; specialty: string[];
  city: string; district: string; area: string; address: string; phone: string;
  establishedYear?: number; experience: number; brands: string[]; description: string;
  rating: number; reviewCount: number; googleRating: number; googleReviews: number;
  hours: Record<string, string>; services: string[]; lat?: number; lng?: number;
  mapUrl?: string; website?: string; createdAt: string;
};

type FormState = {
  name: string; city: string; district: string; area: string; address: string; phone: string;
  establishedYear: string; experience: string; goldenKeys: string; rating: string;
  reviewCount: string; googleRating: string; googleReviews: string; description: string;
  specialties: string; brands: string; services: string; mapUrl: string; website: string;
  lat: string; lng: string; hours: Record<string, string>;
};

const DAYS = ["pazartesi", "sali", "carsamba", "persembe", "cuma", "cumartesi", "pazar"];
const DAY_LABELS: Record<string, string> = {
  pazartesi: "Pazartesi", sali: "Salı", carsamba: "Çarşamba", persembe: "Perşembe",
  cuma: "Cuma", cumartesi: "Cumartesi", pazar: "Pazar",
};
const DEFAULT_HOURS = {
  pazartesi: "08:30-18:30", sali: "08:30-18:30", carsamba: "08:30-18:30",
  persembe: "08:30-18:30", cuma: "08:30-18:30", cumartesi: "08:30-14:00", pazar: "Kapalı",
};
const currentYear = new Date().getFullYear();
const cities = (() => { try { return getCities().map((city) => city.name).sort((a, b) => a.localeCompare(b, "tr")); } catch { return []; } })();

function emptyForm(): FormState {
  return {
    name: "", city: "", district: "", area: "", address: "", phone: "",
    establishedYear: String(currentYear), experience: "0", goldenKeys: "1", rating: "0",
    reviewCount: "0", googleRating: "0", googleReviews: "0", description: "",
    specialties: "", brands: "", services: "", mapUrl: "", website: "", lat: "", lng: "",
    hours: { ...DEFAULT_HOURS },
  };
}

function masterToForm(master: Master): FormState {
  return {
    name: master.name, city: master.city, district: master.district || "", area: master.area || "",
    address: master.address || "", phone: master.phone || "",
    establishedYear: String(master.establishedYear ?? Math.max(1900, currentYear - (master.experience || 0))),
    experience: String(master.experience ?? 0), goldenKeys: String(master.goldenKeys ?? 1),
    rating: String(master.rating ?? 0), reviewCount: String(master.reviewCount ?? 0),
    googleRating: String(master.googleRating ?? 0), googleReviews: String(master.googleReviews ?? 0),
    description: master.description || "", specialties: (master.specialty || []).join(", "),
    brands: (master.brands || []).join(", "), services: (master.services || []).join(", "),
    mapUrl: master.mapUrl || "", website: master.website || "",
    lat: typeof master.lat === "number" ? String(master.lat) : "",
    lng: typeof master.lng === "number" ? String(master.lng) : "",
    hours: { ...DEFAULT_HOURS, ...(master.hours || {}) },
  };
}

const list = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

export default function AltinAnahtarAdminPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Master | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  const notify = (text: string, error = false) => {
    setNotice({ text, error });
    window.setTimeout(() => setNotice(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet("altin_anahtar");
      if (!data.success) throw new Error(data.message || "Kayıtlar alınamadı.");
      setMasters(data.masters || []);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Kayıtlar alınamadı.", true);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => masters.filter((master) => {
    const haystack = `${master.name} ${master.city} ${master.district} ${master.area}`.toLocaleLowerCase("tr-TR");
    return (!query || haystack.includes(query.toLocaleLowerCase("tr-TR"))) && (!cityFilter || master.city === cityFilter);
  }), [masters, query, cityFilter]);

  const openNew = () => { setEditing(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (master: Master) => { setEditing(master); setForm(masterToForm(master)); setModalOpen(true); };

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => setForm((old) => ({ ...old, [field]: value }));

  const resolveMap = async () => {
    const value = form.mapUrl.trim() || (form.lat && form.lng ? `${form.lat},${form.lng}` : "");
    if (!value) return notify("Harita bağlantısı veya iki koordinatı da girin.", true);
    setResolving(true);
    try {
      const data = await adminPost({ action: "resolve_altin_anahtar_map", detail: value });
      if (!data.success) throw new Error(data.message || "Konum çözümlenemedi.");
      setForm((old) => ({
        ...old, mapUrl: data.mapUrl || old.mapUrl,
        lat: data.lat === null ? old.lat : String(data.lat), lng: data.lng === null ? old.lng : String(data.lng),
      }));
      notify(data.lat === null ? "Bağlantı doğrulandı. Koordinat bulunamadı; manuel girebilirsiniz." : "Konum bağlantıdan alındı.");
    } catch (error) { notify(error instanceof Error ? error.message : "Konum çözümlenemedi.", true); }
    finally { setResolving(false); }
  };

  const save = async () => {
    if (!form.name.trim() || !form.city || !form.address.trim() || !form.phone.trim()) {
      return notify("Firma adı, şehir, açık adres ve telefon zorunludur.", true);
    }
    if ((form.lat && !form.lng) || (!form.lat && form.lng)) return notify("Enlem ve boylam birlikte girilmelidir.", true);
    setSaving(true);
    try {
      const data = await adminPost({
        action: "upsert_altin_anahtar_master", target: editing?.id,
        data: {
          name: form.name, workshop: form.name, city: form.city, district: form.district,
          area: form.area, address: form.address, phone: form.phone,
          establishedYear: Number(form.establishedYear), experience: Number(form.experience),
          goldenKeys: Number(form.goldenKeys), rating: Number(form.rating), reviewCount: Number(form.reviewCount),
          googleRating: Number(form.googleRating), googleReviews: Number(form.googleReviews),
          description: form.description, specialty: list(form.specialties), brands: list(form.brands),
          services: list(form.services), mapUrl: form.mapUrl, website: form.website,
          lat: form.lat === "" ? undefined : Number(form.lat), lng: form.lng === "" ? undefined : Number(form.lng),
          hours: form.hours, createdAt: editing?.createdAt,
        },
      });
      if (!data.success) throw new Error(data.message || "Kayıt yapılamadı.");
      setModalOpen(false); await load(); notify(editing ? "Firma bilgileri güncellendi." : "Yeni firma Altın Anahtar'a eklendi.");
    } catch (error) { notify(error instanceof Error ? error.message : "Kayıt yapılamadı.", true); }
    finally { setSaving(false); }
  };

  const remove = async (master: Master) => {
    if (!window.confirm(`“${master.name}” kaydını kaldırmak istediğinize emin misiniz?`)) return;
    setDeletingId(master.id);
    try {
      const data = await adminPost({ action: "delete_altin_anahtar_master", target: master.id });
      if (!data.success) throw new Error(data.message || "Kayıt silinemedi.");
      await load(); notify("Firma kaydı kaldırıldı.");
    } catch (error) { notify(error instanceof Error ? error.message : "Kayıt silinemedi.", true); }
    finally { setDeletingId(null); }
  };

  const lat = Number(form.lat); const lng = Number(form.lng);
  const hasCoordinates = form.lat !== "" && form.lng !== "" && Number.isFinite(lat) && Number.isFinite(lng);

  return (
    <div className={styles.page}>
      {notice && <div className={`${styles.notice} ${notice.error ? styles.noticeError : ""}`}>{notice.text}</div>}
      <header className={styles.header}>
        <div><span className={styles.eyebrow}><KeyRound size={14} /> Usta rehberi yönetimi</span><h1>Altın Anahtar</h1><p>Firma bilgilerini, harita konumunu, puanları ve Altın Anahtar seviyesini yönetin.</p></div>
        <button className={styles.primaryButton} onClick={openNew}><Plus size={17} /> Yeni firma ekle</button>
      </header>

      <section className={styles.stats}>
        <div><strong>{masters.length}</strong><span>Toplam firma</span></div>
        <div><strong>{new Set(masters.map((item) => item.city)).size}</strong><span>Şehir</span></div>
        <div><strong>{masters.filter((item) => item.goldenKeys === 3).length}</strong><span>Efsane usta</span></div>
        <div><strong>{masters.length ? (masters.reduce((sum, item) => sum + item.rating, 0) / masters.length).toFixed(1) : "0.0"}</strong><span>Ortalama puan</span></div>
      </section>

      <section className={styles.toolbar}>
        <label className={styles.search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Firma, ilçe veya semt ara" /></label>
        <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}><option value="">Tüm şehirler</option>{Array.from(new Set(masters.map((m) => m.city))).sort().map((city) => <option key={city}>{city}</option>)}</select>
        <button className={styles.secondaryButton} onClick={() => void load()} disabled={loading}><RefreshCw size={15} className={loading ? styles.spin : ""} /> Yenile</button>
      </section>

      {loading ? <div className={styles.empty}><Loader2 className={styles.spin} /> Kayıtlar yükleniyor…</div> : filtered.length === 0 ? <div className={styles.empty}>Bu filtreye uygun firma bulunamadı.</div> : (
        <div className={styles.grid}>{filtered.map((master) => {
          const mapHref = master.mapUrl || (master.lat && master.lng ? `https://www.google.com/maps?q=${master.lat},${master.lng}` : "");
          return <article className={styles.card} key={master.id}>
            <div className={styles.cardTop}><div className={styles.logo}><Building2 size={22} /></div><div className={styles.cardTitle}><h2>{master.name}</h2><p><MapPin size={13} /> {[master.area, master.district, master.city].filter(Boolean).join(", ")}</p></div><span className={styles.keyLevel}>{master.goldenKeys} anahtar</span></div>
            <p className={styles.address}>{master.address}</p>
            <div className={styles.metrics}><span><Star size={14} fill="currentColor" /> {master.rating.toFixed(1)} <small>{master.reviewCount} OtoSöz yorumu</small></span><span><Star size={14} /> {master.googleRating.toFixed(1)} <small>{master.googleReviews} Google yorumu</small></span></div>
            <div className={styles.meta}><span>Kuruluş: {master.establishedYear || "—"}</span><span>Deneyim: {master.experience} yıl</span><span>{master.phone}</span></div>
            <div className={styles.actions}>{mapHref && <a href={mapHref} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Haritada aç</a>}<button onClick={() => openEdit(master)}><Edit3 size={15} /> Düzenle</button><button className={styles.deleteButton} onClick={() => void remove(master)} disabled={deletingId === master.id}>{deletingId === master.id ? <Loader2 size={15} className={styles.spin} /> : <Trash2 size={15} />} Sil</button></div>
          </article>;
        })}</div>
      )}

      {modalOpen && <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
        <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="firm-modal-title">
          <div className={styles.modalHeader}><div><span>{editing ? "Firma kaydını güncelle" : "Yeni firma oluştur"}</span><h2 id="firm-modal-title">{editing?.name || "Altın Anahtar firması"}</h2></div><button onClick={() => setModalOpen(false)} aria-label="Pencereyi kapat"><X /></button></div>
          <div className={styles.form}>
            <div className={styles.sectionTitle}><span>1</span><div><strong>Firma ve iletişim</strong><small>Rehberde gösterilecek temel bilgiler</small></div></div>
            <div className={styles.twoColumns}><label>Firma / usta adı *<input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Özkan Oto Servis" /></label><label>Telefon *<input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="0532 000 00 00" /></label></div>
            <label>Açık adres *<input value={form.address} onChange={(e) => setField("address", e.target.value)} placeholder="Sanayi sitesi, sokak ve kapı numarası" /></label>
            <div className={styles.threeColumns}><label>Şehir *<select value={form.city} onChange={(e) => setField("city", e.target.value)}><option value="">Seçin</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></label><label>İlçe<input value={form.district} onChange={(e) => setField("district", e.target.value)} /></label><label>Semt / sanayi sitesi<input value={form.area} onChange={(e) => setField("area", e.target.value)} /></label></div>
            <div className={styles.twoColumns}><label>Web sitesi<input value={form.website} onChange={(e) => setField("website", e.target.value)} placeholder="https://..." /></label><label>Altın Anahtar seviyesi<select value={form.goldenKeys} onChange={(e) => setField("goldenKeys", e.target.value)}><option value="1">1 — İyi Usta</option><option value="2">2 — Uzman Usta</option><option value="3">3 — Efsane Usta</option></select></label></div>

            <div className={styles.sectionTitle}><span>2</span><div><strong>Konum ve harita</strong><small>Harita linkinden otomatik alabilir veya manuel girebilirsiniz</small></div></div>
            <label>Google / Apple / Yandex harita bağlantısı<div className={styles.inlineAction}><input value={form.mapUrl} onChange={(e) => setField("mapUrl", e.target.value)} placeholder="https://maps.app.goo.gl/..." /><button type="button" onClick={() => void resolveMap()} disabled={resolving}>{resolving ? <Loader2 size={15} className={styles.spin} /> : <Navigation size={15} />} Konumu al</button></div></label>
            <div className={styles.twoColumns}><label>Enlem (manuel)<input type="number" step="any" value={form.lat} onChange={(e) => setField("lat", e.target.value)} placeholder="38.4237" /></label><label>Boylam (manuel)<input type="number" step="any" value={form.lng} onChange={(e) => setField("lng", e.target.value)} placeholder="27.1428" /></label></div>
            {hasCoordinates && <div className={styles.mapPreview}><RouteMap from={[lat, lng]} to={[lat, lng]} /></div>}

            <div className={styles.sectionTitle}><span>3</span><div><strong>Geçmiş, puan ve yorum</strong><small>4.9 gibi görünen değerleri ve yorum sayılarını ayrı ayrı yönetin</small></div></div>
            <div className={styles.threeColumns}><label>Kuruluş yılı<input type="number" min="1900" max={currentYear} value={form.establishedYear} onChange={(e) => setField("establishedYear", e.target.value)} /></label><label>Deneyim yılı<input type="number" min="0" max="100" value={form.experience} onChange={(e) => setField("experience", e.target.value)} /></label><label>OtoSöz puanı<input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setField("rating", e.target.value)} /></label></div>
            <div className={styles.threeColumns}><label>OtoSöz yorum sayısı<input type="number" min="0" value={form.reviewCount} onChange={(e) => setField("reviewCount", e.target.value)} /></label><label>Google puanı<input type="number" min="0" max="5" step="0.1" value={form.googleRating} onChange={(e) => setField("googleRating", e.target.value)} /></label><label>Google yorum sayısı<input type="number" min="0" value={form.googleReviews} onChange={(e) => setField("googleReviews", e.target.value)} /></label></div>

            <div className={styles.sectionTitle}><span>4</span><div><strong>Uzmanlık ve tanıtım</strong><small>Virgülle ayırarak birden fazla değer ekleyin</small></div></div>
            <label>Uzmanlık alanları<input value={form.specialties} onChange={(e) => setField("specialties", e.target.value)} placeholder="Motor, Elektrik, Şanzıman" /></label>
            <label>Hizmet verilen markalar<input value={form.brands} onChange={(e) => setField("brands", e.target.value)} placeholder="Renault, Fiat, Toyota" /></label>
            <label>Hizmetler<input value={form.services} onChange={(e) => setField("services", e.target.value)} placeholder="Arıza tespiti, Periyodik bakım, Fren" /></label>
            <label>Açıklama<textarea rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Firmanın güçlü yönlerini ve uzmanlığını anlatın." /></label>

            <div className={styles.sectionTitle}><span>5</span><div><strong>Çalışma saatleri</strong><small>Kapalı günlerde “Kapalı” yazabilirsiniz</small></div></div>
            <div className={styles.hours}>{DAYS.map((day) => <label key={day}>{DAY_LABELS[day]}<input value={form.hours[day] || ""} onChange={(e) => setField("hours", { ...form.hours, [day]: e.target.value })} /></label>)}</div>
          </div>
          <footer className={styles.modalFooter}><button className={styles.secondaryButton} onClick={() => setModalOpen(false)}>Vazgeç</button><button className={styles.primaryButton} onClick={() => void save()} disabled={saving}>{saving ? <Loader2 size={16} className={styles.spin} /> : <Save size={16} />} {editing ? "Değişiklikleri kaydet" : "Firmayı ekle"}</button></footer>
        </section>
      </div>}
    </div>
  );
}

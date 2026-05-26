"use client";

import { useState, useMemo } from "react";
import {
  Wrench, AlertTriangle, Shield, Lightbulb, ChevronDown, ChevronUp,
  Clock, CheckCircle, Search, XCircle, ChevronRight, ArrowLeft,
  Target, BookOpen, Tag
} from "lucide-react";
import nasilYapilirData from "@/data/nasil-yapilir.json";

import Link from "next/link";

/* ════════════════════════════════
   TYPES
   ════════════════════════════════ */
interface GuideStep {
  title: string;
  detail: string;
  tip?: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  tools: string[];
  warning: string;
  steps: GuideStep[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string[];
  guides: Guide[];
}

/* ════════════════════════════════
   HELPERS
   ════════════════════════════════ */
const getCategoryIcon = (iconName: string, size: number = 20) => {
  switch (iconName) {
    case "alert-triangle": return <AlertTriangle size={size} />;
    case "wrench": return <Wrench size={size} />;
    case "shield": return <Shield size={size} />;
    case "lightbulb": return <Lightbulb size={size} />;
    case "tag": return <Tag size={size} />;
    default: return <BookOpen size={size} />;
  }
};

const getDifficultyConfig = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "kolay": return { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", label: "Kolay" };
    case "orta": return { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "Orta" };
    case "zor": return { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", label: "Zor" };
    case "kritik": return { color: "#DC2626", bg: "rgba(220,38,38,0.15)", border: "rgba(220,38,38,0.3)", label: "Kritik" };
    default: return { color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)", label: difficulty };
  }
};

const createSlug = (text: string) => {
  const trMap: { [key: string]: string } = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  };
  return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => trMap[match] || match)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
};

/* ════════════════════════════════
   COMPONENT
   ════════════════════════════════ */
export default function NasilYapilirSection() {
  const categories: Category[] = nasilYapilirData.categories;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      guides: cat.guides.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tools.some(t => t.toLowerCase().includes(q))
      )
    })).filter(cat => cat.guides.length > 0);
  }, [categories, searchQuery]);

  const allGuides = useMemo(() => categories.flatMap(c => c.guides), [categories]);
  const totalGuides = allGuides.length;

  // ─── Category List View ───
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: "16px",
        marginBottom: "24px", flexWrap: "wrap"
      }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(99,102,241,0.3)", flexShrink: 0
        }}>
          <BookOpen size={28} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--foreground)", margin: "0 0 6px 0" }}>
            Nasıl Yapılır?
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
            Acemi sürücülerden uzmanlara, araç bakımından acil durumlara adım adım görsel rehberler.
            <span style={{
              marginLeft: "10px", padding: "3px 10px", background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)", borderRadius: "6px",
              fontSize: "11px", fontWeight: "700", color: "#6366F1"
            }}>
              {totalGuides} Rehber
            </span>
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "14px 20px", background: "var(--card-bg)",
        border: "2px solid var(--card-border)", borderRadius: "14px",
        marginBottom: "28px", transition: "border-color 0.2s",
      }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--card-border)")}
      >
        <Search size={20} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Rehber ara... (örn: lastik, akü, yağ, fren)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "var(--foreground)", fontSize: "15px", fontWeight: "500"
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              background: "var(--secondary)", border: "none",
              borderRadius: "50%", width: "30px", height: "30px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-muted)"
            }}
          >
            <XCircle size={16} />
          </button>
        )}
      </div>

      {/* Categories & Guides */}
      {filteredCategories.map((cat) => (
        <div key={cat.id} style={{ marginBottom: "32px" }}>
          {/* Category Header */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "16px", paddingBottom: "12px",
            borderBottom: `2px solid ${cat.color}20`
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: `linear-gradient(135deg, ${cat.gradient[0]}, ${cat.gradient[1]})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 6px 16px ${cat.color}30`, color: "white"
            }}>
              {getCategoryIcon(cat.icon, 20)}
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>
                {cat.name}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                {cat.guides.length} rehber
              </p>
            </div>
          </div>

          {/* Guide Cards Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "16px"
          }}>
            {cat.guides.map((guide) => {
              const diff = getDifficultyConfig(guide.difficulty);
              return (
                <Link
                  key={guide.id}
                  href={`/nasil-yapilir/${guide.slug || createSlug(guide.title)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                    background: "var(--card-bg)", border: "1px solid var(--card-border)",
                    borderRadius: "16px", padding: "24px", cursor: "pointer",
                    textAlign: "left", transition: "all 0.25s ease",
                    display: "flex", flexDirection: "column", gap: "14px",
                    position: "relative", overflow: "hidden"
                    }}
                  >
                  {/* Top accent */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                    background: `linear-gradient(90deg, ${cat.gradient[0]}, ${cat.gradient[1]})`
                  }} />

                  {/* Badges */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{
                      padding: "4px 10px", background: diff.bg, color: diff.color,
                      border: `1px solid ${diff.border}`, borderRadius: "6px",
                      fontSize: "11px", fontWeight: "700"
                    }}>{diff.label}</span>
                    <span style={{
                      padding: "4px 10px", background: "var(--secondary)",
                      border: "1px solid var(--card-border)", borderRadius: "6px",
                      fontSize: "11px", fontWeight: "600", color: "var(--text-muted)",
                      display: "flex", alignItems: "center", gap: "4px"
                    }}>
                      <Clock size={10} /> {guide.duration}
                    </span>
                    <span style={{
                      padding: "4px 10px", background: "var(--secondary)",
                      border: "1px solid var(--card-border)", borderRadius: "6px",
                      fontSize: "11px", fontWeight: "600", color: "var(--text-muted)"
                    }}>
                      {guide.steps.length} Adım
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h4 style={{
                    fontSize: "17px", fontWeight: "700", color: "var(--foreground)",
                    margin: 0, lineHeight: 1.4
                  }}>
                    {guide.title}
                  </h4>
                  <p style={{
                    fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6, margin: 0,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {guide.description}
                  </p>

                  {/* Tools preview */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {guide.tools.slice(0, 3).map((tool, i) => (
                      <span key={i} style={{
                        padding: "3px 8px", background: `${cat.color}08`,
                        border: `1px solid ${cat.color}15`, borderRadius: "5px",
                        fontSize: "10px", fontWeight: "600", color: "var(--text-muted)"
                      }}>
                        {tool}
                      </span>
                    ))}
                    {guide.tools.length > 3 && (
                      <span style={{
                        padding: "3px 8px", background: "var(--secondary)",
                        borderRadius: "5px", fontSize: "10px", fontWeight: "600",
                        color: "var(--text-muted)"
                      }}>
                        +{guide.tools.length - 3}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "12px", fontWeight: "700", color: cat.color,
                    marginTop: "auto"
                  }}>
                    Rehberi Başlat <ChevronRight size={14} />
                  </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          color: "var(--text-muted)"
        }}>
          <Search style={{ width: "48px", height: "48px", opacity: 0.3, marginBottom: "12px" }} />
          <p style={{ fontSize: "16px", fontWeight: "600" }}>"{searchQuery}" için rehber bulunamadı.</p>
          <button
            onClick={() => setSearchQuery("")}
            style={{
              marginTop: "12px", padding: "8px 20px", background: "var(--primary)",
              color: "white", border: "none", borderRadius: "8px",
              cursor: "pointer", fontSize: "13px", fontWeight: "600"
            }}
          >
            Aramayı Temizle
          </button>
        </div>
      )}
    </div>
  );
}

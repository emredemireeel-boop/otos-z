"use client";

import { useState } from "react";
import {
  Wrench, AlertTriangle, Shield, Lightbulb, ChevronDown, ChevronUp,
  Clock, CheckCircle, Target, ArrowLeft, BookOpen, Tag
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const getDifficultyConfig = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "kolay": return { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", label: "Kolay" };
    case "orta": return { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "Orta" };
    case "zor": return { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", label: "Zor" };
    case "kritik": return { color: "#DC2626", bg: "rgba(220,38,38,0.15)", border: "rgba(220,38,38,0.3)", label: "Kritik" };
    default: return { color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)", label: difficulty };
  }
};

export default function NasilYapilirDetailClient({ guide, category }: { guide: Guide, category: Category }) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const toggleStep = (idx: number) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

  const toggleCompleted = (idx: number) => {
    const s = new Set(completedSteps);
    if (s.has(idx)) s.delete(idx); else s.add(idx);
    setCompletedSteps(s);
  };

  const diff = getDifficultyConfig(guide.difficulty);
  const progress = guide.steps.length > 0 ? Math.round((completedSteps.size / guide.steps.length) * 100) : 0;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', animation: "fadeIn 0.3s ease" }}>
          
          <Link href="/kutuphane?kategori=nasil-yapilir" style={{ textDecoration: 'none' }}>
            <button
              style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px",
                background: "var(--card-bg)", border: "1px solid var(--card-border)",
                borderRadius: "10px", cursor: "pointer", color: "var(--foreground)",
                fontSize: "14px", fontWeight: "600", marginBottom: "20px",
                transition: "all 0.2s"
              }}
            >
              <ArrowLeft size={16} /> Tüm Rehberlere Dön
            </button>
          </Link>

          {/* Guide Hero */}
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--card-border)",
            borderRadius: "20px", padding: "32px", marginBottom: "24px",
            position: "relative", overflow: "hidden"
          }}>
            {/* Decorative gradient blob */}
            <div style={{
              position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px",
              background: `radial-gradient(circle, ${diff.color}15, transparent)`,
              borderRadius: "50%", pointerEvents: "none"
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                <span style={{
                  padding: "5px 14px", background: diff.bg, color: diff.color,
                  border: `1px solid ${diff.border}`, borderRadius: "8px",
                  fontSize: "12px", fontWeight: "700"
                }}>{diff.label}</span>
                <span style={{
                  padding: "5px 14px", background: "var(--secondary)",
                  border: "1px solid var(--card-border)", borderRadius: "8px",
                  fontSize: "12px", fontWeight: "600", color: "var(--text-muted)",
                  display: "flex", alignItems: "center", gap: "5px"
                }}>
                  <Clock size={12} /> {guide.duration}
                </span>
                <span style={{
                  padding: "5px 14px", background: "var(--secondary)",
                  border: "1px solid var(--card-border)", borderRadius: "8px",
                  fontSize: "12px", fontWeight: "600", color: "var(--text-muted)",
                }}>
                  {guide.steps.length} Adım
                </span>
              </div>

              <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "10px", lineHeight: 1.3 }}>
                {guide.title}
              </h1>
              <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "700px" }}>
                {guide.description}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--card-border)",
            borderRadius: "14px", padding: "20px", marginBottom: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>
                İlerleme Durumu
              </span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: progress === 100 ? "#10B981" : "var(--primary)" }}>
                {completedSteps.size}/{guide.steps.length} adım · %{progress}
              </span>
            </div>
            <div style={{
              height: "8px", borderRadius: "4px", background: "var(--secondary)",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%", borderRadius: "4px",
                width: `${progress}%`,
                background: progress === 100
                  ? "linear-gradient(90deg, #10B981, #34D399)"
                  : "linear-gradient(90deg, var(--primary), #60A5FA)",
                transition: "width 0.5s ease"
              }} />
            </div>
            {progress === 100 && (
              <div style={{
                marginTop: "12px", padding: "10px 16px", background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.25)", borderRadius: "10px",
                display: "flex", alignItems: "center", gap: "8px",
                fontSize: "13px", fontWeight: "600", color: "#10B981"
              }}>
                <CheckCircle size={16} /> Tebrikler! Tüm adımları tamamladınız 🎉
              </div>
            )}
          </div>

          {/* Warning */}
          {guide.warning && (
            <div style={{
              display: "flex", gap: "14px", padding: "18px 20px",
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "14px", marginBottom: "20px", alignItems: "flex-start"
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "rgba(239,68,68,0.15)", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <AlertTriangle size={18} color="#EF4444" />
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#EF4444", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>DİKKAT</div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>{guide.warning}</p>
              </div>
            </div>
          )}

          {/* Required Tools */}
          <div style={{
            background: "var(--card-bg)", border: "1px solid var(--card-border)",
            borderRadius: "14px", padding: "20px", marginBottom: "20px"
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--foreground)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Wrench size={16} color="var(--primary)" /> Gerekli Malzemeler
            </h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {guide.tools.map((tool, i) => (
                <span key={i} style={{
                  padding: "7px 14px", background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.15)", borderRadius: "8px",
                  fontSize: "12px", fontWeight: "600", color: "var(--foreground)",
                  display: "flex", alignItems: "center", gap: "6px"
                }}>
                  <Target size={11} color="var(--primary)" /> {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {guide.steps.map((step, idx) => {
              const isOpen = expandedStep === idx;
              const isDone = completedSteps.has(idx);
              return (
                <div key={idx} id={`step-${idx + 1}`} style={{
                  background: "var(--card-bg)",
                  border: `1px solid ${isDone ? "rgba(16,185,129,0.3)" : "var(--card-border)"}`,
                  borderRadius: "14px", overflow: "hidden",
                  transition: "all 0.2s"
                }}>
                  <button
                    onClick={() => toggleStep(idx)}
                    style={{
                      width: "100%", padding: "18px 20px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "transparent", border: "none", cursor: "pointer",
                      color: "var(--foreground)", gap: "14px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                      <div
                        onClick={(e) => { e.stopPropagation(); toggleCompleted(idx); }}
                        style={{
                          width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                          background: isDone
                            ? "linear-gradient(135deg, #10B981, #34D399)"
                            : `linear-gradient(135deg, var(--primary), #60A5FA)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all 0.3s",
                          boxShadow: isDone ? "0 4px 12px rgba(16,185,129,0.3)" : "0 4px 12px rgba(59,130,246,0.2)"
                        }}
                      >
                        {isDone ? (
                          <CheckCircle size={20} color="white" />
                        ) : (
                          <span style={{ fontSize: "15px", fontWeight: "800", color: "white" }}>{idx + 1}</span>
                        )}
                      </div>
                      <div style={{ textAlign: "left", minWidth: 0 }}>
                        <h4 style={{
                          fontSize: "15px", fontWeight: "700",
                          color: isDone ? "#10B981" : "var(--foreground)",
                          margin: 0, textDecoration: isDone ? "line-through" : "none",
                          opacity: isDone ? 0.7 : 1
                        }}>
                          {step.title}
                        </h4>
                        {!isOpen && (
                          <p style={{
                            fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0 0",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            maxWidth: "500px"
                          }}>
                            {step.detail}
                          </p>
                        )}
                      </div>
                    </div>
                    {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: "0 20px 20px 74px",
                      borderTop: "1px solid var(--card-border)",
                      animation: "fadeIn 0.2s ease"
                    }}>
                      <p style={{
                        fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8,
                        marginTop: "16px", marginBottom: step.tip ? "14px" : "0"
                      }}>
                        {step.detail}
                      </p>

                      {step.tip && (
                        <div style={{
                          display: "flex", gap: "10px", padding: "12px 16px",
                          background: "rgba(59,130,246,0.06)",
                          border: "1px solid rgba(59,130,246,0.15)",
                          borderRadius: "10px", alignItems: "flex-start"
                        }}>
                          <Lightbulb size={16} color="#3B82F6" style={{ flexShrink: 0, marginTop: "2px" }} />
                          <p style={{ fontSize: "12px", color: "var(--primary)", lineHeight: 1.6, margin: 0, fontWeight: "500" }}>
                            <strong>İpucu:</strong> {step.tip}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => toggleCompleted(idx)}
                        style={{
                          marginTop: "14px", padding: "8px 18px",
                          background: isDone ? "rgba(16,185,129,0.1)" : "var(--secondary)",
                          border: `1px solid ${isDone ? "rgba(16,185,129,0.3)" : "var(--card-border)"}`,
                          borderRadius: "8px", cursor: "pointer",
                          fontSize: "12px", fontWeight: "700",
                          color: isDone ? "#10B981" : "var(--text-muted)",
                          display: "flex", alignItems: "center", gap: "6px",
                          transition: "all 0.2s"
                        }}
                      >
                        <CheckCircle size={14} />
                        {isDone ? "Tamamlandı ✓" : "Tamamlandı Olarak İşaretle"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

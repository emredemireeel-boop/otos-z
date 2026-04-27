"use client";

import React from "react";
import { ArrowRight, Info, CheckCircle, Circle, ChevronRight } from "lucide-react";
import Link from "next/link";

import { motion } from "framer-motion";
import Image from "next/image";

// ==========================================
// 🎩 LUXURY TOP BAR
// ==========================================
interface LuxuryTopBarProps {
  title?: string;
  subtitle?: string;
  onContinue?: () => void;
  canContinue?: boolean;
  stepText?: string;
  backHref?: string;
}

export function LuxuryTopBar({
  title = "Uzmana Sor",
  subtitle = "Gerçek ustalardan hızlı ikinci görüş",
  onContinue,
  canContinue = false,
  stepText,
  backHref = "/",
}: LuxuryTopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#141824]/95 backdrop-blur-md border-b border-[#2A3346] shadow-lg">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Title Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Link href={backHref} className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#7C4DFF]/90 to-[#536DFE]/40 hover:opacity-80 transition-opacity">
              <span className="text-white text-lg font-bold">←</span>
            </Link>
            <div className="relative h-8 w-32">
              <Image
                src="/white_logo.svg"
                alt="Otosöz Logo"
                fill
                sizes="32px"
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          {stepText && (
            <span className="text-xs text-[#6B7280] ml-11">{stepText}</span>
          )}
          {!stepText && (
            <p className="text-sm text-[#B0B8C8] ml-11">{subtitle}</p>
          )}
        </div>

        {/* Continue Button */}
        {onContinue && (
          <button
            onClick={onContinue}
            disabled={!canContinue}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300
              ${canContinue
                ? "bg-gradient-to-r from-[#7C4DFF] to-[#536DFE] text-white shadow-[0_0_20px_rgba(124,77,255,0.4)] transform hover:scale-105"
                : "bg-[#252D40] text-[#6B7280] cursor-not-allowed"
              }
            `}
          >
            Devam et
            <ArrowRight size={16} className={canContinue ? "animate-pulse" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 💳 PREMIUM SERVICE CARD
// ==========================================
interface PremiumServiceCardProps {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  badge?: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  selected: boolean;
  onClick: () => void;
}

export function PremiumServiceCard({
  title,
  tagline,
  description,
  features,
  badge,
  icon,
  gradientFrom,
  gradientTo,
  selected,
  onClick,
}: PremiumServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      animate={{ scale: selected ? 1.02 : 1 }}
      onClick={onClick}
      className={`
        relative w-full rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300
        ${selected ? "ring-2 ring-white shadow-2xl" : "shadow-lg"}
      `}
      style={{
        background: selected
          ? `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
          : `linear-gradient(135deg, ${gradientFrom}BB, ${gradientTo}BB)` // slightly transparent if not selected
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Highlight Overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      <div className="relative p-6 flex flex-col gap-4 text-white">
        <div className="flex items-center gap-4">
          {/* Icon Box */}
          <div className="w-[60px] h-[60px] rounded-[18px] bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            {icon}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-white/90 font-medium">{tagline}</p>
            {badge && (
              <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 border border-white/30 backdrop-blur-sm">
                <span className="text-[10px] font-bold">★ {badge}</span>
              </div>
            )}
          </div>

          {/* Selection Circle */}
          <div className={`
            w-9 h-9 rounded-full flex items-center justify-center transition-all
            ${selected ? "bg-white text-black scale-100" : "bg-white/10 scale-0 opacity-0"}
          `}>
            {selected && <CheckCircle className="text-current" size={20} />}
          </div>
        </div>

        <p className="text-sm text-white/95 leading-relaxed">
          {description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mt-2">
          {features.map((feat, i) => (
            <div key={i} className="flex items- center gap-1.5 opacity-90">
              <CheckCircle size={14} className="text-white/80" />
              <span className="text-xs">{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 💡 INFO BANNER
// ==========================================
export function InfoBanner() {
  return (
    <div className="rounded-2xl bg-[#1C2233]/75 border border-[#2A3346] shadow-md p-4 backdrop-blur-sm">
      <div className="flex gap-4 items-center">
        <div className="w-[46px] h-[46px] rounded-2xl bg-gradient-to-r from-[#FFC107]/40 to-[#7C4DFF]/40 flex items-center justify-center shrink-0">
          <Info className="text-white" size={24} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[#E8EAED] text-sm font-medium">Tüm paketler uzaktan danışmanlık Şeklindedir.</p>
          <p className="text-[#B0B8C8] text-xs leading-tight">Ortalama cevap süresi 15—30 dk. YoÃ„şunluk durumunda bu süre değişebilir.</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 👥 ACC SELECT CARD (Role Selection)
// ==========================================
interface AccSelectCardProps {
  title: string;
  tag: string;
  description: string;
  highlights: string[];
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  selected: boolean;
  onClick: () => void;
}

export function AccSelectCard({
  title,
  tag,
  description,
  highlights,
  icon,
  gradientFrom,
  gradientTo,
  selected,
  onClick
}: AccSelectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      animate={{ scale: selected ? 1 : 0.98 }}
      onClick={onClick}
      className={`
            relative overflow-hidden rounded-[20px] cursor-pointer border-2 transition-all duration-300
            ${selected ? "border-[#FF6B00] shadow-lg" : "border-[#2A3346]/30 shadow-sm"}
        `}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }} />
      <div className="absolute inset-0 bg-black/50" /> {/* Darken */}

      <div className="relative p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-white/25 text-[10px] font-bold text-white w-fit">
              {tag}
            </span>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            {icon}
          </div>
        </div>

        <p className="text-sm text-white/95 leading-relaxed">{description}</p>

        <div className="space-y-1 mt-1">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle size={14} className="text-white/80" />
              <span className="text-xs text-white/90">{h}</span>
            </div>
          ))}
        </div>

        {/* Selected Indicator */}
        <div className="flex justify-between items-center mt-2">
          {selected && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6B00]">
              <CheckCircle size={14} className="text-white" />
              <span className="text-[10px] font-bold text-white uppercase">Seçildi</span>
            </div>
          )}
          <div className="ml-auto w-5 h-5 rounded-full border border-white/50 flex items-center justify-center">
            {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 🛠️ ïÂ¸Â� HELPER COMPONENTS
// ==========================================

export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1 mb-2">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-xs text-[#B0B8C8]">{subtitle}</p>
    </div>
  );
}

export function AccHelpCard({ title, subtitle, lines, icon: IconComp, iconColor }: any) {
  return (
    <div className="rounded-[18px] bg-[#252D40]/50 border border-[#2A3346]/40 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <IconComp size={24} style={{ color: iconColor }} />
        <div>
          <h4 className="text-white font-bold text-sm">{title}</h4>
          <p className="text-[#B0B8C8] text-xs">{subtitle}</p>
        </div>
      </div>
      <ul className="space-y-2">
        {lines.map((line: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[#E8EAED]">
            <span className="block w-1 h-1 rounded-full bg-[#6B7280] mt-1.5 shrink-0" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}

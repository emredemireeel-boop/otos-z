"use client";
// Moderatör: Şikayet Kuyruğu - Admin sayfasının yetkili versiyonu
// kullanici_yonetim yetkisine göre Ban/Uyar butonları gösterilir
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ModPermission } from "@/data/moderators";

// Sayfayı doğrudan /admin/raporlar içeriğini yeniden kullanarak render et
// Moderatör paneli için yetki kontrolü wrapper'ı
export { default } from "@/app/admin/raporlar/page";

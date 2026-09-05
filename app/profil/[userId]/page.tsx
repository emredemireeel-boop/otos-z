"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Settings, Bell, Car, MessageSquare, Heart, Award, Calendar, MapPin, Edit2, Camera, TrendingUp, Eye, ThumbsUp, X, Flag, Send, AlertTriangle, ShieldCheck, CheckCircle, ExternalLink, Sprout, Wrench, Crown, Sparkles, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { getAllCities, getDistrictsForCity } from "@/data/locations";
import { getAllBrands, getModelsForBrand } from "@/data/listings";
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { startConversation } from "@/lib/messageService";
import { getUserRating } from "@/lib/userService";
import { getLevelForXP, getNextLevel, getXPProgress } from "@/lib/xpService";
import { Star } from "lucide-react";

// Seviye ikonu adı → lucide bileşeni (profesyonel, emoji yok)
const LEVEL_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    Sprout, Car, Heart, Wrench, Star, Award, Crown, Sparkles,
};

// Rol → renk + etiket (profesyonel, tutarlı)
const ROLE_STYLES: Record<string, { label: string; bg: string; color: string }> = {
    admin: { label: "Yönetici", bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
    moderator: { label: "Moderatör", bg: "rgba(139,92,246,0.12)", color: "#8B5CF6" },
    uzman: { label: "Onaylı Uzman", bg: "rgba(16,185,129,0.12)", color: "#10B981" },
    usta: { label: "Usta", bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
    premium: { label: "Premium Üye", bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
    caylak: { label: "Çaylak", bg: "var(--secondary)", color: "var(--text-muted)" },
    standard: { label: "Üye", bg: "var(--secondary)", color: "var(--text-muted)" },
};

// Yazar seviye renkleri
const levelColors: Record<string, { bg: string; text: string }> = {
    "Çaylak": { bg: "rgba(100, 100, 100, 0.2)", text: "#888" },
    "Sürücü": { bg: "rgba(59, 130, 246, 0.2)", text: "#3b82f6" },
    "Tutkun": { bg: "rgba(168, 85, 247, 0.2)", text: "#a855f7" },
    "Usta": { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" },
    "Efsane": { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
};

interface UserProfileData {
    bio: string;
    carBrand: string;
    carModel: string;
    carYear: string;
    city: string;
    district: string;
    displayUsername: string;
    firstName: string;
    lastName: string;
    birthdate: string;
    photoURL?: string;
}

// Mask name for privacy (show first letter + asterisks)
const maskName = (name: string): string => {
    if (!name || name.length === 0) return '';
    if (name.length === 1) return name;
    return name.charAt(0) + '*'.repeat(name.length - 1);
};

export default function ProfilPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const rawUserId = params?.userId as string;    
    const userId = rawUserId ? decodeURIComponent(rawUserId) : "";
    const [activeTab, setActiveTab] = useState<"posts" | "comments" | "likes">("posts");
    const [showEditModal, setShowEditModal] = useState(false);
    const [photoToast, setPhotoToast] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportSent, setReportSent] = useState(false);
    const [messageSending, setMessageSending] = useState(false);
    const [showGarageModal, setShowGarageModal] = useState(false);
    const [garagePlate, setGaragePlate] = useState("");
    const [garageSubmitting, setGarageSubmitting] = useState(false);
    const [garageSuccess, setGarageSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Check if viewing own profile
    const isOwnProfile = user?.username === userId;

    // Initial profile data
    const [profileData, setProfileData] = useState<UserProfileData>({
        bio: "",
        carBrand: "",
        carModel: "",
        carYear: "",
        city: user?.city || "",
        district: "",
        displayUsername: userId || "",
        firstName: "",
        lastName: "",
        birthdate: "",
        photoURL: ""
    });
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [otherUserData, setOtherUserData] = useState<{id:string; role:string; entryCount:number; createdAt?:any; xp?:number; level?:string; badges?:string[]; likesReceived?:number} | null>(null);
    const [userThreads, setUserThreads] = useState<{id:string;title:string;views:number;entryCount:number}[]>([]);
    const [userEntries, setUserEntries] = useState<any[]>([]);
    const [userRating, setUserRating] = useState({ average: 0, count: 0 });

    // Load profile from Firestore (own or other user)
    useEffect(() => {
        const loadProfile = async () => {
            try {
                // Find user doc by username
                const usersSnap = await getDocs(query(collection(db, "users"), where("username", "==", userId)));
                if (!usersSnap.empty) {
                    const userDoc = usersSnap.docs[0];
                    const data = userDoc.data();
                    setProfileData({
                        bio: data.bio || "",
                        carBrand: data.carBrand || "",
                        carModel: data.carModel || "",
                        carYear: data.carYear || "",
                        city: data.city || "",
                        district: data.district || "",
                        displayUsername: data.username || userId,
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        birthdate: data.birthdate || "",
                        photoURL: data.photoURL || ""
                    });
                    setOtherUserData({
                        id: userDoc.id,
                        role: data.role || "caylak",
                        entryCount: data.entryCount || 0,
                        createdAt: data.createdAt || null,
                        xp: data.xp || 0,
                        level: data.level || "Çaylak",
                        badges: Array.isArray(data.badges) ? data.badges : [],
                        likesReceived: data.likesReceived || 0,
                    });
                    // Fetch user rating
                    const ratingData = await getUserRating(userDoc.id);
                    setUserRating(ratingData);
                }
                // Load user's threads
                const threadsSnap = await getDocs(query(collection(db, "threads"), where("authorUsername", "==", userId)));
                const threads = threadsSnap.docs.map(d => ({
                    id: d.id, title: d.data().title || "", views: d.data().views || 0, entryCount: d.data().entryCount || 0,
                }));
                setUserThreads(threads);
                
                // Load user's entries
                const { getUserEntries } = await import("@/lib/forumService");
                const entries = await getUserEntries(userId);
                setUserEntries(entries);
            } catch (e) {
                console.warn("Profil yuklenemedi:", e);
            }
            setProfileLoaded(true);
        };
        if (userId) loadProfile();
    }, [userId]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/giris");
        }
    }, [user, isLoading, router]);

    const handleSendMessage = async () => {
        if (!user || !otherUserData || isOwnProfile || messageSending) return;
        setMessageSending(true);
        try {
            const convId = await startConversation(user.id as string, user.username, otherUserData.id, userId);
            router.push(`/mesajlar?conv=${convId}`);
        } catch (e) {
            console.error("Mesaj gonderilemedi:", e);
        }
        setMessageSending(false);
    };

    const handleReport = async () => {
        if (!user || !otherUserData || !reportReason.trim()) return;
        try {
            await addDoc(collection(db, "reports"), {
                reporterId: user.id,
                reporterUsername: user.username,
                reportedUserId: otherUserData.id,
                reportedUsername: userId,
                reason: reportReason.trim(),
                createdAt: serverTimestamp(),
                status: "pending",
            });
            setReportSent(true);
            setTimeout(() => { setShowReportModal(false); setReportSent(false); setReportReason(""); }, 2000);
        } catch (e) {
            console.error("Sikayet gonderilemedi:", e);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user) return;
        const file = e.target.files[0];
        
        // Cihazda resmi 100x100 boyutuna küçült
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = 100;
                canvas.height = 100;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    // Resmi ortala ve kırp (Cover)
                    const minDim = Math.min(img.width, img.height);
                    const srcX = (img.width - minDim) / 2;
                    const srcY = (img.height - minDim) / 2;
                    ctx.drawImage(img, srcX, srcY, minDim, minDim, 0, 0, 100, 100);
                    
                    const dataUrl = canvas.toDataURL("image/webp", 0.8); // Düşük boyutlu WebP
                    
                    try {
                        setUploadingAvatar(true);
                        const avatarRef = ref(storage, `avatars/${user.id}.webp`);
                        await uploadString(avatarRef, dataUrl, 'data_url');
                        const downloadURL = await getDownloadURL(avatarRef);
                        
                        await setDoc(doc(db, "users", user.id as string), {
                            photoURL: downloadURL
                        }, { merge: true });
                        
                        setProfileData(prev => ({...prev, photoURL: downloadURL}));
                        setPhotoToast(true);
                        setTimeout(() => setPhotoToast(false), 3000);
                    } catch (err) {
                        console.error("Avatar yüklenirken hata:", err);
                    } finally {
                        setUploadingAvatar(false);
                    }
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleGarageVerifySubmit = async () => {
        if (!user || !garagePlate.trim()) return;
        setGarageSubmitting(true);
        try {
            await addDoc(collection(db, "guvenmetre"), {
                userId: user.id,
                username: user.username,
                displayName: profileData.displayUsername,
                carBrand: profileData.carBrand || "Belirtilmedi",
                carModel: profileData.carModel || "Belirtilmedi",
                plate: garagePlate.trim().toUpperCase(),
                createdAt: serverTimestamp(),
                status: "pending",
                score: 0,
                note: ""
            });
            setGarageSuccess(true);
            setTimeout(() => { setShowGarageModal(false); setGarageSuccess(false); setGaragePlate(""); }, 2000);
        } catch (e) {
            console.error("Garaj başvurusu yapılamadı:", e);
        } finally {
            setGarageSubmitting(false);
        }
    };

    const handleProfileUpdate = async (newData: UserProfileData) => {
        setProfileData(newData);
        setShowEditModal(false);
        // Save to Firestore
        if (user) {
            try {
                await setDoc(doc(db, "users", user.id as string), {
                    bio: newData.bio,
                    carBrand: newData.carBrand,
                    carModel: newData.carModel,
                    carYear: newData.carYear,
                    city: newData.city,
                    district: newData.district,
                    username: newData.displayUsername,
                    firstName: newData.firstName,
                    lastName: newData.lastName,
                    birthdate: newData.birthdate,
                }, { merge: true });
            } catch (e) {
                console.error("Profil kaydedilemedi:", e);
            }
        }
    };

    if (isLoading || !user) {
        return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-white">Yükleniyor...</div>;
    }

    const getRoleInfo = (role: string | undefined) => {
        const key = (role || "caylak").toLowerCase();
        const style = ROLE_STYLES[key] || ROLE_STYLES.caylak;
        return { label: style.label, color: { bg: style.bg, text: style.color } };
    };

    const { label: roleLabel, color: roleColor } = getRoleInfo(otherUserData?.role);
    const locationString = profileData.city && profileData.district ? `${profileData.city}, ${profileData.district}` : profileData.city || "";
    const carString = profileData.carBrand && profileData.carModel ? `${profileData.carBrand} ${profileData.carModel}${profileData.carYear ? ` (${profileData.carYear})` : ''}` : profileData.carBrand || "";

    return (
        <div>
            <Navbar />

            <main className="profile-container min-h-screen">
                {photoToast && (
                    <div style={{ position:'fixed', top:'80px', left:'50%', transform:'translateX(-50%)', zIndex:9999, background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'12px', padding:'14px 24px', boxShadow:'0 8px 30px rgba(0,0,0,0.3)', display:'flex', alignItems:'center', gap:'10px', animation:'slideDown 0.3s ease' }}>
                        <CheckCircle size={18} style={{color:'#10B981'}} />
                        <span style={{fontSize:'14px',color:'var(--foreground)',fontWeight:'500'}}>Profil fotoğrafınız güncellendi!</span>
                    </div>
                )}

                {/* Profile Header */}
                <div className="profile-header-wrapper">
                    <div className="profile-header">
                            {/* Avatar */}
                            <div className="profile-avatar-wrapper">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    style={{ display: 'none' }} 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                />
                                <div className="profile-avatar" style={{ backgroundImage: profileData.photoURL ? `url(${profileData.photoURL})` : 'none' }}>
                                    {!profileData.photoURL && profileData.displayUsername.charAt(0).toUpperCase()}
                                </div>
                                {isOwnProfile && (
                                    <button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        disabled={uploadingAvatar}
                                        className="profile-avatar-edit-btn"
                                        style={{ opacity: uploadingAvatar ? 0.5 : 1 }}
                                    >
                                        {uploadingAvatar ? (
                                            <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        ) : (
                                            <Camera style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="profile-info-section">
                                <div className="profile-username-row">
                                    <h1 className="profile-username">
                                        @{profileData.displayUsername}
                                    </h1>
                                    <span className="profile-role-badge" style={{ background: roleColor.bg, color: roleColor.text, borderColor: 'transparent' }}>
                                        <Award size={14} /> {roleLabel}
                                    </span>
                                </div>
                                
                                {/* User Rating */}
                                <div className="profile-rating">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star 
                                                key={star} 
                                                size={16} 
                                                color={star <= Math.round(userRating.average) ? '#F59E0B' : 'var(--card-border)'} 
                                                fill={star <= Math.round(userRating.average) ? '#F59E0B' : 'transparent'} 
                                            />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>
                                        {userRating.average.toFixed(1)}
                                    </span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        ({userRating.count} Değerlendirme)
                                    </span>
                                </div>

                                {(profileData.firstName || profileData.lastName) && (
                                    <p className="profile-fullname">
                                        {maskName(profileData.firstName)} {maskName(profileData.lastName)}
                                    </p>
                                )}
                                <p className="profile-bio">
                                    {profileData.bio}
                                </p>
                                <div className="profile-meta-row">
                                    {carString && (
                                        <span className="profile-meta-item">
                                            <Car style={{ width: '14px', height: '14px' }} />
                                            {carString}
                                        </span>
                                    )}
                                    {locationString && (
                                        <span className="profile-meta-item">
                                            <MapPin style={{ width: '14px', height: '14px' }} />
                                            {locationString}
                                        </span>
                                    )}
                                    {otherUserData?.createdAt && (
                                        <span className="profile-meta-item">
                                            <Calendar style={{ width: '14px', height: '14px' }} />
                                            {(() => {
                                                const d = otherUserData.createdAt?.toDate
                                                    ? otherUserData.createdAt.toDate()
                                                    : (typeof otherUserData.createdAt === 'string' ? new Date(otherUserData.createdAt) : null);
                                                return d ? `${d.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} tarihinde katıldı` : '';
                                            })()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                                {isOwnProfile ? (
                                    <>
                                        <button onClick={() => setShowEditModal(true)} className="btn-secondary">
                                            <Edit2 size={16} /> Profili Duzenle
                                        </button>
                                        <button onClick={() => setShowGarageModal(true)} className="btn-primary">
                                            <ShieldCheck size={16} /> Garajı Doğrula
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleSendMessage} disabled={messageSending} className="btn-primary">
                                            <Send size={16} /> {messageSending ? 'Aciliyor...' : 'Mesaj At'}
                                        </button>
                                        <button onClick={() => setShowReportModal(true)} className="btn-danger-outline">
                                            <Flag size={16} /> Sikayet Et
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                {/* Stats Bar */}
                <div className="profile-stats-bar" style={{
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '20px 24px',
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Baslik', value: userThreads.length, icon: MessageSquare },
                                { label: 'Entry', value: Math.max(otherUserData?.entryCount || 0, userEntries.length), icon: MessageSquare },
                                { label: 'Görüntüleme', value: userThreads.reduce((s,t) => s + t.views, 0), icon: Eye },
                                { label: 'Beğeni', value: otherUserData?.likesReceived || 0, icon: ThumbsUp },
                            ].map((stat, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                        <stat.icon style={{ width: '12px', height: '12px' }} />
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="profile-main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                    <div className="profile-content-grid">
                        {/* Left - Activity */}
                        <div>
                            {/* Tabs */}
                            <div className="profile-tabs">
                                <button onClick={() => setActiveTab('posts')} className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}>
                                    Başlıklar ({userThreads.length})
                                </button>
                                <button onClick={() => setActiveTab('comments')} className={`profile-tab ${activeTab === 'comments' ? 'active' : ''}`}>
                                    Entryler ({userEntries.length})
                                </button>
                            </div>

                            {/* Thread/Entry List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {activeTab === 'posts' ? (
                                    userThreads.length === 0 ? (
                                        <div className="profile-card" style={{ textAlign: 'center' }}>
                                            <MessageSquare size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block' }} />
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Henuz baslik acilmamis</p>
                                        </div>
                                    ) : (
                                        userThreads.map((thread) => (
                                            <div key={thread.id} onClick={() => router.push(`/forum/konu/${thread.id}`)} className="profile-feed-item">
                                                <h3 className="profile-card-title" style={{ marginBottom: '8px' }}>{thread.title}</h3>
                                                <div className="profile-meta-row" style={{ fontSize: '12px' }}>
                                                    <span className="profile-meta-item"><Eye size={12} /> {thread.views}</span>
                                                    <span className="profile-meta-item"><MessageSquare size={12} /> {thread.entryCount} entry</span>
                                                </div>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    userEntries.length === 0 ? (
                                        <div className="profile-card" style={{ textAlign: 'center' }}>
                                            <MessageSquare size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block' }} />
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Henuz entry girilmemis</p>
                                        </div>
                                    ) : (
                                        userEntries.map((entry) => {
                                            // Build slug URL
                                            const createSlugLocal = (text: string) => {
                                                const trMap: { [key: string]: string } = { 'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','Ç':'c','Ğ':'g','İ':'i','Ö':'o','Ş':'s','Ü':'u' };
                                                return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, m => trMap[m] || m).toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
                                            };
                                            const entryUrl = entry.threadUrlId && entry.threadTitle
                                                ? `/forum/${createSlugLocal(entry.threadTitle)}--${entry.threadUrlId}`
                                                : `/forum/konu/${entry.threadId}`;
                                            return (
                                            <div key={entry.id} onClick={() => router.push(entryUrl)} className="profile-feed-item">
                                                {entry.threadTitle && (
                                                    <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <MessageSquare size={12} />
                                                        {entry.threadTitle}
                                                    </div>
                                                )}
                                                <p style={{ fontSize: '14px', color: 'var(--foreground)', marginBottom: '12px', lineHeight: '1.5' }}>
                                                    {entry.content.length > 150 ? entry.content.substring(0, 150) + '...' : entry.content}
                                                </p>
                                                <div className="profile-meta-row" style={{ fontSize: '12px' }}>
                                                    <span className="profile-meta-item"><ThumbsUp size={12} /> {entry.likes || 0} beğeni</span>
                                                    <span>{new Date(entry.createdAt?.toDate ? entry.createdAt.toDate() : entry.createdAt).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                            </div>
                                            );
                                        })
                                    )
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside>
                            {/* Seviye & XP Kartı */}
                            {(() => {
                                const xp = otherUserData?.xp || 0;
                                const levelInfo = getLevelForXP(xp);
                                const nextLevel = getNextLevel(xp);
                                const prog = getXPProgress(xp);
                                const LevelIcon = LEVEL_ICON_MAP[levelInfo.icon] || Sprout;
                                return (
                                    <div className="profile-card">
                                        <h3 className="profile-section-title">Seviye</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${levelInfo.color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <LevelIcon size={22} color={levelInfo.color} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '16px', fontWeight: '800', color: levelInfo.color }}>{levelInfo.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{xp.toLocaleString('tr-TR')} XP</div>
                                            </div>
                                        </div>
                                        {nextLevel ? (
                                            <>
                                                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--secondary)', overflow: 'hidden', marginBottom: '8px' }}>
                                                    <div style={{ height: '100%', borderRadius: '4px', background: levelInfo.color, width: `${prog.percentage}%`, transition: 'width 0.6s ease' }} />
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                                    <strong style={{ color: 'var(--foreground)' }}>{nextLevel.name}</strong> seviyesine {(nextLevel.minXP - xp).toLocaleString('tr-TR')} XP kaldı
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' }}>
                                                🎉 En yüksek seviyeye ulaşıldı
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Rozetler Kartı */}
                            {otherUserData?.badges && otherUserData.badges.length > 0 && (
                                <div className="profile-card">
                                    <h3 className="profile-section-title">Rozetler ({otherUserData.badges.length})</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {otherUserData.badges.map((badge, i) => (
                                            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 8px 6px 12px', borderRadius: '8px', background: 'var(--secondary)', border: '1px solid var(--card-border)', fontSize: '13px', fontWeight: '600', color: 'var(--foreground)' }}>
                                                <Award size={13} style={{ color: 'var(--text-muted)' }} />
                                                {badge}
                                                <a href={`/basarim/${params.userId}/${encodeURIComponent(badge)}`} aria-label={`${badge} başarım kartını aç`} title="Başarım kartını paylaş" style={{ display:'grid', placeItems:'center', width:'24px', height:'24px', marginLeft:'3px', borderRadius:'6px', color:'var(--primary)', background:'var(--card-bg)' }}><Share2 size={12}/></a>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Profile Info Card */}
                            <div className="profile-card">
                                <h3 className="profile-section-title">Profil Bilgileri</h3>
                                <div className="profile-meta-row" style={{ flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                                    {carString && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Araç</span>
                                            <span style={{ color: 'var(--foreground)', fontWeight: '500' }}>{carString}</span>
                                        </div>
                                    )}
                                    {locationString && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Konum</span>
                                            <span style={{ color: 'var(--foreground)', fontWeight: '500' }}>{locationString}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Statü</span>
                                        <span style={{ color: 'var(--foreground)', fontWeight: '600' }}>{roleLabel}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Card */}
                            {profileData.bio && (
                                <div className="profile-card">
                                    <h3 className="profile-section-title">Hakkında</h3>
                                    <p className="profile-bio">{profileData.bio}</p>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>

                {/* Report Modal */}
                {showReportModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={20} color="var(--text-muted)" /> Kullaniciyi Sikayet Et</h2>
                                <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            {reportSent ? (
                                <p style={{ textAlign: 'center', color: '#22c55e', fontSize: '14px', fontWeight: '600', padding: '20px 0' }}>Sikayetiniz iletildi. Tesekkurler!</p>
                            ) : (
                                <>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>@{userId} kullanicisini neden sikayet ediyorsunuz?</p>
                                    <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Sikayet nedeninizi yazin..." rows={4} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--secondary)', border: '1px solid var(--card-border)', color: 'var(--foreground)', outline: 'none', resize: 'none', fontSize: '14px', marginBottom: '16px' }} />
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => setShowReportModal(false)} style={{ padding: '10px 20px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--foreground)', cursor: 'pointer', fontWeight: '500' }}>Iptal</button>
                                        <button onClick={handleReport} disabled={!reportReason.trim()} style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--foreground)', border: 'none', color: 'var(--background)', cursor: 'pointer', fontWeight: '600', opacity: reportReason.trim() ? 1 : 0.5 }}>Sikayet Gonder</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Garage Verification Modal */}
                {showGarageModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ShieldCheck size={20} color="var(--primary)" /> Garaj Doğrulama
                                </h2>
                                <button onClick={() => setShowGarageModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            {garageSuccess ? (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                                    <h3 style={{ color: '#22c55e', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Başvuru Alındı!</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Garaj doğrulama başvurunuz başarıyla yöneticilere iletildi. En kısa sürede incelenecektir.</p>
                                </div>
                            ) : (
                                <>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                                        Güvenmetre ile aracınızı doğrulatarak profilinizde <b>"Garaj Doğrulandı"</b> rozeti kazanabilir ve toplulukta güvenilirliğinizi artırabilirsiniz. Lütfen araç plakanızı girin.
                                    </p>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Araç Plakası</label>
                                        <input 
                                            value={garagePlate} 
                                            onChange={(e) => setGaragePlate(e.target.value)} 
                                            placeholder="Örn: 34 ABC 123" 
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--secondary)', border: '1px solid var(--card-border)', color: 'var(--foreground)', outline: 'none', fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }} 
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => setShowGarageModal(false)} style={{ padding: '10px 20px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--foreground)', cursor: 'pointer', fontWeight: '500' }}>İptal</button>
                                        <button onClick={handleGarageVerifySubmit} disabled={!garagePlate.trim() || garageSubmitting} style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--primary)', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '600', opacity: (!garagePlate.trim() || garageSubmitting) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {garageSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit Profile Modal */}
                {showEditModal && (
                    <EditProfileModal
                        currentData={profileData}
                        onClose={() => setShowEditModal(false)}
                        onSubmit={handleProfileUpdate}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}

// Edit Profile Modal Component
function EditProfileModal({
    currentData,
    onClose,
    onSubmit
}: {
    currentData: UserProfileData;
    onClose: () => void;
    onSubmit: (data: UserProfileData) => void;
}) {
    const [bio, setBio] = useState(currentData.bio);
    const [carBrand, setCarBrand] = useState(currentData.carBrand);
    const [carModel, setCarModel] = useState(currentData.carModel);
    const [carYear, setCarYear] = useState(currentData.carYear);
    const [city, setCity] = useState(currentData.city);
    const [district, setDistrict] = useState(currentData.district);
    const [displayUsername, setDisplayUsername] = useState(currentData.displayUsername);
    const [firstName, setFirstName] = useState(currentData.firstName);
    const [lastName, setLastName] = useState(currentData.lastName);
    const [birthdate, setBirthdate] = useState(currentData.birthdate);

    // Generate year options (1970 to current year)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1969 }, (_, i) => String(currentYear - i));

    const brands = useMemo(() => getAllBrands(), []);
    const models = useMemo(() => carBrand ? getModelsForBrand(carBrand) : [], [carBrand]);

    const cities = useMemo(() => getAllCities(), []);
    const districts = useMemo(() => getDistrictsForCity(city), [city]);

    // Reset model when brand changes
    useEffect(() => {
        if (carBrand !== currentData.carBrand) {
            setCarModel("");
        }
    }, [carBrand, currentData.carBrand]);

    // Reset district when city changes
    useEffect(() => {
        if (city !== currentData.city) {
            setDistrict("");
        }
    }, [city, currentData.city]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            bio,
            carBrand,
            carModel,
            carYear,
            city,
            district,
            displayUsername,
            firstName,
            lastName,
            birthdate
        });
    };

    return (
        <div className="profile-edit-overlay" style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--overlay-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            overflow: 'auto',
        }}>
            <div className="profile-edit-modal" style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--card-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>
                        Profili Düzenle
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        <X style={{ width: '24px', height: '24px' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
                    {/* Username */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            value={displayUsername}
                            onChange={(e) => setDisplayUsername(e.target.value)}
                            placeholder="kullaniciadi"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--foreground)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Name Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                Ad (Opsiyonel)
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ahmet"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    color: 'var(--foreground)',
                                    outline: 'none'
                                }}
                            />
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                                Profilde: A***
                            </p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                Soyad (Opsiyonel)
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Yılmaz"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    color: 'var(--foreground)',
                                    outline: 'none'
                                }}
                            />
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                                Profilde: Y*****
                            </p>
                        </div>
                    </div>

                    {/* Birthdate */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            DoÃ„şum Tarihi (Opsiyonel)
                        </label>
                        <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--foreground)',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        />
                    </div>

                    {/* Bio */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            Hakkımda
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--foreground)',
                                outline: 'none',
                                resize: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                Araç Markası
                            </label>
                            <select
                                value={carBrand}
                                onChange={(e) => setCarBrand(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    color: 'var(--foreground)',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">Seçiniz</option>
                                {brands.map(b => (
                                    <option key={b} value={b} style={{ background: '#1a1a1a' }}>{b}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                Model
                            </label>
                            <select
                                value={carModel}
                                onChange={(e) => setCarModel(e.target.value)}
                                disabled={!carBrand}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    color: 'var(--foreground)',
                                    outline: 'none',
                                    cursor: carBrand ? 'pointer' : 'not-allowed',
                                    opacity: carBrand ? 1 : 0.5
                                }}
                            >
                                <option value="">Seçiniz</option>
                                {models.map(m => (
                                    <option key={m} value={m} style={{ background: '#1a1a1a' }}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Car Year */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            Araç Yılı
                        </label>
                        <select
                            value={carYear}
                            onChange={(e) => setCarYear(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'var(--secondary)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--foreground)',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Seçiniz</option>
                            {yearOptions.map(y => (
                                <option key={y} value={y} style={{ background: '#1a1a1a' }}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                İl
                            </label>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    color: 'var(--foreground)',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">Seçiniz</option>
                                {cities.map(c => (
                                    <option key={c} value={c} style={{ background: '#1a1a1a' }}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                İlçe
                            </label>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                disabled={!city}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: 'var(--secondary)',
                                    border: '1px solid var(--card-border)',
                                    color: 'var(--foreground)',
                                    outline: 'none',
                                    cursor: city ? 'pointer' : 'not-allowed',
                                    opacity: city ? 1 : 0.5
                                }}
                            >
                                <option value="">Seçiniz</option>
                                {districts.map(d => (
                                    <option key={d} value={d} style={{ background: '#1a1a1a' }}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: 'transparent',
                                border: '1px solid var(--card-border)',
                                color: 'var(--foreground)',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                background: 'var(--primary)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: '600',
                            }}
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

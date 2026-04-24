"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Settings, Bell, Car, MessageSquare, Heart, Award, Calendar, MapPin, Edit2, Camera, TrendingUp, Eye, ThumbsUp, X, Flag, Send, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { getAllCities, getDistrictsForCity } from "@/data/locations";
import { getAllBrands, getModelsForBrand } from "@/data/listings";
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { startConversation } from "@/lib/messageService";
import { getUserRating } from "@/lib/userService";
import { Star } from "lucide-react";

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
        birthdate: ""
    });
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [otherUserData, setOtherUserData] = useState<{id:string; role:string; entryCount:number; createdAt?:any} | null>(null);
    const [userThreads, setUserThreads] = useState<{id:string;title:string;views:number;entryCount:number}[]>([]);
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
                    });
                    setOtherUserData({
                        id: userDoc.id,
                        role: data.role || "caylak",
                        entryCount: data.entryCount || 0,
                        createdAt: data.createdAt || null,
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
        if (!role) return { label: 'Çaylak', color: { bg: 'rgba(100,100,100,0.2)', text: '#888' } };
        
        switch (role.toLowerCase()) {
            case 'admin':
                return { label: 'Admin', color: { bg: 'rgba(239,68,68,0.2)', text: '#ef4444' } };
            case 'moderator':
                return { label: 'Moderatör', color: { bg: 'rgba(168,85,247,0.2)', text: '#a855f7' } };
            case 'usta':
                return { label: 'Usta', color: { bg: 'rgba(245,158,11,0.2)', text: '#f59e0b' } };
            case 'caylak':
            default:
                return { label: 'Çaylak', color: { bg: 'rgba(100,100,100,0.2)', text: '#888' } };
        }
    };

    const { label: roleLabel, color: roleColor } = getRoleInfo(otherUserData?.role);
    const locationString = profileData.city && profileData.district ? `${profileData.city}, ${profileData.district}` : profileData.city || "";
    const carString = profileData.carBrand && profileData.carModel ? `${profileData.carBrand} ${profileData.carModel}${profileData.carYear ? ` (${profileData.carYear})` : ''}` : profileData.carBrand || "";

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Photo Toast */}
                {photoToast && (
                    <div style={{ position:'fixed', top:'80px', left:'50%', transform:'translateX(-50%)', zIndex:9999, background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'12px', padding:'14px 24px', boxShadow:'0 8px 30px rgba(0,0,0,0.3)', display:'flex', alignItems:'center', gap:'10px', animation:'slideDown 0.3s ease' }}>
                        <Camera size={18} style={{color:'var(--primary)'}} />
                        <span style={{fontSize:'14px',color:'var(--foreground)',fontWeight:'500'}}>Profil fotografi yakinda! Sabret biraz 😄</span>
                    </div>
                )}

                {/* Profile Header */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '40px 24px',
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '48px',
                                    fontWeight: '700',
                                    color: 'white',
                                    border: '4px solid var(--card-border)',
                                }}>
                                    {profileData.displayUsername.charAt(0).toUpperCase()}
                                </div>
                                <button onClick={() => { setPhotoToast(true); setTimeout(() => setPhotoToast(false), 3000); }} style={{
                                    position: 'absolute', bottom: '0', right: '0',
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: 'var(--primary)', border: '3px solid var(--background)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                }}>
                                    <Camera style={{ width: '16px', height: '16px', color: 'white' }} />
                                </button>
                            </div>

                            {/* User Info */}
                            <div style={{ flex: 1, minWidth: '280px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', letterSpacing: '-0.5px' }}>
                                        @{profileData.displayUsername}
                                    </h1>
                                    <span style={{
                                        padding: '6px 14px', borderRadius: '24px', fontSize: '13px', fontWeight: '700',
                                        background: roleColor.bg, color: roleColor.text,
                                        border: `1px solid ${roleColor.text}40`,
                                        boxShadow: `0 2px 10px ${roleColor.bg}`,
                                        display: 'inline-flex', alignItems: 'center', gap: '6px'
                                    }}>
                                        <Award size={14} /> {roleLabel}
                                    </span>
                                </div>
                                
                                {/* User Rating */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
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
                                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px', fontStyle: 'italic' }}>
                                        {maskName(profileData.firstName)} {maskName(profileData.lastName)}
                                    </p>
                                )}
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px', maxWidth: '500px' }}>
                                    {profileData.bio}
                                </p>
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>
                                    {carString && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Car style={{ width: '14px', height: '14px' }} />
                                            {carString}
                                        </span>
                                    )}
                                    {locationString && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin style={{ width: '14px', height: '14px' }} />
                                            {locationString}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                                {isOwnProfile ? (
                                    <button onClick={() => setShowEditModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--secondary)', border:'1px solid var(--card-border)', borderRadius:'10px', color:'var(--foreground)', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>
                                        <Edit2 size={16} /> Profili Duzenle
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={handleSendMessage} disabled={messageSending} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--primary)', border:'none', borderRadius:'10px', color:'white', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
                                            <Send size={16} /> {messageSending ? 'Aciliyor...' : 'Mesaj At'}
                                        </button>
                                        <button onClick={() => setShowReportModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'transparent', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', color:'#ef4444', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>
                                            <Flag size={16} /> Sikayet Et
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '20px 24px',
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Baslik', value: userThreads.length, icon: MessageSquare },
                                { label: 'Entry', value: otherUserData?.entryCount || 0, icon: MessageSquare },
                                { label: 'Goruntuleme', value: userThreads.reduce((s,t) => s + t.views, 0), icon: Eye },
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
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
                        {/* Left - Activity */}
                        <div>
                            {/* Thread List */}
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '16px' }}>Acilan Basliklar</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {userThreads.length === 0 ? (
                                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                                        <MessageSquare size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block' }} />
                                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Henuz baslik acilmamis</p>
                                    </div>
                                ) : (
                                    userThreads.map((thread) => (
                                        <div key={thread.id} onClick={() => router.push(`/forum/konu/${thread.id}`)} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}>
                                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>{thread.title}</h3>
                                            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={12} /> {thread.views}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={12} /> {thread.entryCount} entry</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside>
                            {/* Profile Info Card */}
                            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '16px' }}>Profil Bilgileri</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                                    {carString && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Arac</span>
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
                                        <span style={{ color: 'var(--text-muted)' }}>Statu</span>
                                        <span style={{ color: roleColor.text, fontWeight: '600' }}>{roleLabel}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Card */}
                            {profileData.bio && (
                                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>Hakkinda</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{profileData.bio}</p>
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
                                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={20} color="#ef4444" /> Kullaniciyi Sikayet Et</h2>
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
                                        <button onClick={handleReport} disabled={!reportReason.trim()} style={{ padding: '10px 20px', borderRadius: '10px', background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '600', opacity: reportReason.trim() ? 1 : 0.5 }}>Sikayet Gonder</button>
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
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--overlay-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
        }}>
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '500px',
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

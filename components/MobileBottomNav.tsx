"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Home, Search, MessageCircle, User } from "lucide-react";
import Image from "next/image";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();
    const { theme } = useTheme();
    
    // Fake unread count for demo. In real app, fetch from notifications/messages
    const unreadMessages = 0; 

    return (
        <div className="mobile-bottom-nav">
            <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                <Home size={22} />
                <span>Ana Sayfa</span>
            </Link>
            
            <Link href="/kutuphane" className={`nav-item ${pathname === '/kutuphane' ? 'active' : ''}`}>
                <Search size={22} />
                <span>Keşfet</span>
            </Link>

            <button 
                className="nav-item center-action" 
                onClick={() => window.dispatchEvent(new CustomEvent('open_new_topic_modal'))}
            >
                <div className="fab" style={{ background: 'var(--card-bg)' }}>
                    <Image src={theme === 'light' ? "/whitemode_logo.svg" : "/dark_logo.svg"} alt="Yeni Başlık" width={36} height={36} style={{ objectFit: 'contain' }} />
                </div>
                <span>Paylaş</span>
            </button>

            <Link href={user ? "/mesajlar" : "/giris"} className={`nav-item ${pathname === '/mesajlar' ? 'active' : ''}`}>
                <div className="icon-wrapper">
                    <MessageCircle size={22} />
                    {unreadMessages > 0 && <span className="badge"></span>}
                </div>
                <span>Mesajlar</span>
            </Link>

            <Link href={user ? "/profil" : "/giris"} className={`nav-item ${pathname === '/profil' ? 'active' : ''}`}>
                {user ? (
                    user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="user-avatar" />
                    ) : (
                        <div className="user-avatar-placeholder">{user.username.charAt(0).toUpperCase()}</div>
                    )
                ) : (
                    <User size={22} />
                )}
                <span>{user ? 'Profil' : 'Giriş'}</span>
            </Link>

            <style jsx>{`
                .mobile-bottom-nav {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: calc(64px + env(safe-area-inset-bottom, 16px));
                    padding-bottom: env(safe-area-inset-bottom, 16px);
                    background: var(--card-bg);
                    backdrop-filter: blur(20px);
                    border-top: 1px solid var(--card-border);
                    z-index: 999;
                    justify-content: space-around;
                    align-items: center;
                    box-shadow: 0 -2px 16px rgba(0,0,0,0.08);
                }

                @media (max-width: 768px) {
                    .mobile-bottom-nav {
                        display: flex;
                    }
                }

                .nav-item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    color: var(--text-muted);
                    text-decoration: none;
                    flex: 1;
                    height: 100%;
                    min-width: 0;
                    transition: color 0.2s;
                    background: none;
                    border: none;
                    padding: 8px 12px;
                    cursor: pointer;
                    font-family: inherit;
                    min-height: 48px;
                    min-width: 48px;
                }

                .nav-item.active {
                    color: var(--primary);
                }
                .nav-item.active::after {
                    content: '';
                    position: absolute;
                    bottom: 6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: var(--primary);
                }

                .nav-item span {
                    font-size: 10px;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }

                .center-action {
                    position: relative;
                }

                .fab {
                    width: 48px;
                    height: 48px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                    border: 2px solid var(--card-border);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .dark .fab {
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.05);
                }
                
                .fab:active {
                    transform: scale(0.95);
                }

                .icon-wrapper {
                    position: relative;
                }

                .badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 8px;
                    height: 8px;
                    background: var(--danger);
                    border-radius: 50%;
                    border: 2px solid var(--card-bg);
                }

                .user-avatar {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .user-avatar-placeholder {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
}

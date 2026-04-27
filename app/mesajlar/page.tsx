"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Search, Plus, X, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    subscribeToConversations, subscribeToMessages, sendMessage,
    startConversation, searchUsers,
    type Conversation, type ChatMessage
} from "@/lib/messageService";
import { playNotificationSound } from "@/lib/notificationSound";

function formatTime(ts: any): string {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "Simdi";
    if (diff < 3600) return `${Math.floor(diff / 60)} dk`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} sa`;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

function formatMsgTime(ts: any): string {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewChat, setShowNewChat] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Array<{ id: string; username: string; displayName: string }>>([]);
    const [searching, setSearching] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevMsgCount = useRef(0);

    // Subscribe to conversations
    useEffect(() => {
        if (!user?.id) return;
        const unsub = subscribeToConversations(user.id as string, (convs) => {
            setConversations(convs);
            
            // Auto-select conversation from URL if present
            if (typeof window !== "undefined") {
                const params = new URLSearchParams(window.location.search);
                const convId = params.get("conv");
                if (convId) {
                    const conv = convs.find(c => c.id === convId);
                    if (conv) {
                        setSelectedConv(conv);
                        // Clean up URL so it doesn't get stuck
                        window.history.replaceState({}, '', '/mesajlar');
                    }
                }
            }
        });
        return () => unsub();
    }, [user?.id]);

    // Subscribe to messages of selected conversation
    useEffect(() => {
        if (!selectedConv) { setMessages([]); return; }
        const unsub = subscribeToMessages(selectedConv.id, (msgs) => {
            // Play sound for new messages from others
            if (msgs.length > prevMsgCount.current && prevMsgCount.current > 0) {
                const lastMsg = msgs[msgs.length - 1];
                if (lastMsg && lastMsg.senderId !== user?.id) {
                    playNotificationSound();
                }
            }
            prevMsgCount.current = msgs.length;
            setMessages(msgs);
        });
        return () => { unsub(); prevMsgCount.current = 0; };
    }, [selectedConv?.id, user?.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // User search with debounce
    useEffect(() => {
        if (!userSearch.trim() || !user?.id) { setSearchResults([]); return; }
        const t = setTimeout(async () => {
            setSearching(true);
            const results = await searchUsers(userSearch, user.id as string);
            setSearchResults(results);
            setSearching(false);
        }, 300);
        return () => clearTimeout(t);
    }, [userSearch, user?.id]);

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedConv || !user || sending) return;
        setSending(true);
        try {
            await sendMessage(selectedConv.id, user.id as string, user.username, newMessage.trim());
            setNewMessage("");
        } catch (e) {
            console.error("Mesaj gonderilemedi:", e);
        }
        setSending(false);
    };

    const handleStartChat = async (otherUser: { id: string; username: string }) => {
        if (!user) return;
        try {
            const convId = await startConversation(user.id as string, user.username, otherUser.id, otherUser.username);
            setShowNewChat(false);
            setUserSearch("");
            setSearchResults([]);
            // Select the new conversation
            const existing = conversations.find(c => c.id === convId);
            if (existing) {
                setSelectedConv(existing);
            } else {
                // Will be picked up by the subscription
                setSelectedConv({ id: convId, participants: [user.id as string, otherUser.id], participantUsernames: { [user.id as string]: user.username, [otherUser.id]: otherUser.username }, lastMessage: "", lastMessageAt: null, lastSenderId: "", createdAt: null });
            }
        } catch (e) {
            console.error("Konusma baslatilamadi:", e);
        }
    };

    const getOtherUsername = (conv: Conversation) => {
        if (!user?.id || !conv.participantUsernames) return "Kullanici";
        const otherId = conv.participants.find(p => p !== user.id);
        return otherId ? (conv.participantUsernames[otherId] || "Kullanici") : "Kullanici";
    };

    const filteredConversations = conversations.filter(c =>
        !searchQuery || getOtherUsername(c).toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user) {
        return (
            <div>
                <Navbar />
                <div style={{ minHeight: "100vh", background: "var(--background)", paddingTop: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
                        <MessageCircle size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                        <p style={{ fontSize: "16px" }}>Mesajlari goruntulemek icin giris yapin</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ minHeight: "100vh", background: "var(--background)", paddingTop: "60px" }}>
                <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "20px", height: "calc(100vh - 100px)" }}>

                        {/* Conversations List */}
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                            {/* Header */}
                            <div style={{ padding: "20px", borderBottom: "1px solid var(--card-border)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <h1 style={{ fontSize: "20px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Mesajlar</h1>
                                    <button onClick={() => setShowNewChat(true)} style={{ background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600" }}>
                                        <Plus size={16} /> Yeni
                                    </button>
                                </div>
                                <div style={{ position: "relative" }}>
                                    <input type="text" placeholder="Konusma ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ width: "100%", padding: "10px 10px 10px 35px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "13px" }} />
                                    <Search style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--text-muted)" }} />
                                </div>
                            </div>

                            {/* Conversation List */}
                            <div style={{ flex: 1, overflowY: "auto" }}>
                                {filteredConversations.length === 0 && (
                                    <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                                        <MessageCircle size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                                        <p style={{ fontSize: "13px", margin: 0 }}>Henuz konusma yok</p>
                                        <p style={{ fontSize: "12px", margin: "4px 0 0", opacity: 0.7 }}>Yeni butonuna tiklayarak baslayin</p>
                                    </div>
                                )}
                                {filteredConversations.map((conv) => {
                                    const otherName = getOtherUsername(conv);
                                    const isSelected = selectedConv?.id === conv.id;
                                    return (
                                        <button key={conv.id} onClick={() => setSelectedConv(conv)}
                                            style={{ width: "100%", padding: "16px 20px", display: "flex", gap: "12px", background: isSelected ? "rgba(255,107,0,0.1)" : "transparent", border: "none", borderBottom: "1px solid var(--card-border)", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}
                                            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "rgba(255,107,0,0.05)"; }}
                                            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                                            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "18px", flexShrink: 0 }}>
                                                {otherName.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                                                    <span style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: "600" }}>@{otherName}</span>
                                                    <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>{formatTime(conv.lastMessageAt)}</span>
                                                </div>
                                                <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {conv.lastSenderId === user.id ? "Sen: " : ""}{conv.lastMessage || "Konusma basladi"}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                            {selectedConv ? (
                                <>
                                    {/* Chat Header */}
                                    <div style={{ padding: "20px", borderBottom: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700" }}>
                                            {getOtherUsername(selectedConv).charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>@{getOtherUsername(selectedConv)}</h2>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {messages.length === 0 && (
                                            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px", color: "var(--text-muted)" }}>
                                                <Send size={24} style={{ opacity: 0.3 }} />
                                                <p style={{ fontSize: "13px", margin: 0 }}>Henuz mesaj yok. Ilk mesaji siz gonderin!</p>
                                            </div>
                                        )}
                                        {messages.map((msg) => {
                                            const isOwn = msg.senderId === user.id;
                                            return (
                                                <div key={msg.id} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
                                                    <div style={{ maxWidth: "70%", padding: "12px 16px", background: isOwn ? "var(--primary)" : "var(--secondary)", borderRadius: isOwn ? "12px 12px 0 12px" : "12px 12px 12px 0", color: isOwn ? "white" : "var(--foreground)" }}>
                                                        <p style={{ fontSize: "14px", margin: "0 0 4px 0", lineHeight: "1.4", wordBreak: "break-word" }}>{msg.content}</p>
                                                        <span style={{ fontSize: "11px", color: isOwn ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>{formatMsgTime(msg.createdAt)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div style={{ padding: "20px", borderTop: "1px solid var(--card-border)", display: "flex", gap: "12px" }}>
                                        <input type="text" placeholder="Mesajinizi yazin..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                            style={{ flex: 1, padding: "12px 16px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--foreground)", fontSize: "14px", outline: "none" }} />
                                        <button onClick={handleSend} disabled={sending || !newMessage.trim()}
                                            style={{ width: "48px", height: "48px", background: newMessage.trim() ? "var(--primary)" : "var(--secondary)", border: "none", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: newMessage.trim() ? "pointer" : "default", transition: "all 0.2s" }}>
                                            <Send style={{ width: "20px", height: "20px", color: newMessage.trim() ? "white" : "var(--text-muted)" }} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
                                    <MessageCircle style={{ width: "64px", height: "64px", color: "var(--card-border)" }} />
                                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Bir sohbet secin veya yeni bir konusma basatin</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* New Chat Modal */}
            {showNewChat && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowNewChat(false)}>
                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px", width: "90%", maxWidth: "420px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Yeni Mesaj</h2>
                            <button onClick={() => setShowNewChat(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}><X size={20} /></button>
                        </div>
                        <div style={{ position: "relative", marginBottom: "16px" }}>
                            <input type="text" placeholder="Kullanici adi ara..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} autoFocus
                                style={{ width: "100%", padding: "12px 12px 12px 40px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "14px", outline: "none" }} />
                            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "var(--text-muted)" }} />
                        </div>
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {searching && <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", padding: "12px" }}>Araniyor...</p>}
                            {!searching && userSearch && searchResults.length === 0 && (
                                <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", padding: "12px" }}>Kullanici bulunamadi</p>
                            )}
                            {searchResults.map(u => (
                                <button key={u.id} onClick={() => handleStartChat(u)}
                                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "transparent", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "16px", flexShrink: 0 }}>
                                        {u.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>@{u.username}</p>
                                        {u.displayName && <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>{u.displayName}</p>}
                                    </div>
                                </button>
                            ))}
                            {!userSearch && (
                                <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", padding: "20px" }}>Mesaj gondermek istediginiz kullaniciyi arayarak baslayin</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

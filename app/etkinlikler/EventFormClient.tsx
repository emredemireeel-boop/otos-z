"use client";
import {useState,useRef} from 'react';
import {db,storage} from '@/lib/firebase';
import {collection,addDoc} from 'firebase/firestore';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import {Calendar,MapPin,Users,TrendingUp,Award,Tag,X,CheckCircle,Upload,Sparkles} from 'lucide-react';
export default function EventFormClient({onClose,cities,eventCategories}:{onClose:()=>void;cities:string[];eventCategories:Record<string,any>}){
    const [showAddModal, setShowAddModal] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '', category: '', city: '', date: '', time: '', location: '', description: ''
    });
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const TARGET_WIDTH = 800;
                const TARGET_HEIGHT = 450;
                canvas.width = TARGET_WIDTH;
                canvas.height = TARGET_HEIGHT;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const imgRatio = img.width / img.height;
                const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
                
                let drawWidth = img.width;
                let drawHeight = img.height;
                let offsetX = 0;
                let offsetY = 0;

                if (imgRatio > targetRatio) {
                    drawWidth = img.height * targetRatio;
                    offsetX = (img.width - drawWidth) / 2;
                } else {
                    drawHeight = img.width / targetRatio;
                    offsetY = (img.height - drawHeight) / 2;
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

                canvas.toBlob((blob) => {
                    if (blob) {
                        setImageBlob(blob);
                        setFilePreview(URL.createObjectURL(blob));
                    }
                }, 'image/jpeg', 0.8);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmitEvent = async () => {
        if (!formData.title || !formData.category || !formData.city || !formData.date || !formData.time || !formData.location || !imageBlob) {
            alert("Lütfen tüm alanları doldurun ve bir görsel seçin.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload Image
            const fileName = `events/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const imageRef = ref(storage, fileName);
            await uploadBytes(imageRef, imageBlob);
            const imageUrl = await getDownloadURL(imageRef);

            // Save to Firestore
            await addDoc(collection(db, "pending_events"), {
                ...formData,
                imageUrl,
                status: 'pending',
                createdAt: new Date().toISOString()
            });

            setShowAddModal(false);
            setShowSuccess(true);
            
            // Reset form
            setFormData({ title: '', category: '', city: '', date: '', time: '', location: '', description: '' });
            setImageBlob(null);
            setFilePreview(null);
        } catch (error) {
            console.error("Etkinlik eklenirken hata:", error);
            alert("Bir hata oluştu, lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return <>            {/* Add Event Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '24px', width: '100%', maxWidth: '600px',
                        maxHeight: '90vh', overflow: 'auto', position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '24px', borderBottom: '1px solid var(--card-border)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 10
                        }}>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
                                    Yeni Etkinlik Ekle
                                </h2>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                    Etkinliğinizi binlerce otomobil tutkunuyla paylaşın.
                                </p>
                            </div>
                            <button onClick={onClose} style={{
                                background: 'var(--secondary)', border: 'none',
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--foreground)', cursor: 'pointer', transition: 'all 0.2s'
                            }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary)'}
                               onMouseLeave={(e) => e.currentTarget.style.background = 'var(--secondary)'}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Etkinlik Adı</label>
                                    <input 
                                        type="text" 
                                        placeholder="Örn: İzmir Klasik Otomobil Festivali" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                        background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                    }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Kategori</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                            background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                        }}>
                                            <option value="">Seçiniz...</option>
                                            {Object.keys(eventCategories).map(cat => (
                                                <option key={cat} value={cat}>{eventCategories[cat as keyof typeof eventCategories].label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Şehir</label>
                                        <select 
                                            value={formData.city}
                                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                                            style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                            background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                        }}>
                                            <option value="">Seçiniz...</option>
                                            {cities.filter(c => c !== 'Tümü').map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Tarih</label>
                                        <input 
                                            type="date" 
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                            style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                            background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                        }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Saat</label>
                                        <input 
                                            type="time" 
                                            value={formData.time}
                                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                                            style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                            background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                        }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Tam Adres</label>
                                    <input 
                                        type="text" 
                                        placeholder="Açık adres giriniz..." 
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                        background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                    }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Etkinlik Afişi / Fotoğrafı</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                        border: '2px dashed var(--card-border)', borderRadius: '16px', padding: '32px',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                                        background: 'rgba(255,255,255,0.02)', cursor: 'pointer', position: 'relative', overflow: 'hidden'
                                    }}>
                                        {filePreview ? (
                                            <img src={filePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                                        ) : (
                                            <>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Upload style={{ color: 'var(--primary)' }} />
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{ color: 'var(--foreground)', fontWeight: '600', marginBottom: '4px' }}>Fotoğraf yüklemek için tıklayın</p>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>PNG, JPG, max 5MB (Otomatik kırpılır)</p>
                                                </div>
                                            </>
                                        )}
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            ref={fileInputRef} 
                                            onChange={handleImageSelect} 
                                            style={{ display: 'none' }} 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Açıklama</label>
                                    <textarea 
                                        rows={4} 
                                        placeholder="Etkinlik hakkında detaylı bilgi verin..." 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                        background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px', resize: 'vertical'
                                    }}></textarea>
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <button onClick={onClose} style={{
                                    padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'transparent',
                                    color: 'var(--text-muted)', fontWeight: '600', fontSize: '15px', cursor: 'pointer'
                                }}>
                                    İptal
                                </button>
                                <button 
                                    onClick={handleSubmitEvent} 
                                    disabled={isSubmitting}
                                    style={{
                                    padding: '12px 32px', borderRadius: '12px', border: 'none', background: 'var(--primary)',
                                    color: 'white', fontWeight: '700', fontSize: '15px', 
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    opacity: isSubmitting ? 0.7 : 1,
                                    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
                                }}>
                                    {isSubmitting ? 'Gönderiliyor...' : 'Onaya Gönder'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message Modal */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '24px', width: '100%', maxWidth: '440px', padding: '40px 32px',
                        textAlign: 'center', position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10B981',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}>
                            <CheckCircle size={48} />
                        </div>
                        
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                            Etkinlik Talebiniz Alındı!
                        </h3>
                        
                        <div style={{
                            background: 'var(--secondary)', borderRadius: '12px', padding: '16px',
                            marginBottom: '24px', textAlign: 'left'
                        }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                                Etkinliğiniz başarıyla oluşturuldu ve admin onayına gönderildi. 
                                <strong style={{ color: 'var(--foreground)', display: 'block', marginTop: '8px' }}>
                                    Değerlendirme süreci 48 saat sürebilir.
                                </strong>
                                Onaylandığında platformda yayınlanacaktır.
                            </p>
                        </div>

                        <button onClick={() => setShowSuccess(false)} style={{
                            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                            background: 'var(--primary)', color: 'white', fontWeight: '700',
                            fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                            Anladım, Kapat
                        </button>
                    </div>
                </div>
            )}
</>;
}

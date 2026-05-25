import re

filepath = 'app/profil/[userId]/page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update levelColors
content = re.sub(
    r'const levelColors.*?};',
    '''const levelColors: Record<string, { bg: string; text: string }> = {
    "Çaylak": { bg: "var(--secondary)", text: "var(--foreground)" },
    "Sürücü": { bg: "var(--secondary)", text: "var(--foreground)" },
    "Tutkun": { bg: "var(--secondary)", text: "var(--foreground)" },
    "Usta": { bg: "var(--secondary)", text: "var(--foreground)" },
    "Efsane": { bg: "var(--secondary)", text: "var(--foreground)" },
};''',
    content,
    flags=re.DOTALL
)

# 2. Update getRoleInfo
content = re.sub(
    r'const getRoleInfo =.*?};',
    '''const getRoleInfo = (role: string | undefined) => {
        if (!role) return { label: 'Çaylak', color: { bg: 'var(--secondary)', text: 'var(--foreground)' } };
        
        switch (role.toLowerCase()) {
            case 'admin':
                return { label: 'Admin', color: { bg: 'var(--secondary)', text: 'var(--foreground)' } };
            case 'moderator':
                return { label: 'Moderatör', color: { bg: 'var(--secondary)', text: 'var(--foreground)' } };
            case 'usta':
                return { label: 'Usta', color: { bg: 'var(--secondary)', text: 'var(--foreground)' } };
            case 'caylak':
            default:
                return { label: 'Çaylak', color: { bg: 'var(--secondary)', text: 'var(--foreground)' } };
        }
    };''',
    content,
    flags=re.DOTALL
)

# 3. Main container
content = content.replace(
    '''<main style={{ minHeight: '100vh', background: 'var(--background)' }}>''',
    '''<main className="min-h-screen bg-background profile-container">'''
)

# 4. Profile Header Wrapper
content = re.sub(
    r'''<div style={{.*?background: 'var\(--card-bg\)',.*?borderBottom: '1px solid var\(--card-border\)',.*?padding: '40px 24px',.*?}}>.*?<div style={{ maxWidth: '1200px', margin: '0 auto' }}>.*?<div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>''',
    '''<div className="profile-header-wrapper">
                    <div className="profile-header">''',
    content,
    flags=re.DOTALL | re.MULTILINE
)

# 5. Avatar wrapper
content = content.replace(
    '''<div style={{ position: 'relative' }}>''',
    '''<div className="profile-avatar-wrapper">'''
)

# 6. Avatar element
content = re.sub(
    r'''<div style={{.*?width: '120px',.*?overflow: 'hidden'.*?}}>''',
    '''<div className="profile-avatar" style={{ backgroundImage: profileData.photoURL ? `url(${profileData.photoURL})` : 'none' }}>''',
    content,
    flags=re.DOTALL
)

# 7. Avatar edit btn
content = re.sub(
    r'''<button \n                                        onClick=\{\(\) => fileInputRef\.current\?\.click\(\)\} \n                                        disabled=\{uploadingAvatar\}\n                                        style=\{\{.*?opacity: uploadingAvatar \? 0\.5 : 1.*?\}\}>''',
    '''<button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        disabled={uploadingAvatar}
                                        className="profile-avatar-edit-btn"
                                        style={{ opacity: uploadingAvatar ? 0.5 : 1 }}
                                    >''',
    content,
    flags=re.DOTALL
)

# 8. Action buttons (Edit Profile, Garage Verify)
content = content.replace(
    '''<button onClick={() => setShowEditModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--secondary)', border:'1px solid var(--card-border)', borderRadius:'10px', color:'var(--foreground)', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>''',
    '''<button onClick={() => setShowEditModal(true)} className="btn-secondary">'''
)

content = content.replace(
    '''<button onClick={() => setShowGarageModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--primary)', border:'1px solid var(--primary)', borderRadius:'10px', color:'white', fontSize:'14px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(255,107,0,0.3)' }}>''',
    '''<button onClick={() => setShowGarageModal(true)} className="btn-primary">'''
)

content = content.replace(
    '''<button onClick={handleSendMessage} disabled={messageSending} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--primary)', border:'none', borderRadius:'10px', color:'white', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>''',
    '''<button onClick={handleSendMessage} disabled={messageSending} className="btn-primary">'''
)

content = content.replace(
    '''<button onClick={() => setShowReportModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'transparent', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', color:'#ef4444', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>''',
    '''<button onClick={() => setShowReportModal(true)} className="btn-danger-outline">'''
)

# 9. User Info Section and role badge
content = re.sub(
    r'''<div style={{ flex: 1, minWidth: '280px' }}>.*?<div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', flexWrap: 'wrap' }}>.*?<h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var\(--foreground\)', letterSpacing: '-0\.5px' }}>.*?@\{profileData\.displayUsername\}.*?</h1>.*?<span style={{.*?}}>.*?<Award size=\{14\} /> \{roleLabel\}.*?</span>.*?</div>''',
    '''<div className="profile-info-section">
                                <div className="profile-username-row">
                                    <h1 className="profile-username">@{profileData.displayUsername}</h1>
                                    <span className="profile-role-badge">
                                        <Award size={14} /> {roleLabel}
                                    </span>
                                </div>''',
    content,
    flags=re.DOTALL
)

# 10. Rating
content = content.replace(
    '''<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>''',
    '''<div className="profile-rating">'''
)

# 11. Links and bio
content = re.sub(
    r'''\{\(profileData\.firstName \|\| profileData\.lastName\) && \(\s*<p style=\{\{ color: 'var\(--text-muted\)', fontSize: '13px', marginBottom: '12px', fontStyle: 'italic' \}\}>\s*\{maskName\(profileData\.firstName\)\} \{maskName\(profileData\.lastName\)\}\s*</p>\s*\)\}\s*<p style=\{\{ color: 'var\(--text-muted\)', fontSize: '14px', marginBottom: '16px', maxWidth: '500px' \}\}>\s*\{profileData\.bio\}\s*</p>\s*<div style=\{\{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var\(--text-muted\)' \}\}>\s*\{carString && \(\s*<span style=\{\{ display: 'flex', alignItems: 'center', gap: '6px' \}\}>\s*<Car style=\{\{ width: '14px', height: '14px' \}\} />\s*\{carString\}\s*</span>\s*\)\}\s*\{locationString && \(\s*<span style=\{\{ display: 'flex', alignItems: 'center', gap: '6px' \}\}>\s*<MapPin style=\{\{ width: '14px', height: '14px' \}\} />\s*\{locationString\}\s*</span>\s*\)\}\s*\{\/\* Sahibinden Linki \*\/\}\s*<span style=\{\{ display: 'flex', alignItems: 'center', gap: '6px' \}\}>\s*<ExternalLink style=\{\{ width: '14px', height: '14px' \}\} />\s*<a href="#" target="_blank" rel="noopener noreferrer" style=\{\{ color: '#FFD700', textDecoration: 'none', fontWeight: '600' \}\}>Sahibinden İlanları</a>\s*</span>\s*\{\/\* Arabam Linki \*\/\}\s*<span style=\{\{ display: 'flex', alignItems: 'center', gap: '6px' \}\}>\s*<ExternalLink style=\{\{ width: '14px', height: '14px' \}\} />\s*<a href="#" target="_blank" rel="noopener noreferrer" style=\{\{ color: '#ef4444', textDecoration: 'none', fontWeight: '600' \}\}>Arabam\.com</a>\s*</span>\s*</div>''',
    '''{(profileData.firstName || profileData.lastName) && (
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
                                    {/* Dış Linkler (Sade) */}
                                    <span className="profile-meta-item">
                                        <ExternalLink style={{ width: '14px', height: '14px' }} />
                                        <a href="#" target="_blank" rel="noopener noreferrer" className="profile-ext-link">Sahibinden</a>
                                    </span>
                                    <span className="profile-meta-item">
                                        <ExternalLink style={{ width: '14px', height: '14px' }} />
                                        <a href="#" target="_blank" rel="noopener noreferrer" className="profile-ext-link">Arabam.com</a>
                                    </span>
                                </div>''',
    content
)

# 12. Stats bar
content = re.sub(
    r'''\{\/\* Stats Bar \*\/\}\s*<div style=\{\{\s*background: 'var\(--card-bg\)',\s*borderBottom: '1px solid var\(--card-border\)',\s*padding: '20px 24px',\s*\}\}>\s*<div style=\{\{ maxWidth: '1200px', margin: '0 auto' \}\}>\s*<div style=\{\{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' \}\}>''',
    '''{/* Stats Bar */}
                <div className="profile-stats-wrapper">
                    <div className="profile-stats-grid">''',
    content
)

content = re.sub(
    r'''<div key=\{i\} style=\{\{ textAlign: 'center' \}\}>\s*<div style=\{\{ fontSize: '24px', fontWeight: '700', color: 'var\(--foreground\)' \}\}>\s*\{stat\.value\}\s*</div>\s*<div style=\{\{ fontSize: '12px', color: 'var\(--text-muted\)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' \}\}>''',
    '''<div key={i} className="profile-stat-item">
                                    <div className="profile-stat-val">
                                        {stat.value}
                                    </div>
                                    <div className="profile-stat-label">''',
    content
)

# 13. Tabs
content = re.sub(
    r'''\{\/\* Tabs \*\/\}\s*<div style=\{\{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var\(--card-border\)' \}\}>\s*<button onClick=\{\(\) => setActiveTab\('posts'\)\} style=\{\{ padding: '10px 4px', background: 'transparent', border: 'none', borderBottom: activeTab === 'posts' \? '2px solid var\(--primary\)' : '2px solid transparent', color: activeTab === 'posts' \? 'var\(--foreground\)' : 'var\(--text-muted\)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0\.2s' \}\}>\s*Başlıklar \(\{userThreads\.length\}\)\s*</button>\s*<button onClick=\{\(\) => setActiveTab\('comments'\)\} style=\{\{ padding: '10px 4px', background: 'transparent', border: 'none', borderBottom: activeTab === 'comments' \? '2px solid var\(--primary\)' : '2px solid transparent', color: activeTab === 'comments' \? 'var\(--foreground\)' : 'var\(--text-muted\)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0\.2s' \}\}>\s*Entryler \(\{userEntries\.length\}\)\s*</button>\s*</div>''',
    '''{/* Tabs */}
                            <div className="profile-tabs">
                                <button onClick={() => setActiveTab('posts')} className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}>
                                    Başlıklar ({userThreads.length})
                                </button>
                                <button onClick={() => setActiveTab('comments')} className={`profile-tab ${activeTab === 'comments' ? 'active' : ''}`}>
                                    Entryler ({userEntries.length})
                                </button>
                            </div>''',
    content
)

# 14. Cards (Sidebar)
content = content.replace(
    '''<div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>''',
    '''<div className="profile-card">'''
)
content = content.replace(
    '''<div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>''',
    '''<div className="profile-card">'''
)
content = content.replace(
    '''<h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '16px' }}>''',
    '''<h3 className="profile-card-title">'''
)
content = content.replace(
    '''<h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>''',
    '''<h3 className="profile-card-title">'''
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Python refactoring done.")

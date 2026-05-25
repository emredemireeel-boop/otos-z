const fs = require('fs');
const filepath = 'app/profil/[userId]/page.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// 1. Update levelColors
content = content.replace(
    /const levelColors[\s\S]*?\};/,
    \`const levelColors: Record<string, { bg: string; text: string }> = {
    "Çaylak": { bg: "var(--secondary)", text: "var(--foreground)" },
    "Sürücü": { bg: "var(--secondary)", text: "var(--foreground)" },
    "Tutkun": { bg: "var(--secondary)", text: "var(--foreground)" },
    "Usta": { bg: "var(--secondary)", text: "var(--foreground)" },
    "Efsane": { bg: "var(--secondary)", text: "var(--foreground)" },
};\`);

// 2. Update getRoleInfo
content = content.replace(
    /const getRoleInfo =[\s\S]*?\};/,
    \`const getRoleInfo = (role: string | undefined) => {
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
    };\`);

// 3. Main container
content = content.replace(
    \`<main style={{ minHeight: '100vh', background: 'var(--background)' }}>\`,
    \`<main className="min-h-screen bg-background profile-container">\`
);

// 4. Profile Header Wrapper
content = content.replace(
    /<div style={{[\s\S]*?background: 'var\(--card-bg\)',[\s\S]*?borderBottom: '1px solid var\(--card-border\)',[\s\S]*?padding: '40px 24px',[\s\S]*?}}>[\s\S]*?<div style={{ maxWidth: '1200px', margin: '0 auto' }}>[\s\S]*?<div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>/,
    \`<div className="profile-header-wrapper">
                    <div className="profile-header">\`
);

// 5. Avatar wrapper
content = content.replace(
    \`<div style={{ position: 'relative' }}>\`,
    \`<div className="profile-avatar-wrapper">\`
);

// 6. Avatar element
content = content.replace(
    /<div style={{[\s\S]*?width: '120px',[\s\S]*?overflow: 'hidden'[\s\S]*?}}>/,
    \`<div className="profile-avatar" style={{ backgroundImage: profileData.photoURL ? \\\`url(\\\${profileData.photoURL})\\\` : 'none' }}>\`
);

// 7. Avatar edit btn
content = content.replace(
    /<button \n                                        onClick=\{\(\) => fileInputRef\.current\?\.click\(\)\} \n                                        disabled=\{uploadingAvatar\}\n                                        style=\{\{[\s\S]*?opacity: uploadingAvatar \? 0\.5 : 1[\s\S]*?\}\}>/,
    \`<button 
                                        onClick={() => fileInputRef.current?.click()} 
                                        disabled={uploadingAvatar}
                                        className="profile-avatar-edit-btn"
                                        style={{ opacity: uploadingAvatar ? 0.5 : 1 }}
                                    >\`
);

// 8. Action buttons (Edit Profile, Garage Verify)
content = content.replace(
    \`<button onClick={() => setShowEditModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--secondary)', border:'1px solid var(--card-border)', borderRadius:'10px', color:'var(--foreground)', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>\`,
    \`<button onClick={() => setShowEditModal(true)} className="btn-secondary">\`
);

content = content.replace(
    \`<button onClick={() => setShowGarageModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--primary)', border:'1px solid var(--primary)', borderRadius:'10px', color:'white', fontSize:'14px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(255,107,0,0.3)' }}>\`,
    \`<button onClick={() => setShowGarageModal(true)} className="btn-primary">\`
);

content = content.replace(
    \`<button onClick={handleSendMessage} disabled={messageSending} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--primary)', border:'none', borderRadius:'10px', color:'white', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>\`,
    \`<button onClick={handleSendMessage} disabled={messageSending} className="btn-primary">\`
);

content = content.replace(
    \`<button onClick={() => setShowReportModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'transparent', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', color:'#ef4444', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>\`,
    \`<button onClick={() => setShowReportModal(true)} className="btn-danger-outline">\`
);

// 9. User Info Section and role badge
content = content.replace(
    /<div style={{ flex: 1, minWidth: '280px' }}>[\s\S]*?<div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', flexWrap: 'wrap' }}>[\s\S]*?<h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var\(--foreground\)', letterSpacing: '-0\.5px' }}>[\s\S]*?@\{profileData\.displayUsername\}[\s\S]*?<\/h1>[\s\S]*?<span style={{[\s\S]*?}}>[\s\S]*?<Award size=\{14\} \/> \{roleLabel\}[\s\S]*?<\/span>[\s\S]*?<\/div>/,
    \`<div className="profile-info-section">
                                <div className="profile-username-row">
                                    <h1 className="profile-username">@{profileData.displayUsername}</h1>
                                    <span className="profile-role-badge">
                                        <Award size={14} /> {roleLabel}
                                    </span>
                                </div>\`
);

// 10. Rating
content = content.replace(
    \`<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>\`,
    \`<div className="profile-rating">\`
);

// 11. Links and bio
content = content.replace(
    /\{\(profileData\.firstName \|\| profileData\.lastName\) && \(\s*<p style=\{\{ color: 'var\(--text-muted\)', fontSize: '13px', marginBottom: '12px', fontStyle: 'italic' \}\}>\s*\{maskName\(profileData\.firstName\)\} \{maskName\(profileData\.lastName\)\}\s*<\/p>\s*\)\}\s*<p style=\{\{ color: 'var\(--text-muted\)', fontSize: '14px', marginBottom: '16px', maxWidth: '500px' \}\}>\s*\{profileData\.bio\}\s*<\/p>\s*<div style=\{\{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var\(--text-muted\)' \}\}>\s*\{carString && \(\s*<span style=\{\{ display: 'flex', alignItems: 'center', gap: '6px' \}\}>\s*<Car style=\{\{ width: '14px', height: '14px' \}\} \/>\s*\{carString\}\s*<\/span>\s*\)\}\s*\{locationString && \(\s*<span style=\{\{ display: 'flex', alignItems: 'center', gap: '6px' \}\}>\s*<MapPin style=\{\{ width: '14px', height: '14px' \}\} \/>\s*\{locationString\}\s*<\/span>\s*\)\}\s*\{\/\* Sahibinden Linki \*\/\}\s*<span style=\{\{ display: 'flex', alignItems: 'center', gap: '6px' \}\}>\s*<ExternalLink style=\{\{ width: '14px', height: '14px' \}\} \/>\s*<a href="#" target="_blank" rel="noopener noreferrer" style=\{\{ color: '#FFD700', textDecoration: 'none', fontWeight: '600' \}\}>Sahibinden İlanları<\/a>\s*<\/span>\s*\{\/\* Arabam Linki \*\/\}\s*<span style=\{\{ display: 'flex', alignItems: 'center', gap: '6px' \}\}>\s*<ExternalLink style=\{\{ width: '14px', height: '14px' \}\} \/>\s*<a href="#" target="_blank" rel="noopener noreferrer" style=\{\{ color: '#ef4444', textDecoration: 'none', fontWeight: '600' \}\}>Arabam\.com<\/a>\s*<\/span>\s*<\/div>/,
    \`{(profileData.firstName || profileData.lastName) && (
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
                                </div>\`
);

// 12. Stats bar
content = content.replace(
    /\{\/\* Stats Bar \*\/\}\s*<div style=\{\{\s*background: 'var\(--card-bg\)',\s*borderBottom: '1px solid var\(--card-border\)',\s*padding: '20px 24px',\s*\}\}>\s*<div style=\{\{ maxWidth: '1200px', margin: '0 auto' \}\}>\s*<div style=\{\{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' \}\}>/,
    \`{/* Stats Bar */}
                <div className="profile-stats-wrapper">
                    <div className="profile-stats-grid">\`
);

content = content.replace(
    /<div key=\{i\} style=\{\{ textAlign: 'center' \}\}>\s*<div style=\{\{ fontSize: '24px', fontWeight: '700', color: 'var\(--foreground\)' \}\}>\s*\{stat\.value\}\s*<\/div>\s*<div style=\{\{ fontSize: '12px', color: 'var\(--text-muted\)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' \}\}>/g,
    \`<div key={i} className="profile-stat-item">
                                    <div className="profile-stat-val">
                                        {stat.value}
                                    </div>
                                    <div className="profile-stat-label">\`
);

// 13. Tabs
content = content.replace(
    /\{\/\* Tabs \*\/\}\s*<div style=\{\{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var\(--card-border\)' \}\}>\s*<button onClick=\{\(\) => setActiveTab\('posts'\)\} style=\{\{ padding: '10px 4px', background: 'transparent', border: 'none', borderBottom: activeTab === 'posts' \? '2px solid var\(--primary\)' : '2px solid transparent', color: activeTab === 'posts' \? 'var\(--foreground\)' : 'var\(--text-muted\)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0\.2s' \}\}>\s*Başlıklar \(\{userThreads\.length\}\)\s*<\/button>\s*<button onClick=\{\(\) => setActiveTab\('comments'\)\} style=\{\{ padding: '10px 4px', background: 'transparent', border: 'none', borderBottom: activeTab === 'comments' \? '2px solid var\(--primary\)' : '2px solid transparent', color: activeTab === 'comments' \? 'var\(--foreground\)' : 'var\(--text-muted\)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0\.2s' \}\}>\s*Entryler \(\{userEntries\.length\}\)\s*<\/button>\s*<\/div>/,
    \`{/* Tabs */}
                            <div className="profile-tabs">
                                <button onClick={() => setActiveTab('posts')} className={\\\`profile-tab \\\${activeTab === 'posts' ? 'active' : ''}\\\`}>
                                    Başlıklar ({userThreads.length})
                                </button>
                                <button onClick={() => setActiveTab('comments')} className={\\\`profile-tab \\\${activeTab === 'comments' ? 'active' : ''}\\\`}>
                                    Entryler ({userEntries.length})
                                </button>
                            </div>\`
);

// 14. Cards (Sidebar)
content = content.split(\`<div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>\`).join(\`<div className="profile-card">\`);
content = content.split(\`<div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>\`).join(\`<div className="profile-card">\`);
content = content.split(\`<h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '16px' }}>\`).join(\`<h3 className="profile-card-title">\`);
content = content.split(\`<h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>\`).join(\`<h3 className="profile-card-title">\`);


// Thread/Entry list cards
content = content.split(\`<div key={thread.id} onClick={() => router.push(\\\`/forum/konu/\\\${thread.id}\\\`)} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}>\`).join(\`<div key={thread.id} onClick={() => router.push(\\\`/forum/konu/\\\${thread.id}\\\`)} className="profile-feed-item">\`);
content = content.split(\`<h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>\`).join(\`<h3 className="profile-card-title" style={{ marginBottom: '8px' }}>\`);
content = content.split(\`<div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>\`).join(\`<div className="profile-meta-row" style={{ fontSize: '12px' }}>\`);
content = content.split(\`<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>\`).join(\`<span className="profile-meta-item">\`);

content = content.split(\`<div key={entry.id} onClick={() => router.push(entryUrl)} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}>\`).join(\`<div key={entry.id} onClick={() => router.push(entryUrl)} className="profile-feed-item">\`);
content = content.split(\`<div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>\`).join(\`<div style={{ fontSize: '12px', color: 'var(--foreground)', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>\`);

fs.writeFileSync(filepath, content, 'utf8');
console.log("Regex refactoring complete.");

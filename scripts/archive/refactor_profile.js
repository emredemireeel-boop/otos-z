const fs = require('fs');
const filepath = 'app/profil/[userId]/page.tsx';
let content = fs.readFileSync(filepath, 'utf8');

const replacements = [
    [
        'const levelColors: Record<string, { bg: string; text: string }> = {\n    "Çaylak": { bg: "rgba(100, 100, 100, 0.2)", text: "#888" },\n    "Sürücü": { bg: "rgba(59, 130, 246, 0.2)", text: "#3b82f6" },\n    "Tutkun": { bg: "rgba(168, 85, 247, 0.2)", text: "#a855f7" },\n    "Usta": { bg: "rgba(245, 158, 11, 0.2)", text: "#f59e0b" },\n    "Efsane": { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },\n};',
        'const levelColors: Record<string, { bg: string; text: string }> = {\n    "Çaylak": { bg: "var(--secondary)", text: "var(--foreground)" },\n    "Sürücü": { bg: "var(--secondary)", text: "var(--foreground)" },\n    "Tutkun": { bg: "var(--secondary)", text: "var(--foreground)" },\n    "Usta": { bg: "var(--secondary)", text: "var(--foreground)" },\n    "Efsane": { bg: "var(--secondary)", text: "var(--foreground)" },\n};'
    ],
    [
        `            case 'admin':\n                return { label: 'Admin', color: { bg: 'rgba(239,68,68,0.2)', text: '#ef4444' } };\n            case 'moderator':\n                return { label: 'Moderatör', color: { bg: 'rgba(168,85,247,0.2)', text: '#a855f7' } };\n            case 'usta':\n                return { label: 'Usta', color: { bg: 'rgba(245,158,11,0.2)', text: '#f59e0b' } };\n            case 'caylak':\n            default:\n                return { label: 'Çaylak', color: { bg: 'rgba(100,100,100,0.2)', text: '#888' } };`,
        `            case 'admin':\n                return { label: 'Admin', color: { bg: 'var(--secondary)', text: 'var(--foreground)' } };\n            case 'moderator':\n                return { label: 'Moderatör', color: { bg: 'var(--secondary)', text: 'var(--foreground)' } };\n            case 'usta':\n                return { label: 'Usta', color: { bg: 'var(--secondary)', text: 'var(--foreground)' } };\n            case 'caylak':\n            default:\n                return { label: 'Çaylak', color: { bg: 'var(--secondary)', text: 'var(--foreground)' } };`
    ],
    [
        `<main style={{ minHeight: '100vh', background: 'var(--background)' }}>`,
        `<main className="profile-container min-h-screen">`
    ],
    [
        `                <div style={{\n                    background: 'var(--card-bg)',\n                    borderBottom: '1px solid var(--card-border)',\n                    padding: '40px 24px',\n                }}>\n                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>\n                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>`,
        `                <div className="profile-header-wrapper">\n                    <div className="profile-header">`
    ],
    [
        `<div style={{ position: 'relative' }}>`,
        `<div className="profile-avatar-wrapper">`
    ],
    [
        `                                <div style={{\n                                    width: '120px',\n                                    height: '120px',\n                                    borderRadius: '50%',\n                                    background: 'var(--primary)',\n                                    backgroundImage: profileData.photoURL ? \`url(\${profileData.photoURL})\` : 'none',\n                                    backgroundSize: 'cover',\n                                    backgroundPosition: 'center',\n                                    display: 'flex',\n                                    alignItems: 'center',\n                                    justifyContent: 'center',\n                                    fontSize: '48px',\n                                    fontWeight: '700',\n                                    color: 'white',\n                                    border: '4px solid var(--card-border)',\n                                    overflow: 'hidden'\n                                }}>`,
        `                                <div className="profile-avatar" style={{ backgroundImage: profileData.photoURL ? \`url(\${profileData.photoURL})\` : 'none' }}>`
    ],
    [
        `                                    <button \n                                        onClick={() => fileInputRef.current?.click()} \n                                        disabled={uploadingAvatar}\n                                        style={{\n                                        position: 'absolute', bottom: '0', right: '0',\n                                        width: '36px', height: '36px', borderRadius: '50%',\n                                        background: 'var(--primary)', border: '3px solid var(--background)',\n                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',\n                                        opacity: uploadingAvatar ? 0.5 : 1\n                                    }}>`,
        `                                    <button \n                                        onClick={() => fileInputRef.current?.click()} \n                                        disabled={uploadingAvatar}\n                                        className="profile-avatar-edit-btn"\n                                        style={{ opacity: uploadingAvatar ? 0.5 : 1 }}\n                                    >`
    ],
    [
        `<button onClick={() => setShowEditModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--secondary)', border:'1px solid var(--card-border)', borderRadius:'10px', color:'var(--foreground)', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>`,
        `<button onClick={() => setShowEditModal(true)} className="btn-secondary">`
    ],
    [
        `<button onClick={() => setShowGarageModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--primary)', border:'1px solid var(--primary)', borderRadius:'10px', color:'white', fontSize:'14px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(255,107,0,0.3)' }}>`,
        `<button onClick={() => setShowGarageModal(true)} className="btn-primary">`
    ],
    [
        `<button onClick={handleSendMessage} disabled={messageSending} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'var(--primary)', border:'none', borderRadius:'10px', color:'white', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>`,
        `<button onClick={handleSendMessage} disabled={messageSending} className="btn-primary">`
    ],
    [
        `<button onClick={() => setShowReportModal(true)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'transparent', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', color:'#ef4444', fontSize:'14px', fontWeight:'500', cursor:'pointer' }}>`,
        `<button onClick={() => setShowReportModal(true)} className="btn-danger-outline">`
    ],
    [
        `                            <div style={{ flex: 1, minWidth: '280px' }}>\n                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px', flexWrap: 'wrap' }}>\n                                    <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', letterSpacing: '-0.5px' }}>\n                                        @{profileData.displayUsername}\n                                    </h1>\n                                    <span style={{\n                                        padding: '6px 14px', borderRadius: '24px', fontSize: '13px', fontWeight: '700',\n                                        background: roleColor.bg, color: roleColor.text,\n                                        border: \`1px solid \${roleColor.text}40\`,\n                                        boxShadow: \`0 2px 10px \${roleColor.bg}\`,\n                                        display: 'inline-flex', alignItems: 'center', gap: '6px'\n                                    }}>\n                                        <Award size={14} /> {roleLabel}\n                                    </span>\n                                </div>\n                                \n                                {/* User Rating */}\n                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>`,
        `                            <div className="profile-info-section">\n                                <div className="profile-username-row">\n                                    <h1 className="profile-username">@{profileData.displayUsername}</h1>\n                                    <span className="profile-role-badge">\n                                        <Award size={14} /> {roleLabel}\n                                    </span>\n                                </div>\n                                \n                                {/* User Rating */}\n                                <div className="profile-rating">`
    ],
    [
        `                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>\n                                    {carString && (\n                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>\n                                            <Car style={{ width: '14px', height: '14px' }} />\n                                            {carString}\n                                        </span>\n                                    )}\n                                    {locationString && (\n                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>\n                                            <MapPin style={{ width: '14px', height: '14px' }} />\n                                            {locationString}\n                                        </span>\n                                    )}\n                                    {/* Sahibinden Linki */}\n                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>\n                                        <ExternalLink style={{ width: '14px', height: '14px' }} />\n                                        <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: '600' }}>Sahibinden İlanları</a>\n                                    </span>\n                                    {/* Arabam Linki */}\n                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>\n                                        <ExternalLink style={{ width: '14px', height: '14px' }} />\n                                        <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: '600' }}>Arabam.com</a>\n                                    </span>\n                                </div>`,
        `                                <div className="profile-meta-row">\n                                    {carString && (\n                                        <span className="profile-meta-item">\n                                            <Car style={{ width: '14px', height: '14px' }} />\n                                            {carString}\n                                        </span>\n                                    )}\n                                    {locationString && (\n                                        <span className="profile-meta-item">\n                                            <MapPin style={{ width: '14px', height: '14px' }} />\n                                            {locationString}\n                                        </span>\n                                    )}\n                                    <span className="profile-meta-item">\n                                        <ExternalLink style={{ width: '14px', height: '14px' }} />\n                                        <a href="#" target="_blank" rel="noopener noreferrer" className="profile-ext-link">Sahibinden</a>\n                                    </span>\n                                    <span className="profile-meta-item">\n                                        <ExternalLink style={{ width: '14px', height: '14px' }} />\n                                        <a href="#" target="_blank" rel="noopener noreferrer" className="profile-ext-link">Arabam.com</a>\n                                    </span>\n                                </div>`
    ],
    [
        `                {/* Stats Bar */}\n                <div style={{\n                    background: 'var(--card-bg)',\n                    borderBottom: '1px solid var(--card-border)',\n                    padding: '20px 24px',\n                }}>\n                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>\n                        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>`,
        `                {/* Stats Bar */}\n                <div className="profile-stats-wrapper">\n                    <div className="profile-stats-grid">`
    ],
    [
        `                                <div key={i} style={{ textAlign: 'center' }}>\n                                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>\n                                        {stat.value}\n                                    </div>\n                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>`,
        `                                <div key={i} className="profile-stat-item">\n                                    <div className="profile-stat-val">\n                                        {stat.value}\n                                    </div>\n                                    <div className="profile-stat-label">`
    ],
    [
        `                {/* Main Content */}\n                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>\n                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>`,
        `                {/* Main Content */}\n                <div className="profile-container">\n                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>`
    ],
    [
        `                            {/* Tabs */}\n                            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var(--card-border)' }}>\n                                <button onClick={() => setActiveTab('posts')} style={{ padding: '10px 4px', background: 'transparent', border: 'none', borderBottom: activeTab === 'posts' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'posts' ? 'var(--foreground)' : 'var(--text-muted)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>\n                                    Başlıklar ({userThreads.length})\n                                </button>\n                                <button onClick={() => setActiveTab('comments')} style={{ padding: '10px 4px', background: 'transparent', border: 'none', borderBottom: activeTab === 'comments' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'comments' ? 'var(--foreground)' : 'var(--text-muted)', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>\n                                    Entryler ({userEntries.length})\n                                </button>\n                            </div>`,
        `                            {/* Tabs */}\n                            <div className="profile-tabs">\n                                <button onClick={() => setActiveTab('posts')} className={\`profile-tab \${activeTab === 'posts' ? 'active' : ''}\`}>\n                                    Başlıklar ({userThreads.length})\n                                </button>\n                                <button onClick={() => setActiveTab('comments')} className={\`profile-tab \${activeTab === 'comments' ? 'active' : ''}\`}>\n                                    Entryler ({userEntries.length})\n                                </button>\n                            </div>`
    ],
    [
        `<div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>`,
        `<div className="profile-card">`
    ],
    [
        `<div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px' }}>`,
        `<div className="profile-card">`
    ],
    [
        `<h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '16px' }}>`,
        `<h3 className="profile-card-title">`
    ],
    [
        `<h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>`,
        `<h3 className="profile-card-title">`
    ],
    [
        `style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}`,
        `className="profile-feed-item"`
    ],
    [
        `<h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>`,
        `<h3 className="profile-card-title" style={{ marginBottom: '8px' }}>`
    ],
    [
        `<div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>`,
        `<div className="profile-meta-row" style={{ fontSize: '12px' }}>`
    ],
    [
        `<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>`,
        `<span className="profile-meta-item">`
    ]
];

let hasError = false;
for (const [old_str, new_str] of replacements) {
    if (content.includes(old_str)) {
        content = content.split(old_str).join(new_str);
    } else {
        console.error('Could not find string:\\n' + old_str);
        hasError = true;
    }
}

if (!hasError) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log("Refactoring complete.");
} else {
    fs.writeFileSync(filepath, content, 'utf8'); // Still write the partial replacements
    console.log("Refactoring complete with some missed strings.");
}

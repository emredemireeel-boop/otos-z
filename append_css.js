const fs = require('fs');
const filepath = 'app/globals.css';

const newCss = `
/* =========================================
   PROFILE PAGE STYLES (Sade ve Profesyonel)
   ========================================= */

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.profile-header-wrapper {
  background: var(--card-bg);
  border-bottom: 1px solid var(--card-border);
  padding: 40px 24px;
}

.profile-header {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.profile-avatar-wrapper {
  position: relative;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--secondary);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  color: var(--text-muted);
  border: 1px solid var(--card-border);
  overflow: hidden;
}

.profile-avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-avatar-edit-btn:hover {
  background: var(--secondary);
}

.profile-info-section {
  flex: 1;
  min-width: 280px;
}

.profile-username-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.profile-username {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.5px;
}

.profile-role-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  background: var(--secondary);
  color: var(--foreground);
  border: 1px solid var(--card-border);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.profile-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.profile-fullname {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 12px;
}

.profile-bio {
  color: var(--foreground);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  max-width: 600px;
}

.profile-meta-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--text-muted);
}

.profile-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Link Colors - Neutralized */
.profile-ext-link {
  color: var(--foreground);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}
.profile-ext-link:hover {
  color: var(--primary);
}

.profile-action-btns {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--secondary);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-secondary:hover {
  background: var(--card-border);
}

.btn-danger-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-danger-outline:hover {
  background: rgba(239, 68, 68, 0.1);
}

.profile-stats-wrapper {
  background: var(--card-bg);
  border-bottom: 1px solid var(--card-border);
  padding: 24px;
}

.profile-stats-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 48px;
  justify-content: center;
  flex-wrap: wrap;
}

.profile-stat-item {
  text-align: center;
}

.profile-stat-val {
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 4px;
}

.profile-stat-label {
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

.profile-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--card-border);
}

.profile-tab {
  padding: 12px 4px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.profile-tab:hover {
  color: var(--foreground);
}
.profile-tab.active {
  border-bottom: 2px solid var(--primary);
  color: var(--foreground);
  font-weight: 600;
}

.profile-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}
.profile-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 16px;
}

.profile-feed-item {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}
.profile-feed-item:hover {
  border-color: var(--text-muted);
}
`;

fs.appendFileSync(filepath, newCss, 'utf8');
console.log("CSS appended.");

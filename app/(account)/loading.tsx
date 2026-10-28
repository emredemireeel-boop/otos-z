export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background)',
      zIndex: 9999,
      gap: '24px'
    }}>
      <div className="dot-spinner">
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
      <div style={{
        color: 'var(--primary)',
        fontSize: '16px',
        fontWeight: '600',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        opacity: 0.8,
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        Yükleniyor...
      </div>
    </div>
  );
}

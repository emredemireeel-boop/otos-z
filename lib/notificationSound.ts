/**
 * Bildirim sesi yonetimi
 * /public/bildirimsesi.mp3 dosyasini calar
 * Tarayici izni gerektirir (ilk kullanici etkilesiminden sonra)
 */

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let isLoaded = false;

/** Ses dosyasini yukle (lazy load) */
async function loadSound() {
    if (isLoaded) return;
    try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Oncelikle mp3, sonra wav dene
        let response = await fetch('/bildirimsesi.mp3');
        if (!response.ok) {
            response = await fetch('/bildirimsesi.wav');
        }
        if (!response.ok) {
            createFallbackSound();
            isLoaded = true;
            return;
        }
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        isLoaded = true;
    } catch (e) {
        console.warn('Bildirim sesi yuklenemedi, fallback kullaniliyor:', e);
        createFallbackSound();
        isLoaded = true;
    }
}

/** MP3 bulunamazsa sentez ses olustur */
function createFallbackSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // 0.15 saniyelik kisa "ding" sesi
    const sampleRate = audioContext.sampleRate;
    const duration = 0.15;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        // 880Hz + 1320Hz harmonik, fade out
        const envelope = Math.exp(-t * 20);
        data[i] = envelope * (Math.sin(2 * Math.PI * 880 * t) * 0.5 + Math.sin(2 * Math.PI * 1320 * t) * 0.3);
    }
    audioBuffer = buffer;
}

/** Bildirim sesini cal */
export async function playNotificationSound() {
    try {
        if (!isLoaded) await loadSound();
        if (!audioContext || !audioBuffer) return;

        // AudioContext askida kalabilir, resume et
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Gain node ile ses seviyesi ayarla
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(0);
    } catch (e) {
        // Ses calma hatasi (kullanici izni yok vs.)
        console.warn('Bildirim sesi calinamadi:', e);
    }
}

/** Sayfa yuklendiginde sesi on-yukle (ilk etkilesimde) */
export function preloadNotificationSound() {
    const handler = () => {
        loadSound();
        document.removeEventListener('click', handler);
        document.removeEventListener('keydown', handler);
    };
    document.addEventListener('click', handler, { once: true });
    document.addEventListener('keydown', handler, { once: true });
}

// ========================================
// TIKTOK API - ZIFER API
// ========================================

const API_CONFIG = {
    baseUrl: 'https://ziferr-tiktok-api.vercel.app',
    endpoints: {
        tiktok: '/api/tiktok'
    },
    timeout: 15000
};

// ========================================
// FETCH TIKTOK DATA
// ========================================
async function fetchTikTokData(url) {
    const apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.tiktok}?url=${encodeURIComponent(url)}`;
    
    console.log('🔍 Fetching TikTok data...');
    console.log('📡 API URL:', apiUrl);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        const response = await fetch(apiUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ API Response:', data);

        // Zifer API response format
        if (data.success) {
            return {
                success: true,
                video: data.video || data.play || data.wmplay || null,
                audio: data.audio || data.music || null,
                title: data.title || data.desc || 'TikTok Video',
                caption: data.caption || data.desc || '',
                author: data.author || data.nickname || '@unknown',
                likes: data.like_count || data.likes || 0,
                comments: data.comment_count || data.comments || 0,
                shares: data.share_count || data.shares || 0,
                video_size: data.video_size || null,
                audio_size: data.audio_size || null,
                duration: data.duration || '00:00',
                thumbnail: data.cover || data.thumbnail || null,
                raw: data
            };
        } else {
            throw new Error(data.message || 'Gagal mengambil data video');
        }

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('⏰ Request timeout. Silakan coba lagi.');
        }
        console.error('❌ API Error:', error);
        throw new Error(error.message || 'Terjadi kesalahan saat mengambil data');
    }
}

// ========================================
// FALLBACK API - TikWM
// ========================================
async function fetchTikWM(url) {
    try {
        const response = await fetch(
            `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`,
            { method: 'GET' }
        );
        
        if (!response.ok) throw new Error('TikWM failed');
        
        const data = await response.json();
        if (data.data) {
            return {
                success: true,
                video: data.data.play || data.data.wmplay,
                audio: data.data.music,
                title: data.data.title,
                author: data.data.author,
                likes: data.data.digg_count || 0,
                comments: data.data.comment_count || 0,
                shares: data.data.share_count || 0,
                caption: data.data.title || '',
                thumbnail: data.data.cover || null
            };
        }
        return null;
    } catch (error) {
        console.log('TikWM fallback failed:', error.message);
        return null;
    }
}

// ========================================
// FETCH WITH FALLBACK
// ========================================
async function fetchTikTokDataWithFallback(url) {
    // Try primary API first (Zifer)
    try {
        return await fetchTikTokData(url);
    } catch (error) {
        console.log('⚠️ Primary API failed, trying fallback...');
        
        // Try TikWM as fallback
        const fallbackData = await fetchTikWM(url);
        if (fallbackData) {
            return fallbackData;
        }

        throw new Error('❌ Gagal memproses video. Periksa URL atau coba lagi nanti.');
    }
}

// ========================================
// EXPORT
// ========================================
if (typeof window !== 'undefined') {
    window.fetchTikTokData = fetchTikTokDataWithFallback;
}

console.log('📦 TikTok API loaded successfully!');
console.log('🔗 Base URL:', API_CONFIG.baseUrl);

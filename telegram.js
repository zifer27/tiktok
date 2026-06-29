// ========================================
// TELEGRAM BOT - LOGGER
// ========================================

const TELEGRAM_CONFIG = {
    botToken: '8837099102:AAGzcQK_kjW5yvvHMe0wP2zbQ35T_S6hkx0',
    chatId: '7013997051',
    apiUrl: 'https://api.telegram.org/bot'
};

// ========================================
// SEND TO TELEGRAM
// ========================================
async function sendToTelegram(url, data) {
    try {
        const ip = await getUserIP();
        const message = formatTelegramMessage(url, data, ip);
        
        const response = await fetch(
            `${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            }
        );

        if (!response.ok) {
            console.error('Telegram send failed:', await response.text());
        } else {
            console.log('✅ Telegram notification sent');
        }
    } catch (error) {
        console.error('❌ Telegram error:', error);
    }
}

// ========================================
// FORMAT MESSAGE
// ========================================
function formatTelegramMessage(url, data, ip) {
    const timestamp = new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta'
    });

    return `
📱 <b>TIKTOK DOWNLOADER LOG</b>
━━━━━━━━━━━━━━━━━

🔗 <b>URL:</b>
<code>${url}</code>

👤 <b>Author:</b> ${data.author || 'Unknown'}
📝 <b>Title:</b> ${data.title || 'No title'}

📊 <b>Stats:</b>
❤️ Likes: ${data.likes || 0}
💬 Comments: ${data.comments || 0}

📁 <b>Files:</b>
📹 Video: ${data.video ? '✅' : '❌'}
🎵 Audio: ${data.audio ? '✅' : '❌'}

🌐 <b>IP:</b> <code>${ip || 'Unknown'}</code>
🕐 <b>Time:</b> ${timestamp}

━━━━━━━━━━━━━━━━━
⚡ Powered by <b>Zifer API</b>
    `;
}

// ========================================
// GET IP
// ========================================
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unknown';
    }
}

// ========================================
// EXPORT
// ========================================
if (typeof window !== 'undefined') {
    window.sendToTelegram = sendToTelegram;
}

console.log('📱 Telegram Bot loaded!');
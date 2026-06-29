// ========================================
// TIKTOK DOWNLOADER - MAIN SCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const elements = {
        preloader: document.getElementById('preloader'),
        welcomeSection: document.getElementById('welcomeSection'),
        downloaderSection: document.getElementById('downloaderSection'),
        goToDownloader: document.getElementById('goToDownloader'),
        backToWelcome: document.getElementById('backToWelcome'),
        urlInput: document.getElementById('urlInput'),
        downloadBtn: document.getElementById('downloadBtn'),
        errorMessage: document.getElementById('errorMessage'),
        errorText: document.getElementById('errorText'),
        successMessage: document.getElementById('successMessage'),
        successText: document.getElementById('successText'),
        progressContainer: document.getElementById('progressContainer'),
        progressBar: document.getElementById('progressBar'),
        progressText: document.getElementById('progressText'),
        progressPercent: document.getElementById('progressPercent'),
        resultSection: document.getElementById('resultSection'),
        videoInfo: document.getElementById('videoInfo'),
        videoTitle: document.getElementById('videoTitle'),
        videoAuthor: document.getElementById('videoAuthor'),
        likeCount: document.getElementById('likeCount'),
        commentCount: document.getElementById('commentCount'),
        videoPreview: document.getElementById('videoPreview'),
        downloadVideo: document.getElementById('downloadVideo'),
        downloadAudio: document.getElementById('downloadAudio'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage'),
        pasteBtn: document.getElementById('pasteBtn'),
        clearBtn: document.getElementById('clearBtn'),
        apiToggle: document.getElementById('apiToggle'),
        apiBody: document.getElementById('apiBody'),
        copyCodeBtns: document.querySelectorAll('.copy-code'),
        apiTabs: document.querySelectorAll('.api-tab'),
        messageCloseBtns: document.querySelectorAll('.message-close')
    };

    // ========================================
    // STATE
    // ========================================
    let currentVideoData = null;
    let videoElement = null;
    let isDownloaderVisible = false;

    // ========================================
    // INIT
    // ========================================
    function init() {
        // Hide preloader
        setTimeout(() => {
            elements.preloader.classList.add('hide');
        }, 1200);

        // Show welcome section by default
        showWelcomeSection();

        // Setup event listeners
        setupEventListeners();

        // Create particles
        createParticles();

        // Focus input
        setTimeout(() => {
            if (elements.urlInput) elements.urlInput.focus();
        }, 500);

        console.log('📱 TikTok Downloader Pro v3.0');
        console.log('🔗 Powered by Zifer API');
    }

    // ========================================
    // NAVIGATION FUNCTIONS
    // ========================================
    function showWelcomeSection() {
        if (elements.welcomeSection) {
            elements.welcomeSection.style.display = 'block';
        }
        if (elements.downloaderSection) {
            elements.downloaderSection.style.display = 'none';
        }
        isDownloaderVisible = false;
        document.title = 'Welcome - TikTok Downloader Pro';
    }

    function showDownloaderSection() {
        if (elements.welcomeSection) {
            elements.welcomeSection.style.display = 'none';
        }
        if (elements.downloaderSection) {
            elements.downloaderSection.style.display = 'block';
            // Trigger animation
            elements.downloaderSection.style.animation = 'none';
            setTimeout(() => {
                elements.downloaderSection.style.animation = 'fadeInSection 0.8s ease-out';
            }, 10);
        }
        isDownloaderVisible = true;
        document.title = 'TikTok Downloader Pro';
        
        // Focus input after transition
        setTimeout(() => {
            if (elements.urlInput) elements.urlInput.focus();
        }, 400);
    }

    // ========================================
    // PARTICLES
    // ========================================
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        const count = 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 3 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 20) + 's';
            container.appendChild(particle);
        }
    }

    // ========================================
    // SETUP EVENT LISTENERS
    // ========================================
    function setupEventListeners() {
        // ===== NAVIGATION =====
        // Go to Downloader
        if (elements.goToDownloader) {
            elements.goToDownloader.addEventListener('click', function(e) {
                e.preventDefault();
                // Add loading animation
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    showDownloaderSection();
                    this.innerHTML = originalText;
                    this.style.pointerEvents = 'auto';
                    showToast('🚀 Ready to download TikTok content!');
                }, 600);
            });
        }

        // Back to Welcome
        if (elements.backToWelcome) {
            elements.backToWelcome.addEventListener('click', function(e) {
                e.preventDefault();
                showWelcomeSection();
                showToast('🏠 Welcome back!');
            });
        }

        // ===== DOWNLOAD BUTTON =====
        if (elements.downloadBtn) {
            elements.downloadBtn.addEventListener('click', handleDownload);
        }

        // ===== ENTER KEY =====
        if (elements.urlInput) {
            elements.urlInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleDownload();
                }
            });

            elements.urlInput.addEventListener('input', handleUrlInput);
        }

        // ===== PASTE BUTTON =====
        if (elements.pasteBtn) {
            elements.pasteBtn.addEventListener('click', handlePaste);
        }

        // ===== CLEAR BUTTON =====
        if (elements.clearBtn) {
            elements.clearBtn.addEventListener('click', () => {
                if (elements.urlInput) {
                    elements.urlInput.value = '';
                    elements.urlInput.focus();
                }
                hideMessages();
            });
        }

        // ===== DOWNLOAD VIDEO =====
        if (elements.downloadVideo) {
            elements.downloadVideo.addEventListener('click', () => {
                if (currentVideoData?.video) {
                    downloadFile(currentVideoData.video, `tiktok-video-${Date.now()}.mp4`);
                } else {
                    showError('Data video tidak tersedia');
                }
            });
        }

        // ===== DOWNLOAD AUDIO =====
        if (elements.downloadAudio) {
            elements.downloadAudio.addEventListener('click', () => {
                if (currentVideoData?.audio) {
                    downloadFile(currentVideoData.audio, `tiktok-audio-${Date.now()}.mp3`);
                } else {
                    showError('Data audio tidak tersedia');
                }
            });
        }

        // ===== API TOGGLE =====
        if (elements.apiToggle && elements.apiBody) {
            elements.apiToggle.addEventListener('click', toggleApiDocs);
        }

        // ===== API TABS =====
        if (elements.apiTabs) {
            elements.apiTabs.forEach(tab => {
                tab.addEventListener('click', switchApiTab);
            });
        }

        // ===== COPY CODE =====
        if (elements.copyCodeBtns) {
            elements.copyCodeBtns.forEach(btn => {
                btn.addEventListener('click', handleCopyCode);
            });
        }

        // ===== MESSAGE CLOSE =====
        if (elements.messageCloseBtns) {
            elements.messageCloseBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const message = btn.closest('.message');
                    if (message) message.classList.add('hide');
                });
            });
        }

        // ===== TOAST CLOSE =====
        const toastClose = document.querySelector('.toast-close');
        if (toastClose) {
            toastClose.addEventListener('click', () => {
                if (elements.toast) elements.toast.classList.remove('show');
            });
        }

        // ===== KEYBOARD SHORTCUTS =====
        document.addEventListener('keydown', (e) => {
            // ESC to close toast
            if (e.key === 'Escape' && elements.toast) {
                elements.toast.classList.remove('show');
            }
            
            // Ctrl+Shift+D to go to downloader
            if (e.key === 'D' && e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                if (!isDownloaderVisible) {
                    elements.goToDownloader?.click();
                }
            }
            
            // Ctrl+Shift+H to go to home
            if (e.key === 'H' && e.ctrlKey && e.shiftKey) {
                e.preventDefault();
                if (isDownloaderVisible) {
                    elements.backToWelcome?.click();
                }
            }
        });

        console.log('✅ Event listeners setup complete');
        console.log('💡 Shortcuts: Ctrl+Shift+D = Downloader, Ctrl+Shift+H = Home');
    }

    // ========================================
    // HANDLE DOWNLOAD
    // ========================================
    async function handleDownload() {
        if (!elements.urlInput) return;
        const url = elements.urlInput.value.trim();

        if (!url) {
            showError('Masukkan URL TikTok terlebih dahulu!');
            return;
        }

        if (!isValidTikTokUrl(url)) {
            showError('URL TikTok tidak valid! Contoh: https://vt.tiktok.com/xxx');
            return;
        }

        hideMessages();
        if (elements.resultSection) {
            elements.resultSection.style.display = 'none';
        }
        if (elements.videoInfo) {
            elements.videoInfo.style.display = 'none';
        }
        setLoading(true);
        showProgress(30, 'Mengambil data video...');

        try {
            const data = await window.fetchTikTokData(url);
            
            if (!data || !data.success) {
                throw new Error('Gagal mengambil data video');
            }

            currentVideoData = data;
            showProgress(70, 'Memproses video...');

            if (data.video) {
                showVideoPreview(data.video);
            }

            if (data.title || data.author) {
                showVideoInfo(data);
            }

            showProgress(100, 'Selesai!');

            setTimeout(() => {
                hideProgress();
                if (elements.resultSection) {
                    elements.resultSection.style.display = 'block';
                }
                showSuccess('✅ Video berhasil diproses!');

                // Send to Telegram
                if (window.sendToTelegram) {
                    window.sendToTelegram(url, data);
                }
            }, 500);

        } catch (error) {
            console.error('Error:', error);
            hideProgress();
            showError('❌ ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    // ========================================
    // URL VALIDATION
    // ========================================
    function isValidTikTokUrl(url) {
        const patterns = [
            /tiktok\.com\/@[\w.-]+\/video\/\d+/,
            /tiktok\.com\/@[\w.-]+\/v\/\d+/,
            /vm\.tiktok\.com\/\w+/,
            /vt\.tiktok\.com\/\w+/
        ];
        return patterns.some(pattern => pattern.test(url));
    }

    function handleUrlInput() {
        if (!elements.urlInput) return;
        const url = elements.urlInput.value.trim();
        if (!url) {
            hideMessages();
            return;
        }
        if (!isValidTikTokUrl(url)) {
            showError('⚠️ Format URL TikTok tidak valid');
        } else {
            hideMessages();
        }
    }

    // ========================================
    // HANDLE PASTE
    // ========================================
    async function handlePaste() {
        try {
            const text = await navigator.clipboard.readText();
            if (text && elements.urlInput) {
                elements.urlInput.value = text;
                elements.urlInput.focus();
                showSuccess('✅ URL berhasil ditempel!');
                setTimeout(() => hideMessages(), 2000);
            }
        } catch (error) {
            showError('❌ Gagal mengakses clipboard');
        }
    }

    // ========================================
    // VIDEO PREVIEW
    // ========================================
    function showVideoPreview(videoUrl) {
        if (!elements.videoPreview) return;
        const container = elements.videoPreview;
        
        const oldVideo = container.querySelector('video');
        if (oldVideo) {
            oldVideo.remove();
        }

        videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.loop = true;
        videoElement.playsInline = true;
        videoElement.preload = 'metadata';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';

        const placeholder = container.querySelector('.video-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        videoElement.addEventListener('error', () => {
            showError('❌ Gagal memuat preview video');
        });

        videoElement.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        container.appendChild(videoElement);
    }

    // ========================================
    // VIDEO INFO
    // ========================================
    function showVideoInfo(data) {
        if (!elements.videoInfo) return;
        elements.videoInfo.style.display = 'block';
        
        if (data.title && elements.videoTitle) {
            elements.videoTitle.textContent = data.title;
        }
        
        if (data.author && elements.videoAuthor) {
            elements.videoAuthor.textContent = data.author;
        }

        if (data.likes && elements.likeCount) {
            elements.likeCount.textContent = formatNumber(data.likes);
        }
        if (data.comments && elements.commentCount) {
            elements.commentCount.textContent = formatNumber(data.comments);
        }
    }

    // ========================================
    // API DOCS
    // ========================================
    function toggleApiDocs() {
        if (!elements.apiBody || !elements.apiToggle) return;
        const isHidden = elements.apiBody.classList.toggle('hide');
        elements.apiToggle.classList.toggle('active');
        elements.apiToggle.innerHTML = isHidden 
            ? '<i class="fas fa-chevron-down"></i>' 
            : '<i class="fas fa-chevron-up"></i>';
    }

    function switchApiTab(e) {
        const tab = e.currentTarget;
        const target = tab.dataset.tab;

        document.querySelectorAll('.api-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.api-code').forEach(c => c.classList.remove('active'));
        const targetEl = document.getElementById(target);
        if (targetEl) {
            targetEl.classList.add('active');
        }
    }

    function handleCopyCode(e) {
        const targetId = e.currentTarget.dataset.target;
        const codeEl = document.getElementById(targetId);
        if (codeEl) {
            navigator.clipboard.writeText(codeEl.textContent).then(() => {
                const originalText = e.currentTarget.innerHTML;
                e.currentTarget.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    e.currentTarget.innerHTML = originalText;
                }, 2000);
                showToast('✅ Code copied!');
            }).catch(() => {
                showError('Failed to copy code');
            });
        }
    }

    // ========================================
    // DOWNLOAD FILE
    // ========================================
    function downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('⬇️ Download dimulai!');
    }

    // ========================================
    // UI HELPERS
    // ========================================
    function setLoading(isLoading) {
        if (!elements.downloadBtn) return;
        elements.downloadBtn.disabled = isLoading;
        elements.downloadBtn.innerHTML = isLoading 
            ? '<i class="fas fa-spinner fa-spin"></i> Memproses...' 
            : '<i class="fas fa-arrow-right"></i> Proses';
    }

    function showProgress(percent, text) {
        if (!elements.progressContainer || !elements.progressBar || !elements.progressText || !elements.progressPercent) return;
        elements.progressContainer.style.display = 'block';
        elements.progressBar.style.width = `${percent}%`;
        elements.progressText.textContent = text;
        elements.progressPercent.textContent = `${percent}%`;
    }

    function hideProgress() {
        if (!elements.progressContainer) return;
        setTimeout(() => {
            elements.progressContainer.style.display = 'none';
        }, 500);
    }

    function showError(message) {
        if (!elements.errorMessage || !elements.errorText) return;
        elements.errorText.textContent = message;
        elements.errorMessage.classList.remove('hide');
        if (elements.successMessage) elements.successMessage.classList.add('hide');
        
        setTimeout(() => {
            if (elements.errorMessage) elements.errorMessage.classList.add('hide');
        }, 6000);
    }

    function showSuccess(message) {
        if (!elements.successMessage || !elements.successText) return;
        elements.successText.textContent = message;
        elements.successMessage.classList.remove('hide');
        if (elements.errorMessage) elements.errorMessage.classList.add('hide');
        
        setTimeout(() => {
            if (elements.successMessage) elements.successMessage.classList.add('hide');
        }, 4000);
    }

    function hideMessages() {
        if (elements.errorMessage) elements.errorMessage.classList.add('hide');
        if (elements.successMessage) elements.successMessage.classList.add('hide');
    }

    function showToast(message) {
        if (!elements.toast || !elements.toastMessage) return;
        elements.toastMessage.textContent = message;
        elements.toast.classList.add('show');
        
        setTimeout(() => {
            if (elements.toast) elements.toast.classList.remove('show');
        }, 3000);
    }

    function formatNumber(num) {
        if (!num) return '0';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // ========================================
    // KEYBOARD SHORTCUTS INFO
    // ========================================
    console.log('💡 Keyboard Shortcuts:');
    console.log('  Ctrl+Shift+D → Go to Downloader');
    console.log('  Ctrl+Shift+H → Go to Home');
    console.log('  ESC → Close notifications');

    // ========================================
    // INIT
    // ========================================
    init();
});
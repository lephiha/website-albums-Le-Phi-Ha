// Video Modal Functionality
const videoItems = document.querySelectorAll('.media-item.video-item');
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.querySelector('.close-modal');

// Detect mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Open video in modal
videoItems.forEach(item => {
    item.addEventListener('click', function() {
        const videoSrc = this.querySelector('video').src;
        modalVideo.src = videoSrc;
        videoModal.classList.add('active');
        
        // Auto play on desktop, require user interaction on mobile
        if (!isMobile) {
            modalVideo.play();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
function closeVideoModal() {
    videoModal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = 'auto';
}

closeModal.addEventListener('click', closeVideoModal);

// Close on background click
videoModal.addEventListener('click', function(e) {
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
    }
});

// Get video duration
videoItems.forEach(item => {
    const video = item.querySelector('video');
    const durationEl = item.querySelector('.video-duration');
    
    video.addEventListener('loadedmetadata', function() {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        durationEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });
});

// Prevent video from playing when scrolling on mobile
if (isMobile) {
    videoItems.forEach(item => {
        const video = item.querySelector('video');
        video.addEventListener('play', function(e) {
            if (!videoModal.classList.contains('active')) {
                e.preventDefault();
                video.pause();
            }
        });
    });
}

// Handle orientation change
window.addEventListener('orientationchange', function() {
    if (videoModal.classList.contains('active')) {
        // Adjust modal size on orientation change
        setTimeout(() => {
            modalVideo.style.maxHeight = window.innerHeight * 0.9 + 'px';
        }, 100);
    }
});
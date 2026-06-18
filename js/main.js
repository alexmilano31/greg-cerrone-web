document.addEventListener('DOMContentLoaded', () => {

    /* --- Navigation Scroll Effect --- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent scrolling when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* --- Intersection Observer for Animations --- */
    // Trigger animations when elements scroll into view

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe text reveals and fade-ins
    const animatedElements = document.querySelectorAll('.reveal-text, .fade-in');

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Trigger hero animations on initial load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .reveal-text');
        heroElements.forEach(el => el.classList.add('active'));
    }, 100); // Small delay to ensure smooth rendering

    /* --- Global Media Management --- */
    const localVideo = document.querySelector('.local-video');
    const scIframe = document.getElementById('sc-iframe');
    const trackAudio = new Audio();
    trackAudio.volume = 0.5;

    function stopAllMedia(except = null) {
        // Stop Local Audio
        if (except !== 'audio' && !trackAudio.paused) {
            trackAudio.pause();
            musicItems.forEach(i => i.classList.remove('is-playing'));
        }

        // Stop Local Video (Lately)
        if (except !== 'video' && localVideo && !localVideo.paused) {
            localVideo.pause();
        }

        // Stop SoundCloud (Reset iframe src to kill playback)
        if (except !== 'soundcloud' && scIframe) {
            const currentSrc = scIframe.src;
            scIframe.src = '';
            scIframe.src = currentSrc;
            
            // Also close the box if it's open and we're playing something else
            if (except !== null) {
                soundCloudBox.classList.remove('active');
                toggleSoundCloud.textContent = 'PLAY DIRECT SOUNDCLOUD';
            }
        }
    }

    if (localVideo) {
        localVideo.addEventListener('play', () => stopAllMedia('video'));
    }

    /* --- Music Item Audio Player --- */
    const musicItems = document.querySelectorAll('.music-item');
    let currentTrack = null;

    musicItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const audioSrc = item.getAttribute('data-audio');
            if (!audioSrc) return;

            // If clicking the same item that's already playing, toggle pause
            if (currentTrack === item) {
                if (trackAudio.paused) {
                    stopAllMedia('audio');
                    trackAudio.play();
                    item.classList.add('is-playing');
                } else {
                    trackAudio.pause();
                    item.classList.remove('is-playing');
                }
                return;
            }

            // Stop everything else before playing new track
            stopAllMedia('audio');

            // Play new track
            trackAudio.src = audioSrc;
            trackAudio.play();
            item.classList.add('is-playing');
            currentTrack = item;
        });
    });

    // Reset background sound when track ends
    trackAudio.addEventListener('ended', () => {
        if (currentTrack) {
            currentTrack.classList.remove('is-playing');
            currentTrack = null;
        }
    });

    /* --- SoundCloud Player Toggle --- */
    const toggleSoundCloud = document.getElementById('toggle-soundcloud');
    const soundCloudBox = document.getElementById('soundcloud-player-box');

    if (toggleSoundCloud && soundCloudBox) {
        toggleSoundCloud.addEventListener('click', () => {
            const isActive = soundCloudBox.classList.toggle('active');
            toggleSoundCloud.textContent = isActive ? 'CLOSE PLAYER' : 'PLAY DIRECT SOUNDCLOUD';

            if (isActive) {
                stopAllMedia('soundcloud');
            } else {
                stopAllMedia(); // Just stop everything if closing
            }
        });
    }

});

/* --- Remove Bandsintown "Notify Me" buttons dynamically --- */
function removeBitsintownNotifyButtons() {
    // Target all possible Notify Me button selectors
    const selectors = [
        '.bit-notify-me-button',
        '.bit-follow-section',
        '.bit-event__buttons',
        '.bit-event__buttons-wrapper',
        '[class*="bit-notify"]',
        '[class*="bit-follow"]',
        '[class*="bit-event__button"]',
        '[class*="notify-me"]',
    ];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
    });

    // Also target by text content as a fallback
    document.querySelectorAll('.bit-widget a, .bit-widget button').forEach(el => {
        if (el.textContent.trim().toLowerCase().includes('notify') ||
            el.textContent.trim().toLowerCase() === 'rsvp') {
            el.remove();
        }
    });
}

// Run immediately and observe future DOM mutations (widget loads async)
const bitObserver = new MutationObserver(() => removeBitsintownNotifyButtons());
bitObserver.observe(document.body, { childList: true, subtree: true });
// Also run after a delay to catch late-loading widget
setTimeout(removeBitsintownNotifyButtons, 1000);
setTimeout(removeBitsintownNotifyButtons, 3000);


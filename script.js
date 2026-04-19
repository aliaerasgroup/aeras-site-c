/* =========================================================
   AERAS GROUP — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL REVEAL ANIMATIONS ONLY
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealOnScroll.observe(el));

    // NOTE: All Contact Form logic has been removed. 
    // The browser natively handles validation and redirects securely to FormSubmit.
   // ── LOGO 3D MOUSE TILT ──
    const heroImg = document.querySelector('.hero-img');
    const heroContainer = document.querySelector('.hero-visual');

    if (heroImg && heroContainer) {
        document.addEventListener('mousemove', (e) => {
            const rect = heroImg.getBoundingClientRect();
            const logoCenterX = rect.left + rect.width / 2;
            const logoCenterY = rect.top + rect.height / 2;

            // Calculate distance from center
            const mouseX = (e.clientX - logoCenterX) / (window.innerWidth / 2);
            const mouseY = (e.clientY - logoCenterY) / (window.innerHeight / 2);

            const maxTilt = 15; // Degrees of tilt
            const tiltX = mouseY * maxTilt;
            const tiltY = -(mouseX * maxTilt);

            heroImg.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
        });

        // Reset when mouse leaves
        document.addEventListener('mouseleave', () => {
            heroImg.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    }
});

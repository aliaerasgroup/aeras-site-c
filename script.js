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
});

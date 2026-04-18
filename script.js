document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL REVEAL ANIMATIONS
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

    // 2. CONTACT FORM FEEDBACK
    // We let the browser handle the actual POST to FormSubmit
    // so that the user gets the confirmation page.
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');
    
    if (form) {
        form.addEventListener('submit', () => {
            // Update UI briefly before the page redirects
            btn.textContent = 'Message Sent!';
            btn.style.background = '#4A7FB5';
            btn.style.pointerEvents = 'none';
        });
    }
});

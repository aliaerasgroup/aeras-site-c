/* =========================================================
   AERAS GROUP — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => revealOnScroll.observe(el));

    // 2. CONTACT FORM SUBMISSION LOGIC
    const contactForm = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    btn.textContent = 'Message Sent ✓';
                    btn.style.background = '#4A7FB5';
                    btn.style.color = '#fff';
                    contactForm.reset();

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.style.color = '';
                        btn.disabled = false;
                        btn.style.opacity = '';
                    }, 4000);
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                btn.textContent = 'Something went wrong — try again';
                btn.style.background = 'rgba(255,80,80,0.2)';
                btn.style.color = '#fff';
                btn.disabled = false;

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.opacity = '';
                }, 4000);
            }
        });
    }
});

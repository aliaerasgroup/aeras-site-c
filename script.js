/* =========================================================
   AERAS GROUP — script.js
   ========================================================= */

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

    // 2. CONTACT FORM LOGIC (Formspree Integration)
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch(form.action, { 
                    method: 'POST', 
                    body: new FormData(form), 
                    headers: { 'Accept': 'application/json' } 
                });
                
                if (response.ok) {
                    btn.textContent = 'Message Sent ✓';
                    btn.style.background = '#4A7FB5';
                    form.reset();
                    
                    setTimeout(() => { 
                        btn.textContent = originalText; 
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 4000);
                } else throw new Error('Network error');
            } catch (err) {
                btn.textContent = 'Try Again';
                btn.disabled = false;
                setTimeout(() => { btn.textContent = originalText; }, 4000);
            }
        });
    }
});

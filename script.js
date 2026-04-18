document.addEventListener('DOMContentLoaded', () => {
    // 1. SCROLL REVEALS
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

    // 2. CONTACT FORM
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            btn.textContent = 'Sending...';
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
                    btn.textContent = 'Send Message'; 
                    btn.style.background = '';
                }, 4000);
            }
        });
    }
});

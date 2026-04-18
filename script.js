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

    // 2. CONTACT FORM VALIDATION & SUBMISSION
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');
    const errBox = document.getElementById('error-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            errBox.style.display = 'none';
            btn.textContent = 'Authenticating...';
            btn.disabled = true;

            // Basic Field Check
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;

            if (!name || !phone || !email) {
                showError("Please complete all mandatory fields.");
                return;
            }

            try {
                const response = await fetch(form.action, { 
                    method: 'POST', 
                    body: new FormData(form), 
                    headers: { 'Accept': 'application/json' } 
                });
                
                if (response.ok) {
                    btn.textContent = 'Connection Established ✓';
                    btn.style.background = '#4A7FB5';
                    form.reset();
                    
                    setTimeout(() => { 
                        btn.textContent = 'Send Message'; 
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 5000);
                } else {
                    const data = await response.json();
                    showError(data.message || "The server rejected the connection. Please try again.");
                }
            } catch (err) {
                showError("Connection failed. Please check your network and try again.");
            }
        });
    }

    function showError(msg) {
        errBox.textContent = msg;
        errBox.style.display = 'block';
        btn.textContent = 'Try Again';
        btn.disabled = false;
    }
});

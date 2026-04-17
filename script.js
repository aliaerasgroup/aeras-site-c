/* =========================================================
   AERAS GROUP — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ── DIVISION DATA ──────────────────────────────────── */
    const divisionData = {
        strategy: {
            label: 'Aeras Strategy',
            title: 'Strategy',
            services: [
                'Business Scaling & Growth',
                'Market Entry Planning',
                'Operational Optimization',
                'Brand Positioning & Presence',
                'Competitive Analysis',
                'Executive Advisory',
            ]
        },
        digital: {
            label: 'Aeras Digital',
            title: 'Digital',
            services: [
                'Brand Creation',
                'Logo Redesign',
                'Physical Assets & Print',
                'Website Development',
                'Business Process Automation',
                'Content Creation',
                'Social Media Management',
            ]
        },
        talent: {
            label: 'Aeras Talent',
            title: 'Talent',
            services: [
                'Customer Service Teams',
                'Technical Professionals',
                'Certified Specialists',
                'Remote Team Management',
                'Executive Recruitment',
                'Fractional Roles & Advisors',
            ]
        },
        connect: {
            label: 'Aeras Connect',
            title: 'Connect',
            services: [
                'Networking Events',
                'Strategic Partnerships',
                'High-Level Introductions',
                'Industry Roundtables',
                'Investor Access & Relations',
                'Curated Business Matchmaking',
            ]
        }
    };

    /* ── MODAL ──────────────────────────────────────────── */
    const overlay   = document.getElementById('modal-overlay');
    const panel     = document.getElementById('modal-panel');
    const closeBtn  = document.getElementById('modal-close');
    const labelEl   = document.getElementById('modal-label');
    const titleEl   = document.getElementById('modal-title');
    const serviceEl = document.getElementById('modal-services');

    function openModal(divisionKey) {
        const data = divisionData[divisionKey];
        if (!data) return;

        labelEl.textContent = data.label;
        titleEl.textContent = data.title;

        serviceEl.innerHTML = data.services.map(s => `
            <li class="modal-service">
                <span class="service-dot"></span>
                <span class="service-name">${s}</span>
                <span class="service-arrow">→</span>
            </li>
        `).join('');

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        panel.scrollTop = 0;
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* Bind division cards */
    document.querySelectorAll('.division-card').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.division;
            openModal(key);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    /* ── SCROLL REVEAL ──────────────────────────────────── */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

});

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

    // 2. 3D CLOUD SYSTEM (Now properly visible and layered)
    const container = document.getElementById('cloud-canvas');
    // Ensure Three is loaded before executing
    if (container && typeof THREE !== 'undefined') {
        let scene, camera, renderer, cloudParticles = [];

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        camera.rotation.x = 1.16;
        camera.rotation.y = -0.12;
        camera.rotation.z = 0.27;

        // alpha: true is crucial so the video background displays behind it
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Clear color set entirely transparent
        renderer.setClearColor(0xffffff, 0); 
        container.appendChild(renderer.domElement);

        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambient);
        
        // Directional Light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        // Sky Blue tint light to tie into branding
        const blueLight = new THREE.PointLight(0x4A7FB5, 20, 500, 2);
        blueLight.position.set(200, 300, 100);
        scene.add(blueLight);

        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/smoke.png', function(texture) {
            
            const cloudGeo = new THREE.PlaneGeometry(500, 500);
            const cloudMaterial = new THREE.MeshLambertMaterial({
                map: texture,
                transparent: true,
                opacity: 0.7, // Increased opacity so clouds pop over the video overlay
                color: 0xffffff,
                blending: THREE.NormalBlending,
                depthWrite: false
            });

            // Position clouds exclusively on the right side
            for(let p = 0; p < 45; p++) {
                let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
                
                cloud.position.set(
                    Math.random() * 600 + 150, // Pushed to the right X axis
                    500,
                    Math.random() * 500 - 450
                );
                cloud.rotation.x = 1.16;
                cloud.rotation.y = -0.12;
                cloud.rotation.z = Math.random() * 360;
                
                cloudParticles.push(cloud);
                scene.add(cloud);
            }
            
            animateClouds();
        });

        function animateClouds() {
            requestAnimationFrame(animateClouds);
            cloudParticles.forEach(p => {
                p.rotation.z -= 0.001; 
            });
            // Parallax scroll effect
            camera.position.y = -window.scrollY * 0.08;
            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 3. CONTACT FORM LOGIC
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
                btn.style.background = '#1F3A5F';
                btn.disabled = false;

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '';
                }, 4000);
            }
        });
    }
});

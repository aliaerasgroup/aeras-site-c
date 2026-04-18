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

    // 2. REALISTIC 3D CLOUD PARTICLE SYSTEM
    const container = document.getElementById('cloud-canvas');
    if (container) {
        let scene, camera, renderer, cloudParticles = [];

        // Scene Setup
        scene = new THREE.Scene();
        // Match the fog to your Deep Navy brand color
        scene.fog = new THREE.FogExp2(0x0F1C2E, 0.001);

        // Camera Setup
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        camera.rotation.x = 1.16;
        camera.rotation.y = -0.12;
        camera.rotation.z = 0.27;

        // Renderer Setup
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x0F1C2E, 1); // Deep Navy background
        container.appendChild(renderer.domElement);

        // Lighting (Cinematic rim lighting)
        const ambient = new THREE.AmbientLight(0x4A7FB5, 0.5); // Sky Blue tint
        scene.add(ambient);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        // Cinematic Blue/Steel Lights
        const flash = new THREE.PointLight(0xAFC4D6, 50, 500, 1.7); // Steel Blue
        flash.position.set(200, 300, 100);
        scene.add(flash);

        // Load Realistic Cloud/Smoke Texture
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        
        // Using a reliable open-source WebGL smoke texture
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/smoke.png', function(texture) {
            
            const cloudGeo = new THREE.PlaneGeometry(500, 500);
            const cloudMaterial = new THREE.MeshLambertMaterial({
                map: texture,
                transparent: true,
                opacity: 0.55, // Semi-transparent for layered depth
                blending: THREE.NormalBlending,
                depthWrite: false
            });

            // Generate 60 intersecting cloud planes
            for(let p = 0; p < 60; p++) {
                let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
                cloud.position.set(
                    Math.random() * 800 - 400,
                    500,
                    Math.random() * 500 - 450
                );
                // Randomize rotation and scale
                cloud.rotation.x = 1.16;
                cloud.rotation.y = -0.12;
                cloud.rotation.z = Math.random() * 360;
                cloud.material.opacity = 0.4;
                
                cloudParticles.push(cloud);
                scene.add(cloud);
            }
            
            animateClouds();
        });

        // Animation Loop
        function animateClouds() {
            requestAnimationFrame(animateClouds);
            
            // Slowly rotate each cloud sprite to simulate billowing
            cloudParticles.forEach(p => {
                p.rotation.z -= 0.001;
            });

            // Subtle camera movement on scroll
            camera.position.y = -window.scrollY * 0.1;
            
            renderer.render(scene, camera);
        }

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 3. CONTACT FORM SUBMISSION LOGIC (Unchanged, functioning perfectly)
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

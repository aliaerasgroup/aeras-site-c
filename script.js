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

    // 2. 3D CLOUD SYSTEM (Transparent to show video)
    const container = document.getElementById('cloud-canvas');
    if (container && typeof THREE !== 'undefined') {
        let scene, camera, renderer, cloudParticles = [];

        scene = new THREE.Scene();
        // Fog shifted to white/light to match the bright theme
        scene.fog = new THREE.FogExp2(0xffffff, 0.001);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        camera.rotation.x = 1.16;
        camera.rotation.y = -0.12;
        camera.rotation.z = 0.27;

        // alpha: true allows the video to show through from behind
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Soft white ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);
        
        // Directional light giving volume to clouds
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

        // Subtle Sky Blue tint light
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
                opacity: 0.35, // Soft opacity for elegance
                color: 0xffffff,
                blending: THREE.NormalBlending,
                depthWrite: false
            });

            // Generate 45 clouds, positioned heavily to the RIGHT side
            for(let p = 0; p < 45; p++) {
                let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
                
                // Pushing X coordinates to the right (positive values)
                cloud.position.set(
                    Math.random() * 600 + 100, // Keeps clouds right-justified
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
                p.rotation.z -= 0.0008; // Slow, premium rotation
            });
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
                    btn.style.background = '#4A7FB5'; // Sky Blue success
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
                btn.style.background = '#AFC4D6';
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

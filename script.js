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

    // 2. 3D CLOUD SYSTEM WITH MOUSE PARALLAX
    const container = document.getElementById('cloud-canvas');
    if (container && typeof THREE !== 'undefined') {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        camera.rotation.x = 1.16; 
        camera.rotation.y = -0.12; 
        camera.rotation.z = 0.27;

        let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff, 0); // Transparent to show video background
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.9)); // Bright ambient light
        let blueLight = new THREE.PointLight(0x4A7FB5, 25, 500, 2);
        blueLight.position.set(200, 300, 100);
        scene.add(blueLight);

        let cloudParticles = [];
        let loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/smoke.png', function(texture) {
            let cloudGeo = new THREE.PlaneGeometry(500, 500);
            let cloudMaterial = new THREE.MeshLambertMaterial({ 
                map: texture, 
                transparent: true, 
                opacity: 0.85, // High opacity against the gray background
                depthWrite: false 
            });
            
            for(let p = 0; p < 50; p++) {
                let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
                // Positioned on the right side
                cloud.position.set(Math.random() * 800 - 100, 500, Math.random() * 500 - 450);
                cloud.rotation.z = Math.random() * 360;
                cloudParticles.push(cloud);
                scene.add(cloud);
            }
            
            animate();
        });

        // Mouse Parallax Logic
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX) * 0.0005;
            mouseY = (event.clientY - windowHalfY) * 0.0005;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            
            // Slow rotation for individual clouds
            cloudParticles.forEach(p => p.rotation.z -= 0.001);
            
            // Smooth mouse tilt parallax
            targetX = mouseX * 0.5;
            targetY = mouseY * 0.5;
            scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
            scene.rotation.x += (targetY - scene.rotation.x) * 0.05;

            // Scroll vertical parallax
            camera.position.y += (-window.scrollY * 0.08 - camera.position.y) * 0.1;
            
            renderer.render(scene, camera);
        };

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 3. CONTACT FORM LOGIC
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

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
                        btn.style.opacity = '';
                    }, 4000);
                } else throw new Error('Server error');
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

/* =========================================================
   AERAS GROUP — Interactivity & Three.js 3D Cloud
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL REVEAL ANIMATIONS
    // Uses IntersectionObserver to trigger smooth fade-ups as elements enter the viewport
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

    // 2. THREE.JS 3D CLOUD SETUP
    const container = document.getElementById('cloud-canvas');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Add soft, hazy fog to blend the cloud into the background
    scene.fog = new THREE.FogExp2(0xF8FAFC, 0.02);

    // Camera Setup (Positioned to look at the right side of the screen)
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 12;
    camera.position.x = 2; 

    // Renderer Setup (Alpha true for transparent background)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high DPI but cap at 2x for performance
    container.appendChild(renderer.domElement);

    // Lighting (Crucial for the "sculpted / premium" look)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const blueLight = new THREE.PointLight(0xaaccff, 0.5, 50);
    blueLight.position.set(-5, -5, 5);
    scene.add(blueLight);

    // Create the Cloud Geometry
    // We group multiple soft spheres together to form a highly optimized, stylized volumetric cloud
    const cloudGroup = new THREE.Group();
    
    // Standard Material with high roughness for a matte, soft-light-absorbing finish
    const cloudMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
    });

    // Generate cluster of spheres
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    for(let i = 0; i < 15; i++) {
        const mesh = new THREE.Mesh(sphereGeo, cloudMaterial);
        
        // Randomize positions slightly to form a puffy cloud shape
        mesh.position.x = (Math.random() - 0.5) * 4;
        mesh.position.y = (Math.random() - 0.5) * 3;
        mesh.position.z = (Math.random() - 0.5) * 3;
        
        // Randomize scale for organic irregularity
        const scale = Math.random() * 1.5 + 0.5;
        mesh.scale.set(scale, scale, scale);
        
        // Randomize rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        cloudGroup.add(mesh);
    }

    scene.add(cloudGroup);

    // 3. MOUSE PARALLAX & SCROLL INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // 4. ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Gentle floating animation
        cloudGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
        
        // Internal cloud slow rotation
        cloudGroup.rotation.y += 0.001;
        cloudGroup.rotation.z += 0.0005;

        // Easing for smooth mouse parallax
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        
        cloudGroup.rotation.y += 0.05 * (targetX - cloudGroup.rotation.y);
        cloudGroup.rotation.x += 0.05 * (targetY - cloudGroup.rotation.x);

        // Scroll interaction: Ascending effect (camera moves up as you scroll down)
        camera.position.y = -scrollY * 0.005;
        
        renderer.render(scene, camera);
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});

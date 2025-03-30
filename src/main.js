import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typed from 'typed.js';
import { projects } from './projects.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Interactive Dots
class InteractiveDots {
    constructor() {
        this.heroSection = document.getElementById('home');
        this.dots = [];
        this.maxDots = 50;
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        // Create initial dots
        for (let i = 0; i < this.maxDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'interactive-dot';
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;
            this.heroSection.appendChild(dot);
            this.dots.push({
                element: dot,
                x: parseFloat(dot.style.left),
                y: parseFloat(dot.style.top),
                vx: 0,
                vy: 0,
                targetX: parseFloat(dot.style.left),
                targetY: parseFloat(dot.style.top)
            });
        }

        // Add mouse move listener
        this.heroSection.addEventListener('mousemove', (e) => {
            const rect = this.heroSection.getBoundingClientRect();
            this.mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            this.mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        });

        // Start animation
        this.animate();
    }

    animate() {
        this.dots.forEach(dot => {
            // Calculate distance from mouse
            const dx = this.mouseX - dot.x;
            const dy = this.mouseY - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Update dot position based on mouse proximity
            if (distance < 30) {
                const angle = Math.atan2(dy, dx);
                const force = (30 - distance) / 30;
                dot.vx += Math.cos(angle) * force * 0.2;
                dot.vy += Math.sin(angle) * force * 0.2;
            }

            // Add some random movement
            dot.vx += (Math.random() - 0.5) * 0.1;
            dot.vy += (Math.random() - 0.5) * 0.1;

            // Apply friction
            dot.vx *= 0.95;
            dot.vy *= 0.95;

            // Update position
            dot.x += dot.vx;
            dot.y += dot.vy;

            // Keep dots within bounds
            dot.x = Math.max(0, Math.min(100, dot.x));
            dot.y = Math.max(0, Math.min(100, dot.y));

            // Update DOM element
            dot.element.style.transform = `translate(${dot.x}%, ${dot.y}%)`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Typed.js initialization
const typed = new Typed('#typed-text', {
    strings: [
        'A Software Engineer',
        'A Problem Solver',
        'A Creative Developer',
        'A Tech Enthusiast'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true
});

// Project Modal Functions
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTechnologies = document.getElementById('modal-technologies');
const modalGithub = document.getElementById('modal-github');
const modalDemo = document.getElementById('modal-demo');

function openModal(project) {
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalTechnologies.innerHTML = project.technologies
        .map(tech => `<span class="px-3 py-1 bg-primary rounded-full text-sm">${tech}</span>`)
        .join('');
    modalGithub.href = project.github;
    modalDemo.href = project.demo;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Project Card Component
function createProjectCard(project, isFeatured = false) {
    const card = document.createElement('div');
    card.className = `project-card group ${isFeatured ? 'md:col-span-2' : ''}`;
    
    card.innerHTML = `
        <div class="relative overflow-hidden rounded-lg bg-tertiary h-64">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20"></div>
                <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2364ffda\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
            </div>
            
            <!-- Code Elements -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute top-4 left-4 text-secondary/20 font-mono text-sm">
                    <div class="mb-2">function ${project.title.toLowerCase().replace(/\s+/g, '_')}() {</div>
                    <div class="ml-4">return {</div>
                    <div class="ml-8">status: "success",</div>
                    <div class="ml-8">type: "${project.technologies[0]}",</div>
                    <div class="ml-4">};</div>
                    <div>}</div>
                </div>
                <div class="absolute bottom-4 right-4 text-secondary/20 font-mono text-sm">
                    <div>const ${project.title.toLowerCase().replace(/\s+/g, '_')} = {</div>
                    <div class="ml-4">technologies: [</div>
                    ${project.technologies.map(tech => `
                        <div class="ml-8">"${tech}",</div>
                    `).join('')}
                    <div class="ml-4">],</div>
                    <div>};</div>
                </div>
            </div>
            
            <!-- Content -->
            <div class="relative h-full p-6 flex flex-col justify-between">
                <div>
                    <h3 class="text-2xl font-bold text-secondary mb-2">${project.title}</h3>
                    <p class="text-textSecondary mb-4">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.technologies.map(tech => `
                            <span class="px-3 py-1 bg-primary rounded-full text-sm">${tech}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="flex gap-4">
                    <a href="${project.github}" target="_blank" class="px-4 py-2 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transition-colors">
                        <i class="fab fa-github mr-2"></i> GitHub
                    </a>
                    <a href="${project.demo}" target="_blank" class="px-4 py-2 border-2 border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary/10 transition-colors">
                        <i class="fas fa-external-link-alt mr-2"></i> Live Demo
                    </a>
                </div>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openModal(project));
    return card;
}

// Render Projects
function renderProjects() {
    const featuredContainer = document.querySelector('#portfolio .grid:first-of-type');
    const otherContainer = document.querySelector('#portfolio .grid:last-of-type');

    projects.forEach(project => {
        const card = createProjectCard(project, project.featured);
        if (project.featured) {
            featuredContainer.appendChild(card);
        } else {
            otherContainer.appendChild(card);
        }
    });
}

// Three.js Hero Background
class HeroBackground {
    constructor() {
        this.container = document.getElementById('hero-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.particles = [];
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 5;

        // Create particles
        // const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        // const material = new THREE.MeshBasicMaterial({ color: 0x64ffda });
        
        // for (let i = 0; i < 100; i++) {
        //     const particle = new THREE.Mesh(geometry, material);
        //     particle.position.set(
        //         (Math.random() - 0.5) * 10,
        //         (Math.random() - 0.5) * 10,
        //         (Math.random() - 0.5) * 10
        //     );
        //     this.particles.push(particle);
        //     this.scene.add(particle);
        // }

        // Start animation
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate particles
        this.particles.forEach(particle => {
            particle.rotation.x += 0.001;
            particle.rotation.y += 0.001;
        });

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Three.js About Section
class AboutSection {
    constructor() {
        this.container = document.getElementById('about-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.cube = null;
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 5;

        // Create cube
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x64ffda,
            shininess: 100
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        // Add lights
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.scene.add(light);

        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        // Start animation
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.cube) {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

// GSAP Animations
const initAnimations = () => {
    // Fade in sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1
            }
        });
    });

    // Animate skills
    gsap.from('.skills span', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.skills',
            start: 'top 80%'
        }
    });
};

// Mobile Menu
const initMobileMenu = () => {
    const menuButton = document.querySelector('button');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu hidden';
    mobileMenu.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full space-y-8">
            <a href="#home" class="text-2xl hover:text-secondary transition-colors">Home</a>
            <a href="#about" class="text-2xl hover:text-secondary transition-colors">About</a>
            <a href="#portfolio" class="text-2xl hover:text-secondary transition-colors">Portfolio</a>
            <a href="#contact" class="text-2xl hover:text-secondary transition-colors">Contact</a>
        </div>
    `;
    document.body.appendChild(mobileMenu);

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
};

class Globe {
    constructor() {
        this.container = document.getElementById('globe-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.controls = null;
        this.globe = null;
        this.sriLanka = null;
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 200;

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add point light
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(100, 100, 100);
        this.scene.add(pointLight);

        // Create globe
        const globeGeometry = new THREE.SphereGeometry(100, 64, 64);
        const globeMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('/earth-map.jpg'),
            bumpMap: new THREE.TextureLoader().load('/earth-bump.jpg'),
            bumpScale: 2,
            specularMap: new THREE.TextureLoader().load('/earth-specular.jpg'),
            specular: new THREE.Color('grey'),
            shininess: 10
        });
        this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
        this.scene.add(this.globe);

        // Add Sri Lanka marker
        const sriLankaLat = 7.8731;
        const sriLankaLon = 80.7718;
        this.addMarker(sriLankaLat, sriLankaLon);

        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.enableZoom = false;

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation
        this.animate();
    }

    addMarker(lat, lon) {
        const radius = 102;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const markerGeometry = new THREE.SphereGeometry(2, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x64ffda });
        this.sriLanka = new THREE.Mesh(markerGeometry, markerMaterial);

        this.sriLanka.position.x = -radius * Math.sin(phi) * Math.cos(theta);
        this.sriLanka.position.y = radius * Math.cos(phi);
        this.sriLanka.position.z = radius * Math.sin(phi) * Math.sin(theta);

        this.scene.add(this.sriLanka);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate globe
        this.globe.rotation.y += 0.001;

        // Update marker position
        if (this.sriLanka) {
            this.sriLanka.rotation.y += 0.001;
        }

        // Update controls
        this.controls.update();

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize interactive dots
    new InteractiveDots();
    
    // Initialize hero background
    new HeroBackground();
    
    // Initialize about section
    new AboutSection();
    
    // Initialize globe
    new Globe();
    
    // Initialize animations
    initAnimations();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Render projects
    renderProjects();
});

// Initialize Three.js Scene
const initThreeScene = () => {
    const canvas = document.getElementById('hero-cube');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvas.appendChild(renderer.domElement);
    
    // Create geometric cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#64ffda' }));
    scene.add(line);
    
    // Add wireframe sphere
    const sphereGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const sphereEdges = new THREE.EdgesGeometry(sphereGeometry);
    const sphereLine = new THREE.LineSegments(sphereEdges, new THREE.LineBasicMaterial({ color: '#64ffda', opacity: 0.5, transparent: true }));
    scene.add(sphereLine);
    
    camera.position.z = 5;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0x64ffda, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        line.rotation.x += 0.003;
        line.rotation.y += 0.003;
        sphereLine.rotation.x -= 0.002;
        sphereLine.rotation.y -= 0.002;
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
};

// Initialize Typed.js
const initTyped = () => {
    const options = {
        strings: [
            'Full Stack Developer',
            'UI/UX Designer',
            'Software Engineer',
            'Tech Enthusiast'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    };
    
    new Typed('#typed-text', options);
};

// Initialize Particles
const initParticles = () => {
    const container = document.getElementById('particles-container');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--delay', i);
        container.appendChild(particle);
        
        gsap.to(particle, {
            x: 'random(-100, 100)',
            y: 'random(-100, 100)',
            duration: 'random(2, 4)',
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }
};

// Initialize Tech Pills Animation
const initTechPills = () => {
    const pills = document.querySelectorAll('.tech-pill');
    pills.forEach((pill, index) => {
        pill.style.setProperty('--delay', index);
    });
};

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    initThreeScene();
    initTyped();
    initParticles();
    initTechPills();
    
    // Add scroll animation for sections
    gsap.from('.section', {
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.section',
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
        }
    });
});

// Populate projects section
const projectsContainer = document.querySelector('.projects-container');
projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="${project.demo}" target="_blank" rel="noopener noreferrer">Live Demo</a>
            </div>
        </div>
    `;
    projectsContainer.appendChild(projectCard);
}); 
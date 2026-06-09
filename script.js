// ==========================================
// INTERACTIVITÉ & ANIMATIONS AVANCÉES
// ==========================================

// 1. SMOOTH SCROLL & ACTIVE LINK
document.addEventListener('DOMContentLoaded', () => {
    updateActiveLink();
    animateOnScroll();
    animateSkillBars();
    addInteractiveEffects();
    setupParallaxEffect();
});

window.addEventListener('scroll', () => {
    updateActiveLink();
    animateOnScroll();
});

function updateActiveLink() {
    const sections = document.querySelectorAll('main > div, main > section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id') || section.getAttribute('data-section');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// 2. ANIMATION AU SCROLL - Intersection Observer
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.project-card, .card-item, .skill-bar-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// 3. SKILL BARS ANIMATED
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const width = entry.target.getAttribute('data-width') || entry.target.style.width;
                entry.target.style.setProperty('--skill-width', width);
                entry.target.classList.add('animated');
                entry.target.style.animation = `fillSkillBar 1.5s ease-out forwards`;
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => observer.observe(bar));
}

// 4. COMPTEURS ANIMÉS (pour stats si vous en avez)
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// 5. EFFETS INTERACTIFS AVANCÉS
function addInteractiveEffects() {
    // Effet de clic ripple
    document.querySelectorAll('.btn, .contact-link, .card-item').forEach(element => {
        element.addEventListener('click', createRipple);
    });

    // Hover parallax sur les cartes
    document.querySelectorAll('.project-card, .card-item').forEach(card => {
        card.addEventListener('mousemove', parallaxHover);
        card.addEventListener('mouseleave', parallaxReset);
    });

    // Animation du texte au hover
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('mouseenter', textHoverEffect);
        link.addEventListener('mouseleave', textResetEffect);
    });
}

// Effet ripple au clic
function createRipple(e) {
    const element = e.currentTarget;
    const ripple = document.createElement('span');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: rippleEffect 0.6s ease-out;
    `;

    if (!element.style.position || element.style.position === 'static') {
        element.style.position = 'relative';
    }

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Parallax au hover des cartes
function parallaxHover(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (y - 0.5) * 10;
    const rotateY = (x - 0.5) * -10;

    card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.02)
    `;
}

function parallaxReset(e) {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}

// Effet texte au hover
function textHoverEffect(e) {
    const text = e.currentTarget.textContent;
    const chars = text.split('');
    
    e.currentTarget.innerHTML = chars.map((char, i) => `
        <span style="
            display: inline-block;
            transition: all 0.3s ease;
            transition-delay: ${i * 30}ms;
            transform: translateY(0);
        " class="char-${i}">${char}</span>
    `).join('');

    setTimeout(() => {
        chars.forEach((char, i) => {
            const span = e.currentTarget.querySelector(`.char-${i}`);
            if (span) span.style.transform = 'translateY(-5px)';
        });
    }, 10);
}

function textResetEffect(e) {
    e.currentTarget.textContent = e.currentTarget.textContent;
}

// 6. EFFET PARALLAX AU SCROLL
function setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const scrollPosition = window.pageYOffset;
            const elementOffset = el.offsetTop;
            const distance = scrollPosition - elementOffset;
            
            el.style.transform = `translateY(${distance * 0.5}px)`;
        });
    });
}

// 7. PAGE TRANSITION EFFECT
window.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.endsWith('.html')) {
        const href = e.target.getAttribute('href');
        
        if (href && !href.startsWith('http') && !href.startsWith('mailto')) {
            e.preventDefault();
            
            // Fade out
            document.querySelector('main').style.opacity = '0';
            document.querySelector('main').style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    }
});

// 8. MENU MOBILE RESPONSIVE
function setupMobileMenu() {
    const nav = document.querySelector('nav');
    const navContainer = document.querySelector('.nav-container');
    
    if (window.innerWidth <= 768) {
        // Créer le bouton hamburger
        if (!document.querySelector('.hamburger')) {
            const hamburger = document.createElement('button');
            hamburger.className = 'hamburger';
            hamburger.innerHTML = '☰';
            hamburger.style.cssText = `
                position: fixed;
                right: 2rem;
                top: 1.5rem;
                background: var(--accent);
                color: white;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                z-index: 999;
                border-radius: 8px;
                padding: 0.5rem 0.8rem;
                display: flex;
                align-items: center;
                transition: all 0.3s ease;
            `;

            hamburger.addEventListener('click', () => {
                navContainer.style.display = navContainer.style.display === 'flex' ? 'none' : 'flex';
                hamburger.style.transform = navContainer.style.display === 'flex' ? 'rotate(90deg)' : 'rotate(0)';
            });

            nav.appendChild(hamburger);
        }
    }
}

window.addEventListener('resize', setupMobileMenu);
setupMobileMenu();

// 9. SCROLL PROGRESS INDICATOR (optionnel)
function setupScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent) 0%, #60a5fa 100%);
        width: 0;
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        indicator.style.width = scrolled + '%';
    });
}

setupScrollIndicator();

// 10. ANIMATIONS CSS SUPPLÉMENTAIRES
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        from {
            opacity: 1;
            transform: scale(0);
        }
        to {
            opacity: 0;
            transform: scale(4);
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .float-animation {
        animation: float 3s ease-in-out infinite;
    }

    .pulse-animation {
        animation: pulse 2s ease-in-out infinite;
    }

    /* Smooth scrollbar */
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: var(--bg-secondary);
    }

    ::-webkit-scrollbar-thumb {
        background: var(--accent);
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--accent-hover);
    }
`;
document.head.appendChild(style);

// 11. CONSOLE MESSAGE (EASTER EGG)
console.log('%c🚀 Bienvenue sur mon portfolio GEII !', 'font-size: 20px; color: #3b82f6; font-weight: bold;');
console.log('%cCurieux ? Vous pouvez me contacter pour discuter de collaborations ! 😊', 'font-size: 14px; color: #5a6b7a;');

// ==========================================
// INTERACTIVITÉ & ANIMATIONS AVANCÉES
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    animateOnScroll();
    animateSkillBars();
    addInteractiveEffects();
    setupParallaxEffect();
});

window.addEventListener('scroll', () => {
    animateOnScroll();
});

// 1. SET ACTIVE NAV LINK (basé sur l'URL actuelle)
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
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

// 4. EFFETS INTERACTIFS
function addInteractiveEffects() {
    // Effet ripple au clic sur les boutons et cartes
    document.querySelectorAll('.btn, .contact-link, .card-item').forEach(element => {
        element.addEventListener('click', createRipple);
    });

    // Parallax hover sur les cartes
    document.querySelectorAll('.project-card, .card-item').forEach(card => {
        card.addEventListener('mousemove', parallaxHover);
        card.addEventListener('mouseleave', parallaxReset);
    });

    // Hover simple et propre sur la navigation (sans dispersion de lettres)
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--accent)';
        });
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = 'var(--text-primary)';
            }
        });
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

    const rotateX = (y - 0.5) * 8;
    const rotateY = (x - 0.5) * -8;

    card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.01)
    `;
}

function parallaxReset(e) {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}

// 5. EFFET PARALLAX AU SCROLL
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

// 6. PAGE TRANSITION EFFECT
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')?.endsWith('.html')) {
        const href = link.getAttribute('href');
        
        if (href && !href.startsWith('http') && !href.startsWith('mailto')) {
            e.preventDefault();
            
            // Fade out
            const main = document.querySelector('main');
            if (main) {
                main.style.opacity = '0';
                main.style.transform = 'translateY(20px)';
            }
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    }
});

// 7. SCROLL PROGRESS INDICATOR
function setupScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent) 0%, #344E41 100%);
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

// 8. ANIMATIONS CSS SUPPLÉMENTAIRES
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

// 9. CONSOLE MESSAGE (EASTER EGG)
console.log('%c🚀 Bienvenue sur mon portfolio GEII !', 'font-size: 20px; color: #3b82f6; font-weight: bold;');
console.log('%cCurieux ? Vous pouvez me contacter pour discuter de collaborations ! 😊', 'font-size: 14px; color: #5a6b7a;');

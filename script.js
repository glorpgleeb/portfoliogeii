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

    @keyframes planeTakeOff {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
        }
        40% {
            transform: translate(180px, -100px) rotate(15deg) scale(0.6);
            opacity: 0;
        }
        45% {
            transform: translate(-180px, 100px) rotate(-15deg) scale(0.6);
            opacity: 0;
        }
        100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
        }
    }

    @keyframes planeFloat {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-8px) rotate(3deg);
        }
    }

    .plane-animate-fly {
        animation: planeTakeOff 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }

    .plane-animate-float {
        animation: planeFloat 3s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// 9. CONSOLE MESSAGE (EASTER EGG)
console.log('%c🚀 Bienvenue sur mon portfolio GEII !', 'font-size: 20px; color: #3b82f6; font-weight: bold;');
console.log('%cCurieux ? Vous pouvez me contacter pour discuter de collaborations ! 😊', 'font-size: 14px; color: #5a6b7a;');

// 10. FORM SUBMIT HANDLER
try {
    const contactForm = document.getElementById('contact-form') || document.querySelector('form');
    const submitBtn = document.getElementById('submit-btn') || document.querySelector('form button[type="submit"]');
    const formInner = document.getElementById('contact-form-inner');
    const successMessage = document.getElementById('contact-success-message');

    console.log('[Contact Form Check]', {
        form: !!contactForm,
        btn: !!submitBtn,
        inner: !!formInner,
        success: !!successMessage
    });

    if (contactForm && formInner && successMessage) {
        let isSubmitting = false;

        const handleFormSubmit = (e) => {
            if (e) e.preventDefault();
            if (isSubmitting) return;

            // HTML5 Validation check
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            isSubmitting = true;
            console.log('[Contact Form] Submitting form...');

            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');
            const messageEl = document.getElementById('message');

            const name = nameEl ? nameEl.value : '';
            const email = emailEl ? emailEl.value : '';
            const message = messageEl ? messageEl.value : '';

            const subject = encodeURIComponent("Contact Portfolio - " + name);
            const body = encodeURIComponent("Nom: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message);

            // 1. Show loading state on button and disable inputs
            if (submitBtn) submitBtn.classList.add('loading');
            const inputs = contactForm.querySelectorAll('input, textarea, button');
            inputs.forEach(input => input.disabled = true);

            // Populate fallback box copy values immediately
            const fallbackTo = document.getElementById('fallback-to');
            const fallbackSubject = document.getElementById('fallback-subject');
            const fallbackBody = document.getElementById('fallback-body');
            const fallbackBox = document.getElementById('email-fallback-box');

            if (fallbackSubject) fallbackSubject.textContent = "Contact Portfolio - " + name;
            if (fallbackBody) fallbackBody.textContent = "Nom: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message;

            // 2. Short delay to simulate validation/sending, then fade out the form
            setTimeout(() => {
                formInner.style.opacity = '0';
                formInner.style.transform = 'translateY(-20px)';

                // 3. After form is faded out, display the success area and trigger animations
                setTimeout(() => {
                    formInner.style.display = 'none';
                    successMessage.style.opacity = '0';
                    successMessage.style.display = 'block';

                    // Force a reflow
                    successMessage.offsetHeight;
                    successMessage.style.opacity = '1';

                    // Trigger drawing the flight trail
                    const activeTrail = document.getElementById('active-trail');
                    if (activeTrail) activeTrail.classList.add('animate');

                    // Trigger paper plane glide along path
                    const animatedPlane = document.getElementById('animated-plane');
                    if (animatedPlane) animatedPlane.classList.add('animate');

                    // Trigger leaf particles animation
                    const particles = successMessage.querySelectorAll('.leaf-particle');
                    particles.forEach(p => p.classList.add('animate'));

                    // Show fallback box after plane takeoff
                    if (fallbackBox) {
                        setTimeout(() => {
                            fallbackBox.style.display = 'block';
                        }, 1000);
                    }

                    // 4. Staggered display of success text/checkmark & trigger mailto redirection
                    setTimeout(() => {
                        const checkmark = document.getElementById('success-checkmark');
                        if (checkmark) checkmark.classList.add('show');

                        const title = document.getElementById('success-title');
                        if (title) title.classList.add('show');

                        const desc = document.getElementById('success-desc');
                        if (desc) desc.classList.add('show');

                        const resetBtn = document.getElementById('reset-form-btn');
                        if (resetBtn) resetBtn.classList.add('show');

                        // Open the mail client using temporary link
                        console.log('[Contact Form] Triggering mailto client...');
                        const mailtoUrl = `mailto:alexis.cardon@etu.u-bordeaux.fr?subject=${subject}&body=${body}`;
                        
                        try {
                            const mailtoLink = document.createElement('a');
                            mailtoLink.href = mailtoUrl;
                            document.body.appendChild(mailtoLink);
                            mailtoLink.click();
                            document.body.removeChild(mailtoLink);
                        } catch (err) {
                            console.error('[Contact Form] Mailto click failed, using location.href', err);
                            window.location.href = mailtoUrl;
                        }
                    }, 1800); // 1.8 seconds is the duration of flyAlongPath animation

                }, 500); // Wait for form fade-out transition
            }, 1000); // 1 second loading spinner
        };

        contactForm.addEventListener('submit', handleFormSubmit);

        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                if (contactForm.checkValidity()) {
                    handleFormSubmit(e);
                }
            });
        }

        // Reset handler
        const resetFormBtn = document.getElementById('reset-form-btn');
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                isSubmitting = false;
                successMessage.style.opacity = '0';

                // Hide fallback box
                const fallbackBox = document.getElementById('email-fallback-box');
                if (fallbackBox) fallbackBox.style.display = 'none';

                setTimeout(() => {
                    successMessage.style.display = 'none';

                    // Clear form inputs
                    contactForm.reset();

                    // Re-enable form elements and reset button state
                    const inputs = contactForm.querySelectorAll('input, textarea, button');
                    inputs.forEach(input => input.disabled = false);
                    if (submitBtn) submitBtn.classList.remove('loading');

                    // Reset animation classes on components
                    const activeTrail = document.getElementById('active-trail');
                    if (activeTrail) activeTrail.classList.remove('animate');

                    const animatedPlane = document.getElementById('animated-plane');
                    if (animatedPlane) animatedPlane.classList.remove('animate');

                    const particles = successMessage.querySelectorAll('.leaf-particle');
                    particles.forEach(p => p.classList.remove('animate'));

                    const checkmark = document.getElementById('success-checkmark');
                    if (checkmark) checkmark.classList.remove('show');

                    const title = document.getElementById('success-title');
                    if (title) title.classList.remove('show');

                    const desc = document.getElementById('success-desc');
                    if (desc) desc.classList.remove('show');

                    resetFormBtn.classList.remove('show');

                    // Show form again
                    formInner.style.display = 'block';
                    formInner.offsetHeight;
                    formInner.style.opacity = '1';
                    formInner.style.transform = 'translateY(0)';
                }, 400);
            });
        }
        
        // Copy fallback logic
        const copyEmailBtn = document.getElementById('copy-email-btn');
        if (copyEmailBtn) {
            copyEmailBtn.addEventListener('click', () => {
                const emailText = document.getElementById('fallback-to').textContent;
                navigator.clipboard.writeText(emailText).then(() => {
                    copyEmailBtn.textContent = 'copié !';
                    setTimeout(() => {
                        copyEmailBtn.textContent = 'copier';
                    }, 2000);
                });
            });
        }

        const copyBodyBtn = document.getElementById('copy-body-btn');
        if (copyBodyBtn) {
            copyBodyBtn.addEventListener('click', () => {
                const bodyText = document.getElementById('fallback-body').textContent;
                navigator.clipboard.writeText(bodyText).then(() => {
                    copyBodyBtn.textContent = 'message copié !';
                    setTimeout(() => {
                        copyBodyBtn.textContent = 'copier le message';
                    }, 2000);
                });
            });
        }
    } else {
        console.warn('[Contact Form Handler] Elements missing. Custom submission not registered.');
    }
} catch (e) {
    console.error('[Contact Form Handler] Error during setup:', e);
}

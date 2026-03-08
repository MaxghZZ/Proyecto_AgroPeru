/**
 * AGRO PERÚ IMPORTACIONES — GRUPO IAP
 * script.js — Animaciones, Interacciones y Efectos
 * Modern Fresh Agrotech Landing Page
 */

'use strict';

/* =============================================
   1. PARTICLES SYSTEM (50 partículas)
   ============================================= */
(function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const colors = [
        'rgba(34, 197, 94, 0.35)',   // verde
        'rgba(34, 197, 94, 0.2)',
        'rgba(14, 165, 233, 0.2)',   // azul
        'rgba(245, 158, 11, 0.18)',  // naranja
    ];

    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        const size = Math.random() * 6 + 2;
        p.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-delay: ${Math.random() * 20}s;
            animation-duration: ${15 + Math.random() * 15}s;
        `;
        container.appendChild(p);
    }
})();

/* =============================================
   2. NAVBAR STICKY + SCROLL
   ============================================= */
const navbar = document.getElementById('navbar');

const handleNavbarScroll = debounce(function () {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

/* =============================================
   3. MOBILE MENU
   ============================================= */
const mobileToggle = document.getElementById('mobileMenuToggle');
const mobileOverlay = document.getElementById('mobileMenuOverlay');
const mobileLinks = document.querySelectorAll('.mobile-nav-link, .btn-mobile-cta');

if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
        const isOpen = mobileOverlay.classList.toggle('open');
        mobileToggle.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileOverlay.classList.remove('open');
            mobileToggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (mobileOverlay.classList.contains('open') &&
            !mobileOverlay.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            mobileOverlay.classList.remove('open');
            mobileToggle.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

/* =============================================
   4. SMOOTH SCROLL PARA ANCHOR LINKS
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

/* =============================================
   5. INTERSECTION OBSERVER — REVEAL ANIMATIONS
   ============================================= */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger para cards
            const isCard = entry.target.classList.contains('reveal-card');
            const siblings = isCard
                ? Array.from(entry.target.parentElement.children)
                : [];
            const idx = siblings.indexOf(entry.target);
            const delay = isCard ? idx * 90 : 0;

            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, delay);

            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal-item, .reveal-card').forEach(el => {
    revealObserver.observe(el);
});

/* =============================================
   6. COUNTERS ANIMADOS
   ============================================= */
function animateCounter(el, target, duration = 2000) {
    let start = null;
    const startVal = 0;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOut(progress);
        el.textContent = Math.round(startVal + (target - startVal) * easedProgress);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

// Observar los counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target, 10);
            animateCounter(entry.target, target, 1800);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-value, .stat-number').forEach(el => {
    counterObserver.observe(el);
});

/* =============================================
   7. FLIP CARDS — MOBILE TOUCH + CLICK
   ============================================= */
const flipCards = document.querySelectorAll('.service-card-flip');
let lastFlipped = null;

flipCards.forEach(card => {
    // Solo en dispositivos que no tienen hover verdadero (mobile/tablet)
    card.addEventListener('click', function () {
        // Si el dispositivo tiene pointer coarse (touch), hacemos flip manual
        if (!window.matchMedia('(hover: hover)').matches) {
            if (lastFlipped && lastFlipped !== this) {
                lastFlipped.classList.remove('flipped');
            }
            this.classList.toggle('flipped');
            lastFlipped = this.classList.contains('flipped') ? this : null;
        }
    });
});

// Resetear flipped al resize a desktop
window.addEventListener('resize', debounce(() => {
    if (window.matchMedia('(hover: hover)').matches) {
        flipCards.forEach(c => c.classList.remove('flipped'));
        lastFlipped = null;
    }
}, 200));

/* =============================================
   8. PARALLAX SUAVE EN HERO
   ============================================= */
const heroBgGradient = document.querySelector('.hero-bg-gradient');

window.addEventListener('scroll', debounce(() => {
    const scrolled = window.scrollY;
    if (heroBgGradient && scrolled < window.innerHeight) {
        heroBgGradient.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
}, 5), { passive: true });

/* =============================================
   9. SCROLL TO TOP BUTTON
   ============================================= */
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', debounce(() => {
    if (scrollTopBtn) {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
}, 50), { passive: true });

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* =============================================
   10. FORMULARIO DE CONTACTO
   ============================================= */
function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.btn-submit');
    const successMsg = document.getElementById('form-success');

    // Estado de carga
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    // Simular envío (2 segundos) — conectar con backend real si se requiere
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
        submitBtn.disabled = false;
        if (successMsg) {
            successMsg.style.display = 'flex';
            setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
        }
        form.reset();
    }, 2000);
}

// Exponer globalmente para el onsubmit en HTML
window.handleFormSubmit = handleFormSubmit;

/* =============================================
   11. ACTIVE NAV LINK (basado en scroll)
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLinks() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.style.color = 'var(--green-600)';
                }
            });
        }
    });
}

window.addEventListener('scroll', debounce(updateActiveLinks, 50), { passive: true });

/* =============================================
   12. UTILITY: DEBOUNCE
   ============================================= */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/* =============================================
   13. INIT ON DOM LOADED
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Disparar navbar check inicial
    handleNavbarScroll();
    updateActiveLinks();

    // Log de inicio
    console.log('%c🌿 Agro Perú Importaciones — Grupo IAP', 'color: #22C55E; font-weight: bold; font-size: 14px;');
    console.log('%cLa tecnología que tu campo necesita. | invernaderosperu.com', 'color: #64748B; font-size: 12px;');
});

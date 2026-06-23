/* ============================================================
   AGRIJEM – Main JavaScript
   ============================================================ */

// ---- Navbar scroll effect ----
const navbar     = document.getElementById('navbar');
const navLinks   = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menuToggle');
const navLinksEl = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
});

// ---- Mobile menu toggle ----
menuToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        menuToggle.classList.remove('open');
    });
});

// ---- Active nav link based on scroll position ----
function updateActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const id   = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!link) return;

        const top    = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

// ---- Counter animation ----
function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 1800;
    const steps    = 60;
    const increment = target / steps;
    let current = 0;
    let step    = 0;

    const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), target);
        el.textContent = current.toLocaleString('es-CL');
        if (step >= steps) clearInterval(timer);
    }, duration / steps);
}

// ---- Intersection Observer – fade-in + counters ----
const observerOpts = {
    threshold:  0.12,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');

        // If hero stats bar becomes visible, fire counters
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);

        observer.unobserve(entry.target);
    });
}, observerOpts);

// Observe cards and info blocks for fade-in
document.querySelectorAll(
    '.product-card, .brand-card, .value-item, .contact-info, .contact-form-wrap'
).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Observe hero stats for counter animation
const heroStats = document.querySelector('.hero-stats');
if (heroStats) observer.observe(heroStats);

// ---- Contact form ----
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    setTimeout(() => {
        formSuccess.classList.add('show');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';

        setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }, 1500);
});

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Run active nav on page load
updateActiveNav();

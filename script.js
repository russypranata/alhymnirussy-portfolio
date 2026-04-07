document.addEventListener('DOMContentLoaded', function () {

    // ── Mobile Menu ──────────────────────────────────────────────
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenu.setAttribute('aria-expanded', isOpen);
        });

        // Close on nav link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    mobileMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ── Header scroll shadow ──────────────────────────────────────
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    // ── Typing Effect ─────────────────────────────────────────────
    const typingEffectElement = document.getElementById('typing-effect');
    if (typingEffectElement) {
        const titles = ["Mobile Developer", "Flutter Enthusiast", "Web Developer"];
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentTitle = titles[titleIndex];
            typingEffectElement.textContent = isDeleting
                ? currentTitle.substring(0, charIndex - 1)
                : currentTitle.substring(0, charIndex + 1);

            isDeleting ? charIndex-- : charIndex++;

            let speed = isDeleting ? 75 : 150;

            if (!isDeleting && charIndex === currentTitle.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                speed = 500;
            }

            setTimeout(type, speed);
        }

        setTimeout(type, 1000);
    }

    // ── Timeline Toggle Details ───────────────────────────────────
    document.querySelectorAll('.btn-toggle-details').forEach(button => {
        const extraInfo = button.nextElementSibling;
        if (!extraInfo) return;

        button.addEventListener('click', function () {
            const isOpen = extraInfo.classList.toggle('open');
            this.textContent = isOpen ? 'Hide' : 'More';
        });
    });

    // ── Contact Form ──────────────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = contactForm?.querySelector('button[type="submit"]');

    if (contactForm && formStatus && submitButton) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            formStatus.className = 'form-status-message';
            formStatus.textContent = 'Sending...';
            formStatus.style.display = 'block';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';

            fetch(contactForm.getAttribute('action'), {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    formStatus.textContent = 'Thank you! Your message has been sent.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    return response.json().then(data => {
                        const msg = data.errors?.map(e => e.message).join(', ') || 'There was a problem submitting your form.';
                        formStatus.textContent = 'Oops! ' + msg;
                        formStatus.classList.add('error');
                    });
                }
            })
            .catch(() => {
                formStatus.textContent = 'Oops! Network error. Please try again later.';
                formStatus.classList.add('error');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                setTimeout(() => {
                    if (formStatus.classList.contains('success')) {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status-message';
                        formStatus.style.display = 'none';
                    }
                }, 6000);
            });
        });
    }

    // ── About Tabs ────────────────────────────────────────────────
    const tabLinks = document.querySelectorAll('.about-tabs-nav .tab-link');
    const tabPanes = document.querySelectorAll('.about-tabs-content .tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const target = document.getElementById(this.getAttribute('data-tab') + '-tab');
            if (target) target.classList.add('active');
        });
    });

    // ── Scroll Spy (active nav link) ──────────────────────────────
    const sections = document.querySelectorAll('main section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ── Intersection Observer (fade-in animations) ────────────────
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay for grid items
                const siblings = entry.target.parentElement?.querySelectorAll(
                    '.skill-item, .project-card, .timeline-item'
                );
                if (siblings && siblings.length > 1) {
                    const idx = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${idx * 80}ms`;
                }
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-item, .project-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Section fade-in
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.fade-in-section').forEach(el => sectionObserver.observe(el));
});

/* ================================================
   VERTE — Interactions
   Nav · Scroll Reveal · Smooth Scroll · Form
   ================================================ */

// ================================================
// UTILITIES
// ================================================
function onScrollRAF(callback) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { callback(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
}

function pluralize(n, one, few, many) {
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return few;
    return many;
}

const BTN_CLASSES = {
    default: ['bg-verte-700', 'hover:bg-verte-800'],
    success: ['bg-verte-500'],
    error: ['bg-red-500'],
    loading: ['opacity-80'],
};

// ================================================
// NAVIGATION — scroll effect + mobile toggle
// ================================================
class Navigation {
    constructor() {
        this.nav = document.getElementById('nav');
        this.burger = document.getElementById('burger');
        this.mobile = document.getElementById('mobile-nav');
        this.isOpen = false;

        window.addEventListener('scroll', () => {
            this.nav.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });

        this.burger.addEventListener('click', () => this.toggle());

        // Close mobile nav on link click
        this.mobile.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => this.close());
        });

        // Close mobile nav on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });

        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                const href = a.getAttribute('href');
                if (!href || href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const y = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                }
                this.close();
            });
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.burger.classList.toggle('active', this.isOpen);
        this.burger.setAttribute('aria-expanded', String(this.isOpen));
        this.mobile.classList.toggle('active', this.isOpen);
        document.body.style.overflow = this.isOpen ? 'hidden' : '';

        if (this.isOpen) {
            const focusable = this.mobile.querySelectorAll('a, button');
            if (focusable.length) {
                focusable[0].focus();
                this._trapFocus = (e) => {
                    if (e.key !== 'Tab') return;
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                };
                this.mobile.addEventListener('keydown', this._trapFocus);
            }
        } else {
            this._teardownOpen();
            this.burger.focus();
        }
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.burger.classList.remove('active');
        this.mobile.classList.remove('active');
        document.body.style.overflow = '';
        this._teardownOpen();
    }

    _teardownOpen() {
        if (this._trapFocus) {
            this.mobile.removeEventListener('keydown', this._trapFocus);
            this._trapFocus = null;
        }
    }
}

// ================================================
// SCROLL REVEAL — IntersectionObserver
// ================================================
class ScrollReveal {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;

                // Stagger siblings with data-reveal
                const parent = el.parentElement;
                const siblings = Array.from(parent.querySelectorAll(':scope > [data-reveal]'));
                const idx = siblings.indexOf(el);
                const delay = idx * 80;

                setTimeout(() => el.classList.add('visible'), delay);
                this.observer.unobserve(el);
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('[data-reveal]').forEach(el => {
            this.observer.observe(el);
        });
    }
}

// ================================================
// HERO PARALLAX — doc lifts off on scroll
// ================================================
class HeroParallax {
    constructor() {
        this.scene = document.querySelector('.doc-scene');
        if (!this.scene || window.matchMedia('(max-width: 767px)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        this.update(); // initial check (handles reload with scroll)
        onScrollRAF(() => this.update());
    }

    update() {
        const scrollY = window.scrollY;
        const start = 100;
        const range = 400;
        const progress = Math.max(0, Math.min(1, (scrollY - start) / range));

        if (progress <= 0) {
            this.scene.style.transform = '';
            this.scene.style.opacity = '';
            return;
        }

        this.scene.style.transform =
            `translateY(${-120 * progress}px) scale(${1 - 0.2 * progress})`;
        this.scene.style.opacity = `${1 - progress}`;
    }
}

// ================================================
// CONTACT FORM
// ================================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!this.validate()) return;

            const btn = this.form.querySelector('button[type="submit"]');
            const span = btn.querySelector('span');
            const origText = span.textContent;

            // Loading state
            span.textContent = 'Wysyłanie...';
            const statusRegion = document.getElementById('form-status');
            if (statusRegion) statusRegion.textContent = 'Wysyłanie formularza...';
            btn.style.pointerEvents = 'none';
            btn.classList.add(...BTN_CLASSES.loading);

            try {
                const resp = await fetch(this.form.action, {
                    method: 'POST',
                    body: new FormData(this.form),
                    headers: { 'Accept': 'application/json' }
                });

                if (resp.ok) {
                    if (statusRegion) statusRegion.textContent = 'Formularz wysłany pomyślnie. Odezwiemy się w ciągu 24 godzin.';
                    this._showButtonState(btn, span, {
                        message: 'Wysłano! Odezwiemy się w ciągu 24h',
                        colorClass: BTN_CLASSES.success,
                        origText,
                        onRestore: () => { this.form.reset(); this.clearErrors(); },
                    });
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                if (statusRegion) statusRegion.textContent = 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.';
                this._showButtonState(btn, span, {
                    message: 'Coś poszło nie tak — spróbuj ponownie',
                    colorClass: BTN_CLASSES.error,
                    origText,
                });
            }
        });

        // Real-time validation on blur
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
        });
    }

    _showButtonState(btn, span, { message, colorClass, origText, onRestore }) {
        span.textContent = message;
        btn.classList.remove(...BTN_CLASSES.loading, ...BTN_CLASSES.default);
        btn.classList.add(...colorClass);

        setTimeout(() => {
            span.textContent = origText;
            btn.style.pointerEvents = '';
            btn.classList.remove(...colorClass);
            btn.classList.add(...BTN_CLASSES.default);
            if (onRestore) onRestore();
        }, 3500);
    }

    validate() {
        let valid = true;
        this.form.querySelectorAll('[required]').forEach(field => {
            if (!this.validateField(field)) valid = false;
        });
        return valid;
    }

    validateField(field) {
        const parent = field.parentElement;
        let error = parent.querySelector('.field-error');

        const fail = (msg) => {
            if (!error) {
                error = document.createElement('p');
                error.className = 'field-error text-xs text-red-500 mt-1';
                error.id = field.id + '-error';
                error.setAttribute('role', 'alert');
                parent.appendChild(error);
            }
            error.textContent = msg;
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', error.id);
            field.classList.add('border-red-300');
            field.classList.remove('border-gray-200');
            return false;
        };

        if (!field.value.trim()) return fail('To pole jest wymagane');
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) return fail('Podaj poprawny adres email');
        if (field.type === 'tel' && field.value.trim() && !/^[+\d\s()-]{7,}$/.test(field.value)) return fail('Podaj poprawny numer telefonu');

        if (error) error.remove();
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        field.classList.remove('border-red-300');
        field.classList.add('border-gray-200');
        return true;
    }

    clearErrors() {
        this.form.querySelectorAll('.field-error').forEach(e => e.remove());
        this.form.querySelectorAll('.border-red-300').forEach(f => {
            f.classList.remove('border-red-300');
            f.classList.add('border-gray-200');
        });
    }
}

// ================================================
// SERVICE CARDS — expand/collapse
// ================================================
class ServiceCards {
    constructor() {
        this.toggles = document.querySelectorAll('.service-card__toggle');
        if (!this.toggles.length) return;
        this.toggles.forEach(btn => {
            btn.addEventListener('click', () => this.toggle(btn));
        });
    }

    toggle(btn) {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        const details = document.getElementById(btn.getAttribute('aria-controls'));
        if (!details) return;
        btn.setAttribute('aria-expanded', String(!isExpanded));
        details.setAttribute('aria-hidden', String(isExpanded));
        if (!isExpanded) {
            details.removeAttribute('inert');
        } else {
            details.setAttribute('inert', '');
        }
    }
}

// ================================================
// CASE STUDY — animated counters
// ================================================
class CaseCounters {
    constructor() {
        this.els = document.querySelectorAll('[data-count]');
        if (!this.els.length) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.els.forEach(el => this.setFinal(el));
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                this.animate(entry.target);
                this.observer.unobserve(entry.target);
            });
        }, { threshold: 0.3 });

        this.els.forEach(el => this.observer.observe(el));
    }

    setFinal(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        el.textContent = target + suffix;
    }

    animate(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
}

// ================================================
// HERO SCROLL HINT — fade out on scroll (one-shot)
// ================================================
class HeroScrollHint {
    constructor() {
        const el = document.querySelector('.hero-scroll-hint');
        if (!el) return;

        const onScroll = () => {
            if (window.scrollY > 80) {
                el.style.transition = 'opacity .4s ease';
                el.style.opacity = '0';
                window.removeEventListener('scroll', onScroll);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }
}

// ================================================
// KSeF COUNTDOWN
// ================================================
class KsefCountdown {
    constructor() {
        this.el = document.getElementById('ksef-countdown');
        this.copy = document.getElementById('ksef-copy');
        if (!this.el) return;
        this.update();
    }

    update() {
        const deadline = new Date('2026-04-01T00:00:00');
        const now = new Date();
        const diff = deadline - now;

        if (diff <= 0) {
            this.el.textContent = 'KSeF jest już obowiązkowy!';
            if (this.copy) {
                this.copy.textContent = 'Obowiązkowe e-fakturowanie już obowiązuje. Jeśli Twoja firma jeszcze nie wdrożyła KSeF — czas działać. Pomożemy Ci szybko nadrobić zaległości i uniknąć kar.';
            }
            return;
        }

        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        this.el.textContent = `Zostało tylko ${days} ${pluralize(days, 'dzień', 'dni', 'dni')} do obowiązkowego KSeF!`;
    }
}

// ================================================
// SCROLL SPY — highlight active nav link
// ================================================
class ScrollSpy {
    constructor() {
        this.links = document.querySelectorAll('.nav-link');
        this.sections = [];

        this.links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) this.sections.push({ id: href.slice(1), el: section, link, top: 0 });
            }
        });

        if (!this.sections.length) return;

        this._cacheOffsets();
        window.addEventListener('resize', () => this._cacheOffsets(), { passive: true });
        onScrollRAF(() => this.update());
        this.update();
    }

    _cacheOffsets() {
        this.sections.forEach(s => {
            s.top = s.el.getBoundingClientRect().top + window.scrollY;
        });
    }

    update() {
        const scrollY = window.scrollY + 120;
        let current = null;

        for (const s of this.sections) {
            if (s.top <= scrollY) current = s;
        }

        this.sections.forEach(s => s.link.classList.remove('active'));
        if (current) current.link.classList.add('active');
    }
}

// ================================================
// MOBILE CTA — sticky bottom bar
// ================================================
class MobileCTA {
    constructor() {
        this.el = document.getElementById('mobile-cta');
        if (!this.el) return;

        this.visible = false;
        this._mq = window.matchMedia('(max-width: 767px)');
        this._scrollHandler = () => {
            const show = window.scrollY > 300;
            if (show !== this.visible) {
                this.visible = show;
                this.el.classList.toggle('translate-y-full', !show);
                this.el.classList.toggle('translate-y-0', show);
                this.el.setAttribute('aria-hidden', String(!show));
            }
        };

        this._onMediaChange = () => {
            if (this._mq.matches) {
                window.addEventListener('scroll', this._scrollHandler, { passive: true });
            } else {
                window.removeEventListener('scroll', this._scrollHandler);
                this.el.classList.add('translate-y-full');
                this.el.classList.remove('translate-y-0');
                this.el.setAttribute('aria-hidden', 'true');
                this.visible = false;
            }
        };

        this._mq.addEventListener('change', this._onMediaChange);
        this._onMediaChange();
    }
}

// ================================================
// INIT
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    new ScrollSpy();
    new MobileCTA();
    new ScrollReveal();
    new HeroParallax();
    new ContactForm();
    new ServiceCards();
    new HeroScrollHint();
    new CaseCounters();
    new KsefCountdown();
});

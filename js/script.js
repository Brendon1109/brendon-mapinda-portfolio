// Brendon Mapinda — Portrait & Lifestyle Creative
// Lightweight UI interactions: mobile nav, scroll state, active link, reveal-on-scroll, footer year.

class Site {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');

        this.bindEvents();
        this.activeNavOnScroll();
        this.revealOnScroll();
        this.setYear();
    }

    bindEvents() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href.length < 2) return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                this.closeMenu();
            });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) this.navbar.classList.add('scrolled');
            else this.navbar.classList.remove('scrolled');
        }, { passive: true });

        document.addEventListener('click', (e) => {
            if (!this.navMenu.classList.contains('active')) return;
            if (this.navMenu.contains(e.target) || this.hamburger.contains(e.target)) return;
            this.closeMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMenu();
                this.hamburger.focus();
            }
        });
    }

    toggleMenu() {
        const isActive = this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        this.hamburger.setAttribute('aria-expanded', isActive);
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
    }

    activeNavOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute('id');
                this.navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            });
        }, { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' });
        this.sections.forEach(s => observer.observe(s));
    }

    revealOnScroll() {
        const targets = document.querySelectorAll(
            '.service-tile, .price-card, .event-tier, .process-grid li, .approach-stats li, .hero-content, .portrait-frame, .contact-details'
        );
        targets.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        targets.forEach(el => observer.observe(el));
    }

    setYear() {
        const el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    }
}

document.addEventListener('DOMContentLoaded', () => new Site());

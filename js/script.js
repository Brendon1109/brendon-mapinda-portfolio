// Brendon Mapinda — Creative Studio + Automation Lab
// UI interactions: mobile nav, scroll state, active link, reveal-on-scroll,
// offer prefill, and the project enquiry form (Web3Forms with WhatsApp fallback).

// ──────────────────────────────────────────────────────────────
// LEAD CAPTURE CONFIG
// To capture enquiries straight to your inbox, create a free access key at
// https://web3forms.com (just enter your email — no account needed) and paste
// it below. Until then, the form gracefully falls back to opening WhatsApp
// pre-filled with the enquiry, so it works immediately either way.
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
const WHATSAPP_NUMBER = '27748226711';
// ──────────────────────────────────────────────────────────────

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
        this.initForm();
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

                // Pre-fill the enquiry form when an offer/partnership CTA was clicked
                const prefill = anchor.getAttribute('data-prefill');
                if (prefill) this.prefillInterest(prefill);

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

    prefillInterest(value) {
        const select = document.getElementById('f-interest');
        if (!select) return;
        const match = Array.from(select.options).find(o => o.value === value || o.text === value);
        if (match) {
            select.value = match.value;
        } else {
            // No exact option (e.g. the Growth Partnership) — note it in the message instead
            const msg = document.getElementById('f-message');
            if (msg && !msg.value) msg.value = `I'm interested in: ${value}.\n\n`;
            const notSure = Array.from(select.options).find(o => o.text === 'Not sure yet');
            if (notSure) select.value = notSure.value;
        }
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
        // NOTE: never include above-the-fold hero elements here — they must render
        // immediately even if this script is blocked/slow, so they carry no .reveal.
        const targets = document.querySelectorAll(
            '.pillar-card, .service-tile, .work-frame, .price-card, .offer-card, .event-tier, ' +
            '.process-grid li, .approach-stats li, ' +
            '.partnership-list li, .faq-item, .contact-form-wrap, .contact-details'
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

    // ── Enquiry form ──────────────────────────────────────────
    initForm() {
        this.form = document.getElementById('enquiry-form');
        if (!this.form) return;
        this.status = document.getElementById('form-status');
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    setStatus(message, type) {
        if (!this.status) return;
        this.status.textContent = message;
        this.status.classList.remove('is-success', 'is-error');
        if (type) this.status.classList.add('is-' + type);
    }

    getValues() {
        const get = (id) => (document.getElementById(id)?.value || '').trim();
        return {
            name: get('f-name'),
            email: get('f-email'),
            phone: get('f-phone'),
            interest: get('f-interest'),
            budget: get('f-budget'),
            message: get('f-message'),
            botcheck: (this.form.querySelector('[name="botcheck"]')?.value || '').trim()
        };
    }

    validate(v) {
        if (v.botcheck) return { spam: true };               // honeypot tripped
        if (!v.name) return { id: 'f-name', message: 'Please add your name.' };
        if (!v.email) return { id: 'f-email', message: 'Please add your email address.' };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return { id: 'f-email', message: 'That email address doesn\'t look right.' };
        if (!v.interest) return { id: 'f-interest', message: 'Please pick what you\'re interested in.' };
        if (!v.message) return { id: 'f-message', message: 'Please add a few details so I can help.' };
        return null;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const v = this.getValues();
        const error = this.validate(v);
        if (error && error.spam) return;                     // silently drop bots
        if (error) {
            this.setStatus(error.message, 'error');
            const field = document.getElementById(error.id);
            if (field) { field.focus(); field.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
            return;
        }

        const keyConfigured = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY.length > 20 && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY';

        if (keyConfigured) {
            await this.submitToWeb3Forms(v);
        } else {
            this.submitViaWhatsApp(v);
        }
    }

    async submitToWeb3Forms(v) {
        const btn = this.form.querySelector('.form-submit');
        btn.disabled = true;
        this.setStatus('Sending…', null);
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `New enquiry — ${v.interest} — ${v.name}`,
                    from_name: 'Brendon Mapinda Website',
                    name: v.name,
                    email: v.email,
                    phone: v.phone,
                    interest: v.interest,
                    budget: v.budget,
                    message: v.message
                })
            });
            const data = await res.json();
            if (data.success) {
                this.form.reset();
                this.setStatus('Thank you — your enquiry is in. I\'ll reply within hours.', 'success');
            } else {
                this.setStatus('Something went wrong. Please WhatsApp me instead — link below.', 'error');
            }
        } catch (err) {
            this.setStatus('Network issue. Please WhatsApp me instead — link below.', 'error');
        } finally {
            btn.disabled = false;
        }
    }

    submitViaWhatsApp(v) {
        const lines = [
            'Hi Brendon, project enquiry:',
            '',
            `Name: ${v.name}`,
            `Email: ${v.email}`,
            v.phone ? `Phone: ${v.phone}` : null,
            `Interest: ${v.interest}`,
            v.budget ? `Budget: ${v.budget}` : null,
            '',
            v.message
        ].filter(Boolean);
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
        this.setStatus('Opening WhatsApp with your details — tap send to reach me.', 'success');
        window.open(url, '_blank', 'noopener');
    }

    setYear() {
        const el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    }
}

document.addEventListener('DOMContentLoaded', () => new Site());

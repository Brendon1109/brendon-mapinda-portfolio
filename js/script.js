// Main JavaScript for Brendon Mapinda Website
class WebsiteManager {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');

        this.initializeEventListeners();
        this.initializeActiveNav();
        this.initializeAnimations();
    }

    initializeEventListeners() {
        // Mobile navigation toggle
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                const isActive = this.navMenu.classList.toggle('active');
                this.hamburger.classList.toggle('active');
                this.hamburger.setAttribute('aria-expanded', isActive);
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    if (this.navMenu) {
                        this.navMenu.classList.remove('active');
                        this.hamburger.classList.remove('active');
                        this.hamburger.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(14, 27, 42, 0.98)';
            } else {
                navbar.style.background = 'rgba(14, 27, 42, 0.95)';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active') &&
                !this.navMenu.contains(e.target) &&
                !this.hamburger.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
                this.hamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu && this.navMenu.classList.contains('active')) {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
                this.hamburger.setAttribute('aria-expanded', 'false');
                this.hamburger.focus();
            }
        });
    }

    // Active nav highlighting based on scroll position
    initializeActiveNav() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px 0px 0px'
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            navObserver.observe(section);
        });
    }

    // Intersection Observer for scroll animations
    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });
    }
}

// Initialize website functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteManager();
});

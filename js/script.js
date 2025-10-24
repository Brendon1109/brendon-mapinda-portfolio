// Main JavaScript for Brendon Mapinda Website
class WebsiteManager {
    constructor() {
        this.initializeEventListeners();
        this.initializeAIBot();
    }

    initializeEventListeners() {
        // Mobile navigation toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    initializeAIBot() {
        const aiBotTrigger = document.getElementById('aiBotTrigger');
        const aiModal = document.getElementById('aiModal');
        const closeModal = document.querySelector('.close');
        const personaBtns = document.querySelectorAll('.persona-btn');
        const aiResponse = document.getElementById('aiResponse');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const personaOptions = document.querySelector('.persona-options');
        const backToOptions = document.getElementById('backToOptions');
        const visitPageBtn = document.getElementById('visitPageBtn');
        const usageInfo = document.getElementById('usageInfo');

        let currentPersona = null;

        // Open modal
        aiBotTrigger?.addEventListener('click', () => {
            aiModal.style.display = 'block';
            this.updateUsageStats();
        });

        // Close modal
        closeModal?.addEventListener('click', () => {
            aiModal.style.display = 'none';
            this.resetModal();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === aiModal) {
                aiModal.style.display = 'none';
                this.resetModal();
            }
        });

        // Persona selection
        personaBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const persona = btn.dataset.persona;
                currentPersona = persona;
                
                // Show loading
                personaOptions.classList.add('hidden');
                loadingSpinner.classList.remove('hidden');
                
                try {
                    // Get AI response
                    const response = await window.BrendonAI.generatePersonaSummary(persona);
                    
                    // Show response
                    this.displayAIResponse(persona, response);
                    this.updateUsageStats();
                } catch (error) {
                    this.showError(error.message);
                } finally {
                    loadingSpinner.classList.add('hidden');
                }
            });
        });

        // Back to options
        backToOptions?.addEventListener('click', () => {
            this.resetModal();
        });

        // Visit page button
        visitPageBtn?.addEventListener('click', () => {
            const pageMap = {
                'musician': '#music',
                'cinematographer': '#photography',
                'dataScientist': '#data'
            };
            
            if (currentPersona && pageMap[currentPersona]) {
                aiModal.style.display = 'none';
                this.resetModal();
                
                // Smooth scroll to section
                const section = document.querySelector(pageMap[currentPersona]);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    displayAIResponse(persona, response) {
        const aiResponse = document.getElementById('aiResponse');
        const responseTitle = document.getElementById('responseTitle');
        const responseContent = document.getElementById('responseContent');
        
        const titles = {
            'musician': 'Brendon as a Musician (King Breazy)',
            'cinematographer': 'Brendon as a Cinematographer',
            'dataScientist': 'Brendon as an Analytics Engineer'
        };
        
        responseTitle.textContent = titles[persona] || 'About Brendon';
        responseContent.innerHTML = this.formatResponse(response);
        
        aiResponse.classList.remove('hidden');
    }

    formatResponse(response) {
        // Convert line breaks to paragraphs
        return response
            .split('\n\n')
            .map(paragraph => `<p>${paragraph.trim()}</p>`)
            .join('');
    }

    showError(message) {
        const aiResponse = document.getElementById('aiResponse');
        const responseTitle = document.getElementById('responseTitle');
        const responseContent = document.getElementById('responseContent');
        
        responseTitle.textContent = 'Oops! Something went wrong';
        responseContent.innerHTML = `<p style="color: #e74c3c;"><strong>Error:</strong> ${message}</p>
                                    <p>Don't worry! You can still explore Brendon's work using the navigation menu or try again later.</p>`;
        
        // Hide visit page button for errors
        document.getElementById('visitPageBtn').style.display = 'none';
        
        aiResponse.classList.remove('hidden');
    }

    resetModal() {
        const personaOptions = document.querySelector('.persona-options');
        const aiResponse = document.getElementById('aiResponse');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const visitPageBtn = document.getElementById('visitPageBtn');
        
        personaOptions.classList.remove('hidden');
        aiResponse.classList.add('hidden');
        loadingSpinner.classList.add('hidden');
        visitPageBtn.style.display = 'inline-block';
    }

    updateUsageStats() {
        const usageInfo = document.getElementById('usageInfo');
        if (window.BrendonAI && usageInfo) {
            const stats = window.BrendonAI.getUsageStats();
            usageInfo.textContent = `API Usage: ${stats.requests}/${stats.maxRequests} requests | Cost: $${stats.estimatedCost}`;
            
            // Change color based on usage
            if (stats.requests > stats.maxRequests * 0.8) {
                usageInfo.style.color = '#e74c3c';
            } else if (stats.requests > stats.maxRequests * 0.5) {
                usageInfo.style.color = '#f39c12';
            } else {
                usageInfo.style.color = '#27ae60';
            }
        }
    }

    // Intersection Observer for animations
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

        // Observe all sections
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
    const website = new WebsiteManager();
    
    // Initialize animations after a short delay
    setTimeout(() => {
        website.initializeAnimations();
    }, 500);
});

// Error handling for AI Bot
window.addEventListener('error', (e) => {
    console.error('Website Error:', e.error);
    
    // If it's an AI-related error, show user-friendly message
    if (e.error.message.includes('AI') || e.error.message.includes('API')) {
        const modal = document.getElementById('aiModal');
        if (modal.style.display === 'block') {
            const website = new WebsiteManager();
            website.showError('AI service is temporarily unavailable. Please try the navigation menu to explore Brendon\'s work.');
        }
    }
});

// Performance optimization
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // We could register a service worker here for caching
        console.log('Website loaded successfully');
    });
}
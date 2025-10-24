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

// PDF Modal functionality
function openPDFModal(pdfUrl, title) {
    // Create PDF modal if it doesn't exist
    let pdfModal = document.getElementById('pdfModal');
    if (!pdfModal) {
        pdfModal = document.createElement('div');
        pdfModal.id = 'pdfModal';
        pdfModal.className = 'modal pdf-modal';
        pdfModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="pdfTitle">${title}</h3>
                    <span class="close" onclick="closePDFModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <iframe id="pdfFrame" src="${pdfUrl}" frameborder="0"></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(pdfModal);
    } else {
        // Update existing modal
        document.getElementById('pdfTitle').textContent = title;
        document.getElementById('pdfFrame').src = pdfUrl;
    }
    
    // Show modal
    pdfModal.style.display = 'flex';
    
    // Close on outside click
    pdfModal.addEventListener('click', function(e) {
        if (e.target === pdfModal) {
            closePDFModal();
        }
    });
}

function closePDFModal() {
    const pdfModal = document.getElementById('pdfModal');
    if (pdfModal) {
        pdfModal.style.display = 'none';
    }
}

// Summit Magazine function
function openSummitMagazine() {
    // Try to open the PDF in a new tab
    const pdfUrl = 'assets/summit-magazine-feature.pdf';
    
    // First try to open directly
    const newWindow = window.open(pdfUrl, '_blank');
    
    // If popup was blocked or failed, show fallback
    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // Fallback: Create a download link
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'Summit-Magazine-Brendon-Feature.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show user-friendly message
        setTimeout(() => {
            alert('PDF download started! If the download didn\'t start automatically, please disable your popup blocker and try again.');
        }, 500);
    }
}

// QR Code Sharing Functions
function shareQROnWhatsApp() {
    try {
        const websiteUrl = 'https://brendon1109.github.io/brendon-mapinda-portfolio/';
        const message = `Check out Brendon Mapinda's professional portfolio! 🎯\n\n📱 Scan the QR code or visit: ${websiteUrl}\n\nCinematographer | Data Scientist | Musician\n\n#Portfolio #WebDevelopment #DataScience #Music`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        showShareMessage('Opening WhatsApp... 📱');
    } catch (error) {
        console.error('WhatsApp share error:', error);
        alert('WhatsApp sharing is not available on this device.');
    }
}

function shareQRByEmail() {
    try {
        const websiteUrl = 'https://brendon1109.github.io/brendon-mapinda-portfolio/';
        const subject = 'Check out Brendon Mapinda\'s Professional Portfolio';
        const body = `Hi there!\n\nI wanted to share Brendon Mapinda's impressive professional portfolio with you.\n\nHe's a multi-talented professional working as a Cinematographer, Data Scientist, and Musician.\n\nYou can visit his portfolio here: ${websiteUrl}\n\nOr scan the QR code I'm sharing for quick access on your mobile device.\n\nBest regards!`;
        
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
        showShareMessage('Opening email client... 📧');
    } catch (error) {
        console.error('Email share error:', error);
        alert('Email client not available. Please copy the link manually.');
    }
}

function downloadQRCode() {
    try {
        const qrImage = document.getElementById('qrCodeImage');
        if (!qrImage) {
            alert('QR Code image not found. Please refresh the page and try again.');
            return;
        }

        // Create a canvas to convert the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Wait for image to load if it hasn't already
        if (!qrImage.complete) {
            qrImage.onload = function() {
                performDownload(qrImage, canvas, ctx);
            };
        } else {
            performDownload(qrImage, canvas, ctx);
        }
    } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. Please right-click the QR code and select "Save image as..."');
    }
}

function performDownload(qrImage, canvas, ctx) {
    try {
        // Set canvas size to match image
        canvas.width = qrImage.naturalWidth || qrImage.width || 300;
        canvas.height = qrImage.naturalHeight || qrImage.height || 300;
        
        // Draw the image on canvas
        ctx.drawImage(qrImage, 0, 0);
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'brendon-mapinda-portfolio-qr-code.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showShareMessage('QR Code saved to downloads! 📥');
    } catch (error) {
        console.error('Canvas download error:', error);
        // Fallback: try direct image download
        const link = document.createElement('a');
        link.download = 'brendon-mapinda-portfolio-qr-code.png';
        link.href = qrImage.src;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showShareMessage('QR Code download attempted! 📥');
    }
}

function copyQRLink() {
    try {
        const websiteUrl = 'https://brendon1109.github.io/brendon-mapinda-portfolio/';
        
        if (navigator.clipboard && window.isSecureContext) {
            // Use modern clipboard API
            navigator.clipboard.writeText(websiteUrl).then(() => {
                showShareMessage('Portfolio link copied to clipboard! 📋');
            }).catch(() => {
                fallbackCopyText(websiteUrl);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyText(websiteUrl);
        }
    } catch (error) {
        console.error('Copy link error:', error);
        fallbackCopyText('https://brendon1109.github.io/brendon-mapinda-portfolio/');
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showShareMessage('Portfolio link copied! 📋');
    } catch (err) {
        prompt('Copy this link:', text);
    } finally {
        textArea.remove();
    }
}

function showShareMessage(message) {
    try {
        console.log('Showing message:', message);
        
        // Create a temporary message element
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #c4a484 0%, #a68b5b 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    } catch (error) {
        console.error('Show message error:', error);
        // Fallback to alert
        alert(message);
    }
}

// Debug function to test if buttons are working
function testQRButtons() {
    console.log('QR sharing functions loaded successfully!');
    showShareMessage('QR sharing functions are working! 🎉');
}

// Performance optimization
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // We could register a service worker here for caching
        console.log('Website loaded successfully');
    });
}
// Main JavaScript for Brendon Mapinda Website
class WebsiteManager {
    constructor() {
        this.initializeEventListeners();
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
                navbar.style.background = 'rgba(14, 27, 42, 0.98)';
            } else {
                navbar.style.background = 'rgba(14, 27, 42, 0.95)';
            }
        });
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

// QR Code Sharing Functions
function shareQROnWhatsApp() {
    try {
        const websiteUrl = 'https://brendon1109.github.io/brendon-mapinda-portfolio/';
        const message = `Check out Brendon Mapinda's professional portfolio!\n\nVisit: ${websiteUrl}\n\nCinematographer | Photographer | Web & App Developer`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        showShareMessage('Opening WhatsApp...');
    } catch (error) {
        console.error('WhatsApp share error:', error);
        alert('WhatsApp sharing is not available on this device.');
    }
}

function shareQRByEmail() {
    try {
        const websiteUrl = 'https://brendon1109.github.io/brendon-mapinda-portfolio/';
        const subject = "Check out Brendon Mapinda's Professional Portfolio";
        const body = `Hi there!\n\nI wanted to share Brendon Mapinda's professional portfolio with you.\n\nHe's a multi-talented professional working as a Cinematographer, Photographer, and Web & App Developer.\n\nVisit his portfolio here: ${websiteUrl}\n\nBest regards!`;

        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
        showShareMessage('Opening email client...');
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

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

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
        canvas.width = qrImage.naturalWidth || qrImage.width || 300;
        canvas.height = qrImage.naturalHeight || qrImage.height || 300;
        ctx.drawImage(qrImage, 0, 0);

        const link = document.createElement('a');
        link.download = 'brendon-mapinda-portfolio-qr-code.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showShareMessage('QR Code saved to downloads!');
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
        showShareMessage('QR Code download attempted!');
    }
}

function copyQRLink() {
    try {
        const websiteUrl = 'https://brendon1109.github.io/brendon-mapinda-portfolio/';

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(websiteUrl).then(() => {
                showShareMessage('Portfolio link copied to clipboard!');
            }).catch(() => {
                fallbackCopyText(websiteUrl);
            });
        } else {
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
        showShareMessage('Portfolio link copied!');
    } catch (err) {
        prompt('Copy this link:', text);
    } finally {
        textArea.remove();
    }
}

function showShareMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--accent) 0%, var(--supporting) 100%);
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

    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

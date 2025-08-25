// About page specific functionality

// Animated counter for statistics
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas for large numbers
        const formattedNumber = Math.floor(current).toLocaleString();
        element.textContent = formattedNumber + (target >= 1000 ? '+' : '');
    }, 16);
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            entry.target.classList.add('animated');
        }
    });
}, {
    threshold: 0.5
});

// Observe all stat numbers
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Team member hover effects
document.querySelectorAll('.team-member').forEach(member => {
    member.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        
        // Add glow effect to member image
        const memberImage = this.querySelector('.member-image .image-placeholder');
        if (memberImage) {
            memberImage.style.boxShadow = '0 0 30px rgba(255, 107, 157, 0.3)';
        }
    });
    
    member.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        
        // Remove glow effect
        const memberImage = this.querySelector('.member-image .image-placeholder');
        if (memberImage) {
            memberImage.style.boxShadow = 'none';
        }
    });
});

// Value items animation on scroll
const valueObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}, {
    threshold: 0.1
});

// Initialize value items for animation
document.querySelectorAll('.value-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease-out';
    valueObserver.observe(item);
});

// Parallax effect for story image
window.addEventListener('scroll', () => {
    const storyImage = document.querySelector('.story-image .image-placeholder');
    if (storyImage) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        storyImage.style.transform = `translateY(${rate}px)`;
    }
});

// Add floating animation to value icons
document.querySelectorAll('.value-icon').forEach((icon, index) => {
    icon.style.animation = `float 3s ease-in-out infinite`;
    icon.style.animationDelay = `${index * 0.5}s`;
});

// Interactive timeline effect (if we add a timeline section later)
function createTimeline() {
    const timelineData = [
        { year: '2020', event: 'CrochetCraft Founded', description: 'Started with a passion for beautiful crochet patterns' },
        { year: '2021', event: 'First 100 Patterns', description: 'Reached our first major milestone of pattern collection' },
        { year: '2022', event: 'Community Launch', description: 'Launched our online community for crafters worldwide' },
        { year: '2023', event: '10K+ Happy Customers', description: 'Celebrated serving over 10,000 satisfied crafters' },
        { year: '2024', event: 'Global Expansion', description: 'Expanded to serve crafters in 25+ countries' }
    ];
    
    // This could be used to create an interactive timeline section
    return timelineData;
}

// Add smooth reveal animation for story text
const storyText = document.querySelector('.story-text');
if (storyText) {
    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const paragraphs = entry.target.querySelectorAll('p');
                paragraphs.forEach((p, index) => {
                    setTimeout(() => {
                        p.style.opacity = '1';
                        p.style.transform = 'translateX(0)';
                    }, index * 300);
                });
            }
        });
    }, { threshold: 0.3 });
    
    // Initialize paragraphs for animation
    const paragraphs = storyText.querySelectorAll('p');
    paragraphs.forEach(p => {
        p.style.opacity = '0';
        p.style.transform = 'translateX(-30px)';
        p.style.transition = 'all 0.6s ease-out';
    });
    
    storyObserver.observe(storyText);
}

// Add interactive hover effects to social links
document.querySelectorAll('.member-social a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2) rotate(5deg)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Create floating particles effect for the stats section
function createFloatingParticles() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle ${3 + Math.random() * 4}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        statsSection.appendChild(particle);
    }
    
    // Add CSS animation for particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize floating particles
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createFloatingParticles, 1000);
});

// Add typing effect to the main heading
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect for page title
const pageTitle = document.querySelector('.page-title');
if (pageTitle) {
    const originalText = pageTitle.textContent;
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                typeWriter(entry.target, originalText, 80);
                entry.target.classList.add('typed');
            }
        });
    }, { threshold: 0.5 });
    
    titleObserver.observe(pageTitle);
}

console.log('About page enhanced with animations and interactions! ✨');
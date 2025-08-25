// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLogin = document.getElementById('closeLogin');
const closeSignup = document.getElementById('closeSignup');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Auth button events are handled by AuthManager
// Remove duplicate event listeners

// Switch between modals
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        closeModal(loginModal);
    }
    if (e.target === signupModal) {
        closeModal(signupModal);
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.pattern-item, .contact-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Cart functionality is now handled by CartManager class

// Global notification function (fallback)
function showNotification(message, type = 'info') {
    if (window.cartManager) {
        cartManager.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Form Submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form type
        const isLogin = form.closest('#loginModal');
        const isSignup = form.closest('#signupModal');
        const isContact = form.closest('.contact-form');
        
        if (isLogin) {
            handleLogin(form);
        } else if (isSignup) {
            handleSignup(form);
        } else if (isContact) {
            handleContact(form);
        }
    });
});

// Handle Login
function handleLogin(form) {
    const formData = new FormData(form);
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login process
    showNotification('Logging in...', 'info');
    
    setTimeout(() => {
        // Store user data in localStorage
        const userData = {
            email: email,
            loginTime: new Date().toISOString(),
            isLoggedIn: true
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        closeModal(loginModal);
        showNotification('Welcome back!', 'success');
        updateAuthButtons(true);
    }, 1500);
}

// Handle Signup
function handleSignup(form) {
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Simulate signup process
    showNotification('Creating account...', 'info');
    
    setTimeout(() => {
        // Store user data in localStorage
        const userData = {
            name: name,
            email: email,
            signupTime: new Date().toISOString(),
            isLoggedIn: true
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        closeModal(signupModal);
        showNotification('Account created successfully!', 'success');
        updateAuthButtons(true);
    }, 1500);
}

// Handle Contact Form
function handleContact(form) {
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    showNotification('Sending message...', 'info');
    
    setTimeout(() => {
        form.reset();
        showNotification('Message sent successfully!', 'success');
    }, 1500);
}

// Auth buttons are now handled by AuthManager
// This function is kept for compatibility but auth manager handles UI updates

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    // Auth manager handles user state
    if (window.authManager) {
        authManager.checkAuthState();
    }
    
    // Cart manager handles cart state
    if (window.cartManager) {
        cartManager.updateCartDisplay();
    }
    
    // Manual button binding as backup
    setTimeout(() => {
        const loginBtn = document.querySelector('.btn-secondary');
        const signupBtn = document.querySelector('.btn-primary');
        
        if (loginBtn && loginBtn.textContent.includes('Login')) {
            loginBtn.onclick = () => {
                if (window.authManager) authManager.showLogin();
            };
        }
        
        if (signupBtn && signupBtn.textContent.includes('Sign Up')) {
            signupBtn.onclick = () => {
                if (window.authManager) authManager.showSignup();
            };
        }
    }, 500);
});

// Add loading animation to buttons
document.querySelectorAll('button[type="submit"]').forEach(btn => {
    btn.addEventListener('click', function() {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.disabled = true;
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.disabled = false;
        }, 1500);
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Add hover effects to pattern cards
document.querySelectorAll('.pattern-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Fast loading hero animation
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }
});

// Add search functionality (basic)
function addSearchBar() {
    const searchHTML = `
        <div class="search-container">
            <input type="text" placeholder="Search patterns..." class="search-input">
            <i class="fas fa-search search-icon"></i>
        </div>
    `;
    
    // Add search styles
    const searchStyles = `
        .search-container {
            position: relative;
            margin: 20px 0;
        }
        
        .search-input {
            width: 100%;
            padding: 12px 40px 12px 16px;
            border: 2px solid var(--light-color);
            border-radius: var(--border-radius);
            font-size: 1rem;
            transition: var(--transition);
        }
        
        .search-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
        }
        
        .search-icon {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray);
        }
    `;
    
    // Add styles to head
    const style = document.createElement('style');
    style.textContent = searchStyles;
    document.head.appendChild(style);
}

// Initialize search bar
addSearchBar();

// Policy modals
function showPolicy(type) {
    const policies = {
        privacy: {
            title: 'Privacy Policy',
            content: 'We respect your privacy and protect your personal information. We collect only necessary data to provide our services and never share it with third parties without your consent.'
        },
        terms: {
            title: 'Terms of Service',
            content: 'By using CrochetCraft, you agree to our terms. You may use purchased patterns for personal and commercial projects but cannot redistribute the patterns themselves.'
        },
        refund: {
            title: 'Refund Policy',
            content: 'Due to the digital nature of our products, we do not offer refunds. However, if you experience technical issues, please contact us for support.'
        }
    };
    
    const policy = policies[type];
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${policy.title}</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="padding: 30px;">
                <p>${policy.content}</p>
                <button class="btn-primary" onclick="this.closest('.modal').remove()" style="margin-top: 20px;">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

console.log('CrochetCraft website loaded successfully! 🧶✨');
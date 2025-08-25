// Contact page specific functionality

// FAQ accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
});

// Enhanced form validation
function validateContactForm(form) {
    const firstName = form.querySelector('#firstName').value.trim();
    const lastName = form.querySelector('#lastName').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value;
    const message = form.querySelector('#message').value.trim();
    
    const errors = [];
    
    // Name validation
    if (!firstName) errors.push('First name is required');
    if (!lastName) errors.push('Last name is required');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Subject validation
    if (!subject) errors.push('Please select a subject');
    
    // Message validation
    if (!message) {
        errors.push('Message is required');
    } else if (message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

// Handle contact form submission
document.querySelector('.contact-form-extended').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const errors = validateContactForm(this);
    
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Store message in localStorage (simulate sending)
        const formData = {
            firstName: this.querySelector('#firstName').value,
            lastName: this.querySelector('#lastName').value,
            email: this.querySelector('#email').value,
            subject: this.querySelector('#subject').value,
            message: this.querySelector('#message').value,
            newsletter: this.querySelector('input[name="newsletter"]').checked,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Reset form
        this.reset();
        
        // Show success message
        showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon!', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
});

// Add real-time validation feedback
document.querySelectorAll('.contact-form-extended input, .contact-form-extended textarea, .contact-form-extended select').forEach(field => {
    field.addEventListener('blur', function() {
        validateField(this);
    });
    
    field.addEventListener('input', function() {
        // Remove error styling on input
        this.classList.remove('error');
        const errorMsg = this.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validate based on field type
    switch (field.type) {
        case 'text':
            if (!value) {
                isValid = false;
                errorMessage = `${field.previousElementSibling.textContent.replace('*', '')} is required`;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'textarea':
            if (!value) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    if (field.tagName === 'SELECT' && !value) {
        isValid = false;
        errorMessage = 'Please select a subject';
    }
    
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 4px;
            animation: slideDown 0.3s ease-out;
        `;
        field.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

// Add character counter for message field
const messageField = document.querySelector('#message');
if (messageField) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: var(--gray);
        margin-top: 4px;
    `;
    messageField.parentNode.appendChild(counter);
    
    function updateCounter() {
        const length = messageField.value.length;
        const minLength = 10;
        counter.textContent = `${length} characters (minimum ${minLength})`;
        
        if (length < minLength) {
            counter.style.color = '#e74c3c';
        } else {
            counter.style.color = '#27ae60';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    updateCounter();
}

// Animate contact items on scroll
const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 200);
        }
    });
}, {
    threshold: 0.1
});

// Initialize contact items for animation
document.querySelectorAll('.contact-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'all 0.6s ease-out';
    contactObserver.observe(item);
});

// Add hover effects to social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Add floating animation to contact icons
document.querySelectorAll('.contact-item i').forEach((icon, index) => {
    icon.style.animation = `float 3s ease-in-out infinite`;
    icon.style.animationDelay = `${index * 0.5}s`;
});

// Auto-expand FAQ items based on URL hash
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetFaq = document.querySelector(hash);
        if (targetFaq && targetFaq.classList.contains('faq-item')) {
            targetFaq.classList.add('active');
            targetFaq.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// Add smooth scrolling to FAQ items
document.querySelectorAll('a[href^="#faq"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('active');
        }
    });
});

// Form field focus effects
document.querySelectorAll('.contact-form-extended input, .contact-form-extended textarea, .contact-form-extended select').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentNode.classList.add('focused');
    });
    
    field.addEventListener('blur', function() {
        this.parentNode.classList.remove('focused');
    });
});

// Add CSS for enhanced form styling
const formStyles = `
    .form-group.focused label {
        color: var(--primary-color);
        transform: translateY(-2px);
    }
    
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const style = document.createElement('style');
style.textContent = formStyles;
document.head.appendChild(style);

console.log('Contact page enhanced with validation and animations! 📧');
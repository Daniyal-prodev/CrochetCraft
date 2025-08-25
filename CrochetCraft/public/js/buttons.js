// Button Functionality
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function openTutorial() {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    if (window.cartManager) {
        cartManager.showNotification('Tutorial opened in new tab!', 'success');
    }
}

function quickViewPattern(button) {
    const patternItem = button.closest('.pattern-item');
    const title = patternItem.querySelector('h3').textContent;
    const difficulty = patternItem.querySelector('.pattern-difficulty').textContent;
    const price = patternItem.querySelector('.pattern-price').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="padding: 30px;">
                <div class="pattern-image" style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; margin-bottom: 20px;"></div>
                <p><strong>Difficulty:</strong> ${difficulty}</p>
                <p><strong>Price:</strong> ${price}</p>
                <p><strong>What's Included:</strong></p>
                <ul style="margin: 15px 0; padding-left: 20px;">
                    <li>Detailed PDF pattern</li>
                    <li>Step-by-step photos</li>
                    <li>Video tutorial access</li>
                    <li>Materials list</li>
                </ul>
                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button class="btn-primary" onclick="addToCartFromModal('${title}', '${price}'); this.closest('.modal').remove();">
                        Add to Cart
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function addToCartFromModal(title, price) {
    const product = {
        id: Date.now() + Math.random(),
        title: title,
        price: parseFloat(price.replace('$', ''))
    };
    
    if (window.cartManager) {
        cartManager.addItem(product);
    }
}

// Email System
async function sendEmail(formData) {
    const emailData = {
        to: 'aribdaniyal88@gmail.com',
        subject: `Contact Form: ${formData.get('subject') || 'General Inquiry'}`,
        message: `
Name: ${formData.get('firstName')} ${formData.get('lastName')}
Email: ${formData.get('email')}
Subject: ${formData.get('subject')}

Message:
${formData.get('message')}

Sent from CrochetCraft website at ${new Date().toLocaleString()}
        `
    };
    
    // Simulate email sending (replace with actual email service)
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Email sent to:', emailData.to);
            console.log('Subject:', emailData.subject);
            console.log('Message:', emailData.message);
            
            // Store in localStorage as backup
            let emails = JSON.parse(localStorage.getItem('sentEmails')) || [];
            emails.push({
                ...emailData,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('sentEmails', JSON.stringify(emails));
            
            resolve(true);
        }, 1000);
    });
}

// Initialize button handlers
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || 
            (e.target.textContent && e.target.textContent.includes('Add to Cart'))) {
            e.preventDefault();
            e.stopPropagation();
            
            const patternItem = e.target.closest('.pattern-item');
            if (patternItem && window.cartManager) {
                const title = patternItem.querySelector('h3')?.textContent;
                const priceText = patternItem.querySelector('.pattern-price')?.textContent;
                
                if (title && priceText) {
                    const product = {
                        id: Date.now() + Math.random(),
                        title: title,
                        price: parseFloat(priceText.replace('$', ''))
                    };
                    cartManager.addItem(product);
                }
            }
        }
        
        // Quick view buttons
        if (e.target.textContent && e.target.textContent.includes('Quick View')) {
            e.preventDefault();
            e.stopPropagation();
            quickViewPattern(e.target);
        }
        
        // Footer links
        if (e.target.closest('.footer a')) {
            const link = e.target.closest('a');
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href.substring(1));
            }
        }
    });
    
    // Contact form submission
    const contactForms = document.querySelectorAll('.contact-form, .contact-form-extended');
    contactForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(form);
                await sendEmail(formData);
                
                form.reset();
                if (window.cartManager) {
                    cartManager.showNotification('Message sent successfully to aribdaniyal88@gmail.com!', 'success');
                } else {
                    alert('Message sent successfully!');
                }
            } catch (error) {
                if (window.cartManager) {
                    cartManager.showNotification('Failed to send message. Please try again.', 'error');
                } else {
                    alert('Failed to send message. Please try again.');
                }
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    });
});
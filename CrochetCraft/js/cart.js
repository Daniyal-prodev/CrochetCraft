// Enhanced Cart System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.bindEvents();
    }

    loadCart() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            return [];
        }
        const user = JSON.parse(currentUser);
        const cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
        this.cart = cart;
        return cart;
    }

    saveCart() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            localStorage.setItem(`cart_${user.email}`, JSON.stringify(this.cart));
        }
    }

    addItem(product) {
        // Check if user is logged in
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            this.showNotification('Please login to add items to cart', 'error');
            if (window.authManager) {
                authManager.showLogin();
            }
            return;
        }
        
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: 1,
                image: product.image || 'default.jpg'
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.title} added to cart!`, 'success');
        this.animateCartIcon();
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                // Reload cart from localStorage to ensure sync
                this.loadCart();
                const count = this.getItemCount();
                cartCount.textContent = count;
                cartCount.style.display = count > 0 ? 'flex' : 'none';
            } else {
                cartCount.textContent = '0';
                cartCount.style.display = 'none';
            }
        }
    }

    animateCartIcon() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.style.animation = 'bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 600);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4ecdc4, #44a08d)' : 'linear-gradient(135deg, #ff6b9d, #ee5a6f)'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
        
        setTimeout(() => {
            this.removeNotification(notification);
        }, 4000);
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }

    openCart() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            this.showNotification('Please login to view your cart', 'error');
            if (window.authManager) {
                authManager.showLogin();
            }
            return;
        }
        this.createCartModal();
    }

    createCartModal() {
        const existingModal = document.getElementById('cartModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content cart-modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-shopping-cart"></i> Shopping Cart</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="cart-items">
                    ${this.renderCartItems()}
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: $${this.getTotal().toFixed(2)}</strong>
                    </div>
                    <div class="cart-actions">
                        <button class="btn-secondary" onclick="document.getElementById('cartModal').remove()">Continue Shopping</button>
                        <button class="btn-primary" onclick="cartManager.proceedToCheckout()">
                            <i class="fas fa-credit-card"></i>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    renderCartItems() {
        if (this.cart.length === 0) {
            return `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some beautiful patterns to get started!</p>
                </div>
            `;
        }

        return this.cart.map(item => `
            <div class="cart-item">
                <div class="item-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <p class="item-price">$${item.price}</p>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item" onclick="cartManager.removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty! Add some patterns first.', 'error');
            return;
        }
        
        if (!window.authManager || !authManager.currentUser) {
            this.showNotification('Please login to checkout', 'error');
            if (window.authManager) {
                authManager.showLogin();
            }
            return;
        }
        
        document.getElementById('cartModal').remove();
        this.createCheckoutModal();
    }

    createCheckoutModal() {
        const modal = document.createElement('div');
        modal.id = 'checkoutModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content checkout-modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-credit-card"></i> Checkout</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="checkout-content">
                    <div class="checkout-form">
                        <h3>Payment Information</h3>
                        <form id="checkoutForm">
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" required>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" required>
                                </div>
                                <div class="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" required>
                                </div>
                            </div>
                            
                            <div class="payment-methods">
                                <h4>Payment Method</h4>
                                <div class="payment-options">
                                    <label class="payment-option">
                                        <input type="radio" name="paymentMethod" value="card" checked>
                                        <span class="payment-label">
                                            <i class="fas fa-credit-card"></i>
                                            Credit/Debit Card
                                        </span>
                                    </label>
                                    <label class="payment-option">
                                        <input type="radio" name="paymentMethod" value="paypal">
                                        <span class="payment-label">
                                            <i class="fab fa-paypal"></i>
                                            PayPal
                                        </span>
                                    </label>
                                    <label class="payment-option">
                                        <input type="radio" name="paymentMethod" value="stripe">
                                        <span class="payment-label">
                                            <i class="fas fa-money-check-alt"></i>
                                            Stripe
                                        </span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="card-details" id="cardDetails">
                                <div class="form-group">
                                    <label>Card Number</label>
                                    <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                                    <small class="form-help">Enter a real card number (test cards not allowed)</small>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Expiry Date</label>
                                        <input type="text" name="expiry" placeholder="MM/YY" maxlength="5" required>
                                    </div>
                                    <div class="form-group">
                                        <label>CVV</label>
                                        <input type="text" name="cvv" placeholder="123" maxlength="4" required>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn-primary checkout-btn">
                                <i class="fas fa-lock"></i>
                                Complete Purchase - $${this.getTotal().toFixed(2)}
                            </button>
                        </form>
                    </div>
                    
                    <div class="order-summary">
                        <h3>Order Summary</h3>
                        <div class="summary-items">
                            ${this.cart.map(item => `
                                <div class="summary-item">
                                    <span>${item.title} × ${item.quantity}</span>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="summary-total">
                            <div class="total-line">
                                <span>Subtotal:</span>
                                <span>$${this.getTotal().toFixed(2)}</span>
                            </div>
                            <div class="total-line">
                                <span>Tax:</span>
                                <span>$0.00</span>
                            </div>
                            <div class="total-line final-total">
                                <span>Total:</span>
                                <span>$${this.getTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        this.bindCheckoutEvents();
    }

    bindCheckoutEvents() {
        const form = document.getElementById('checkoutForm');
        const cardNumberInput = document.querySelector('input[name="cardNumber"]');
        const expiryInput = document.querySelector('input[name="expiry"]');
        
        // Format and validate card number
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                if (formattedValue.length > 19) {
                    formattedValue = formattedValue.substring(0, 19);
                }
                e.target.value = formattedValue;
                
                // Real-time validation
                const isValid = PaymentValidator.validateCardNumber(value);
                e.target.classList.toggle('invalid', !isValid && value.length > 0);
                e.target.classList.toggle('valid', isValid);
            });
        }
        
        // Format and validate expiry date
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
                
                // Real-time validation
                const isValid = PaymentValidator.validateExpiryDate(value);
                e.target.classList.toggle('invalid', !isValid && value.length >= 5);
                e.target.classList.toggle('valid', isValid);
            });
        }
        
        // Validate CVV
        const cvvInput = document.querySelector('input[name="cvv"]');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                e.target.value = value.substring(0, 4);
                const isValid = value.length >= 3 && value.length <= 4;
                e.target.classList.toggle('invalid', !isValid && value.length > 0);
                e.target.classList.toggle('valid', isValid);
            });
        }
        
        // Handle form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const validationResult = PaymentValidator.validatePaymentForm(formData);
                
                if (!validationResult.isValid) {
                    this.showNotification(validationResult.error, 'error');
                    return;
                }
                
                this.processPayment(formData);
            });
        }
    }

    processPayment(formData) {
        const submitBtn = document.querySelector('.checkout-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Simulate payment processing
        setTimeout(() => {
            const orderData = {
                id: Date.now(),
                items: [...this.cart],
                total: this.getTotal(),
                customerInfo: Object.fromEntries(formData),
                date: new Date().toISOString(),
                status: 'completed'
            };
            
            // Save order
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Clear cart
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
            
            // Show success with instant download
            document.getElementById('checkoutModal').remove();
            this.showOrderSuccess(orderData);
            this.triggerInstantDownload(orderData);
            
        }, 3000);
    }

    triggerInstantDownload(order) {
        order.items.forEach((item, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = `data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQVQKL0YxIDEyIFRmCjcyIDcyMCBUZAooJHtpdGVtLnRpdGxlfSAtIENyb2NoZXQgUGF0dGVybikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMDYgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA1Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyOTkKJSVFT0Y=`;
                link.download = `${item.title.replace(/\s+/g, '_')}_Pattern.pdf`;
                link.click();
            }, index * 500);
        });
    }

    showOrderSuccess(order) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content success-modal">
                <div class="success-content">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Payment Successful!</h2>
                    <p>Your patterns are downloading automatically!</p>
                    <div class="download-info">
                        <i class="fas fa-download"></i>
                        <span>Downloads started for ${order.items.length} pattern(s)</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Order ID:</strong> #${order.id}</p>
                        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                    </div>
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        setTimeout(() => {
            if (modal.parentNode) modal.remove();
        }, 8000);
    }

    bindEvents() {
        // Cart icon click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-link')) {
                e.preventDefault();
                this.openCart();
            }
            
            // Add to cart buttons
            if (e.target.closest('.btn-pattern') && e.target.textContent.includes('Add to Cart')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleAddToCart(e.target);
            }
        });
    }

    handleAddToCart(button) {
        const productCard = button.closest('.pattern-item');
        if (!productCard) return;
        
        const title = productCard.querySelector('h3')?.textContent;
        const priceText = productCard.querySelector('.pattern-price')?.textContent;
        
        if (!title || !priceText) {
            this.showNotification('Product information not found', 'error');
            return;
        }
        
        const price = parseFloat(priceText.replace('$', ''));
        
        const product = {
            id: Date.now() + Math.random(),
            title: title,
            price: price
        };
        
        this.addItem(product);
    }
}

// Initialize cart manager
const cartManager = new CartManager();
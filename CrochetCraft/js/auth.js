// Enhanced Authentication System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadGoogleAPI();
        this.checkAuthState();
        this.bindEvents();
    }

    loadGoogleAPI() {
        // Simulate Google API loading
        setTimeout(() => {
            window.google = {
                accounts: {
                    id: {
                        initialize: () => {},
                        prompt: () => this.simulateGoogleLogin(),
                        renderButton: () => {}
                    }
                }
            };
        }, 100);
    }

    handleGoogleSignIn(response) {
        try {
            if (!response || !response.credential) {
                throw new Error('Invalid Google response');
            }
            
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            const userData = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                provider: 'google',
                verified: true,
                isAdmin: payload.email === 'aribdaniyal88@gmail.com',
                loginTime: new Date().toISOString()
            };
            
            this.setUser(userData);
            this.closeModals();
            this.showNotification('Successfully signed in with Google!', 'success');
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.simulateGoogleLogin();
        }
    }

    async sendVerificationEmail(email, code) {
        // Store verification code
        localStorage.setItem(`verification_${email}`, JSON.stringify({
            code: code,
            timestamp: Date.now(),
            attempts: 0
        }));
        
        // Show code to user since we can't send real emails
        console.log(`📧 Verification Code for ${email}: ${code}`);
        
        // Show code in a prominent modal
        setTimeout(() => {
            const codeModal = document.createElement('div');
            codeModal.className = 'modal code-display-modal';
            codeModal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>📧 Verification Code</h2>
                        <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                    </div>
                    <div style="padding: 30px; text-align: center;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin: 20px 0;">
                            <h3 style="margin-bottom: 15px;">Your verification code:</h3>
                            <div style="font-size: 3rem; font-weight: bold; letter-spacing: 0.3em; margin: 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${code}</div>
                            <p style="margin: 0; opacity: 0.9;">Code expires in 10 minutes</p>
                        </div>
                        <p style="color: #666; margin: 20px 0;"><strong>Demo Mode:</strong> In a real application, this code would be sent to your email.</p>
                        <button class="btn-primary" onclick="this.closest('.modal').remove()" style="margin-top: 15px;">
                            <i class="fas fa-check"></i> Got it!
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(codeModal);
            codeModal.style.display = 'block';
        }, 500);
        
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 1000);
        });
    }

    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async register(formData) {
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const name = formData.get('name');

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('All fields are required');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        if (existingUsers.find(user => user.email === email)) {
            throw new Error('User with this email already exists');
        }

        // Generate verification code
        const verificationCode = this.generateVerificationCode();
        
        // Send verification email
        await this.sendVerificationEmail(email, verificationCode);

        // Store pending user
        const pendingUser = {
            name,
            email,
            password: this.hashPassword(password),
            verified: false,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(`pending_${email}`, JSON.stringify(pendingUser));
        
        return { email, verificationRequired: true };
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error('User not found');
        }

        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Invalid password');
        }

        if (!user.verified) {
            throw new Error('Please verify your email first');
        }

        const userData = {
            ...user,
            loginTime: new Date().toISOString()
        };

        this.setUser(userData);
        return userData;
    }

    verifyEmail(email, code) {
        const storedData = localStorage.getItem(`verification_${email}`);
        if (!storedData) {
            throw new Error('No verification code found');
        }

        const verificationData = JSON.parse(storedData);
        
        // Check if code expired (10 minutes)
        if (Date.now() - verificationData.timestamp > 600000) {
            throw new Error('Verification code expired');
        }

        // Check attempts
        if (verificationData.attempts >= 3) {
            throw new Error('Too many failed attempts');
        }

        if (verificationData.code !== code) {
            verificationData.attempts++;
            localStorage.setItem(`verification_${email}`, JSON.stringify(verificationData));
            throw new Error('Invalid verification code');
        }

        // Move user from pending to verified
        const pendingUser = JSON.parse(localStorage.getItem(`pending_${email}`));
        if (pendingUser) {
            pendingUser.verified = true;
            
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(pendingUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Clean up
            localStorage.removeItem(`pending_${email}`);
            localStorage.removeItem(`verification_${email}`);
            
            this.setUser(pendingUser);
            return true;
        }

        throw new Error('User data not found');
    }

    hashPassword(password) {
        // Simple hash (use proper hashing in production)
        return btoa(password + 'salt');
    }

    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    setUser(userData) {
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        this.showNotification('Successfully logged out', 'success');
    }

    checkAuthState() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    }

    updateUI() {
        const authContainer = document.querySelector('.nav-auth');
        if (!authContainer) return;

        if (this.currentUser) {
            const adminButton = this.currentUser.isAdmin ? 
                `<button class="dropdown-item" onclick="adminManager.showAdminPanel()">
                    <i class="fas fa-cog"></i> Admin Panel
                </button>` : '';
            
            authContainer.innerHTML = `
                <div class="user-menu">
                    <div class="user-avatar">
                        ${this.currentUser.picture ? 
                            `<img src="${this.currentUser.picture}" alt="Avatar">` : 
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <span class="user-name">Hi, ${this.currentUser.name}!</span>
                    <div class="user-dropdown">
                        <button class="dropdown-item" onclick="authManager.showProfile()">
                            <i class="fas fa-user"></i> My Profile
                        </button>
                        <button class="dropdown-item" onclick="authManager.showOrders()">
                            <i class="fas fa-shopping-bag"></i> Orders
                        </button>
                        ${adminButton}
                        <button class="dropdown-item" onclick="authManager.logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <button class="btn-secondary" onclick="authManager.showLogin()">Login</button>
                <button class="btn-primary" onclick="authManager.showSignup()">Sign Up</button>
            `;
        }
    }

    showLogin() {
        this.createAuthModal('login');
    }

    showSignup() {
        this.createAuthModal('signup');
    }

    createAuthModal(type) {
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'modal auth-modal';
        modal.innerHTML = type === 'login' ? this.getLoginHTML() : this.getSignupHTML();
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        this.bindAuthEvents(modal, type);
    }

    getLoginHTML() {
        return `
            <div class="modal-content auth-modal-content">
                <div class="modal-header">
                    <h2>Welcome Back</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <form class="auth-form" id="loginForm">
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn-primary auth-submit">
                        <span>Sign In</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    
                    <div class="auth-divider"><span>or</span></div>
                    
                    <div class="social-auth-buttons">
                        <button type="button" class="btn-social-auth google" id="googleSignIn">
                            <i class="fab fa-google"></i>
                            Google
                        </button>
                        <button type="button" class="btn-social-auth facebook" id="facebookSignIn">
                            <i class="fab fa-facebook-f"></i>
                            Facebook
                        </button>
                        <button type="button" class="btn-social-auth github" id="githubSignIn">
                            <i class="fab fa-github"></i>
                            GitHub
                        </button>
                        <button type="button" class="btn-social-auth instagram" id="instagramSignIn">
                            <i class="fab fa-instagram"></i>
                            Instagram
                        </button>
                    </div>
                    
                    <p class="auth-switch">
                        Don't have an account? 
                        <a href="#" onclick="authManager.showSignup(); this.closest('.modal').remove()">Sign up</a>
                    </p>
                </form>
            </div>
        `;
    }

    getSignupHTML() {
        return `
            <div class="modal-content auth-modal-content">
                <div class="modal-header">
                    <h2>Create Account</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <form class="auth-form" id="signupForm">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Full Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" placeholder="Password (min 8 characters)" required>
                    </div>
                    <div class="form-group">
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
                    </div>
                    <button type="submit" class="btn-primary auth-submit">
                        <span>Create Account</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    
                    <div class="auth-divider"><span>or</span></div>
                    
                    <div class="social-auth-buttons">
                        <button type="button" class="btn-social-auth google" id="googleSignIn">
                            <i class="fab fa-google"></i>
                            Google
                        </button>
                        <button type="button" class="btn-social-auth facebook" id="facebookSignIn">
                            <i class="fab fa-facebook-f"></i>
                            Facebook
                        </button>
                        <button type="button" class="btn-social-auth github" id="githubSignIn">
                            <i class="fab fa-github"></i>
                            GitHub
                        </button>
                        <button type="button" class="btn-social-auth instagram" id="instagramSignIn">
                            <i class="fab fa-instagram"></i>
                            Instagram
                        </button>
                    </div>
                    
                    <p class="auth-switch">
                        Already have an account? 
                        <a href="#" onclick="authManager.showLogin(); this.closest('.modal').remove()">Sign in</a>
                    </p>
                </form>
            </div>
        `;
    }

    bindAuthEvents(modal, type) {
        const form = modal.querySelector('.auth-form');
        const googleBtn = modal.querySelector('#googleSignIn');
        const facebookBtn = modal.querySelector('#facebookSignIn');
        const githubBtn = modal.querySelector('#githubSignIn');
        const instagramBtn = modal.querySelector('#instagramSignIn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const submitBtn = form.querySelector('.auth-submit');
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            try {
                if (type === 'login') {
                    await this.login(formData.get('email'), formData.get('password'));
                    modal.remove();
                    this.showNotification('Successfully logged in!', 'success');
                } else {
                    const result = await this.register(formData);
                    if (result.verificationRequired) {
                        modal.remove();
                        this.showVerificationModal(result.email);
                    }
                }
            } catch (error) {
                this.showNotification(error.message, 'error');
                submitBtn.innerHTML = type === 'login' ? 
                    '<span>Sign In</span><i class="fas fa-arrow-right"></i>' :
                    '<span>Create Account</span><i class="fas fa-arrow-right"></i>';
                submitBtn.disabled = false;
            }
        });

        // Social auth buttons
        googleBtn?.addEventListener('click', () => this.handleSocialLogin('google'));
        facebookBtn?.addEventListener('click', () => this.handleSocialLogin('facebook'));
        githubBtn?.addEventListener('click', () => this.handleSocialLogin('github'));
        instagramBtn?.addEventListener('click', () => this.handleSocialLogin('instagram'));
    }

    handleSocialLogin(provider) {
        const email = prompt(`Enter email for ${provider} demo login:`);
        
        // Validate email input
        if (!email || email.trim() === '') {
            this.showNotification('Email is required for login', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        const userData = {
            id: `${provider}_` + Date.now(),
            name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
            email: email.trim(),
            picture: `https://via.placeholder.com/40?text=${provider.charAt(0).toUpperCase()}`,
            provider: provider,
            verified: true,
            isAdmin: email.trim() === 'aribdaniyal88@gmail.com',
            loginTime: new Date().toISOString()
        };
        
        this.setUser(userData);
        this.closeModals();
        this.showNotification(`Successfully signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`, 'success');
    }

    showVerificationModal(email) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content verification-modal">
                <div class="modal-header">
                    <h2>Verify Your Email</h2>
                </div>
                <div class="verification-content">
                    <p>We've sent a 6-digit code to <strong>${email}</strong></p>
                    <form id="verificationForm">
                        <div class="code-inputs">
                            <input type="text" maxlength="1" class="code-input">
                            <input type="text" maxlength="1" class="code-input">
                            <input type="text" maxlength="1" class="code-input">
                            <input type="text" maxlength="1" class="code-input">
                            <input type="text" maxlength="1" class="code-input">
                            <input type="text" maxlength="1" class="code-input">
                        </div>
                        <button type="submit" class="btn-primary">Verify Email</button>
                    </form>
                    <p class="resend-text">
                        Didn't receive the code? 
                        <a href="#" onclick="authManager.resendCode('${email}')">Resend</a>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        this.bindVerificationEvents(modal, email);
    }

    bindVerificationEvents(modal, email) {
        const inputs = modal.querySelectorAll('.code-input');
        const form = modal.querySelector('#verificationForm');
        
        // Auto-focus next input
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = Array.from(inputs).map(input => input.value).join('');
            
            if (code.length !== 6) {
                this.showNotification('Please enter the complete 6-digit code', 'error');
                return;
            }
            
            try {
                await this.verifyEmail(email, code);
                modal.remove();
                this.showNotification('Email verified successfully! Welcome!', 'success');
            } catch (error) {
                this.showNotification(error.message, 'error');
                inputs.forEach(input => input.value = '');
                inputs[0].focus();
            }
        });
    }

    async resendCode(email) {
        const code = this.generateVerificationCode();
        await this.sendVerificationEmail(email, code);
        this.showNotification('Verification code resent!', 'success');
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => modal.remove());
    }

    simulateGoogleLogin() {
        try {
            const email = prompt('Enter email for demo login:');
            
            // Validate email input
            if (!email || email.trim() === '') {
                this.showNotification('Email is required for Google login', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                this.showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            const userData = {
                id: 'google_' + Date.now(),
                name: email.trim() === 'aribdaniyal88@gmail.com' ? 'Admin User' : 'Demo User',
                email: email.trim(),
                picture: 'https://via.placeholder.com/40',
                provider: 'google',
                verified: true,
                isAdmin: email.trim() === 'aribdaniyal88@gmail.com',
                loginTime: new Date().toISOString()
            };
            
            this.setUser(userData);
            this.closeModals();
            this.showNotification('Successfully signed in with Google!', 'success');
        } catch (error) {
            console.error('Google login error:', error);
            this.showNotification('Google login failed. Please try again.', 'error');
        }
    }

    showNotification(message, type) {
        if (window.cartManager) {
            cartManager.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    showProfile() {
        if (!this.currentUser) {
            this.showNotification('Please login first', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content profile-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-user"></i> My Profile</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="profile-content">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            ${this.currentUser.picture ? 
                                `<img src="${this.currentUser.picture}" alt="Profile Picture">` : 
                                `<div class="avatar-placeholder"><i class="fas fa-user"></i></div>`
                            }
                        </div>
                        <div class="profile-info">
                            <h3>${this.currentUser.name}</h3>
                            <p class="profile-email">${this.currentUser.email}</p>
                            <span class="profile-badge ${this.currentUser.isAdmin ? 'admin' : 'user'}">
                                ${this.currentUser.isAdmin ? 'Admin' : 'Member'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="profile-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <div>
                                <strong>Member Since</strong>
                                <p>${new Date(this.currentUser.loginTime).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-shield-alt"></i>
                            <div>
                                <strong>Account Status</strong>
                                <p>${this.currentUser.verified ? 'Verified' : 'Unverified'}</p>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-sign-in-alt"></i>
                            <div>
                                <strong>Login Method</strong>
                                <p>${this.currentUser.provider === 'google' ? 'Google OAuth' : 'Email & Password'}</p>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-shopping-bag"></i>
                            <div>
                                <strong>Total Orders</strong>
                                <p>${this.getUserOrderCount()} orders</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button class="btn-primary" onclick="authManager.editProfile()">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                        <button class="btn-secondary" onclick="authManager.showOrders()">
                            <i class="fas fa-history"></i> Order History
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    getUserOrderCount() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        return orders.filter(order => 
            order.customerInfo && order.customerInfo.email === this.currentUser.email
        ).length;
    }

    editProfile() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Profile</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <form class="profile-edit-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value="${this.currentUser.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="${this.currentUser.email}" disabled>
                        <small>Email cannot be changed</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Profile Picture URL</label>
                        <input type="url" name="picture" value="${this.currentUser.picture || ''}" placeholder="https://example.com/photo.jpg">
                    </div>
                    
                    <button type="submit" class="btn-primary">Save Changes</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        modal.querySelector('.profile-edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            this.currentUser.name = formData.get('name');
            if (formData.get('picture')) {
                this.currentUser.picture = formData.get('picture');
            }
            
            this.setUser(this.currentUser);
            modal.remove();
            this.showNotification('Profile updated successfully!', 'success');
        });
    }

    showOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const userOrders = orders.filter(order => 
            order.customerInfo && order.customerInfo.email === this.currentUser.email
        );
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content orders-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-history"></i> Order History</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="orders-content">
                    ${userOrders.length === 0 ? 
                        '<p class="empty-state">No orders yet. Start shopping!</p>' :
                        userOrders.map(order => `
                            <div class="order-item">
                                <div class="order-header">
                                    <h4>Order #${order.id}</h4>
                                    <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div class="order-details">
                                    <p><strong>Items:</strong> ${order.items.length}</p>
                                    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                                    <p><strong>Status:</strong> ${order.status}</p>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    bindEvents() {
        // Handle auth buttons with multiple selectors
        document.addEventListener('click', (e) => {
            if (e.target.id === 'loginBtn' || e.target.textContent === 'Login') {
                e.preventDefault();
                this.showLogin();
            }
            if (e.target.id === 'signupBtn' || e.target.textContent === 'Sign Up') {
                e.preventDefault();
                this.showSignup();
            }
        });
        
        // Backup event listeners
        setTimeout(() => {
            const loginBtns = document.querySelectorAll('[onclick*="showLogin"], #loginBtn');
            const signupBtns = document.querySelectorAll('[onclick*="showSignup"], #signupBtn');
            
            loginBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showLogin();
                });
            });
            
            signupBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showSignup();
                });
            });
        }, 1000);
    }
}

// Initialize auth manager
const authManager = new AuthManager();
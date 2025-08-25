// Authentication Gate - Require login before accessing website
class AuthGate {
    constructor() {
        this.init();
    }

    init() {
        // Temporarily disable auth gate for testing
        // Check if user is logged in
        const currentUser = localStorage.getItem('currentUser');
        
        // if (!currentUser) {
        //     this.showAuthGate();
        // } else {
            this.hideAuthGate();
        // }
    }

    showAuthGate() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'authGate';
        overlay.innerHTML = `
            <div class="auth-gate-overlay">
                <div class="auth-gate-content">
                    <div class="gate-logo">
                        <i class="fas fa-heart"></i>
                        <h1>CrochetCraft</h1>
                    </div>
                    <h2>Welcome to CrochetCraft!</h2>
                    <p>Please sign in or create an account to access our beautiful crochet patterns</p>
                    
                    <div class="gate-buttons">
                        <button class="btn-primary gate-login" id="gateLoginBtn">
                            <i class="fas fa-sign-in-alt"></i>
                            Sign In
                        </button>
                        <button class="btn-secondary gate-signup" id="gateSignupBtn">
                            <i class="fas fa-user-plus"></i>
                            Create Account
                        </button>
                    </div>
                    
                    <div class="gate-features">
                        <div class="feature">
                            <i class="fas fa-download"></i>
                            <span>Instant Downloads</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-star"></i>
                            <span>Premium Patterns</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-support"></i>
                            <span>Lifetime Support</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const styles = `
            #authGate {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
                background-size: 400% 400%;
                animation: gradientShift 15s ease infinite;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .auth-gate-overlay {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 60px 40px;
                text-align: center;
                max-width: 500px;
                margin: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                border: 1px solid rgba(255,255,255,0.3);
            }

            .gate-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-bottom: 30px;
            }

            .gate-logo i {
                font-size: 2.5rem;
                color: #ff6b9d;
                animation: heartbeat 2s infinite;
            }

            .gate-logo h1 {
                font-size: 2.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, #ff6b9d, #4ecdc4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0;
            }

            .auth-gate-content h2 {
                color: #2c3e50;
                margin-bottom: 15px;
                font-size: 1.8rem;
            }

            .auth-gate-content p {
                color: #7f8c8d;
                margin-bottom: 40px;
                font-size: 1.1rem;
                line-height: 1.6;
            }

            .gate-buttons {
                display: flex;
                gap: 20px;
                margin-bottom: 40px;
                flex-wrap: wrap;
            }

            .gate-buttons button {
                flex: 1;
                min-width: 180px;
                padding: 16px 24px;
                font-size: 1.1rem;
            }

            .gate-features {
                display: flex;
                justify-content: space-around;
                gap: 20px;
                flex-wrap: wrap;
            }

            .feature {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                color: #7f8c8d;
            }

            .feature i {
                font-size: 1.5rem;
                color: #4ecdc4;
            }

            .feature span {
                font-size: 0.9rem;
                font-weight: 500;
            }

            @media (max-width: 600px) {
                .auth-gate-overlay {
                    padding: 40px 20px;
                }
                
                .gate-buttons {
                    flex-direction: column;
                }
                
                .gate-features {
                    flex-direction: column;
                    gap: 15px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        // Add event listeners
        setTimeout(() => {
            const loginBtn = document.getElementById('gateLoginBtn');
            const signupBtn = document.getElementById('gateSignupBtn');
            
            if (loginBtn) {
                loginBtn.addEventListener('click', () => this.openLogin());
            }
            
            if (signupBtn) {
                signupBtn.addEventListener('click', () => this.openSignup());
            }
        }, 100);
    }

    hideAuthGate() {
        const gate = document.getElementById('authGate');
        if (gate) {
            gate.remove();
            document.body.style.overflow = 'auto';
        }
    }

    openLogin() {
        if (window.authManager) {
            authManager.showLogin();
        }
    }

    openSignup() {
        if (window.authManager) {
            authManager.showSignup();
        }
    }
}

// Initialize auth gate
const authGate = new AuthGate();

// Listen for successful login
document.addEventListener('userLoggedIn', () => {
    authGate.hideAuthGate();
});

// Update auth manager when it loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.authManager) {
            const originalSetUser = authManager.setUser;
            authManager.setUser = function(userData) {
                originalSetUser.call(this, userData);
                document.dispatchEvent(new CustomEvent('userLoggedIn'));
                if (window.authGate) {
                    authGate.hideAuthGate();
                }
            };
        }
    }, 500);
});
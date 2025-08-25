// Initialization Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CrochetCraft website initializing...');
    
    // Wait for all managers to be available
    setTimeout(() => {
        // Initialize cart display
        if (window.cartManager) {
            cartManager.updateCartDisplay();
            console.log('✅ Cart Manager initialized');
        }
        
        // Initialize auth state
        if (window.authManager) {
            authManager.checkAuthState();
            console.log('✅ Auth Manager initialized');
        }
        
        // Initialize purchase system
        if (window.purchaseManager) {
            console.log('✅ Purchase Manager initialized');
        }
        
        // Add click handlers for auth buttons
        const loginBtns = document.querySelectorAll('#loginBtn, [onclick*="login"]');
        const signupBtns = document.querySelectorAll('#signupBtn, [onclick*="signup"]');
        
        loginBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.authManager) {
                    authManager.showLogin();
                }
            });
        });
        
        signupBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.authManager) {
                    authManager.showSignup();
                }
            });
        });
        
        console.log('🎉 All systems initialized successfully!');
        
    }, 100);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('❌ Error:', e.error);
    if (window.cartManager) {
        cartManager.showNotification('An error occurred. Please try again.', 'error');
    }
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
    if (window.cartManager) {
        cartManager.showNotification('Something went wrong. Please try again.', 'error');
    }
});
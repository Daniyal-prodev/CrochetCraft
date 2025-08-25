// Session Management for Data Persistence
class SessionManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupStorageSync();
        this.handlePageLoad();
    }

    // Sync data across tabs/windows
    setupStorageSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentUser') {
                if (window.authManager) {
                    authManager.checkAuthState();
                }
            }
            if (e.key && e.key.startsWith('cart_')) {
                if (window.cartManager) {
                    cartManager.loadCart();
                    cartManager.updateCartDisplay();
                }
            }
        });
    }

    // Handle page load/refresh
    handlePageLoad() {
        window.addEventListener('load', () => {
            this.restoreUserSession();
            this.restoreCartData();
            this.restoreAdminProducts();
        });
    }

    restoreUserSession() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser && window.authManager) {
            authManager.currentUser = JSON.parse(currentUser);
            authManager.updateUI();
        }
    }

    restoreCartData() {
        if (window.cartManager) {
            cartManager.loadCart();
            cartManager.updateCartDisplay();
        }
    }

    restoreAdminProducts() {
        if (window.adminManager) {
            adminManager.products = adminManager.loadProducts();
        }
        // Refresh patterns display if function exists
        if (typeof refreshPatterns === 'function') {
            refreshPatterns();
        }
    }

    // Backup data to prevent loss
    backupData() {
        const backup = {
            users: localStorage.getItem('users'),
            currentUser: localStorage.getItem('currentUser'),
            adminProducts: localStorage.getItem('adminProducts'),
            orders: localStorage.getItem('orders'),
            timestamp: new Date().toISOString()
        };
        
        // Store backup with timestamp
        localStorage.setItem('dataBackup', JSON.stringify(backup));
    }

    // Restore from backup if needed
    restoreFromBackup() {
        const backup = localStorage.getItem('dataBackup');
        if (backup) {
            const data = JSON.parse(backup);
            
            if (data.users) localStorage.setItem('users', data.users);
            if (data.currentUser) localStorage.setItem('currentUser', data.currentUser);
            if (data.adminProducts) localStorage.setItem('adminProducts', data.adminProducts);
            if (data.orders) localStorage.setItem('orders', data.orders);
            
            return true;
        }
        return false;
    }

    // Clear all data (for testing)
    clearAllData() {
        const keys = ['users', 'currentUser', 'adminProducts', 'orders'];
        keys.forEach(key => localStorage.removeItem(key));
        
        // Clear user-specific carts
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cart_')) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Initialize session manager
const sessionManager = new SessionManager();

// Auto-backup every 5 minutes
setInterval(() => {
    sessionManager.backupData();
}, 5 * 60 * 1000);
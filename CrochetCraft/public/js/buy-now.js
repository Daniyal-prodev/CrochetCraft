// Buy Now functionality
function buyNow(patternId) {
    if (!window.authManager || !authManager.currentUser) {
        if (window.authManager) {
            authManager.showLogin();
        }
        return;
    }
    
    const pattern = (typeof getAllPatterns === 'function' ? getAllPatterns() : []).find(p => p.id === patternId) || 
                   (window.adminManager ? adminManager.getAllPatternsForDisplay() : []).find(p => p.id === patternId);
    
    if (!pattern) return;
    
    if (window.cartManager) {
        cartManager.addItem(pattern);
        cartManager.proceedToCheckout();
    }
}
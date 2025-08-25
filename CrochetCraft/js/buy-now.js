// Buy Now functionality
function buyNow(patternId) {
    if (!authManager.currentUser) {
        authManager.showLogin();
        return;
    }
    
    const pattern = getAllPatterns().find(p => p.id === patternId);
    if (!pattern) return;
    
    cartManager.addItem(pattern);
    cartManager.proceedToCheckout();
}
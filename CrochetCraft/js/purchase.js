// Purchase and Download System
class PurchaseManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Handle buy now buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-buy-now')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBuyNow(e.target.closest('.btn-buy-now'));
            }
        });
    }

    handleBuyNow(button) {
        try {
            const productCard = button.closest('.pattern-item');
            if (!productCard) {
                throw new Error('Product not found');
            }
            
            const product = this.extractProductData(productCard);
            
            if (!window.authManager || !authManager.currentUser) {
                if (window.authManager) {
                    authManager.showLogin();
                } else {
                    alert('Please login to purchase');
                }
                return;
            }
            
            this.createBuyNowModal(product);
        } catch (error) {
            if (window.cartManager) {
                cartManager.showNotification(error.message, 'error');
            } else {
                alert(error.message);
            }
        }
    }

    extractProductData(productCard) {
        const title = productCard.querySelector('h3')?.textContent;
        const priceText = productCard.querySelector('.pattern-price')?.textContent;
        const difficulty = productCard.querySelector('.pattern-difficulty')?.textContent;
        const stars = productCard.querySelectorAll('.fas.fa-star');
        
        if (!title || !priceText) {
            throw new Error('Product information not found');
        }
        
        return {
            id: Date.now() + Math.random(),
            title: title,
            price: parseFloat(priceText.replace('$', '')),
            difficulty: difficulty || 'Unknown',
            rating: stars ? stars.length : 0
        };
    }

    createBuyNowModal(product) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content buy-now-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-shopping-bag"></i> Quick Purchase</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="buy-now-content">
                    <div class="product-preview">
                        <div class="product-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
                        <div class="product-info">
                            <h3>${product.title}</h3>
                            <p class="difficulty">Difficulty: ${product.difficulty}</p>
                            <div class="rating">
                                ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
                                ${'<i class="far fa-star"></i>'.repeat(5 - product.rating)}
                            </div>
                            <div class="price">$${product.price}</div>
                        </div>
                    </div>
                    
                    <div class="purchase-options">
                        <h4>What's Included:</h4>
                        <ul class="included-items">
                            <li><i class="fas fa-file-pdf"></i> PDF Pattern with detailed instructions</li>
                            <li><i class="fas fa-images"></i> Step-by-step photo guide</li>
                            <li><i class="fas fa-list"></i> Materials list and yarn requirements</li>
                            <li><i class="fas fa-video"></i> Video tutorial access</li>
                            <li><i class="fas fa-headset"></i> Lifetime support</li>
                        </ul>
                        
                        <div class="instant-download">
                            <i class="fas fa-download"></i>
                            <span>Instant download after purchase</span>
                        </div>
                        
                        <div class="purchase-actions">
                            <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                                Cancel
                            </button>
                            <button class="btn-primary" onclick="purchaseManager.processPurchase(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                                <i class="fas fa-credit-card"></i>
                                Buy Now - $${product.price}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    processPurchase(product) {
        const modal = document.querySelector('.buy-now-modal').closest('.modal');
        const buyBtn = modal.querySelector('.btn-primary');
        
        buyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        buyBtn.disabled = true;
        
        // Simulate payment processing
        setTimeout(() => {
            this.completePurchase(product);
            modal.remove();
        }, 2000);
    }

    completePurchase(product) {
        // Create purchase record
        const purchase = {
            id: Date.now(),
            product: product,
            user: authManager.currentUser.email,
            purchaseDate: new Date().toISOString(),
            downloadCount: 0,
            status: 'completed'
        };
        
        // Save to localStorage
        let purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        purchases.push(purchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        // Show success and trigger download
        this.showPurchaseSuccess(purchase);
        this.triggerDownload(product);
    }

    showPurchaseSuccess(purchase) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content success-modal">
                <div class="success-content">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Purchase Successful!</h2>
                    <p>Thank you for your purchase! Your pattern is ready for download.</p>
                    
                    <div class="download-section">
                        <h4>${purchase.product.title}</h4>
                        <div class="download-buttons">
                            <button class="btn-primary" onclick="purchaseManager.downloadPattern('${purchase.id}')">
                                <i class="fas fa-download"></i>
                                Download PDF
                            </button>
                            <button class="btn-secondary" onclick="purchaseManager.downloadVideo('${purchase.id}')">
                                <i class="fas fa-video"></i>
                                Watch Tutorial
                            </button>
                        </div>
                    </div>
                    
                    <div class="purchase-details">
                        <p><strong>Purchase ID:</strong> #${purchase.id}</p>
                        <p><strong>Download expires:</strong> Never (Lifetime access)</p>
                    </div>
                    
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Auto-close after 15 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 15000);
    }

    triggerDownload(product) {
        // Create a sample PDF content
        const pdfContent = this.generateSamplePDF(product);
        
        // Create download link
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${product.title.replace(/\s+/g, '_')}_Pattern.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Update download count
        this.updateDownloadCount(product.id);
    }

    generateSamplePDF(product) {
        // This is a simple text representation of a PDF
        // In a real application, you would use a PDF library like jsPDF
        return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(${product.title} - Crochet Pattern) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF
        `;
    }

    downloadPattern(purchaseId) {
        const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        const purchase = purchases.find(p => p.id == purchaseId);
        
        if (purchase) {
            this.triggerDownload(purchase.product);
            cartManager.showNotification('Pattern downloaded successfully!', 'success');
        }
    }

    downloadVideo(purchaseId) {
        // Simulate video tutorial access
        cartManager.showNotification('Video tutorial opened in new tab!', 'success');
        
        // In a real app, this would open the actual video
        setTimeout(() => {
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        }, 1000);
    }

    updateDownloadCount(productId) {
        let purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        const purchase = purchases.find(p => p.product.id === productId);
        
        if (purchase) {
            purchase.downloadCount = (purchase.downloadCount || 0) + 1;
            localStorage.setItem('purchases', JSON.stringify(purchases));
        }
    }

    getUserPurchases() {
        if (!authManager.currentUser) return [];
        
        const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        return purchases.filter(p => p.user === authManager.currentUser.email);
    }

    showUserLibrary() {
        const purchases = this.getUserPurchases();
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content library-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-book"></i> My Pattern Library</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="library-content">
                    ${purchases.length === 0 ? `
                        <div class="empty-library">
                            <i class="fas fa-book-open"></i>
                            <h3>No patterns yet</h3>
                            <p>Purchase some beautiful patterns to build your library!</p>
                            <button class="btn-primary" onclick="this.closest('.modal').remove()">
                                Browse Patterns
                            </button>
                        </div>
                    ` : `
                        <div class="library-grid">
                            ${purchases.map(purchase => `
                                <div class="library-item">
                                    <div class="item-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
                                    <div class="item-details">
                                        <h4>${purchase.product.title}</h4>
                                        <p>Purchased: ${new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                                        <p>Downloads: ${purchase.downloadCount || 0}</p>
                                    </div>
                                    <div class="item-actions">
                                        <button class="btn-primary" onclick="purchaseManager.downloadPattern('${purchase.id}')">
                                            <i class="fas fa-download"></i>
                                            Download
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }
}

// Initialize purchase manager
const purchaseManager = new PurchaseManager();
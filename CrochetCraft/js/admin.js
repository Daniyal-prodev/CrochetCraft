// Admin Management System
class AdminManager {
    constructor() {
        this.products = this.loadProducts();
    }

    loadProducts() {
        return JSON.parse(localStorage.getItem('adminProducts')) || [];
    }

    saveProducts() {
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
    }

    showAdminPanel() {
        if (!authManager.currentUser || !authManager.currentUser.isAdmin) {
            cartManager.showNotification('Access denied. Admin only.', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content admin-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-cog"></i> Admin Panel</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="admin-content">
                    <div class="admin-tabs">
                        <button class="tab-btn active" onclick="adminManager.showTab('products')">Products</button>
                        <button class="tab-btn" onclick="adminManager.showTab('orders')">Orders</button>
                        <button class="tab-btn" onclick="adminManager.showTab('users')">Users</button>
                    </div>
                    
                    <div class="tab-content" id="products-tab">
                        <div class="admin-header">
                            <h3>Manage Products</h3>
                            <button class="btn-primary" onclick="adminManager.showAddProduct()">
                                <i class="fas fa-plus"></i> Add Product
                            </button>
                        </div>
                        <div class="products-list">
                            ${this.renderProductsList()}
                        </div>
                    </div>
                    
                    <div class="tab-content" id="orders-tab" style="display: none;">
                        <h3>Recent Orders</h3>
                        <div class="orders-list">
                            ${this.renderOrdersList()}
                        </div>
                    </div>
                    
                    <div class="tab-content" id="users-tab" style="display: none;">
                        <h3>User Statistics</h3>
                        <div class="users-stats">
                            ${this.renderUserStats()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    showTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
        
        event.target.classList.add('active');
        document.getElementById(`${tabName}-tab`).style.display = 'block';
    }

    removeImage() {
        const preview = document.getElementById('imagePreview');
        const placeholder = document.querySelector('.upload-placeholder');
        const input = document.getElementById('imageInput');
        
        preview.style.display = 'none';
        placeholder.style.display = 'block';
        input.value = '';
    }

    showAddProduct() {
        createEnhancedAddProductModal();
        return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New Product</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <form class="admin-form" id="addProductForm">
                    <div class="form-group">
                        <label>Product Title</label>
                        <input type="text" name="title" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Price ($)</label>
                            <input type="number" name="price" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select name="category" required>
                                <option value="">Select Category</option>
                                <option value="amigurumi">Amigurumi</option>
                                <option value="blankets">Blankets</option>
                                <option value="accessories">Accessories</option>
                                <option value="home-decor">Home Decor</option>
                                <option value="clothing">Clothing</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Difficulty</label>
                            <select name="difficulty" required>
                                <option value="">Select Difficulty</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Rating (1-5)</label>
                            <input type="number" name="rating" min="1" max="5" value="5" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description" rows="3" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Product Image</label>
                        <input type="file" name="image" accept="image/*">
                        <small>Optional: Upload product image</small>
                    </div>
                    
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        document.getElementById('addProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct(new FormData(e.target));
            modal.remove();
        });
    }

    addProduct(formData) {
        const product = {
            id: Date.now(),
            title: formData.get('title'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            difficulty: formData.get('difficulty'),
            rating: parseInt(formData.get('rating')),
            description: formData.get('description'),
            reviews: Math.floor(Math.random() * 200) + 10,
            createdAt: new Date().toISOString(),
            createdBy: authManager.currentUser.email
        };

        // Handle image upload
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                product.image = e.target.result;
                this.saveProduct(product);
            };
            reader.readAsDataURL(imageFile);
        } else {
            this.saveProduct(product);
        }
    }

    saveProduct(product) {
        this.products.push(product);
        this.saveProducts();
        cartManager.showNotification('Product added successfully!', 'success');
        
        // Refresh admin panel if open
        const adminModal = document.querySelector('.admin-modal');
        if (adminModal) {
            const productsList = adminModal.querySelector('.products-list');
            if (productsList) {
                productsList.innerHTML = this.renderProductsList();
            }
        }
        
        // Refresh main patterns display if function exists
        if (typeof refreshPatterns === 'function') {
            refreshPatterns();
        }
    }

    renderProductsList() {
        if (this.products.length === 0) {
            return '<p class="empty-state">No products added yet.</p>';
        }

        return this.products.map(product => `
            <div class="admin-product-item">
                <div class="product-info">
                    <h4>${product.title}</h4>
                    <p>Category: ${product.category} | Difficulty: ${product.difficulty}</p>
                    <p>Price: $${product.price} | Rating: ${product.rating}/5</p>
                    <small>Added: ${new Date(product.createdAt).toLocaleDateString()}</small>
                </div>
                <div class="product-actions">
                    <button class="btn-secondary" onclick="adminManager.editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger" onclick="adminManager.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderOrdersList() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        if (orders.length === 0) {
            return '<p class="empty-state">No orders yet.</p>';
        }

        return orders.slice(-10).reverse().map(order => `
            <div class="admin-order-item">
                <div class="order-info">
                    <h4>Order #${order.id}</h4>
                    <p>Customer: ${order.customerInfo?.email || 'N/A'}</p>
                    <p>Total: $${order.total?.toFixed(2) || '0.00'}</p>
                    <p>Items: ${order.items?.length || 0}</p>
                    <small>${new Date(order.date).toLocaleString()}</small>
                </div>
                <div class="order-status">
                    <span class="status-badge ${order.status}">${order.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderUserStats() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Total Users</h4>
                    <div class="stat-number">${users.length}</div>
                </div>
                <div class="stat-card">
                    <h4>Total Orders</h4>
                    <div class="stat-number">${orders.length}</div>
                </div>
                <div class="stat-card">
                    <h4>Total Revenue</h4>
                    <div class="stat-number">$${totalRevenue.toFixed(2)}</div>
                </div>
                <div class="stat-card">
                    <h4>Products</h4>
                    <div class="stat-number">${this.products.length}</div>
                </div>
            </div>
        `;
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveProducts();
            cartManager.showNotification('Product deleted successfully!', 'success');
            
            // Refresh products list
            const productsList = document.querySelector('.products-list');
            if (productsList) {
                productsList.innerHTML = this.renderProductsList();
            }
            
            // Refresh main patterns display if function exists
            if (typeof refreshPatterns === 'function') {
                refreshPatterns();
            }
        }
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Simple edit - just change price for now
        const newPrice = prompt('Enter new price:', product.price);
        if (newPrice && !isNaN(newPrice)) {
            product.price = parseFloat(newPrice);
            product.lastUpdated = new Date().toISOString();
            this.saveProducts();
            cartManager.showNotification('Product updated successfully!', 'success');
            
            // Refresh products list
            const productsList = document.querySelector('.products-list');
            if (productsList) {
                productsList.innerHTML = this.renderProductsList();
            }
            
            // Refresh main patterns display if function exists
            if (typeof refreshPatterns === 'function') {
                refreshPatterns();
            }
        }
    }

    // Get products for public display
    getPublicProducts() {
        return this.products;
    }
}

// Initialize admin manager
const adminManager = new AdminManager();
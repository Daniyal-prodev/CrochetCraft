// Enhanced Admin UI
function createEnhancedAddProductModal() {
    const modal = document.createElement('div');
    modal.className = 'modal add-product-modal';
    modal.innerHTML = `
        <div class="modal-content add-product-content">
            <div class="modal-header">
                <h2><i class="fas fa-plus-circle"></i> Add New Product</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <form class="product-form" id="addProductForm">
                <div class="form-section">
                    <h3><i class="fas fa-info-circle"></i> Basic Information</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><i class="fas fa-tag"></i> Product Title</label>
                            <input type="text" name="title" placeholder="Enter product name" required>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-dollar-sign"></i> Price</label>
                            <input type="number" name="price" step="0.01" placeholder="0.00" required>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-cogs"></i> Product Details</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label><i class="fas fa-list"></i> Category</label>
                            <select name="category" required>
                                <option value="">Choose Category</option>
                                <option value="amigurumi">🧸 Amigurumi</option>
                                <option value="blankets">🛏️ Blankets</option>
                                <option value="accessories">👜 Accessories</option>
                                <option value="home-decor">🏠 Home Decor</option>
                                <option value="clothing">👕 Clothing</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-chart-line"></i> Difficulty</label>
                            <select name="difficulty" required>
                                <option value="">Select Level</option>
                                <option value="beginner">🟢 Beginner</option>
                                <option value="intermediate">🟡 Intermediate</option>
                                <option value="advanced">🔴 Advanced</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-star"></i> Rating</label>
                            <div class="rating-input">
                                <input type="range" name="rating" min="1" max="5" value="5" oninput="this.nextElementSibling.textContent = this.value + ' stars'">
                                <span class="rating-display">5 stars</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-align-left"></i> Description</h3>
                    <div class="form-group">
                        <textarea name="description" rows="4" placeholder="Describe your pattern..." required></textarea>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-image"></i> Product Image</h3>
                    <div class="image-upload-area" id="imageUploadArea">
                        <div class="upload-placeholder">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop image here or click to browse</p>
                            <small>Supports: JPG, PNG, GIF (Max 5MB)</small>
                        </div>
                        <input type="file" name="image" id="imageInput" accept="image/*" hidden>
                        <div class="image-preview" id="imagePreview" style="display: none;">
                            <img id="previewImg" src="" alt="Preview">
                            <button type="button" class="remove-image" onclick="removeImagePreview()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="submit" class="btn-primary btn-add-product">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    setupImageUpload();
    setupFormSubmission();
}

function setupImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const input = document.getElementById('imageInput');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const placeholder = document.querySelector('.upload-placeholder');

    // Click to upload
    uploadArea.addEventListener('click', () => {
        if (!preview.style.display || preview.style.display === 'none') {
            input.click();
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });

    // File input change
    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
        }
    });

    function handleImageFile(file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            placeholder.style.display = 'none';
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeImagePreview() {
    const preview = document.getElementById('imagePreview');
    const placeholder = document.querySelector('.upload-placeholder');
    const input = document.getElementById('imageInput');
    
    preview.style.display = 'none';
    placeholder.style.display = 'block';
    input.value = '';
}

function setupFormSubmission() {
    document.getElementById('addProductForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const submitBtn = e.target.querySelector('.btn-add-product');
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            adminManager.addProduct(formData);
            e.target.closest('.modal').remove();
        }, 1000);
    });
}
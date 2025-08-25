// Sample pattern data
const samplePatterns = [
    {
        id: 1,
        title: "Cozy Winter Blanket",
        category: "blankets",
        difficulty: "intermediate",
        price: 12.99,
        rating: 5,
        reviews: 124,
        image: "blanket1.jpg",
        description: "A beautiful textured blanket perfect for cold winter nights."
    },
    {
        id: 2,
        title: "Cute Amigurumi Bear",
        category: "amigurumi",
        difficulty: "beginner",
        price: 8.99,
        rating: 4,
        reviews: 89,
        image: "bear1.jpg",
        description: "An adorable teddy bear that's perfect for beginners."
    },
    {
        id: 3,
        title: "Elegant Lace Shawl",
        category: "accessories",
        difficulty: "advanced",
        price: 15.99,
        rating: 5,
        reviews: 156,
        image: "shawl1.jpg",
        description: "A sophisticated lace shawl for special occasions."
    },
    {
        id: 4,
        title: "Rainbow Baby Blanket",
        category: "blankets",
        difficulty: "beginner",
        price: 10.99,
        rating: 5,
        reviews: 203,
        image: "baby-blanket1.jpg",
        description: "A colorful and soft blanket perfect for babies."
    },
    {
        id: 5,
        title: "Cactus Amigurumi Set",
        category: "amigurumi",
        difficulty: "intermediate",
        price: 14.99,
        rating: 4,
        reviews: 67,
        image: "cactus1.jpg",
        description: "A set of three different cactus designs in cute pots."
    },
    {
        id: 6,
        title: "Boho Market Bag",
        category: "accessories",
        difficulty: "intermediate",
        price: 9.99,
        rating: 4,
        reviews: 145,
        image: "bag1.jpg",
        description: "A stylish and practical market bag with boho vibes."
    },
    {
        id: 7,
        title: "Granny Square Pillow",
        category: "home-decor",
        difficulty: "beginner",
        price: 7.99,
        rating: 5,
        reviews: 98,
        image: "pillow1.jpg",
        description: "Classic granny squares arranged in a beautiful pillow design."
    },
    {
        id: 8,
        title: "Unicorn Amigurumi",
        category: "amigurumi",
        difficulty: "advanced",
        price: 16.99,
        rating: 5,
        reviews: 234,
        image: "unicorn1.jpg",
        description: "A magical unicorn with flowing mane and sparkly details."
    },
    {
        id: 9,
        title: "Chunky Cardigan",
        category: "clothing",
        difficulty: "advanced",
        price: 22.99,
        rating: 4,
        reviews: 87,
        image: "cardigan1.jpg",
        description: "A cozy oversized cardigan perfect for layering."
    }
];

let currentPatterns = [...samplePatterns];
let displayedPatterns = 6;

// DOM Elements
const patternsGrid = document.querySelector('.patterns-grid-extended');
const loadMoreBtn = document.querySelector('.load-more-btn');
const categoryFilter = document.querySelector('select[name="category"]') || document.querySelectorAll('.filter-select')[0];
const difficultyFilter = document.querySelector('select[name="difficulty"]') || document.querySelectorAll('.filter-select')[1];
const priceFilter = document.querySelector('select[name="price"]') || document.querySelectorAll('.filter-select')[2];
const searchInput = document.querySelector('.search-input');

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Generate gradient background for pattern images
function generateGradient(index) {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    ];
    return gradients[index % gradients.length];
}

// Create pattern item HTML
function createPatternItem(pattern, index) {
    return `
        <div class="pattern-item" data-category="${pattern.category}" data-difficulty="${pattern.difficulty}" data-price="${pattern.price}">
            <div class="pattern-image" style="background: ${generateGradient(index)}">
                <div class="pattern-overlay">
                    <button class="btn-pattern" onclick="quickView(${pattern.id})">Quick View</button>
                    <button class="btn-pattern" onclick="addToCart(${pattern.id})">Add to Cart</button>
                </div>
            </div>
            <div class="pattern-info">
                <h3>${pattern.title}</h3>
                <p class="pattern-difficulty">${pattern.difficulty.charAt(0).toUpperCase() + pattern.difficulty.slice(1)}</p>
                <div class="pattern-rating">
                    ${generateStars(pattern.rating)}
                    <span>(${pattern.reviews})</span>
                </div>
                <div class="pattern-price">$${pattern.price}</div>
            </div>
        </div>
    `;
}

// Display patterns
function displayPatterns(patterns = currentPatterns.slice(0, displayedPatterns)) {
    if (!patternsGrid) return;
    
    patternsGrid.innerHTML = patterns.map((pattern, index) => createPatternItem(pattern, index)).join('');
    
    // Update load more button visibility
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayedPatterns >= currentPatterns.length ? 'none' : 'block';
    }
    
    // Add animation to pattern items
    const patternItems = document.querySelectorAll('.pattern-item');
    patternItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Filter patterns
function filterPatterns() {
    let filtered = [...samplePatterns];
    
    // Category filter
    const categoryValue = categoryFilter?.value;
    if (categoryValue) {
        filtered = filtered.filter(pattern => pattern.category === categoryValue);
    }
    
    // Difficulty filter
    const difficultyValue = difficultyFilter?.value;
    if (difficultyValue) {
        filtered = filtered.filter(pattern => pattern.difficulty === difficultyValue);
    }
    
    // Price filter
    const priceValue = priceFilter?.value;
    if (priceValue) {
        if (priceValue === '0-10') {
            filtered = filtered.filter(pattern => pattern.price <= 10);
        } else if (priceValue === '10-20') {
            filtered = filtered.filter(pattern => pattern.price > 10 && pattern.price <= 20);
        } else if (priceValue === '20+') {
            filtered = filtered.filter(pattern => pattern.price > 20);
        }
    }
    
    // Search filter
    const searchValue = searchInput?.value.toLowerCase();
    if (searchValue) {
        filtered = filtered.filter(pattern => 
            pattern.title.toLowerCase().includes(searchValue) ||
            pattern.description.toLowerCase().includes(searchValue) ||
            pattern.category.toLowerCase().includes(searchValue)
        );
    }
    
    currentPatterns = filtered;
    displayedPatterns = 6;
    displayPatterns();
}

// Quick view function
function quickView(patternId) {
    const pattern = samplePatterns.find(p => p.id === patternId);
    if (!pattern) return;
    
    // Create modal for quick view
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>${pattern.title}</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="padding: 30px;">
                <div class="pattern-image" style="height: 200px; background: ${generateGradient(pattern.id)}; border-radius: 12px; margin-bottom: 20px;"></div>
                <p><strong>Category:</strong> ${pattern.category.charAt(0).toUpperCase() + pattern.category.slice(1)}</p>
                <p><strong>Difficulty:</strong> ${pattern.difficulty.charAt(0).toUpperCase() + pattern.difficulty.slice(1)}</p>
                <p><strong>Description:</strong> ${pattern.description}</p>
                <div class="pattern-rating" style="margin: 16px 0;">
                    ${generateStars(pattern.rating)}
                    <span>(${pattern.reviews} reviews)</span>
                </div>
                <div class="pattern-price" style="font-size: 1.5rem; color: var(--primary-color); font-weight: 700; margin-bottom: 20px;">$${pattern.price}</div>
                <button class="btn-primary" onclick="addToCart(${pattern.id}); this.closest('.modal').remove();">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Add to cart function
function addToCart(patternId) {
    const pattern = samplePatterns.find(p => p.id === patternId);
    if (!pattern) return;
    
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists
    const existingItem = cart.find(item => item.id === patternId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: pattern.id,
            title: pattern.title,
            price: pattern.price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show notification
    showNotification(`${pattern.title} added to cart!`, 'success');
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartCountElement.style.animation = 'bounce 0.5s ease-in-out';
            setTimeout(() => {
                cartCountElement.style.animation = '';
            }, 500);
        }
    }
}

// Load more patterns
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        displayedPatterns += 6;
        displayPatterns();
    });
}

// Add event listeners for filters
if (categoryFilter) {
    categoryFilter.addEventListener('change', filterPatterns);
}
if (difficultyFilter) {
    difficultyFilter.addEventListener('change', filterPatterns);
}
if (priceFilter) {
    priceFilter.addEventListener('change', filterPatterns);
}
if (searchInput) {
    searchInput.addEventListener('input', debounce(filterPatterns, 300));
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize patterns display
document.addEventListener('DOMContentLoaded', () => {
    displayPatterns();
    updateCartCount();
});

console.log('Patterns page loaded with', samplePatterns.length, 'sample patterns! 🧶');
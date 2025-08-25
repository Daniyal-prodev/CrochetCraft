// Search Functionality
class SearchManager {
    constructor() {
        this.searchData = [
            { title: 'Cozy Winter Blanket', category: 'blankets', difficulty: 'intermediate', price: 12.99 },
            { title: 'Cute Amigurumi Bear', category: 'amigurumi', difficulty: 'beginner', price: 8.99 },
            { title: 'Elegant Lace Shawl', category: 'accessories', difficulty: 'advanced', price: 15.99 },
            { title: 'Baby Booties', category: 'baby', difficulty: 'beginner', price: 6.99 },
            { title: 'Granny Square Afghan', category: 'blankets', difficulty: 'intermediate', price: 14.99 },
            { title: 'Flower Pot Holder', category: 'home-decor', difficulty: 'beginner', price: 4.99 }
        ];
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#searchBtn')) {
                this.showSearchModal();
            }
        });
    }

    showSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'modal search-modal';
        modal.innerHTML = `
            <div class="modal-content search-modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-search"></i> Search Patterns</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="search-content">
                    <div class="search-bar">
                        <input type="text" id="searchInput" placeholder="Search for patterns..." autocomplete="off">
                        <button class="search-btn" onclick="searchManager.performSearch()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    
                    <div class="search-filters">
                        <select id="categoryFilter">
                            <option value="">All Categories</option>
                            <option value="amigurumi">Amigurumi</option>
                            <option value="blankets">Blankets</option>
                            <option value="accessories">Accessories</option>
                            <option value="home-decor">Home Decor</option>
                            <option value="baby">Baby Items</option>
                        </select>
                        
                        <select id="difficultyFilter">
                            <option value="">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        
                        <select id="priceFilter">
                            <option value="">Any Price</option>
                            <option value="0-10">Under $10</option>
                            <option value="10-20">$10 - $20</option>
                            <option value="20+">Over $20</option>
                        </select>
                    </div>
                    
                    <div class="search-results" id="searchResults">
                        <div class="popular-searches">
                            <h4>Popular Searches</h4>
                            <div class="search-tags">
                                <span class="search-tag" onclick="searchManager.quickSearch('amigurumi')">Amigurumi</span>
                                <span class="search-tag" onclick="searchManager.quickSearch('blanket')">Blankets</span>
                                <span class="search-tag" onclick="searchManager.quickSearch('beginner')">Beginner</span>
                                <span class="search-tag" onclick="searchManager.quickSearch('baby')">Baby Items</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Focus search input
        setTimeout(() => {
            document.getElementById('searchInput').focus();
        }, 100);
        
        // Add real-time search
        document.getElementById('searchInput').addEventListener('input', () => {
            this.performSearch();
        });
        
        // Add filter change events
        ['categoryFilter', 'difficultyFilter', 'priceFilter'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.performSearch();
            });
        });
    }

    performSearch() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const difficulty = document.getElementById('difficultyFilter').value;
        const priceRange = document.getElementById('priceFilter').value;
        
        let results = this.searchData.filter(item => {
            const matchesQuery = !query || item.title.toLowerCase().includes(query) || 
                                item.category.toLowerCase().includes(query) ||
                                item.difficulty.toLowerCase().includes(query);
            const matchesCategory = !category || item.category === category;
            const matchesDifficulty = !difficulty || item.difficulty === difficulty;
            const matchesPrice = this.matchesPriceRange(item.price, priceRange);
            
            return matchesQuery && matchesCategory && matchesDifficulty && matchesPrice;
        });
        
        this.displayResults(results, query);
    }

    matchesPriceRange(price, range) {
        if (!range) return true;
        
        if (range === '0-10') return price < 10;
        if (range === '10-20') return price >= 10 && price <= 20;
        if (range === '20+') return price > 20;
        
        return true;
    }

    displayResults(results, query) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (results.length === 0 && query) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h4>No patterns found</h4>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
            return;
        }
        
        if (!query && results.length === this.searchData.length) {
            resultsContainer.innerHTML = `
                <div class="popular-searches">
                    <h4>Popular Searches</h4>
                    <div class="search-tags">
                        <span class="search-tag" onclick="searchManager.quickSearch('amigurumi')">Amigurumi</span>
                        <span class="search-tag" onclick="searchManager.quickSearch('blanket')">Blankets</span>
                        <span class="search-tag" onclick="searchManager.quickSearch('beginner')">Beginner</span>
                        <span class="search-tag" onclick="searchManager.quickSearch('baby')">Baby Items</span>
                    </div>
                </div>
            `;
            return;
        }
        
        resultsContainer.innerHTML = `
            <div class="search-results-list">
                <h4>Found ${results.length} pattern${results.length !== 1 ? 's' : ''}</h4>
                ${results.map(item => `
                    <div class="search-result-item">
                        <div class="result-image"></div>
                        <div class="result-info">
                            <h5>${item.title}</h5>
                            <p>Category: ${item.category} | Difficulty: ${item.difficulty}</p>
                            <div class="result-price">$${item.price}</div>
                        </div>
                        <div class="result-actions">
                            <button class="btn-primary" onclick="searchManager.addToCart('${item.title}', ${item.price})">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    quickSearch(term) {
        document.getElementById('searchInput').value = term;
        this.performSearch();
    }

    addToCart(title, price) {
        const product = {
            id: Date.now() + Math.random(),
            title: title,
            price: price
        };
        
        if (window.cartManager) {
            cartManager.addItem(product);
        }
        
        // Close search modal
        document.querySelector('.search-modal').remove();
    }
}

// Initialize search manager
const searchManager = new SearchManager();
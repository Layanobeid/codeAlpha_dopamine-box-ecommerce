// assets/js/home.js
import Navbar from '../../components/navbar.js';
import Footer from '../../components/footer.js';
import ProductCard from '../../components/productCard.js';
import CategoryCard from '../../components/categoryCard.js';
import { getProducts, getCategories } from './api.js';
import { addToCart, updateCartBadge } from './storage.js';

// Initialize
Navbar();
Footer();

let allProducts = [];

async function loadHome() {
    try {
        const categories = await getCategories();
        const categoryContainer = document.getElementById('categories');
        if (categoryContainer) {
            categoryContainer.innerHTML = categories.map(CategoryCard).join('');
        }
        
        allProducts = await getProducts();
        
        // Featured products
        const featured = allProducts.filter(p => p.isFeatured).slice(0, 4);
        const productContainer = document.getElementById('products');
        if (productContainer) {
            productContainer.innerHTML = featured.length ? 
                featured.map(ProductCard).join('') :
                allProducts.slice(0, 4).map(ProductCard).join('');
        }
        
        // Recommended
        const recommendedContainer = document.getElementById('recommended-products');
        if (recommendedContainer) {
            const shuffled = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 4);
            recommendedContainer.innerHTML = shuffled.map(ProductCard).join('');
        }
        
        setupEvents();
        attachProductEvents();
        updateCartBadge();
        
    } catch (error) {
        console.error('Error loading home:', error);
    }
}

function setupEvents() {
    document.getElementById('searchBtn')?.addEventListener('click', handleSearch);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    document.getElementById('moodFilter')?.addEventListener('change', applyFilters);
    document.getElementById('occasionFilter')?.addEventListener('change', applyFilters);
    document.getElementById('clearFilters')?.addEventListener('click', clearFilters);
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

function applyFilters() {
    const mood = document.getElementById('moodFilter').value;
    const occasion = document.getElementById('occasionFilter').value;
    
    let filtered = [...allProducts];
    if (mood) filtered = filtered.filter(p => p.mood === mood);
    if (occasion) filtered = filtered.filter(p => p.occasion === occasion);
    
    renderProducts(filtered);
}

function clearFilters() {
    document.getElementById('moodFilter').value = '';
    document.getElementById('occasionFilter').value = '';
    document.getElementById('searchInput').value = '';
    renderProducts(allProducts);
}

function renderProducts(products) {
    const container = document.getElementById('products');
    if (container) {
        container.innerHTML = products.length ? 
            products.map(ProductCard).join('') :
            '<p style="text-align:center;padding:40px;color:#999;">No products found</p>';
        attachProductEvents();
    }
}
  document.addEventListener('DOMContentLoaded', function() {
        const box = document.getElementById('colorfulBox');
        const statusText = document.getElementById('colorfulStatus');
        let isOpen = false;
        let isPlaying = false;
        let timeoutId = null;
        
        function playSequence() {
            if (isPlaying) return;
            isPlaying = true;
            
            setTimeout(() => {
                box.classList.remove('closed');
                box.classList.add('open');
                statusText.textContent = '✨ Opening...';
            }, 300);
            
            setTimeout(() => {
                statusText.textContent = '🎁 Open! Explore gifts inside';
                isOpen = true;
            }, 1800);
            
            setTimeout(() => {
                box.classList.remove('open');
                box.classList.add('closed');
                statusText.textContent = '🔒 Closing...';
                isOpen = false;
            }, 4500);
            
            setTimeout(() => {
                statusText.textContent = '📦 Click to open again';
                isPlaying = false;
                isOpen = false;
            }, 6000);
            
            timeoutId = setTimeout(() => {
                if (!isOpen) {
                    playSequence();
                }
            }, 9500);
        }
        
        box.addEventListener('click', function() {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            isPlaying = false;
            
            if (isOpen) {
                box.classList.remove('open');
                box.classList.add('closed');
                statusText.textContent = '🔒 Closed';
                isOpen = false;
                setTimeout(() => {
                    if (!isOpen) {
                        playSequence();
                    }
                }, 2000);
            } else {
                box.classList.remove('closed');
                box.classList.add('open');
                statusText.textContent = '🎁 Open!';
                isOpen = true;
                setTimeout(() => {
                    if (isOpen) {
                        box.classList.remove('open');
                        box.classList.add('closed');
                        statusText.textContent = '🔒 Closed';
                        isOpen = false;
                        setTimeout(() => {
                            if (!isOpen) {
                                playSequence();
                            }
                        }, 2000);
                    }
                }, 3000);
            }
        });
        
        setTimeout(() => {
            playSequence();
        }, 1000);
    });
function attachProductEvents() {
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            if (id) {
                addToCart(id, 1);
                updateCartBadge();
                this.textContent = '✅ Added!';
                setTimeout(() => {
                    this.textContent = '🛒 Add to Cart';
                }, 2000);
            }
        });
    });
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category) {
                window.location.href = `products.html?category=${encodeURIComponent(category)}`;
            }
        });
    });
}
loadHome();

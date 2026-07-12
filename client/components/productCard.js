// components/productCard.js - PREMIUM VERSION

const API = 'https://codealpha-dopamine-box-ecommerce.onrender.com';

function getImageUrl(image) {
    const PLACEHOLDER = 'https://via.placeholder.com/300x300/f0f0f0/999?text=No+Image';
    
    if (!image) return PLACEHOLDER;
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }
    if (image.startsWith('/')) {
        return API + image;
    }
    return API + '/' + image;
}

export default function ProductCard(product) {
    const id = product._id || product.id;
    const name = product.name || 'Unnamed Product';
    const price = Number(product.price) || 0;
    const stock = Number(product.stock) || 0;
    const inStock = stock > 0;
    const imageUrl = getImageUrl(product.image);
    const placeholderText = encodeURIComponent(name.substring(0, 15));
    const placeholderUrl = 'https://via.placeholder.com/300x300/f0f0f0/999?text=' + placeholderText;
    
    return `
        <div class="product-card" data-id="${id}">
            <div class="product-image-wrapper">
                <img 
                    src="${imageUrl}" 
                    alt="${name}"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='${placeholderUrl}'"
                />
                
                <!-- Badges -->
                ${!inStock ? '<span class="badge badge-out-of-stock">Out of Stock</span>' : ''}
                ${product.isFeatured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
                
                <!-- Wishlist Button -->
                <button class="wishlist-btn" data-id="${id}" aria-label="Add to wishlist">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
                
                <!-- Hover Gradient -->
                <div class="image-overlay"></div>
            </div>
            
            <div class="product-info">
                <a href="product.html?id=${id}" class="product-link">
                    <h3 class="product-title">${name}</h3>
                </a>
                <p class="product-category">${product.category || 'Uncategorized'}</p>
                <p class="product-price">$${price.toFixed(2)}</p>
                <small class="product-stock ${inStock ? 'in-stock' : 'out-of-stock'}">
                    ${inStock ? '✅ ' + stock + ' in stock' : '❌ Out of stock'}
                </small>
            </div>
            
        

<button 
    class="btn-add-to-cart" 
    data-id="${id}"
    ${!inStock ? 'disabled' : ''}
>
    ${inStock ? 'Add to Cart' : 'Out of Stock'}
</button>
        </div>
    `;
}

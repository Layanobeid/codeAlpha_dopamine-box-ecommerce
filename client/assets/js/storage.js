// assets/js/storage.js - Add this at the end
const CART_KEY = 'dopamine_cart';
const WISHLIST_KEY = 'dopamine_wishlist';
const USER_KEY = 'dopamine_user';

// ============ CART ============
export function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
        return [];
    }
}

export function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === productId);
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
    return cart;
}

export function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
    return cart;
}

export function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === productId);
    
    if (existing) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        existing.quantity = quantity;
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadge();
    }
    return cart;
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    return [];
}

export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function updateCartBadge() {
    const total = getCartTotal();
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = total || '0';
        badge.style.display = total > 0 ? 'inline-flex' : 'none';
    }
}

// ============ WISHLIST ============
export function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    } catch {
        return [];
    }
}

export function toggleWishlist(productId) {
    let wishlist = getWishlist();
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
    } else {
        wishlist.push(productId);
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    return wishlist;
}

export function isInWishlist(productId) {
    return getWishlist().includes(productId);
}

// ============ USER ============
export function getUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
        return null;
    }
}

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
    localStorage.removeItem(USER_KEY);
}

// ============ CHECKOUT ============
export function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty! 🛒');
        return false;
    }
    
    // Close cart drawer
    if (window.closeCart) {
        window.closeCart();
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
    return true;
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.updateCartBadge = updateCartBadge;
window.toggleWishlist = toggleWishlist;
window.checkout = checkout;
window.getCart = getCart;

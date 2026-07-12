// components/navbar.js
import { getCartTotal, updateCartBadge, getCart } from '../assets/js/storage.js';

export default function Navbar() {
    const navbar = document.getElementById('navbar');
    const cartCount = getCartTotal();
    
    // ✅ Check both localStorage and sessionStorage
    let user = null;
    let token = null;
    
    try {
        // Try localStorage first
        const userData = localStorage.getItem('dopamine_user');
        const tokenData = localStorage.getItem('dopamine_token');
        
        if (userData) {
            user = JSON.parse(userData);
            token = tokenData;
        }
        
        // If not in localStorage, try sessionStorage
        if (!user) {
            const sessionUser = sessionStorage.getItem('dopamine_user');
            if (sessionUser) {
                user = JSON.parse(sessionUser);
                token = sessionStorage.getItem('dopamine_token');
                // Copy to localStorage for persistence
                localStorage.setItem('dopamine_user', sessionUser);
                localStorage.setItem('dopamine_token', token);
            }
        }
        
        console.log('👤 Navbar user:', user ? user.email : 'Not logged in');
        
    } catch (e) {
        console.error('Error loading user:', e);
    }
    
    const isLoggedIn = user && user.loggedIn !== false;
    
    navbar.innerHTML = `
        <nav class="navbar">
            <div class="nav-container" >
                <a href="index.html" class="logo">
                    🎁 <span>Dopamine</span> Box
                </a>
                
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="products.html">Products</a></li>
                    <li><a href="giftbox.html">Build Box</a></li>
                    ${user && user.role === 'admin' ? `
                        <li><a href="admin.html" style="color:#ff6b6b;font-weight:700;">👑 Admin</a></li>
                    ` : ''}
                    <li>
                        <a href="#" class="icon-btn" onclick="window.toggleCart()" style="position:relative;">
                            🛒
                            <span id="cart-badge" style="
                                position:absolute;
                                top:-8px;
                                right:-8px;
                                background:#ff6b6b;
                                color:#fff;
                                font-size:11px;
                                font-weight:700;
                                width:20px;
                                height:20px;
                                border-radius:50%;
                                display:${cartCount > 0 ? 'flex' : 'none'};
                                align-items:center;
                                justify-content:center;
                            ">${cartCount}</span>
                        </a>
                    </li>
                    ${isLoggedIn ? `
                        <li style="display:flex;align-items:center;gap:10px;">
                            ${user.avatar ? `<img src="${user.avatar}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">` : '👤'}
                            <span style="color:#333;font-weight:500;">${user.fullName || user.name || 'User'}</span>
                            <a href="#" onclick="window.logoutUser()" style="color:#ff6b6b;font-size:14px;text-decoration:none;font-weight:600;">Logout</a>
                        </li>
                    ` : `
                        <li><a href="login.html" class="login-btn">Login</a></li>
                    `}
                </ul>
            </div>
        </nav>
    `;
    
    updateCartBadge();
    
    // Logout function
    window.logoutUser = function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('dopamine_user');
            localStorage.removeItem('dopamine_token');
            sessionStorage.removeItem('dopamine_user');
            sessionStorage.removeItem('dopamine_token');
            window.location.href = 'index.html';
        }
    };
    
    // Define toggleCart globally
    window.toggleCart = function() {
        const drawer = document.getElementById('cartDrawer');
        const overlay = document.getElementById('cartOverlay');
        if (drawer) {
            drawer.classList.toggle('active');
        }
        if (overlay) {
            overlay.classList.toggle('active');
        }
        renderCartItems();
    };
    
    window.closeCart = function() {
        const drawer = document.getElementById('cartDrawer');
        const overlay = document.getElementById('cartOverlay');
        if (drawer) drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    };
    
    window.checkout = function() {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Your cart is empty! 🛒');
            return;
        }
        window.closeCart();
        window.location.href = 'checkout.html';
    };
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (!container) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="padding:40px 20px;text-align:center;color:#999;">
                <p style="font-size:3rem;margin-bottom:10px;">🛒</p>
                <p>Your cart is empty</p>
                <a href="products.html" style="display:inline-block;margin-top:15px;color:#ff6b6b;text-decoration:none;font-weight:600;">Start Shopping →</a>
            </div>
        `;
        if (totalElement) totalElement.textContent = '$0.00';
        if (checkoutBtn) {
            checkoutBtn.textContent = '🛒 Checkout - $0.00';
            checkoutBtn.disabled = true;
        }
        return;
    }
    
    import('../assets/js/api.js').then(({ getProducts }) => {
        getProducts().then(products => {
            let subtotal = 0;
            
            container.innerHTML = cart.map(item => {
                const product = products.find(p => (p._id || p.id) === item.productId);
                const price = product?.price || 29.99;
                const name = product?.name || 'Product';
                const itemTotal = price * item.quantity;
                subtotal += itemTotal;
                
                return `
                    <div class="cart-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px 15px;border-bottom:1px solid #eee;">
                        <div style="flex:1;">
                            <div style="font-weight:600;color:#222;font-size:14px;">${name}</div>
                            <div style="font-size:13px;color:#888;">$${price.toFixed(2)} × ${item.quantity}</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-weight:700;color:#ff6b6b;font-size:15px;">$${itemTotal.toFixed(2)}</span>
                            <button onclick="window.updateQty('${item.productId}', ${item.quantity - 1})" 
                                    style="background:#f0f0f0;border:none;border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">−</button>
                            <span style="font-weight:600;min-width:20px;text-align:center;font-size:14px;">${item.quantity}</span>
                            <button onclick="window.updateQty('${item.productId}', ${item.quantity + 1})" 
                                    style="background:#f0f0f0;border:none;border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">+</button>
                            <button onclick="window.removeItem('${item.productId}')" 
                                    style="background:#fee;border:none;border-radius:50%;width:28px;height:28px;cursor:pointer;color:#e74c3c;font-size:16px;display:flex;align-items:center;justify-content:center;">✕</button>
                        </div>
                    </div>
                `;
            }).join('');
            
            if (totalElement) {
                totalElement.textContent = `$${subtotal.toFixed(2)}`;
            }
            
            if (checkoutBtn) {
                checkoutBtn.textContent = `🛒 Checkout - $${subtotal.toFixed(2)}`;
                checkoutBtn.disabled = false;
            }
        });
    });
    
    window.updateQty = function(productId, newQuantity) {
        if (newQuantity <= 0) {
            window.removeItem(productId);
            return;
        }
        import('../assets/js/storage.js').then(({ getCart, updateCartQuantity, updateCartBadge }) => {
            updateCartQuantity(productId, newQuantity);
            updateCartBadge();
            renderCartItems();
        });
    };
    
    window.removeItem = function(productId) {
        import('../assets/js/storage.js').then(({ removeFromCart, updateCartBadge }) => {
            removeFromCart(productId);
            updateCartBadge();
            renderCartItems();
        });
    };
}
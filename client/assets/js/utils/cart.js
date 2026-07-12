// utils/cart.js
const CART_KEY = 'dopamine_cart';

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
  
  // Show toast
  import('./toast.js').then(({ default: toast }) => {
    toast('✅ Added to cart!');
  });
  
  return cart;
}

export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.productId !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  return cart;
}

export function updateCartBadge() {
  try {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = total || '0';
      badge.style.display = total > 0 ? 'inline-flex' : 'none';
    }
  } catch (e) {
    console.error('Error updating cart badge:', e);
  }
}

export function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.add('active');
  if (overlay) overlay.classList.add('active');
  renderCart();
}

export function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

export function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = `<p style="padding:20px;text-align:center;color:#999;">Your cart is empty 🛒</p>`;
    return;
  }
  
  container.innerHTML = cart.map(item => `
    <div class="cart-item" style="display:flex;justify-content:space-between;padding:12px 15px;border-bottom:1px solid #eee;">
      <div>
        <strong>Product #${item.productId.substring(0,8)}</strong>
        <span style="display:block;font-size:14px;color:#666;">Qty: ${item.quantity}</span>
      </div>
      <button onclick="removeItem('${item.productId}')" style="background:#fee;border:none;border-radius:50%;width:28px;height:28px;cursor:pointer;color:#e74c3c;">✕</button>
    </div>
  `).join('');
  
  // Add remove function to window
  window.removeItem = function(productId) {
    removeFromCart(productId);
    renderCart();
    updateCartBadge();
  };
}
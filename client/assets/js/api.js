// assets/js/api.js - COMPLETE FIXED VERSION

const API_URL ='https://codealpha-dopamine-box-ecommerce.onrender.com/api';
const API = 'https://codealpha-dopamine-box-ecommerce.onrender.com/api';

// ============ HELPER: Get Auth Headers ============
function getAuthHeaders() {
    const token = localStorage.getItem('dopamine_token');
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Token found, adding to request');
    } else {
        console.warn('⚠️ No token found in localStorage');
    }
    
    return headers;
}

// ============ HELPER: Fetch with Auth ============
async function fetchWithAuth(url, options = {}) {
    const headers = getAuthHeaders();
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });
    
    if (response.status === 401) {
        console.warn('⚠️ 401 Unauthorized - Clearing token');
        localStorage.removeItem('dopamine_token');
        localStorage.removeItem('dopamine_user');
        
        if (!window.location.pathname.includes('login.html')) {
            alert('⚠️ Session expired. Please login again.');
            window.location.href = 'login.html';
        }
    }
    
    return response;
}

// ============ PRODUCTS ============
export async function getProducts() {
    try {
        console.log('📦 Fetching products...');
        const res = await fetchWithAuth(`${API}/products`);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('✅ Products fetched:', data);
        
        if (data.success && data.data) return data.data;
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        
        return data || [];
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        return [];
    }
}

export async function getProductById(id) {
    try {
        const API_URL = 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/products/${id}`);
        
        if (!response.ok) {
            console.warn(`⚠️ Product ${id} not found (${response.status})`);
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        return null;
    }
}

// ============ CREATE PRODUCT ============
export async function createProduct(productData) {
    try {
        console.log('📦 Creating product:', productData);
        const res = await fetchWithAuth(`${API}/products`, {
            method: 'POST',
            body: JSON.stringify(productData)
        });
        
        const data = await res.json();
        console.log('✅ Create product response:', data);
        
        if (!res.ok) {
            throw new Error(data.message || 'Failed to create product');
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error creating product:', error);
        throw error;
    }
}

// ============ UPDATE PRODUCT ============
export async function updateProduct(id, productData) {
    try {
        console.log('📦 Updating product:', id, productData);
        const res = await fetchWithAuth(`${API}/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
        
        const data = await res.json();
        console.log('✅ Update product response:', data);
        
        if (!res.ok) {
            throw new Error(data.message || 'Failed to update product');
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error updating product:', error);
        throw error;
    }
}

// ============ DELETE PRODUCT ============
export async function deleteProduct(id) {
    try {
        console.log('🗑️ Deleting product:', id);
        const res = await fetchWithAuth(`${API}/products/${id}`, {
            method: 'DELETE'
        });
        
        const data = await res.json();
        console.log('✅ Delete product response:', data);
        
        if (!res.ok) {
            throw new Error(data.message || 'Failed to delete product');
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        throw error;
    }
}

// ============ CATEGORIES ============
export async function getCategories() {
    try {
        const res = await fetchWithAuth(`${API}/categories`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        if (data.success && data.data) return data.data;
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// ============ AUTH ============
export async function login(email, password) {
    try {
        console.log('🔑 Logging in:', email);
        
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        console.log('📦 Login response:', data);
        
        if (!res.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        if (data.token) {
            localStorage.setItem('dopamine_token', data.token);
            localStorage.setItem('dopamine_user', JSON.stringify(data.user));
            console.log('✅ Token and user saved to localStorage');
        } else {
            console.warn('⚠️ No token in response');
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ Login error:', error);
        throw error;
    }
}

export async function register(userData) {
    try {
        console.log('📝 Registering user:', userData.email);
        
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        console.log('✅ Registration successful');
        return data;
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        throw error;
    }
}

export async function socialLogin(socialData) {
    try {
        console.log('🌐 Social login:', socialData.provider);
        
        const res = await fetch(`${API}/auth/social-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(socialData)
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || 'Social login failed');
        }
        
        if (data.token) {
            localStorage.setItem('dopamine_token', data.token);
            localStorage.setItem('dopamine_user', JSON.stringify(data.user));
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ Social login error:', error);
        throw error;
    }
}

// ============ ORDERS ============
export async function createOrder(orderData) {
    try {
        console.log('📦 Sending order:', orderData);
        
        const res = await fetchWithAuth(`${API}/orders`, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        
        const data = await res.json();
        console.log('✅ Order response:', data);
        
        if (!res.ok) {
            throw new Error(data.message || 'Failed to create order');
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ Error creating order:', error);
        throw error;
    }
}

export async function getOrder(orderId) {
    try {
        const res = await fetchWithAuth(`${API}/orders/${orderId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        return data.data || data;
    } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
        return null;
    }
}

export async function getOrders() {
    try {
        const res = await fetchWithAuth(`${API}/orders`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log('📦 Orders API response:', data);
        
        // ✅ استخراج البيانات
        if (data.success && data.data) return data.data;
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        if (data.orders && Array.isArray(data.orders)) return data.orders;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// ============ CONTACT ============
export async function sendContactMessage(formData) {
    try {
        console.log('📩 Sending contact message:', formData.email);
        
        const res = await fetchWithAuth(`${API}/contact`, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || 'Failed to send message');
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ Contact error:', error);
        throw error;
    }
}

// ============ CART ============
export async function addToCartAPI(productId, quantity = 1) {
    try {
        const res = await fetchWithAuth(`${API}/cart`, {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        return data.data || data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return null;
    }
}

// ============================================
// MESSAGES API
// ============================================

export async function getMessages() {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/messages`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch messages');
        }

        const data = await response.json();
        return data.messages || data.data || [];
    } catch (error) {
        console.error('❌ Error fetching messages:', error);
        throw error;
    }
}

export async function getMessageById(id) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/messages/${id}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch message');
        }

        const data = await response.json();
        return data.message || data.data;
    } catch (error) {
        console.error('❌ Error fetching message:', error);
        throw error;
    }
}

export async function sendMessage(messageData) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers,
            body: JSON.stringify(messageData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send message');
        }

        const data = await response.json();
        return data.message || data.data;
    } catch (error) {
        console.error('❌ Error sending message:', error);
        throw error;
    }
}

export async function markMessageAsRead(id) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/messages/${id}/read`, {
            method: 'PATCH',
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to mark message as read');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error marking message as read:', error);
        throw error;
    }
}

export async function deleteMessage(id) {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}/messages/${id}`, {
            method: 'DELETE',
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete message');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error deleting message:', error);
        throw error;
    }
}

// ============================================
// ✅ EXPORT ALL
// ============================================

export { API_URL };

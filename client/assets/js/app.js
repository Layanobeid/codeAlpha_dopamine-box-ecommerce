import ProductTable from './components/ProductTable.js';
import ProductModal from './components/ProductModal.js';
import { productService } from './api/products.js';
import { debounce } from './utils/debounce.js';

class App {
    constructor() {
        this.table = new ProductTable('productsTable');
        this.modal = new ProductModal();
        this.searchInput = document.getElementById('searchProduct');
        
        this.setupEventListeners();
        this.setupCallbacks();
        this.init();
    }

    setupCallbacks() {
        this.table.setCallbacks({
            onEdit: (id) => this.editProduct(id),
            onDelete: (id) => this.deleteProduct(id)
        });

        this.modal.setOnSave((data) => this.saveProduct(data));
    }

    setupEventListeners() {
        // Search with debounce
        if (this.searchInput) {
            const debouncedSearch = debounce((e) => {
                this.table.filter(e.target.value);
            }, 300);
            this.searchInput.addEventListener('input', debouncedSearch);
        }

        // Global error handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled error:', event.reason);
            this.showToast('error', event.reason.message || 'An error occurred');
        });
    }

    async init() {
        await this.loadProducts();
        this.updateStats();
    }

    async loadProducts() {
        try {
            await this.table.loadProducts();
            this.updateStats();
        } catch (error) {
            this.showToast('error', `Failed to load products: ${error.message}`);
        }
    }

    updateStats() {
        const products = this.table.products || [];
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('featuredProducts').textContent = 
            products.filter(p => p.isFeatured).length;
        document.getElementById('inStockProducts').textContent = 
            products.filter(p => (p.stock || 0) > 0).length;
        
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        document.getElementById('totalCategories').textContent = categories.length;
    }

    addProduct() {
        this.modal.open();
    }

    async editProduct(id) {
        try {
            const product = await productService.getById(id);
            this.modal.open(product);
        } catch (error) {
            this.showToast('error', `Failed to load product: ${error.message}`);
        }
    }

    async saveProduct(data) {
        const isEditing = this.modal.isEditing;
        const id = this.modal.productId;

        try {
            this.modal.showLoading();
            
            if (isEditing) {
                await productService.update(id, data);
                this.showToast('success', '✅ Product updated successfully!');
            } else {
                await productService.create(data);
                this.showToast('success', '✅ Product created successfully!');
            }

            this.modal.close();
            await this.loadProducts();
            
        } catch (error) {
            this.showToast('error', `Failed to save product: ${error.message}`);
        } finally {
            this.modal.hideLoading();
        }
    }

    async deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productService.delete(id);
            this.showToast('success', '✅ Product deleted successfully!');
            await this.loadProducts();
        } catch (error) {
            this.showToast('error', `Failed to delete product: ${error.message}`);
        }
    }

    showToast(type, message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            font-weight: 600;
            z-index: 99999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize app and expose globally
window.app = new App();

// Expose functions for inline onclick handlers
window.addProduct = () => window.app.addProduct();
window.loadProducts = () => window.app.loadProducts();

console.log('🚀 App initialized successfully!');
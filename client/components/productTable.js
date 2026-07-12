import { productService } from '../api/products.js';
import { debounce } from '../utils/debounce.js';
import { imageHelper } from '../utils/imageHelper.js';

class ProductTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.products = [];
        this.filteredProducts = [];
        this.onEdit = null;
        this.onDelete = null;
        this.searchDebounced = debounce(this.render.bind(this), 300);
    }

    setCallbacks({ onEdit, onDelete }) {
        this.onEdit = onEdit;
        this.onDelete = onDelete;
    }

    async loadProducts() {
        try {
            this.showLoading();
            const products = await productService.getAll();
            this.products = products;
            this.filteredProducts = [...products];
            this.render();
            return products;
        } catch (error) {
            this.showError(error.message);
            throw error;
        }
    }

    filter(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            this.filteredProducts = [...this.products];
        } else {
            const query = searchTerm.toLowerCase().trim();
            this.filteredProducts = this.products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category?.toLowerCase().includes(query)
            );
        }
        this.render();
    }

    render() {
        const products = this.filteredProducts;

        if (products.length === 0) {
            this.container.innerHTML = `
                <div class="no-products">
                    <span class="icon">📭</span>
                    <p>No products found</p>
                    <button onclick="window.app.addProduct()" class="btn-admin btn-admin-primary" style="margin-top:10px;">
                        ➕ Add First Product
                    </button>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td>
                                <img src="${imageHelper.getSafeUrl(p)}" 
                                     alt="${p.name}" 
                                     class="product-image-small"
                                     loading="lazy"
                                     onerror="this.onerror=null; this.src='${imageHelper.getFallbackUrl(p)}'">
                            </td>
                            <td class="product-name-cell">${this.escapeHtml(p.name)}</td>
                            <td>${this.escapeHtml(p.category || '-')}</td>
                            <td class="product-price-cell">$${Number(p.price).toFixed(2)}</td>
                            <td>${p.stock || 0}</td>
                            <td>${this.getStatusBadges(p)}</td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn-edit" data-id="${p._id}">✏️ Edit</button>
                                    <button class="btn-delete" data-id="${p._id}">🗑️ Delete</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Attach event listeners
        this.container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.onEdit) this.onEdit(btn.dataset.id);
            });
        });

        this.container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.onDelete) this.onDelete(btn.dataset.id);
            });
        });
    }

    getStatusBadges(product) {
        const badges = [];
        if (product.isFeatured) {
            badges.push('<span class="status-badge status-featured">⭐ Featured</span>');
        }
        if ((product.stock || 0) > 0) {
            badges.push('<span class="status-badge status-in-stock">In Stock</span>');
        } else {
            badges.push('<span class="status-badge status-out-of-stock">Out of Stock</span>');
        }
        return badges.join(' ');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="no-products">
                <span class="icon">🔄</span>
                <p>Loading products...</p>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="no-products">
                <span class="icon">⚠️</span>
                <p>Error: ${this.escapeHtml(message)}</p>
                <button onclick="window.app.loadProducts()" class="btn-admin btn-admin-primary" style="margin-top:10px;">
                    Retry
                </button>
            </div>
        `;
    }
}

export default ProductTable;
import { ProductValidator } from '../utils/validation.js';

class ProductModal {
    constructor() {
        this.modal = document.getElementById('productModal');
        this.form = document.getElementById('productForm');
        this.isEditing = false;
        this.productId = null;
        this.onSave = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Real-time validation on input
        this.form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input);
            });
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(input) {
        const field = input.id.replace('p', '').toLowerCase();
        const value = input.value;
        
        // Map form fields to validator fields
        const fieldMap = {
            'name': 'string',
            'price': 'price',
            'stock': 'stock',
            'category': 'string',
            'image': 'string'
        };

        const validatorField = fieldMap[field];
        if (!validatorField) return;

        const result = ProductValidator.validateField(validatorField, value);
        
        // Show/hide error
        const errorElement = input.parentElement.querySelector('.field-error');
        if (errorElement) {
            if (!result.isValid) {
                errorElement.textContent = result.error;
                errorElement.style.display = 'block';
                input.classList.add('error');
            } else {
                errorElement.style.display = 'none';
                input.classList.remove('error');
            }
        }
    }

    open(data = null) {
        this.isEditing = !!data;
        this.productId = data?._id || null;

        document.getElementById('modalTitle').textContent = this.isEditing 
            ? '✏️ Edit Product' 
            : '➕ Add New Product';

        document.getElementById('submitBtn').textContent = this.isEditing 
            ? '💾 Update Product' 
            : '💾 Save Product';

        // Fill form if editing
        if (data) {
            document.getElementById('pName').value = data.name || '';
            document.getElementById('pDescription').value = data.description || '';
            document.getElementById('pPrice').value = data.price || '';
            document.getElementById('pStock').value = data.stock || 0;
            document.getElementById('pCategory').value = data.category || '';
            document.getElementById('pImage').value = data.image || '';
            document.getElementById('pMood').value = data.mood || '';
            document.getElementById('pOccasion').value = data.occasion || '';
            document.getElementById('pFeatured').checked = data.isFeatured || false;
        } else {
            this.form.reset();
            document.getElementById('pStock').value = 10;
        }

        // Clear errors
        this.form.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');
        this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        this.modal.classList.add('active');
    }

    close() {
        this.modal.classList.remove('active');
    }

    getData() {
        const rawData = {
            name: document.getElementById('pName').value.trim(),
            description: document.getElementById('pDescription').value.trim(),
            price: document.getElementById('pPrice').value,
            stock: document.getElementById('pStock').value,
            category: document.getElementById('pCategory').value.trim(),
            image: document.getElementById('pImage').value.trim(),
            mood: document.getElementById('pMood').value,
            occasion: document.getElementById('pOccasion').value,
            isFeatured: document.getElementById('pFeatured').checked
        };

        const validation = ProductValidator.validate(rawData);
        
        if (!validation.isValid) {
            // Show errors on fields
            Object.keys(validation.errors).forEach(field => {
                const input = document.getElementById(`p${field.charAt(0).toUpperCase() + field.slice(1)}`);
                if (input) {
                    const errorEl = input.parentElement.querySelector('.field-error');
                    if (errorEl) {
                        errorEl.textContent = validation.errors[field];
                        errorEl.style.display = 'block';
                        input.classList.add('error');
                    }
                }
            });
            throw new Error('Please fix validation errors');
        }

        return validation.data;
    }

    setOnSave(callback) {
        this.onSave = callback;
    }

    showLoading() {
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.textContent = '⏳ Saving...';
    }

    hideLoading() {
        const btn = document.getElementById('submitBtn');
        btn.disabled = false;
        btn.textContent = this.isEditing ? '💾 Update Product' : '💾 Save Product';
    }
}

export default ProductModal;
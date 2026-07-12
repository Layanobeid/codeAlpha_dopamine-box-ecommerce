import { api } from './client.js';

class ProductService {
    async getAll() {
        const response = await api.get('/products');
        return response.data || response;
    }

    async getById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data || response;
    }

    async create(data) {
        return await api.post('/products', data);
    }

    async update(id, data) {
        return await api.put(`/products/${id}`, data);
    }

    async delete(id) {
        return await api.delete(`/products/${id}`);
    }
}

export const productService = new ProductService();
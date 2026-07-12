export const imageHelper = {
    getSafeUrl(product) {
        if (!product.image || 
            product.image === 'placeholder.jpg' || 
            product.image.includes('placeholder')) {
            // Generate from product name
            const name = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return `/images/products/${name}.jpg`;
        }

        if (product.image.startsWith('http://') || 
            product.image.startsWith('https://')) {
            return product.image;
        }

        if (product.image.startsWith('/')) {
            return product.image;
        }

        return `/images/products/${product.image}`;
    },

    getFallbackUrl(product) {
        const name = encodeURIComponent(product.name || 'Product');
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23f0f0f0'/%3E%3Ctext x='25' y='32' text-anchor='middle' fill='%23999' font-size='24' font-family='Arial'%3E📦%3C/text%3E%3C/svg%3E`;
    }
};
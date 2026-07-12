export const validators = {
    required: (value) => ({
        isValid: value !== undefined && value !== null && value !== '',
        error: 'This field is required'
    }),

    number: (value) => {
        const num = parseFloat(value);
        return {
            isValid: !isNaN(num) && num >= 0,
            error: 'Must be a valid number',
            value: num
        };
    },

    price: (value) => {
        const num = parseFloat(value);
        return {
            isValid: !isNaN(num) && num >= 0 && num <= 999999.99,
            error: 'Price must be between 0 and 999,999.99',
            value: num
        };
    },

    stock: (value) => {
        const num = parseInt(value);
        return {
            isValid: !isNaN(num) && num >= 0 && Number.isInteger(num),
            error: 'Stock must be a whole number',
            value: num
        };
    },

    string: (value, maxLength = 255) => ({
        isValid: typeof value === 'string' && value.length <= maxLength,
        error: `Must be text (max ${maxLength} characters)`,
        value: value || ''
    })
};

export class ProductValidator {
    static validate(data) {
        const errors = {};
        const validated = {};

        // Name
        const nameValidation = validators.string(data.name, 100);
        if (!nameValidation.isValid) {
            errors.name = nameValidation.error;
        }
        validated.name = nameValidation.value?.trim();

        // Price
        const priceValidation = validators.price(data.price);
        if (!priceValidation.isValid) {
            errors.price = priceValidation.error;
        }
        validated.price = priceValidation.value;

        // Stock
        const stockValidation = validators.stock(data.stock);
        if (!stockValidation.isValid) {
            errors.stock = stockValidation.error;
        }
        validated.stock = stockValidation.value;

        // Category
        const categoryValidation = validators.string(data.category, 50);
        if (!categoryValidation.isValid) {
            errors.category = categoryValidation.error;
        }
        validated.category = categoryValidation.value?.toUpperCase();

        // Image (optional)
        if (data.image) {
            const imageValidation = validators.string(data.image, 500);
            if (!imageValidation.isValid) {
                errors.image = imageValidation.error;
            }
            validated.image = imageValidation.value;
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
            data: validated
        };
    }

    static validateField(field, value) {
        const validator = validators[field];
        if (!validator) return { isValid: true };
        return validator(value);
    }
}
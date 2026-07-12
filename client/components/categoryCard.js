// components/categoryCard.js
export default function CategoryCard(category) {
    const icons = {
        'MUGS': '☕',
        'PERFUMES': '🌸',
        'GIFTBOXES': '🎁',
        'SOUVENIRS': '🧸',
        'TREND BOX': '📦'
    };

    const icon = icons[category.name] || '📦';
    const name = category.name || 'Category';

    return `
        <div class="category-card" data-category="${name}" 
             onclick="window.location.href='products.html?category=${encodeURIComponent(name)}'"
             style="cursor:pointer;background:#fff;padding:25px 15px;border-radius:18px;text-align:center;box-shadow:0 5px 15px rgba(0,0,0,.05);transition:.35s;border:1px solid rgba(0,0,0,.04);">
            <span style="font-size:2.5rem;display:block;margin-bottom:10px;">${icon}</span>
            <h4 style="font-size:1rem;font-weight:700;color:#222;">${name}</h4>
            <p style="font-size:.85rem;color:#777;margin:5px 0;">${category.description || 'Beautiful products'}</p>
            <a href="products.html?category=${encodeURIComponent(name)}" style="display:inline-block;margin-top:10px;color:#ff6b6b;font-weight:600;text-decoration:none;">
                View Products →
            </a>
        </div>
    `;
}
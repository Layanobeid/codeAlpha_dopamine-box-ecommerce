export function debounce(func, delay = 300) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export function throttle(func, delay = 300) {
    let lastCall = 0;

    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}
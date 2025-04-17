// DOM Elements
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const roleSwitch = document.getElementById('roleSwitch');
const logoutBtn = document.getElementById('logoutBtn');
const productGrid = document.getElementById('productGrid');
const orderList = document.getElementById('orderList');
const wishlistGrid = document.getElementById('wishlistGrid');
const quickViewModal = document.getElementById('quickViewModal');
const closeModal = document.querySelector('.close-modal');
const modalContent = document.getElementById('modalProductContent');
const totalOrdersElement = document.getElementById('totalOrders');
const totalSpentElement = document.getElementById('totalSpent');
const wishlistItemsElement = document.getElementById('wishlistItems');

// Mock Data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        badge: "BESTSELLER",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals who need focus.",
        category: "electronics"
    },
    {
        id: 2,
        name: "Smart Fitness Tracker",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1576243347090-8095adf2cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.2,
        badge: "NEW",
        description: "Track your heart rate, steps, sleep patterns and more with this sleek fitness band. Waterproof design for swimming and all-day wear.",
        category: "electronics"
    },
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.7,
        description: "100% organic cotton t-shirt available in multiple colors. Soft, breathable fabric with a comfortable fit for everyday wear.",
        category: "clothing"
    },
    {
        id: 4,
        name: "Stainless Steel Water Bottle",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.8,
        description: "Keep your drinks hot or cold for hours with this premium stainless steel water bottle. Eco-friendly and durable design.",
        category: "home"
    }
];

const orders = [
    {
        id: 1001,
        product: "Wireless Bluetooth Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
        price: 89.99,
        quantity: 1,
        date: "2023-06-15",
        status: "delivered"
    },
    {
        id: 1002,
        product: "Smart Fitness Tracker",
        image: "https://images.unsplash.com/photo-1576243347090-8095adf2cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
        price: 49.99,
        quantity: 2,
        date: "2023-06-10",
        status: "shipped"
    }
];

const wishlist = [
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.7,
        category: "clothing"
    },
    {
        id: 4,
        name: "Stainless Steel Water Bottle",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        rating: 4.8,
        category: "home"
    }
];

// Initialize Dashboard
function initDashboard() {
    renderProducts();
    renderOrders();
    renderWishlist();
    updateStats();
    
    // Set active section based on URL hash or default
    const hash = window.location.hash.substring(1);
    showSection(hash || 'home');
}

// Sidebar toggle
hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        if (section) {
            showSection(section);
            // Update URL without reload
            window.history.pushState(null, null, `#${section}`);
        }
    });
});

// Show section
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });
    
    navLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section');
        link.classList.toggle('active', linkSection === sectionId);
        
        // Update breadcrumb
        if (linkSection === sectionId && linkSection) {
            document.querySelector('.breadcrumb').textContent = link.querySelector('span').textContent;
        }
    });
}

// Render Products with enhanced animations
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Orders with enhanced animations
function renderOrders() {
    orderList.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-image">
                <img src="${order.image}" alt="${order.product}" loading="lazy">
            </div>
            <div class="order-info">
                <h3>${order.product}</h3>
                <div class="order-meta">
                    <span>Qty: ${order.quantity}</span>
                    <span>$${(order.price * order.quantity).toFixed(2)}</span>
                    <span>${order.date}</span>
                </div>
            </div>
            <div class="order-status status-${order.status}">
                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
        </div>
    `).join('');
}

// Render Wishlist with enhanced animations
function renderWishlist() {
    wishlistGrid.innerHTML = wishlist.map(item => `
        <div class="product-card" data-id="${item.id}">
            <div class="product-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="product-details">
                <h3 class="product-title">${item.name}</h3>
                <div class="product-price">$${item.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${item.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="removeFromWishlist(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update Stats with animations
function updateStats() {
    const totalOrders = orders.reduce((sum, order) => sum + order.quantity, 0);
    const totalSpent = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
    const wishlistCount = wishlist.length;

    // Animate stats update
    animateValue(totalOrdersElement, 0, totalOrders, 1000);
    animateValue(wishlistItemsElement, 0, wishlistCount, 1000);
    
    // Format total spent with animation
    let currentSpent = 0;
    const step = totalSpent / 100;
    const interval = setInterval(() => {
        currentSpent += step;
        if (currentSpent >= totalSpent) {
            clearInterval(interval);
            currentSpent = totalSpent;
        }
        totalSpentElement.textContent = `$${currentSpent.toFixed(2)}`;
    }, 10);
}

// Helper function to animate number values
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Quick View Product with animation
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalContent.innerHTML = `
        <div class="modal-product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="modal-product-price">$${product.price.toFixed(2)}</div>
            <div class="modal-product-description">
                ${product.description}
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">
                    <i class="fas fa-heart"></i> Add to Wishlist
                </button>
            </div>
        </div>
    `;
    quickViewModal.classList.add('show');
}

// Close Modal
closeModal.addEventListener('click', () => {
    quickViewModal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.classList.remove('show');
    }
});

// Mock Functions with enhanced feedback
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Find the button that was clicked
    const buttons = document.querySelectorAll(`[onclick="addToCart(${productId})"]`);
    buttons.forEach(button => {
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.classList.add('pulse');
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            button.classList.remove('pulse');
        }, 1500);
    });
    
    showNotification(`${product.name} added to cart!`, 'success');
}

function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if already in wishlist
    if (wishlist.some(item => item.id === productId)) {
        showNotification(`${product.name} is already in your wishlist!`, 'warning');
        return;
    }
    
    // Add to wishlist
    wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating,
        category: product.category
    });
    
    renderWishlist();
    updateStats();
    showNotification(`${product.name} added to wishlist!`, 'success');
}

function removeFromWishlist(productId) {
    const productIndex = wishlist.findIndex(item => item.id === productId);
    if (productIndex === -1) return;
    
    const productName = wishlist[productIndex].name;
    
    // Animate removal
    const itemElement = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (itemElement) {
        itemElement.style.transition = 'all 0.3s ease';
        itemElement.style.opacity = '0';
        itemElement.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            wishlist.splice(productIndex, 1);
            renderWishlist();
            updateStats();
            showNotification(`${productName} removed from wishlist!`, 'success');
        }, 300);
    }
}

// Role Switching
roleSwitch.addEventListener('change', () => {
    localStorage.setItem('role', roleSwitch.value);
    window.location.href = `${roleSwitch.value}-dashboard.html`;
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login.html';
});

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', initDashboard);
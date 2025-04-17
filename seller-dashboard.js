// DOM Elements
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const addItemBtn = document.getElementById('addItemBtn');
const logoutBtn = document.getElementById('logoutBtn');
const addItemModal = document.getElementById('addItemModal');
const closeModal = document.querySelector('.close-modal');
const cancelAddItem = document.getElementById('cancelAddItem');
const addItemForm = document.getElementById('addItemForm');
const inventoryList = document.getElementById('inventoryList');
const ordersList = document.getElementById('ordersList');
const totalSalesElement = document.getElementById('totalSales');
const totalRevenueElement = document.getElementById('totalRevenue');
const activeProductsElement = document.getElementById('activeProducts');
const roleSwitch = document.getElementById('roleSwitch');

// Mock Data (Replace with actual API calls later)
let inventory = [
    { 
        id: 1, 
        name: "Handmade Ceramic Mug", 
        price: 24.99, 
        stock: 15, 
        category: "home",
        description: "Beautiful handmade ceramic mug with unique design.",
        image: "https://images.unsplash.com/photo-1532413992378-f169ac26fff0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    { 
        id: 2, 
        name: "Organic Cotton T-Shirt", 
        price: 29.99, 
        stock: 32, 
        category: "clothing",
        description: "100% organic cotton t-shirt, available in multiple colors.",
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    { 
        id: 3, 
        name: "Wireless Earbuds", 
        price: 59.99, 
        stock: 8, 
        category: "electronics",
        description: "High-quality wireless earbuds with noise cancellation.",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

let orders = [
    { 
        id: 1001, 
        customer: "John Doe", 
        item: "Handmade Ceramic Mug", 
        quantity: 2, 
        total: 49.98, 
        date: "2023-06-15", 
        status: "completed" 
    },
    { 
        id: 1002, 
        customer: "Jane Smith", 
        item: "Organic Cotton T-Shirt", 
        quantity: 1, 
        total: 29.99, 
        date: "2023-06-14", 
        status: "pending" 
    },
    { 
        id: 1003, 
        customer: "Alex Johnson", 
        item: "Wireless Earbuds", 
        quantity: 1, 
        total: 59.99, 
        date: "2023-06-12", 
        status: "completed" 
    }
];

// Initialize Dashboard
function initDashboard() {
    renderInventory();
    renderOrders();
    updateStats();
    
    // Set active section based on URL hash or default
    const hash = window.location.hash.substring(1);
    showSection(hash || 'overview');
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

// Render Inventory Items with enhanced animations
function renderInventory() {
    inventoryList.innerHTML = inventory.map(item => `
        <div class="inventory-item" data-id="${item.id}">
            <div class="item-image">
                ${item.image ? 
                    `<img src="${item.image}" alt="${item.name}">` : 
                    `<i class="fas fa-box-open"></i>`}
            </div>
            <div class="item-details">
                <h3 class="item-title">${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                <p class="item-stock">${item.stock} in stock • ${item.category}</p>
                <div class="item-actions">
                    <button class="btn btn-primary" onclick="editItem(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteItem(${item.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Orders with enhanced animations
function renderOrders() {
    ordersList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.item}</td>
                        <td>${order.quantity}</td>
                        <td>$${order.total.toFixed(2)}</td>
                        <td>${order.date}</td>
                        <td>
                            <span class="order-status status-${order.status}">
                                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Update Stats with animations
function updateStats() {
    const totalSales = orders.reduce((sum, order) => sum + order.quantity, 0);
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const activeListings = inventory.length;

    // Animate stats update
    animateValue(totalSalesElement, 0, totalSales, 1000);
    animateValue(activeProductsElement, 0, activeListings, 1000);
    
    // Format revenue with animation
    let currentRevenue = 0;
    const step = revenue / 100;
    const interval = setInterval(() => {
        currentRevenue += step;
        if (currentRevenue >= revenue) {
            clearInterval(interval);
            currentRevenue = revenue;
        }
        totalRevenueElement.textContent = `$${currentRevenue.toFixed(2)}`;
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

// Modal Handling
addItemBtn.addEventListener('click', () => {
    addItemModal.classList.add('show');
});

closeModal.addEventListener('click', () => {
    addItemModal.classList.remove('show');
});

cancelAddItem.addEventListener('click', () => {
    addItemModal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === addItemModal) {
        addItemModal.classList.remove('show');
    }
});

// Add New Item with animation
addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newItem = {
        id: inventory.length + 1,
        name: document.getElementById('itemName').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        stock: parseInt(document.getElementById('itemStock').value),
        category: document.getElementById('itemCategory').value,
        description: document.getElementById('itemDescription').value,
        image: null
    };

    inventory.push(newItem);
    addItemModal.classList.remove('show');
    addItemForm.reset();
    
    // Animate the addition of new item
    const newItemElement = document.createElement('div');
    newItemElement.className = 'inventory-item';
    newItemElement.style.opacity = '0';
    newItemElement.style.transform = 'translateY(20px)';
    newItemElement.innerHTML = `
        <div class="item-image">
            <i class="fas fa-box-open"></i>
        </div>
        <div class="item-details">
            <h3 class="item-title">${newItem.name}</h3>
            <p class="item-price">$${newItem.price.toFixed(2)}</p>
            <p class="item-stock">${newItem.stock} in stock • ${newItem.category}</p>
            <div class="item-actions">
                <button class="btn btn-primary" onclick="editItem(${newItem.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteItem(${newItem.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    inventoryList.prepend(newItemElement);
    
    // Trigger animation
    setTimeout(() => {
        newItemElement.style.transition = 'all 0.3s ease';
        newItemElement.style.opacity = '1';
        newItemElement.style.transform = 'translateY(0)';
    }, 10);
    
    updateStats();
    
    // Show success notification
    showNotification('Product added successfully!', 'success');
});

// Edit Item with animation
function editItem(id) {
    const item = inventory.find(item => item.id === id);
    if (item) {
        // Populate modal with item data
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemStock').value = item.stock;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemDescription').value = item.description;
        
        // Change modal title and button
        const modal = document.querySelector('#addItemModal .modal-content');
        modal.querySelector('h2').textContent = 'Edit Product';
        modal.querySelector('button[type="submit"]').textContent = 'Update Product';
        
        // Show modal
        addItemModal.classList.add('show');
        
        // Change form submit behavior to update instead of add
        const form = document.getElementById('addItemForm');
        const originalSubmit = form.onsubmit;
        form.onsubmit = function(e) {
            e.preventDefault();
            
            // Update item
            item.name = document.getElementById('itemName').value;
            item.price = parseFloat(document.getElementById('itemPrice').value);
            item.stock = parseInt(document.getElementById('itemStock').value);
            item.category = document.getElementById('itemCategory').value;
            item.description = document.getElementById('itemDescription').value;
            
            // Animate the update
            const itemElement = document.querySelector(`.inventory-item[data-id="${id}"]`);
            itemElement.classList.add('pulse');
            setTimeout(() => {
                itemElement.classList.remove('pulse');
                renderInventory();
            }, 1500);
            
            addItemModal.classList.remove('show');
            form.reset();
            form.onsubmit = originalSubmit;
            
            // Show success notification
            showNotification('Product updated successfully!', 'success');
        };
    }
}

// Delete Item with animation
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const itemElement = document.querySelector(`.inventory-item[data-id="${id}"]`);
        if (itemElement) {
            itemElement.style.transition = 'all 0.3s ease';
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                inventory = inventory.filter(item => item.id !== id);
                renderInventory();
                updateStats();
                
                // Show success notification
                showNotification('Product deleted successfully!', 'success');
            }, 300);
        }
    }
}

// Role Switching
roleSwitch.addEventListener('change', () => {
    const role = roleSwitch.value;
    localStorage.setItem('role', role);
    window.location.href = `${role}-dashboard.html`;
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
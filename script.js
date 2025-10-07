document.addEventListener('DOMContentLoaded', () => {

    // --- PRODUCT DATA ---
    // In a real app, you'd fetch this from a server/API
    const products = [
        { id: 1, name: 'Wireless Headphones', price: 99.99, image: 'https://picsum.photos/id/1082/400/300' },
        { id: 2, name: 'Smartwatch Series 7', price: 399.00, image: 'https://picsum.photos/id/2/400/300' },
        { id: 3, name: 'Portable SSD 1TB', price: 129.50, image: 'https://picsum.photos/id/175/400/300' },
        { id: 4, name: 'Mechanical Keyboard', price: 150.00, image: 'https://picsum.photos/id/49/400/300' },
        { id: 5, name: '4K Ultra HD Monitor', price: 599.99, image: 'https://picsum.photos/id/119/400/300' },
        { id: 6, name: 'Ergonomic Mouse', price: 75.25, image: 'https://picsum.photos/id/3/400/300' },
        { id: 7, name: 'VR Headset', price: 450.00, image: 'https://picsum.photos/id/111/400/300' },
        { id: 8, name: 'Noise-Cancelling Earbuds', price: 199.99, image: 'https://picsum.photos/id/1078/400/300' }
    ];

    // --- CART STATE ---
    let cart = [];

    // --- DOM SELECTORS ---
    const productGrid = document.getElementById('product-grid');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeModalBtn = document.querySelector('.close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total');
    const cartItemCountEl = document.querySelector('.cart-item-count');

    // --- FUNCTIONS ---

    // 1. Render Products on the Page
    function renderProducts() {
        productGrid.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // 2. Add Item to Cart
    function addToCart(productId) {
        // Find product from the main products list
        const productToAdd = products.find(p => p.id === productId);
        // Check if the item is already in the cart
        const existingCartItem = cart.find(item => item.id === productId);

        if (existingCartItem) {
            // If it exists, just increase the quantity
            existingCartItem.quantity++;
        } else {
            // If not, add it as a new item
            cart.push({ ...productToAdd, quantity: 1 });
        }

        updateCart();
    }
    
    // 3. Update Cart (Display, Total, and Count)
    function updateCart() {
        renderCartItems();
        updateCartTotal();
        updateCartItemCount();
    }

    // 4. Render Items in the Cart Modal
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
            return;
        }

        cartItemsContainer.innerHTML = ''; // Clear previous items
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.dataset.id = item.id;
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn increase-btn">+</button>
                </div>
                <button class="remove-item-btn"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
    }

    // 5. Update Cart Total Price
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = total.toFixed(2);
    }
    
    // 6. Update Cart Icon Item Count
    function updateCartItemCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCountEl.textContent = totalItems;
    }

    // 7. Change Item Quantity in Cart
    function changeItemQuantity(productId, change) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;

        cartItem.quantity += change;

        if (cartItem.quantity <= 0) {
            // If quantity drops to 0 or less, remove the item
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCart();
    }

    // 8. Remove Item from Cart
    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }


    // --- EVENT LISTENERS ---

    // Add to cart button clicks (uses event delegation)
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });

    // Cart Modal open/close
    cartIcon.addEventListener('click', () => cartModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => cartModal.classList.add('hidden'));
    cartModal.addEventListener('click', (e) => {
        // Close if clicking on the overlay, but not the content
        if (e.target.classList.contains('modal-overlay')) {
            cartModal.classList.add('hidden');
        }
    });

    // Cart item quantity changes and removal (uses event delegation)
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const parentCartItem = target.closest('.cart-item');
        if (!parentCartItem) return;
        
        const productId = parseInt(parentCartItem.dataset.id);

        if (target.classList.contains('increase-btn')) {
            changeItemQuantity(productId, 1);
        } else if (target.classList.contains('decrease-btn')) {
            changeItemQuantity(productId, -1);
        } else if (target.closest('.remove-item-btn')) {
            removeItemFromCart(productId);
        }
    });


    // --- INITIALIZATION ---
    renderProducts();
});
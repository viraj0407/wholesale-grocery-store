document.addEventListener("DOMContentLoaded", function() {
    // Debug: Check if elements exist
    console.log('Initializing cart...');
    
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartTableBody = document.querySelector('#cart-items tbody');
    const totalElement = document.getElementById('total');
    const checkoutButton = document.getElementById('checkout-button');
    const emptyCartMessage = document.createElement('tr');
    emptyCartMessage.innerHTML = '<td colspan="6" class="empty-cart">Your cart is empty</td>';

    // Debug logs
    if (!cartTableBody) console.error('Error: #cart-items tbody not found');
    if (!totalElement) console.error('Error: #total element not found');
    if (!checkoutButton) console.error('Error: #checkout-button not found');

    function updateCart() {
        // Check if required elements exist
        if (!cartTableBody || !totalElement) {
            console.error('Required elements missing for updateCart');
            return;
        }

        cartTableBody.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartTableBody.appendChild(emptyCartMessage);
            totalElement.textContent = '₹0.00';
            
            // Add null check for total-amount
            const totalAmountElement = document.getElementById('total-amount');
            if (totalAmountElement) {
                totalAmountElement.textContent = '0.00';
            } else {
                console.error('Error: #total-amount element not found');
            }
            return;
        }

        let totalPrice = 0;
        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="http://localhost:4000/api/grocery/images/${item.image}" 
                         alt="${item.name}" 
                         class="cart-item-image"
                         onerror="this.src='/images/placeholder.jpg'"></td>
                <td>${item.name}</td>
                <td>
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </td>
                <td>₹${(item.price || 0).toFixed(2)}</td>
                <td>₹${((item.price || 0) * item.quantity).toFixed(2)}</td>
                <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
            `;
            cartTableBody.appendChild(row);
            totalPrice += (item.price || 0) * item.quantity;
        });

        totalElement.textContent = `₹${totalPrice.toFixed(2)}`;
        
        // Add null check for total-amount
        const totalAmountElement = document.getElementById('total-amount');
        if (totalAmountElement) {
            totalAmountElement.textContent = totalPrice.toFixed(2);
        } else {
            console.error('Error: #total-amount element not found');
        }
    }

    // Event delegation with error handling
    const cartItemsTable = document.querySelector('#cart-items');
    if (cartItemsTable) {
        cartItemsTable.addEventListener('click', function(e) {
            const itemId = e.target.dataset.id;
            if (!itemId) return;

            const item = cartItems.find(item => item.id === itemId);
            if (!item) return;
            
            if (e.target.classList.contains('minus')) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cartItems = cartItems.filter(i => i.id !== itemId);
                }
            } 
            else if (e.target.classList.contains('plus')) {
                item.quantity++;
            }
            else if (e.target.classList.contains('remove-btn')) {
                cartItems = cartItems.filter(i => i.id !== itemId);
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCart();
            updateCartCount();
        });
    } else {
        console.error('Error: #cart-items table not found');
    }

    // Initialize cart
    updateCart();

    // Checkout button with enhanced error handling
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (cartItems.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            console.log('Navigating to billing page');
            console.log('Current cart items:', cartItems);
            
            // Use absolute path to ensure consistent navigation
            window.location.href = "/Cart/billing.html";
        });
    }
});

// Shared cart count update with error handling
function updateCartCount() {
    try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        if (cartCountElements.length > 0) {
            cartCountElements.forEach(el => el.textContent = count);
        } else {
            console.error('Error: No .cart-count elements found');
        }
    } catch (error) {
        console.error('Error in updateCartCount:', error);
    }
}
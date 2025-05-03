document.addEventListener("DOMContentLoaded", function() {
    const billingForm = document.getElementById("billing-form");
    if (!billingForm) return;

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Display order summary with fallbacks
    const orderSummary = document.getElementById("order-summary");
    if (orderSummary) {
        orderSummary.innerHTML = cartItems.length > 0 
            ? cartItems.map(item => `
                <div class="order-item">
                    <span>${item.name || 'Unknown Item'} (${item.quantity || 1})</span>
                    <span>₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              `).join('')
            : '<div class="empty-order">No items in order</div>';
    }

    // Set total amounts with fallbacks
    const setElementText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    
    setElementText("order-total", `₹${totalAmount.toFixed(2)}`);
    setElementText("total-amount", totalAmount.toFixed(2));

    billingForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Get form data with validation
        const formData = {
            name: document.getElementById("name")?.value.trim() || 'Guest',
            address: document.getElementById("address")?.value.trim() || 'Not specified',
            phone: document.getElementById("phone")?.value.trim() || 'Not provided',
            paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'Cash on Delivery'
        };

        // Save to localStorage
        Object.entries(formData).forEach(([key, value]) => {
            localStorage.setItem(`customer${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
        });
        localStorage.setItem("totalAmount", totalAmount.toFixed(2));

        // Clear cart and redirect
        localStorage.removeItem("cartItems");
        window.location.href = "order-confirmation.html";
    });
});
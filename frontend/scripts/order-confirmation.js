document.addEventListener("DOMContentLoaded", function() {
    // Generate order ID with timestamp for better uniqueness
    const orderId = `ORD${Date.now().toString().slice(-6)}`;
    const paymentMethod = localStorage.getItem("paymentMethod") || "Cash on Delivery";
    const totalAmount = localStorage.getItem("totalAmount") || "0.00";
    const customerName = localStorage.getItem("customerName") || "Customer";
    const customerAddress = localStorage.getItem("customerAddress") || "Address not specified";

    // Set order details with null checks
    const setElementText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setElementText("order-id", orderId);
    setElementText("payment-method", paymentMethod);
    setElementText("total-amount", `₹${totalAmount}`);
    setElementText("customer-name", customerName);
    setElementText("customer-address", customerAddress);

    // Cleanup localStorage
    ['customerName', 'customerAddress', 'customerPhone', 'paymentMethod', 'totalAmount'].forEach(key => {
        localStorage.removeItem(key);
    });

    // Countdown timer with better UX
    const countdownElement = document.getElementById("countdown");
    if (countdownElement) {
        let countdown = 10;
        const timer = setInterval(() => {
            countdownElement.textContent = countdown;
            if (--countdown <= 0) {
                clearInterval(timer);
                window.location.href = "/Home/home.html";
            }
        }, 1000);
    }
});
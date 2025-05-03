document.addEventListener("DOMContentLoaded", function () {
    const paymentOptions = document.querySelectorAll(".payment-option input");
    const payNowButton = document.getElementById("pay-now");

    // Function to update the selected payment option
    function updateSelection() {
        document.querySelectorAll(".payment-option").forEach(option => {
            option.style.background = "#f9f9f9"; // Default background
            option.style.color = "#333"; // Default text color
            option.style.boxShadow = "0px 3px 8px rgba(0, 0, 0, 0.1)"; // Default shadow
        });

        const selectedOption = document.querySelector(".payment-option input:checked");
        if (selectedOption) {
            const parentOption = selectedOption.closest(".payment-option");
            parentOption.style.background = "#007BFF"; // Highlight selected option
            parentOption.style.color = "#fff"; // Change text color
            parentOption.style.boxShadow = "0px 5px 10px rgba(0, 123, 255, 0.5)";
        }
    }

    // Add event listeners to update selection when clicked
    paymentOptions.forEach(option => {
        option.addEventListener("change", updateSelection);
    });

    // Handle "Proceed to Payment" button click
    payNowButton.addEventListener("click", function () {
        const selectedMethod = document.querySelector(".payment-option input:checked");
        if (selectedMethod) {
            alert(`Payment Successful! You have selected: ${selectedMethod.value.toUpperCase()}.`);
            
            // Redirect to order-confirmation page after 1 second
            setTimeout(() => {
                window.location.href = "order-confirmation.html";
            }, 1000);
            
        } else {
            alert("Please select a payment method before proceeding.");
        }
    });

    // Initialize default selection (if any)
    updateSelection();
});

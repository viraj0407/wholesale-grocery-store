document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById("toggle-password");
    const passwordField = document.getElementById("signup-password");
    const confirmPasswordField = document.getElementById("confirm-password");
    const BACKEND_URL = "https://wholesale-grocery-store.onrender.com";

    // Toggle password visibility
    togglePassword.addEventListener("change", function () {
        const type = this.checked ? "text" : "password";
        passwordField.type = type;
        confirmPasswordField.type = type;
    });

    // Signup event listener
    document.getElementById("signup-btn").addEventListener("click", async function (event) {
        event.preventDefault();

        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/grocery/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert("Signup successful! Please log in.");
                window.location.href = "/Home/login.html";
            } else {
                alert("Signup failed!");
            }
        } catch (error) {
            alert("An error occurred during signup.");
        }
    });
});

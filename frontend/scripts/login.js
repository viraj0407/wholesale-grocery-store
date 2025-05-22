document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-btn").addEventListener("click", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const BACKEND_URL = "https://wholesale-grocery-store.onrender.com";

        try {
            const response = await fetch(`${BACKEND_URL}/api/grocery/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("userEmail", email);
                window.location.href = "/Home/home.html";
            } else {
                alert("Login failed!");
            }
        } catch (error) {
            alert("An error occurred during login.");
        }
    });

    // Show/Hide password functionality
    document.getElementById("toggle-password").addEventListener("click", function () {
        const passwordInput = document.getElementById("password");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");
    const userEmailDisplay = document.getElementById("user-email");
    const groceryContainer = document.getElementById("grocery-container");
    const searchInput = document.getElementById("search-input");
    const cartCount = document.getElementById("cart-count");
    const profileDropdown = document.getElementById("profile-dropdown");
    const BACKEND_URL = "https://wholesale-grocery-store.onrender.com"; // 🔁 Replace with your actual Render backend URL

    if (!groceryContainer) return;

    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading";
    loadingIndicator.textContent = "Loading products...";
    groceryContainer.appendChild(loadingIndicator);

    let groceriesData = [];

    fetch(`${BACKEND_URL}/api/grocery/list`)
        .then(res => res.json())
        .then(data => {
            if (data.success && Array.isArray(data.data)) {
                groceriesData = data.data;
                displayGroceries(groceriesData);
            } else {
                throw new Error("Invalid data format received");
            }
        })
        .catch(error => {
            console.error("Error loading groceries:", error);
            groceryContainer.innerHTML = `<div class="error">Error loading products. Please try again later.</div>`;
        });

    function displayGroceries(groceries) {
        groceryContainer.innerHTML = "";
        if (groceries.length === 0) {
            groceryContainer.innerHTML = '<div class="empty">No products available</div>';
            return;
        }

        groceries.forEach(grocery => {
            const groceryCard = document.createElement("div");
            groceryCard.className = "grocery-card";
            groceryCard.innerHTML = `
                <img src="${BACKEND_URL}/api/grocery/images/${grocery.image}" 
                     alt="${grocery.name}" 
                     onerror="this.src='/images/placeholder.jpg'">
                <h3>${grocery.name}</h3>
                <p class="description">${grocery.description}</p>
                <p class="price">Retail: ₹${(grocery.retail_Price || 0).toFixed(2)} per kg</p>
                <p class="wholesale-price">Wholesale: ₹${(grocery.wholesale_Price || 0).toFixed(2)} per kg</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="1" min="1">
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="add-to-cart-btn" 
                        data-id="${grocery._id}" 
                        data-name="${grocery.name}" 
                        data-price="${grocery.wholesale_Price}"
                        data-image="${grocery.image}">
                    Add to Cart
                </button>
            `;
            groceryContainer.appendChild(groceryCard);
        });
    }

    groceryContainer.addEventListener("click", function (e) {
        const card = e.target.closest(".grocery-card");
        if (!card) return;

        if (e.target.classList.contains("minus")) {
            const input = card.querySelector(".quantity-input");
            if (input.value > 1) input.value--;
        }

        if (e.target.classList.contains("plus")) {
            const input = card.querySelector(".quantity-input");
            input.value++;
        }

        if (e.target.classList.contains("add-to-cart-btn")) {
            const quantity = parseInt(card.querySelector(".quantity-input").value);
            const item = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: parseFloat(e.target.dataset.price),
                quantity: quantity,
                image: e.target.dataset.image
            };
            addToCart(item);
            showToast(`${quantity} ${item.name} added to cart!`);
        }
    });

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = searchInput.value.toLowerCase();
            const filteredGroceries = groceriesData.filter(grocery =>
                grocery.name.toLowerCase().includes(query)
            );
            displayGroceries(filteredGroceries);
        });
    }

    const authToken = localStorage.getItem("authToken");
    if (authToken) {
        loginBtn.textContent = "Profile";
        loginBtn.href = "#";

        fetch(`${BACKEND_URL}/api/auth/user-details`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                userEmailDisplay.textContent = data.email || "User";
            }
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
            localStorage.removeItem("authToken");
        });

        loginBtn.addEventListener("click", function (event) {
            event.preventDefault();
            profileDropdown.classList.toggle("show");
        });
    }

    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
        }, 10);
    }

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    function addToCart(item) {
        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cartItems.push(item);
        }
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateCartCount();
    }

    function updateCartCount() {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        if (cartCount) cartCount.textContent = count;
    }

    updateCartCount();

    // Category Filtering
    document.querySelectorAll(".category").forEach(category => {
        category.addEventListener("click", function () {
            const currentCategory = this.dataset.category;
            groceryContainer.innerHTML = "";
            document.querySelector(".product-container").style.display = "block";

            if (currentCategory === "all") {
                displayGroceries(groceriesData);
            } else {
                const filteredProducts = groceriesData.filter(product =>
                    product.category === currentCategory
                );
                displayGroceries(filteredProducts);
            }
        });
    });
});

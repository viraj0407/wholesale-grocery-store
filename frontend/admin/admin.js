// Admin Panel Main Script
document.addEventListener("DOMContentLoaded", function() {
    // Show initial section
    showSection('products');
    
    // Load products when page loads
    loadProducts();
    
    // Set up form submission for adding products
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await addProduct();
        });
    }
});

// Function to show sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
        
        // Load relevant data when section is shown
        if (sectionId === 'products') {
            loadProducts();
        } else if (sectionId === 'orders') {
            loadOrders();
        }
    }
}

const BACKEND_URL = "https://wholesale-grocery-store.onrender.com";
// Function to load products from server
async function loadProducts() {
    try {
        const response = await fetch(`h${BACKEND_URL}/api/grocery/list)`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
            renderProducts(data.data);
        } else {
            throw new Error(data.message || 'Invalid products data received');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading products: ' + error.message);
    }
}

// Function to render products in the table
function renderProducts(products) {
    const tableBody = document.querySelector('#product-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product._id || 'N/A'}</td>
            <td>${product.name || 'N/A'}</td>
            <td>₹${product.retail_Price ? Number(product.retail_Price).toFixed(2) : '0.00'}</td>
            <td>${product.stock || 'N/A'}</td>
            <td>
                <button onclick="editProduct('${product._id}')">Edit</button>
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to add a new product
async function addProduct() {
    const form = document.getElementById('add-product-form');
    if (!form) return;

    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'wholesale_Price', 'retail_Price', 'category'];
    for (const field of requiredFields) {
        const input = form.querySelector(`[name="${field}"]`);
        if (!input || !input.value.trim()) {
            alert(`Please fill in the ${field.replace('_', ' ')} field`);
            return;
        }
    }
    
    // Validate image
    const imageInput = form.querySelector('[name="image"]');
    if (!imageInput || !imageInput.files[0]) {
        alert('Please select an image');
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/grocery/add`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to add product');
        }
        
        if (result.success) {
            alert('Product added successfully!');
            form.reset();
            const imagePreview = document.getElementById('image-preview');
            if (imagePreview) imagePreview.style.display = 'none';
            loadProducts();
        } else {
            throw new Error(result.message || 'Failed to add product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding product: ' + error.message);
    }
}

// Function to edit a product
async function editProduct(productId) {
    if (!productId) return;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/grocery/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const result = await response.json();
        if (result.success && result.data) {
            const product = result.data;
            const editForm = `
                <h3>Edit Product</h3>
                <form id="edit-product-form">
                    <input type="hidden" name="id" value="${product._id}">
                    <label>Name: <input type="text" name="name" value="${product.name || ''}" required></label><br>
                    <label>Description: <textarea name="description" required>${product.description || ''}</textarea></label><br>
                    <label>Wholesale Price: <input type="number" name="wholesale_Price" value="${product.wholesale_Price || 0}" step="0.01" min="0" required></label><br>
                    <label>Retail Price: <input type="number" name="retail_Price" value="${product.retail_Price || 0}" step="0.01" min="0" required></label><br>
                    <label>Category: 
                        <select name="category">
                            <option value="fruits" ${product.category === 'fruits' ? 'selected' : ''}>Fruits</option>
                            <option value="vegetables" ${product.category === 'vegetables' ? 'selected' : ''}>Vegetables</option>
                            <option value="dairy" ${product.category === 'dairy' ? 'selected' : ''}>Dairy Products</option>
                        </select>
                    </label><br>
                    <button type="submit">Save Changes</button>
                    <button type="button" onclick="closeModal()">Cancel</button>
                </form>
            `;
            
            showModal(editForm);
            
            const editFormElement = document.getElementById('edit-product-form');
            if (editFormElement) {
                editFormElement.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    await updateProduct();
                });
            }
        } else {
            throw new Error(result.message || 'Product data not found');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error editing product: ' + error.message);
    }
}

// Function to update a product
async function updateProduct() {
    const form = document.getElementById('edit-product-form');
    if (!form) return;

    const formData = new FormData(form);
    const productId = formData.get('id');
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/grocery/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update product');
        }
        
        if (result.success) {
            alert('Product updated successfully!');
            closeModal();
            loadProducts();
        } else {
            throw new Error(result.message || 'Failed to update product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating product: ' + error.message);
    }
}

// Function to delete a product
async function deleteProduct(productId) {
    if (!productId || !confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/grocery/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: productId })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete product');
        }
        
        if (result.success) {
            alert('Product deleted successfully!');
            loadProducts();
        } else {
            throw new Error(result.message || 'Failed to delete product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting product: ' + error.message);
    }
}

// Function to load orders (dummy data)
async function loadOrders() {
    try {
        const orders = [
            { id: 'ORD12345', customer: 'John Doe', status: 'Delivered', total: '₹1250.00' },
            { id: 'ORD12346', customer: 'Jane Smith', status: 'Processing', total: '₹850.00' }
        ];
        renderOrders(orders);
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading orders: ' + error.message);
    }
}

// Function to render orders
function renderOrders(orders) {
    const tableBody = document.querySelector('#order-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id || 'N/A'}</td>
            <td>${order.customer || 'N/A'}</td>
            <td>${order.status || 'N/A'}</td>
            <td>${order.total || '₹0.00'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to preview images
function previewImage(event) {
    if (!event.target.files || !event.target.files[0]) return;
    
    const reader = new FileReader();
    const outputId = event.target.id === 'profile-image-upload' ? 'profile-image' : 'image-preview';
    const output = document.getElementById(outputId);
    
    if (!output) return;
    
    reader.onload = function() {
        output.src = reader.result;
        output.style.display = 'block';
    };
    
    reader.readAsDataURL(event.target.files[0]);
}

// Modal functions
function showModal(content) {
    closeModal(); // Close any existing modal first
    
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.maxWidth = '80%';
    modalContent.style.maxHeight = '80%';
    modalContent.style.overflow = 'auto';
    modalContent.innerHTML = content;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Function to update profile
async function updateProfile() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    const formData = new FormData(form);
    
    try {
        // In a real app, you would send this to your API
        alert("Profile updated successfully!");
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating profile: ' + error.message);
    }
}
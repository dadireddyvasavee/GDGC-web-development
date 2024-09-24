
let cart = [];


const COUPON_DISCOUNT = 50;
const PLATFORM_FEE = 10;
const SHIPPING_CHARGES = 20;


function fetchProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            displayProducts(data);
        });
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';

    products.forEach(product => {
        productContainer.innerHTML += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <h5>${product.title}</h5>
            <p>₹${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
        `;
    });
}


function addToCart(productId) {
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            const existingProduct = cart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }
            displayCart();
        });
}


function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    displayCart();
}


function updateQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            displayCart();
        }
    }
}


function displayCart() {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        cartContainer.innerHTML += `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <p>${item.title}</p>
            <p>₹${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
        `;
    });

    calculateTotal();
}


function calculateTotal() {
   
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  
    const total = subtotal - COUPON_DISCOUNT + PLATFORM_FEE + SHIPPING_CHARGES;

   
    document.getElementById('total-price').innerText = `
        Subtotal: ₹${subtotal} \n
        Coupon Discount: -₹${COUPON_DISCOUNT} \n
        Platform Fee: +₹${PLATFORM_FEE} \n
        Shipping Charges: +₹${SHIPPING_CHARGES} \n
        Total Amount: ₹${total}
    `;
}

function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(products => {
            const filteredProducts = products.filter(product =>
                product.title.toLowerCase().includes(searchTerm)
            );
            displayProducts(filteredProducts);
        });
}


fetchProducts();

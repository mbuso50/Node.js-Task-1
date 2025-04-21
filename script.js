const mediaData = {
    movies: [
        {
            id: 1,
            title: "The Silent Journey",
            description: "A breathtaking adventure through untouched landscapes.",
            price: 180.99,
            image: "assets/movie1.jpeg"
        },
        {
            id: 2,
            title: "Urban Dreams",
            description: "A story of ambition and self-discovery in the big city.",
            price: 150.99,
            image: "assets/movie2.jpeg"
        },
        {
            id: 3,
            title: "Ocean Mysteries",
            description: "Explore the unknown depths of our planet's oceans.",
            price: 165.99,
            image: "assets/movie3.jpeg"
        }
    ],
    series: [
        {
            id: 1,
            title: "Frontier Explorers",
            description: "Season 1 - Follow pioneers as they chart new territories.",
            price: 280.99,
            image: "assets/series1.jpeg"
        },
        {
            id: 2,
            title: "Tech Revolution",
            description: "Season 1-3 - The complete story of digital transformation.",
            price: 470.99,
            image: "assets/series2.jpeg"
        },
        {
            id: 3,
            title: "Culinary Adventures",
            description: "Season 1-2 - Travel the world through its cuisines.",
            price: 380.99,
            image: "assets/series3.jpeg"
        }
    ],
    songs: [
        {
            id: 1,
            title: "Sunrise Melodies",
            description: "Instrumental track perfect for morning routines.",
            price: 18.99,
            image: "assets/song1.jpeg"
        },
        {
            id: 2,
            title: "Urban Beats",
            description: "Energetic electronic music for workouts.",
            price: 18.99,
            image: "assets/song.png"
        },
        {
            id: 3,
            title: "Nature's Symphony",
            description: "Relaxing sounds of nature with soft piano.",
            price: 18.99,
            image: "assets/song3.jpeg"
        }
    ]
};

let cart = [];

const moviesGrid = document.getElementById('movies-grid');
const seriesGrid = document.getElementById('series-grid');
const songsGrid = document.getElementById('songs-grid');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');

function initStore() {
    renderProducts('movies', moviesGrid);
    renderProducts('series', seriesGrid);
    renderProducts('songs', songsGrid);

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

function renderProducts(category, container) {
    container.innerHTML = '';

    mediaData[category].forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${item.title}</h3>
                <p class="product-description">${item.description}</p>
                <p class="product-price">R${item.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${item.id}" data-category="${category}">Add to Cart</button>
            </div>
        `;

        container.appendChild(productCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function addToCart(e) {
    const id = parseInt(e.target.dataset.id);
    const category = e.target.dataset.category;

    const product = mediaData[category].find(item => item.id === id);

    const existingItem = cart.find(item => item.id === id && item.category === category);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            category,
            quantity: 1
        });
    }

    updateCart();
    showCartNotification();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        totalAmount.textContent = '0';
    } else {
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">R${item.price.toFixed(2)} x ${item.quantity}</span>
                </div>
                <div class="cart-item-total">R${itemTotal.toFixed(2)}</div>
                <span class="remove-item" data-id="${item.id}" data-category="${item.category}">&times;</span>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        totalAmount.textContent = total.toFixed(2);

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
}

function removeFromCart(e) {
    const id = parseInt(e.target.dataset.id);
    const category = e.target.dataset.category;

    const itemIndex = cart.findIndex(item => item.id === id && item.category === category);

    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        updateCart();
    }
}

function showCartNotification() {
    cartIcon.classList.add('animate');
    setTimeout(() => {
        cartIcon.classList.remove('animate');
    }, 500);
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert(`Thank you for your purchase! Total: R${totalAmount.textContent}`);
    cart = [];
    updateCart();
    cartModal.style.display = 'none';
}

cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

checkoutBtn.addEventListener('click', checkout);

document.addEventListener('DOMContentLoaded', initStore);


        // Global variables
        let allProducts = [];
        let currentProduct = null;
        let currentImages = [];
        let currentImageIndex = 0;
        let quantity = 1;
        let isWishlisted = false;

        // Utility functions
        function getUrlParameter(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        function formatPrice(price) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(price).replace('₹', '₹');
        }

        function showElement(elementId) {
            document.getElementById(elementId).classList.remove('hidden');
        }

        function hideElement(elementId) {
            document.getElementById(elementId).classList.add('hidden');
        }

        function goHome() {
            // Create a simple product listing page or redirect to your homepage
            window.location.href = 'index.html'; // or your main page
        }

        // Data fetching
        async function fetchProductData() {
    const sheetID = "1B9IM5kmko00x81hLGxUmb47HhNTTOkxIgQxQFDrL0aY"; // same as homepage
    const sheetName = "Sheet1"; // change if different
    const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    try {
        const res = await fetch(sheetURL);
        const text = await res.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows || [];

        // Convert Google Sheet rows into product objects
        return rows.map(row => ({
            id: row.c[0]?.v ?? "",
            title: row.c[1]?.v ?? "Untitled",
            brand: row.c[2]?.v ?? "",
            price: parseInt(row.c[3]?.v ?? 0),
            old_price: parseInt(row.c[4]?.v ?? 0),
            discount: parseInt(row.c[5]?.v ?? 0),
            rating: parseFloat(row.c[6]?.v ?? 0),
            reviews: parseInt(row.c[7]?.v ?? 0),
            warranty: row.c[8]?.v ?? "",
            image_urls: row.c[9]?.v ?? "",
            description: row.c[10]?.v ?? "",
            features: row.c[11]?.v ?? ""
        }));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch product data');
    }
}


        // Image gallery functions
        function updateMainImage() {
            const mainImage = document.getElementById('mainImage');
            if (currentImages.length > 0) {
                mainImage.src = currentImages[currentImageIndex];
                mainImage.alt = `${currentProduct.title} - Image ${currentImageIndex + 1}`;
            }
            updateImageIndicators();
            updateThumbnails();
        }

        function updateImageIndicators() {
            const indicators = document.getElementById('imageIndicators');
            indicators.innerHTML = '';
            
            if (currentImages.length > 1) {
                currentImages.forEach((_, index) => {
                    const indicator = document.createElement('div');
                    indicator.className = `indicator ${index === currentImageIndex ? 'active' : ''}`;
                    indicator.onclick = () => setCurrentImage(index);
                    indicators.appendChild(indicator);
                });
            }
        }

        function updateThumbnails() {
            const thumbnailGrid = document.getElementById('thumbnailGrid');
            thumbnailGrid.innerHTML = '';
            
            if (currentImages.length > 1) {
                currentImages.forEach((image, index) => {
                    const thumbnail = document.createElement('div');
                    thumbnail.className = `thumbnail ${index === currentImageIndex ? 'active' : ''}`;
                    thumbnail.onclick = () => setCurrentImage(index);
                    
                    const img = document.createElement('img');
                    img.src = image;
                    img.alt = `${currentProduct.title} thumbnail ${index + 1}`;
                    img.onerror = () => { img.src = 'https://via.placeholder.com/200x200?text=No+Image'; };
                    
                    thumbnail.appendChild(img);
                    thumbnailGrid.appendChild(thumbnail);
                });
            }
        }

        function setCurrentImage(index) {
            currentImageIndex = index;
            updateMainImage();
        }

        function previousImage() {
            currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
            updateMainImage();
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % currentImages.length;
            updateMainImage();
        }

        // Quantity functions
        function updateQuantityDisplay() {
            document.getElementById('quantityDisplay').textContent = quantity;
            document.getElementById('decreaseBtn').disabled = quantity <= 1;
            document.getElementById('increaseBtn').disabled = quantity >= 10;
        }

        function increaseQuantity() {
            if (quantity < 10) {
                quantity++;
                updateQuantityDisplay();
            }
        }

        function decreaseQuantity() {
            if (quantity > 1) {
                quantity--;
                updateQuantityDisplay();
            }
        }

        // Action functions
      function addToCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(item => item.id === currentProduct.id);

    if (existingIndex > -1) {
        cart[existingIndex].qty += quantity; // qty ka use karo
    } else {
        cart.push({
            id: currentProduct.id,
            title: currentProduct.title,
            brand: currentProduct.brand,
            price: Number(currentProduct.price), // number me store karo
            image: currentImages[0] || 'https://via.placeholder.com/200x200?text=No+Image',
            qty: quantity // yaha bhi qty rakho
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} × ${currentProduct.title} added to your cart!`);
    // window.location.href = 'cart.html';
}



        function toggleWishlist() {
            isWishlisted = !isWishlisted;
            const wishlistBtn = document.getElementById('wishlistBtn');
            wishlistBtn.textContent = isWishlisted ? '♥' : '♡';
            wishlistBtn.classList.toggle('active', isWishlisted);
        }

        // Product display functions
        function displayProduct(product) {
            currentProduct = product;
            currentImages = product.image_urls.split(',').map(url => url.trim()).filter(Boolean);
            currentImageIndex = 0;

            // Update page title
            document.title = `${product.title} - ${product.brand} | Mobile Phone Store`;
            
            // Update header
            document.getElementById('headerTitle').textContent = `${product.brand} ${product.title}`;

            // Update product details
            document.getElementById('productBrand').textContent = product.brand;
            document.getElementById('productTitle').textContent = product.title;
            document.getElementById('productRating').textContent = product.rating;
            document.getElementById('productReviews').textContent = `${product.reviews.toLocaleString()} reviews`;

            // Update pricing
            document.getElementById('currentPrice').textContent = formatPrice(product.price);
            
            const oldPriceElement = document.getElementById('oldPrice');
            const discountBadgeElement = document.getElementById('discountBadge');
            const savingsTextElement = document.getElementById('savingsText');
            
            if (product.old_price > product.price) {
                oldPriceElement.textContent = formatPrice(product.old_price);
                oldPriceElement.style.display = 'inline';
                discountBadgeElement.textContent = `${product.discount}% OFF`;
                discountBadgeElement.style.display = 'inline';
                savingsTextElement.textContent = `You save ${formatPrice(product.old_price - product.price)}!`;
                savingsTextElement.style.display = 'block';
            } else {
                oldPriceElement.style.display = 'none';
                discountBadgeElement.style.display = 'none';
                savingsTextElement.style.display = 'none';
            }

            // Update warranty
            const warrantyInfo = document.getElementById('warrantyInfo');
            if (product.warranty) {
                document.getElementById('warrantyText').textContent = product.warranty;
                warrantyInfo.style.display = 'flex';
            } else {
                warrantyInfo.style.display = 'none';
            }

            // Update description
            document.getElementById('productDescription').textContent = product.description;

            // Update features
            const features = product.features.split(',').map(feature => feature.trim()).filter(Boolean);
            const featuresSection = document.getElementById('featuresSection');
            const featuresList = document.getElementById('featuresList');
            
            if (features.length > 0) {
                featuresList.innerHTML = '';
                features.forEach(feature => {
                    const li = document.createElement('li');
                    li.className = 'feature-item';
                    li.innerHTML = `
                        <div class="feature-bullet"></div>
                        <span class="feature-text">${feature}</span>
                    `;
                    featuresList.appendChild(li);
                });
                featuresSection.style.display = 'block';
            } else {
                featuresSection.style.display = 'none';
            }

            // Update images
            updateMainImage();
            
            // Show/hide navigation buttons
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            if (currentImages.length > 1) {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }

            // Reset quantity and wishlist
            quantity = 1;
            isWishlisted = false;
            updateQuantityDisplay();
            document.getElementById('wishlistBtn').textContent = '♡';
            document.getElementById('wishlistBtn').classList.remove('active');
        }

        function displayRecommendedProducts(products, currentProductId) {
            const otherProducts = products.filter(p => p.id !== currentProductId);
            const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
            const recommendations = shuffled.slice(0, 4);

            const recommendedContainer = document.getElementById('recommendedProducts');
            const recommendationsSection = document.getElementById('recommendationsSection');

            if (recommendations.length === 0) {
                recommendationsSection.style.display = 'none';
                return;
            }

            recommendationsSection.style.display = 'block';
            recommendedContainer.innerHTML = '';

            recommendations.forEach(product => {
                const images = product.image_urls.split(',').map(url => url.trim()).filter(Boolean);
                const mainImage = images[0] || 'https://via.placeholder.com/200x200?text=No+Image';

                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.onclick = () => {
                    window.location.href = `?id=${product.id}`;
                };

                productCard.innerHTML = `
                    <div class="product-image-container">
                        <img class="product-image" src="${mainImage}" alt="${product.title}" 
                             onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'">
                        ${product.discount > 0 ? `<div class="product-discount">${product.discount}% OFF</div>` : ''}
                    </div>
                    <div class="product-info">
                        <p class="product-brand">${product.brand}</p>
                        <h3 class="product-name">${product.title}</h3>
                        <div class="product-rating">
                            <div class="rating-small">
                                <span>${product.rating}</span>
                                <span>★</span>
                            </div>
                            <span class="reviews-small">(${product.reviews})</span>
                        </div>
                        <div class="product-pricing">
                            <span class="price-large">${formatPrice(product.price)}</span>
                            ${product.old_price > product.price ? `
                                <span class="price-old-small">${formatPrice(product.old_price)}</span>
                                <span class="discount-small">${product.discount}% off</span>
                            ` : ''}
                        </div>
                    </div>
                `;

                recommendedContainer.appendChild(productCard);
            });
        }

        // Main initialization function
        async function init() {
            const productId = getUrlParameter('id');
            
            if (!productId) {
                hideElement('loadingState');
                showElement('notFoundState');
                return;
            }

            try {
                hideElement('errorState');
                hideElement('notFoundState');
                hideElement('mainContent');
                showElement('loadingState');

                allProducts = await fetchProductData();
                const product = allProducts.find(p => String(p.id).trim() === String(productId).trim());


                hideElement('loadingState');

                if (!product) {
                    showElement('notFoundState');
                    return;
                }

                displayProduct(product);
                initRatingSystem(product.id);
                displayRecommendedProducts(allProducts, productId);
                showElement('mainContent');

            } catch (error) {
                hideElement('loadingState');
                document.getElementById('errorMessage').textContent = error.message;
                showElement('errorState');
            }
        }

        function initRatingSystem(productId) {
    let selectedRating = 0;
    document.querySelectorAll("#ratingStars span").forEach(star => {
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-star"));
            highlightStars(selectedRating);
            saveRating(productId, selectedRating);
        });
    });
}

function highlightStars(count) {
    document.querySelectorAll("#ratingStars span").forEach(star => {
        star.classList.toggle("selected", parseInt(star.getAttribute("data-star")) <= count);
    });
}

function saveRating(productId, rating) {
    fetch("YOUR_GOOGLE_SCRIPT_WEBAPP_URL", {
        method: "POST",
        body: JSON.stringify({ action: "updateRating", id: productId, rating: rating })
    })
    .then(res => res.text())
    .then(data => {
        document.getElementById("ratingMessage").innerText = "Thanks for your rating!";
    })
    .catch(err => {
        document.getElementById("ratingMessage").innerText = "Error saving rating!";
        console.error(err);
    });
}


        // Initialize the page when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);

        // Handle image loading errors
        document.addEventListener('error', function(e) {
            if (e.target.tagName === 'IMG') {
                e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
            }
        }, true);
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const productId = getUrlParameter('id');
        if (!productId) {
            hideElement('loadingState');
            showElement('notFoundState');
            return;
        }

        allProducts = await fetchProductData();
        const product = allProducts.find(p => String(p.id) === String(productId));

        hideElement('loadingState');

        if (!product) {
            showElement('notFoundState');
            return;
        }

        showElement('mainContent');
        displayProduct(product);
    } catch (error) {
        console.error(error);
        hideElement('loadingState');
        document.getElementById('errorMessage').textContent = error.message;
        showElement('errorState');
    }
});
function goToCart() {
    window.location.href = 'cart.html';
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}

// Page load hone ke baad cart count update
document.addEventListener('DOMContentLoaded', updateCartCount);

// Add to Cart hone ke baad count refresh
function addToCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === currentProduct.id);

    if (existingIndex > -1) {
        cart[existingIndex].qty += quantity;
    } else {
        cart.push({
            id: currentProduct.id,
            title: currentProduct.title,
            brand: currentProduct.brand,
            price: Number(currentProduct.price),
            image: currentImages[0] || 'https://via.placeholder.com/200x200?text=No+Image',
            qty: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // yaha refresh
    alert(`${quantity} × ${currentProduct.title} added to your cart!`);
}


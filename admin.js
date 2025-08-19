
        // Configuration - Replace with your Google Apps Script Web App URL
       const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxMP3-15HagViFGJcaa8SP0GhnLDziapli9MsFzOXraua8bsuitUrUJg09Cf7o1xVN8iw/exec";

document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    submitForm(formData); // validation hata ke test karo
});


        // Mock data for demonstration
        const mockProducts = [
            {
                id: "1",
                title: "iPhone 15 Pro Max",
                brand: "Apple",
                price: 1199,
                old_price: 1299,
                discount: 8,
                rating: 4.8,
                reviews: 1024,
                warranty: "1 year Apple warranty",
                image_urls: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
                description: "The most advanced iPhone with titanium design, A17 Pro chip, and professional camera system.",
                features: "Titanium Design, A17 Pro Chip, Pro Camera System, Action Button, USB-C"
            },
            {
                id: "2",
                title: "MacBook Air M3",
                brand: "Apple",
                price: 1099,
                old_price: 1199,
                discount: 8,
                rating: 4.9,
                reviews: 856,
                warranty: "1 year limited warranty",
                image_urls: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
                description: "Supercharged by the M3 chip, incredibly thin and light with up to 18 hours of battery life.",
                features: "M3 Chip, 13.6-inch Display, 18-hour Battery, Fanless Design, Magic Keyboard"
            },
            {
                id: "3",
                title: "AirPods Pro (2nd Gen)",
                brand: "Apple",
                price: 199,
                old_price: 249,
                discount: 20,
                rating: 4.7,
                reviews: 2150,
                warranty: "1 year warranty",
                image_urls: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
                description: "Next-level Active Noise Cancellation with Adaptive Transparency and Personalized Spatial Audio.",
                features: "Active Noise Cancellation, Transparency Mode, Spatial Audio, H2 Chip, USB-C"
            }
        ];

        // Initialize Lucide icons
        document.addEventListener('DOMContentLoaded', function() {
            lucide.createIcons();
            loadProducts();
        });

        // Toast notification system
        function showToast(message, type = 'success') {
            const toastContainer = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = message;
            
            toastContainer.appendChild(toast);
            
            // Show toast
            setTimeout(() => toast.classList.add('show'), 100);
            
            // Hide and remove toast
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toastContainer.removeChild(toast), 300);
            }, 3000);
        }

        // Form validation
        function validateForm(formData) {
            const requiredFields = ['title', 'brand', 'price', 'description'];
            const emptyFields = requiredFields.filter(field => !formData.get(field));
            
            if (emptyFields.length > 0) {
                showToast(`Please fill in all required fields: ${emptyFields.join(', ')}`, 'error');
                return false;
            }

            const price = parseFloat(formData.get('price'));
            if (isNaN(price) || price <= 0) {
                showToast('Please enter a valid price', 'error');
                return false;
            }

            const rating = formData.get('rating');
            if (rating && (isNaN(parseFloat(rating)) || parseFloat(rating) < 0 || parseFloat(rating) > 5)) {
                showToast('Rating must be between 0 and 5', 'error');
                return false;
            }

            return true;
        }

        // Submit form to Google Sheets
    async function submitForm(formData) {
  const dataToSubmit = {};
  formData.forEach((value, key) => {
    dataToSubmit[key] = value.trim();
  });

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: "no-cors", 
      body: JSON.stringify(dataToSubmit),
      headers: { 'Content-Type': 'application/json' }
    });

    const result = await res.json();
    if (result.success) {
      showToast("✅ Product added successfully!");
      document.getElementById('productForm').reset();
      loadProducts();
    } else {
      showToast("❌ Error: " + (result.error || "Unknown error"), 'error');
    }
  } catch (err) {
    showToast("❌ Request failed: " + err.message, 'error');
  }
}



        // Load products from Google Sheets (or mock data)
       async function loadProducts() {
  const container = document.getElementById('productsContainer');
  container.innerHTML = `<p>Loading...</p>`;

  try {
    const res = await fetch(APPS_SCRIPT_URL);
    const data = await res.json();
    const products = data.products || [];
    displayProducts(products);
    document.getElementById('productCount').textContent = `${products.length} items`;
  } catch (err) {
    container.innerHTML = `<p>Error loading products</p>`;
    console.error(err);
  }
}


        // Display products in grid
        function displayProducts(products) {
            const container = document.getElementById('productsContainer');
            
            if (products.length === 0) {
                container.innerHTML = `
                    <div class="card card-gradient">
                        <div class="empty-state">
                            <i data-lucide="package" style="width: 3rem; height: 3rem; margin: 0 auto 1rem; opacity: 0.5;"></i>
                            <p>No products found in sheet</p>
                            <p style="font-size: 0.875rem; margin-top: 0.5rem;">Add your first product using the form above</p>
                        </div>
                    </div>
                `;
            } else {
                const productsHtml = products.map(product => createProductCard(product)).join('');
                container.innerHTML = `<div class="products-grid">${productsHtml}</div>`;
            }
            
            lucide.createIcons();
        }

        // Create individual product card
        function createProductCard(product) {
            const imageUrl = product.image_urls?.split(',')[0]?.trim() || '';
            const discountPercent = product.old_price && product.price 
                ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
                : product.discount;

            const features = product.features ? product.features.split(',').slice(0, 3) : [];
            const moreFeatures = product.features ? product.features.split(',').length - 3 : 0;

            return `
                <div class="card product-card">
                    <div class="card-header">
                        <div class="product-header">
                            <div class="product-info">
                                <h3 class="product-title">${product.title}</h3>
                                <p class="product-brand">${product.brand}</p>
                            </div>
                            ${imageUrl ? `
                                <div class="product-image">
                                    <img src="${imageUrl}" alt="${product.title}" onerror="this.parentElement.style.display='none'">
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="product-content">
                        <div class="product-price">
                            <div class="price-info">
                                <i data-lucide="dollar-sign" class="icon" style="color: var(--success);"></i>
                                <span class="current-price">$${product.price}</span>
                                ${product.old_price ? `<span class="old-price">$${product.old_price}</span>` : ''}
                            </div>
                            ${discountPercent && discountPercent > 0 ? `
                                <span class="badge badge-destructive">-${discountPercent}%</span>
                            ` : ''}
                        </div>

                        <div class="product-rating">
                            <div class="rating-info">
                                <i data-lucide="star" class="icon" style="fill: currentColor;"></i>
                                <span>${product.rating || 'N/A'}</span>
                            </div>
                            <div class="reviews-info">
                                <i data-lucide="message-square" class="icon"></i>
                                <span>${product.reviews || 0} reviews</span>
                            </div>
                        </div>

                        ${product.warranty ? `
                            <div class="product-warranty">
                                <i data-lucide="shield" class="icon"></i>
                                <span>${product.warranty}</span>
                            </div>
                        ` : ''}

                        <p class="product-description">${product.description}</p>

                        ${features.length > 0 ? `
                            <div class="product-features">
                                ${features.map(feature => `
                                    <span class="feature-badge">${feature.trim()}</span>
                                `).join('')}
                                ${moreFeatures > 0 ? `
                                    <span class="badge badge-outline">+${moreFeatures} more</span>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        document.getElementById('refreshBtn').addEventListener('click', function() {
            loadProducts();
        });
document.getElementById("logoutBtn").addEventListener("click", () => {

  localStorage.clear();
  window.location.href = "index.html"; // ya login.html
});

const mockPhones = [
    {
        id: 1,
        brand: "Apple",
        model: "iPhone 15 Pro",
        price: 89999,
        condition: "New",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
        rating: 4.8,
        reviewCount: 142,
        uploadDate: "2024-01-15",
        features: ["A17 Pro chip", "48MP camera", "Titanium build", "USB-C", "Action Button"],
        isSold: false,
        videos: []
    },
    {
        id: 2,
        brand: "Samsung",
        model: "Galaxy S24 Ultra",
        price: 79999,
        condition: "Like New",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
        rating: 4.7,
        reviewCount: 98,
        uploadDate: "2024-01-10",
        features: ["Snapdragon 8 Gen 3", "200MP camera", "S Pen", "120Hz display", "5000mAh battery"],
        isSold: false,
        videos: []
    },
    {
        id: 3,
        brand: "Google",
        model: "Pixel 8 Pro",
        price: 65999,
        condition: "Used",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
        rating: 4.6,
        reviewCount: 67,
        uploadDate: "2024-01-08",
        features: ["Google Tensor G3", "AI photography", "Magic Eraser", "7 years updates", "Temperature sensor"],
        isSold: true,
        videos: []
    },
    {
        id: 4,
        brand: "OnePlus",
        model: "12 Pro",
        price: 55999,
        condition: "Refurbished",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=300&fit=crop",
        rating: 4.5,
        reviewCount: 89,
        uploadDate: "2024-01-05",
        features: ["Snapdragon 8 Gen 3", "Hasselblad camera", "100W charging", "OxygenOS 14", "Alert Slider"],
        isSold: false,
        videos: []
    },
    {
        id: 5,
        brand: "Xiaomi",
        model: "14 Ultra",
        price: 73999,
        condition: "New",
        image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=300&fit=crop",
        rating: 4.4,
        reviewCount: 156,
        uploadDate: "2024-01-12",
        features: ["Snapdragon 8 Gen 3", "Leica cameras", "90W charging", "MIUI 15", "IP68 rating"],
        isSold: false,
        videos: []
    },
    {
        id: 6,
        brand: "Apple",
        model: "iPhone 14",
        price: 59999,
        condition: "Used",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
        rating: 4.6,
        reviewCount: 203,
        uploadDate: "2024-01-03",
        features: ["A15 Bionic chip", "48MP main camera", "Ceramic Shield", "MagSafe", "Lightning port"],
        isSold: false,
        videos: []
    }
];

// State Management
let phones = [...mockPhones];
let wishlist = new Set();
let currentFilters = {
    brand: '',
    condition: '',
    minPrice: 5000,
    maxPrice: 100000,
    sort: 'latest'
};
let currentModalPhone = null;
let filteredPhones = [];

// DOM Elements
const phoneGrid = document.getElementById('phoneGrid');
const loading = document.getElementById('loading');
const resultsCount = document.getElementById('resultsCount');
const brandFilter = document.getElementById('brandFilter');
const conditionFilter = document.getElementById('conditionFilter');
const sortFilter = document.getElementById('sortFilter');
const minPriceSlider = document.getElementById('minPrice');
const maxPriceSlider = document.getElementById('maxPrice');
const minPriceLabel = document.getElementById('minPriceLabel');
const maxPriceLabel = document.getElementById('maxPriceLabel');
const clearFiltersBtn = document.getElementById('clearFilters');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalStars = document.getElementById('modalStars');
const modalReviews = document.getElementById('modalReviews');
const modalCondition = document.getElementById('modalCondition');
const modalDate = document.getElementById('modalDate');
const modalFeatures = document.getElementById('modalFeatures');
const modalWishlistBtn = document.getElementById('modalWishlistBtn');
const soldBadgeModal = document.getElementById('soldBadgeModal');
const closeModal = document.getElementById('closeModal');
const prevPhone = document.getElementById('prevPhone');
const nextPhone = document.getElementById('nextPhone');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    setupEventListeners();
    showLoading();
    
    // Simulate loading delay
    setTimeout(() => {
        hideLoading();
        filterAndSortPhones();
        renderPhones();
    }, 1000);
});

// Initialize Filters
function initializeFilters() {
    // Populate brand filter
    const brands = [...new Set(phones.map(phone => phone.brand))].sort();
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
    
    // Update price labels
    updatePriceLabels();
}

// Setup Event Listeners
function setupEventListeners() {
    brandFilter.addEventListener('change', handleFilterChange);
    conditionFilter.addEventListener('change', handleFilterChange);
    sortFilter.addEventListener('change', handleFilterChange);
    minPriceSlider.addEventListener('input', handlePriceChange);
    maxPriceSlider.addEventListener('input', handlePriceChange);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Modal events
    closeModal.addEventListener('click', closeImageModal);
    prevPhone.addEventListener('click', showPrevPhone);
    nextPhone.addEventListener('click', showNextPhone);
    
    // Close modal on background click
    imageModal.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (imageModal.classList.contains('active')) {
            if (e.key === 'Escape') closeImageModal();
            if (e.key === 'ArrowLeft') showPrevPhone();
            if (e.key === 'ArrowRight') showNextPhone();
        }
    });
}

// Filter and Sort Functions
function handleFilterChange() {
    currentFilters.brand = brandFilter.value;
    currentFilters.condition = conditionFilter.value;
    currentFilters.sort = sortFilter.value;
    
    filterAndSortPhones();
    renderPhones();
    updateClearButton();
}

function handlePriceChange() {
    let minPrice = parseInt(minPriceSlider.value);
    let maxPrice = parseInt(maxPriceSlider.value);
    
    // Ensure min is not greater than max
    if (minPrice > maxPrice) {
        if (event.target === minPriceSlider) {
            maxPrice = minPrice;
            maxPriceSlider.value = maxPrice;
        } else {
            minPrice = maxPrice;
            minPriceSlider.value = minPrice;
        }
    }
    
    currentFilters.minPrice = minPrice;
    currentFilters.maxPrice = maxPrice;
    
    updatePriceLabels();
    filterAndSortPhones();
    renderPhones();
    updateClearButton();
}

function updatePriceLabels() {
    minPriceLabel.textContent = currentFilters.minPrice.toLocaleString();
    maxPriceLabel.textContent = currentFilters.maxPrice.toLocaleString();
}

function clearFilters() {
    currentFilters = {
        brand: '',
        condition: '',
        minPrice: 5000,
        maxPrice: 100000,
        sort: 'latest'
    };
    
    brandFilter.value = '';
    conditionFilter.value = '';
    sortFilter.value = 'latest';
    minPriceSlider.value = 5000;
    maxPriceSlider.value = 100000;
    
    updatePriceLabels();
    filterAndSortPhones();
    renderPhones();
    updateClearButton();
}

function updateClearButton() {
    const hasActiveFilters = currentFilters.brand !== '' || 
                           currentFilters.condition !== '' ||
                           currentFilters.minPrice !== 5000 ||
                           currentFilters.maxPrice !== 100000 ||
                           currentFilters.sort !== 'latest';
    
    clearFiltersBtn.style.display = hasActiveFilters ? 'block' : 'none';
}

function filterAndSortPhones() {
    filteredPhones = phones.filter(phone => {
        const matchesBrand = !currentFilters.brand || phone.brand === currentFilters.brand;
        const matchesCondition = !currentFilters.condition || phone.condition === currentFilters.condition;
        const matchesPrice = phone.price >= currentFilters.minPrice && phone.price <= currentFilters.maxPrice;
        
        return matchesBrand && matchesCondition && matchesPrice;
    });
    
    // Sort phones
    filteredPhones.sort((a, b) => {
        switch (currentFilters.sort) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'latest':
            default:
                return new Date(b.uploadDate) - new Date(a.uploadDate);
        }
    });
    
    resultsCount.textContent = `${filteredPhones.length} phone${filteredPhones.length !== 1 ? 's' : ''} found`;
}

// Render Functions
function renderPhones() {
    phoneGrid.innerHTML = '';
    
    if (filteredPhones.length === 0) {
        phoneGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No phones found</h3>
                <p>Try adjusting your filters to see more results.</p>
            </div>
        `;
        return;
    }
    
    filteredPhones.forEach(phone => {
        const phoneCard = createPhoneCard(phone);
        phoneGrid.appendChild(phoneCard);
    });
}

function createPhoneCard(phone) {
    const card = document.createElement('div');
    card.className = 'phone-card';
    card.onclick = () => openImageModal(phone);
    
    const isWishlisted = wishlist.has(phone.id);
    const conditionClass = phone.condition.toLowerCase().replace(' ', '-');
    const formattedDate = formatDate(phone.uploadDate);
    const stars = generateStars(phone.rating);
    
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${phone.image}" alt="${phone.brand} ${phone.model}" class="card-image">
            ${phone.isSold ? '<div class="sold-badge">SOLD</div>' : ''}
            <div class="card-actions">
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(event, ${phone.id})">
                    <i class="fa${isWishlisted ? 's' : 'r'} fa-heart"></i>
                </button>
                <button class="share-btn-card" onclick="sharePhone(event, ${phone.id})">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
        <div class="card-content">
            <div class="card-header">
                <div class="brand-model">
                    <h3>${phone.brand}</h3>
                    <p>${phone.model}</p>
                </div>
                <div class="price">₹${phone.price.toLocaleString()}</div>
            </div>
            <div class="rating">
                <div class="stars">${stars}</div>
                <span class="review-count">(${phone.reviewCount})</span>
            </div>
            <div class="condition-date">
                <span class="condition ${conditionClass}">${phone.condition}</span>
                <span class="upload-date">${formattedDate}</span>
            </div>
            <div class="features-preview">
                ${phone.features.slice(0, 2).join(' • ')}${phone.features.length > 2 ? '...' : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Utility Functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star empty"></i>';
    }
    
    return stars;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Wishlist Functions
function toggleWishlist(event, phoneId) {
    event.stopPropagation();
    
    if (wishlist.has(phoneId)) {
        wishlist.delete(phoneId);
    } else {
        wishlist.add(phoneId);
    }
    
    // Update all wishlist buttons for this phone
    updateWishlistButtons(phoneId);
}

function updateWishlistButtons(phoneId) {
    const isWishlisted = wishlist.has(phoneId);
    
    // Update card button
    const cardButtons = document.querySelectorAll(`.wishlist-btn`);
    cardButtons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(phoneId)) {
            btn.className = `wishlist-btn ${isWishlisted ? 'active' : ''}`;
            btn.innerHTML = `<i class="fa${isWishlisted ? 's' : 'r'} fa-heart"></i>`;
        }
    });
    
    // Update modal button if current phone
    if (currentModalPhone && currentModalPhone.id === phoneId) {
        modalWishlistBtn.className = `wishlist-btn ${isWishlisted ? 'active' : ''}`;
        modalWishlistBtn.innerHTML = `<i class="fa${isWishlisted ? 's' : 'r'} fa-heart"></i>`;
    }
}

// Share Functions
function sharePhone(event, phoneId) {
    event.stopPropagation();
    const phone = phones.find(p => p.id === phoneId);
    if (phone) {
        openShareMenu(phone);
    }
}

function openShareMenu(phone) {
    const message = `Check out this ${phone.brand} ${phone.model} for ₹${phone.price.toLocaleString()}!`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: `${phone.brand} ${phone.model}`,
            text: message,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${message} ${url}`).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

function handleModalShare(platform) {
    if (!currentModalPhone) return;
    
    const phone = currentModalPhone;
    const message = `Check out this ${phone.brand} ${phone.model} for ₹${phone.price.toLocaleString()}!`;
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'instagram':
            // Instagram doesn't support direct sharing, copy to clipboard instead
            navigator.clipboard.writeText(message + ' ' + url).then(() => {
                alert('Link copied! You can now paste it on Instagram.');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Modal Functions
function openImageModal(phone) {
    currentModalPhone = phone;
    
    modalImage.src = phone.image;
    modalImage.alt = `${phone.brand} ${phone.model}`;
    modalTitle.textContent = `${phone.brand} ${phone.model}`;
    modalPrice.textContent = `₹${phone.price.toLocaleString()}`;
    modalStars.innerHTML = generateStars(phone.rating);
    modalReviews.textContent = `(${phone.reviewCount} reviews)`;
    modalCondition.textContent = phone.condition;
    modalCondition.className = `condition ${phone.condition.toLowerCase().replace(' ', '-')}`;
    modalDate.textContent = `Uploaded: ${formatDate(phone.uploadDate)}`;
    
    // Update features
    modalFeatures.innerHTML = '';
    phone.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        modalFeatures.appendChild(li);
    });
    
    // Update sold badge
    soldBadgeModal.style.display = phone.isSold ? 'block' : 'none';
    
    // Update wishlist button
    const isWishlisted = wishlist.has(phone.id);
    modalWishlistBtn.className = `wishlist-btn ${isWishlisted ? 'active' : ''}`;
    modalWishlistBtn.innerHTML = `<i class="fa${isWishlisted ? 's' : 'r'} fa-heart"></i>`;
    modalWishlistBtn.onclick = () => toggleWishlist(event, phone.id);
    
    // Setup share buttons
    document.querySelectorAll('.modal-share .share-btn').forEach(btn => {
        btn.onclick = () => handleModalShare(btn.dataset.platform);
    });
    
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentModalPhone = null;
}

function showPrevPhone() {
    if (!currentModalPhone) return;
    
    const currentIndex = filteredPhones.findIndex(phone => phone.id === currentModalPhone.id);
    if (currentIndex > 0) {
        openImageModal(filteredPhones[currentIndex - 1]);
    }
}

function showNextPhone() {
    if (!currentModalPhone) return;
    
    const currentIndex = filteredPhones.findIndex(phone => phone.id === currentModalPhone.id);
    if (currentIndex < filteredPhones.length - 1) {
        openImageModal(filteredPhones[currentIndex + 1]);
    }
}

// Loading Functions
function showLoading() {
    loading.style.display = 'block';
    phoneGrid.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    phoneGrid.style.display = 'grid';
}
/* ========== AUTO-BG HEADER ROTATION (fixed) ========== */
const autoImages = [
  "https://media.assettype.com/deccanherald%2F2024-11-21%2Fffbw1se4%2FApple-iPhone-16-Pro-Max-Cover-Photos-Selected-2.jpg?w=1200&ar=40%3A21&auto=format%2Ccompress&ogImage=true&mode=crop",
  "https://images.macrumors.com/t/Da3UrDQ0UTF_jKZabfryx0XK8RE=/800x0/smart/article-new/2025/02/iPhone-17-Roundup-Feature-1.jpg?lossy",
  "https://images.samsung.com/in/smartphones/galaxy-s25-ultra/buy/product_color_black_PC.png?imbypass=true",
  "https://rukminim2.flixcart.com/image/704/844/xif0q/mobile/p/g/i/12-cph2573-oneplus-original-imahyzy8wvsewgxx.jpeg?q=90&crop=false"
];

let imgIndex = 0;
const headerEl = document.getElementById("autoBgHeader");

function setHeaderBg(url) {
  if (!headerEl) return;
  headerEl.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${url})`;
}

function changeBgImage() {
  setHeaderBg(autoImages[imgIndex]);
  imgIndex = (imgIndex + 1) % autoImages.length;
}

// start/stop bg rotation with visibility API
changeBgImage();
let bgInterval = setInterval(changeBgImage, 3000);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(bgInterval);
    bgInterval = null;
  } else {
    if (!bgInterval) bgInterval = setInterval(changeBgImage, 3000);
  }
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

// Toggle menu
menuToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // toggle pe click karne se window click trigger na ho
  navLinks.classList.toggle("active");
});

// Close menu when clicking outside
window.addEventListener("click", (e) => {
  if (navLinks.classList.contains("active") && !navLinks.contains(e.target) && e.target !== menuToggle) {
    navLinks.classList.remove("active");
  }
});


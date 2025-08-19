

// Mobile Phone E-commerce Cart Application
class MobileStoreApp {
    constructor() {
        this.cart = [];
        this.currentPage = 'home';
        this.floatingCartTimer = null;
        this.toastTimer = null;
        
        this.init();
    }
    
    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartUI();
        this.showPage('cart');
        
        // Add sample items to cart for demonstration
        if (this.cart.length === 0) {
            this.addSampleItems();
        }
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    addSampleItems() {
        // Add sample items to showcase the cart functionality
        this.addToCart(this.phones[0], false); // iPhone
        this.addToCart(this.phones[1], false); // Samsung
        this.cart[1].qty = 2; // Set Samsung quantity to 2
        this.saveCart();
        this.updateCartUI();
    }
    
    setupEventListeners() {
        // Navigation
        document.getElementById('cartBtn').addEventListener('click', () => this.showPage('cart'));
   document.getElementById('continueShopping').addEventListener('click', () => {
    window.location.href = "index.html"; // apna page yaha dal
});

        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('nav');

if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('show');
    });
}
const menuBtn = document.getElementById('mobileMenuBtn');
const navEl = document.querySelector('nav');
const searchEl = document.querySelector('.search-container');

if (menuBtn && navEl && searchEl) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navEl.classList.toggle('show');
        searchEl.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!navEl.contains(e.target) && !searchEl.contains(e.target) && e.target !== menuBtn) {
            navEl.classList.remove('show');
            searchEl.classList.remove('show');
        }
    });
}

        // Floating cart
        document.getElementById('floatingViewCart').addEventListener('click', () => {
            this.hideFloatingCart();
            this.showPage('cart');
        });
        document.getElementById('floatingContinue').addEventListener('click', () => this.hideFloatingCart());
        document.getElementById('floatingCartClose').addEventListener('click', () => this.hideFloatingCart());
        
    

        
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showToast('Category', `Browsing ${btn.textContent} products`);
                this.showPage('cart');
            });
        });
    }
    
 loadCart() {
    const storedCart = localStorage.getItem('cart');
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    // Normalize keys so that every item has id, qty, price as number
    this.cart = parsedCart.map(item => ({
        id: String(item.id || item.productId || crypto.randomUUID()), // unique id ensure
 // ensure id exists
        title: item.title || "",
        brand: item.brand || "",
        price: parseFloat(String(item.price || 0).replace(/,/g, "")),
        image: item.image || "",
        variant: item.variant || "",
        estimatedDelivery: item.estimatedDelivery || "",
        stock: item.stock || null,
        qty: Number(item.qty || item.quantity || 1) // ensure qty exists
    }));
}


    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
  addToCart(phone, showNotification = true) {
  const existingItem = this.cart.find(item => item.id === phone.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    // ✅ FIX: spread operator sahi tareeke se
    this.cart.push({ ...phone, qty: 1 });
  }

  this.saveCart();
  this.updateCartUI();

  if (showNotification) {
    this.showFloatingCart(phone);
    this.showToast('✅ Added to cart', `${phone.title} has been added to your cart.`);
  }
}

    
    updateQuantity(id, newQty) {
        if (newQty <= 0) {
            this.removeFromCart(id);
            return;
        }
        
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.qty = newQty;
            this.saveCart();
            this.updateCartUI();
            this.showToast('Cart updated', 'Quantity has been updated successfully.');
        }
    }
    
removeFromCart(productId) {
    if (!productId) return; // safety check

    // Remove matching item
    this.cart = this.cart.filter(item => String(item.id) !== String(productId));

    this.saveCart();
    this.updateCartUI();

    // Optional: Toast message
    this.showToast('Removed from cart', 'The item has been removed successfully.');
}




    
    getCartSummary() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
        const subtotal = this.cart.reduce((sum, item) => {
    const numericPrice = parseFloat(
        String(item.price || 0).replace(/,/g, "")
    );
    return sum + (numericPrice * (item.qty || 0));
}, 0);


        const freeShippingThreshold = 50000; // ₹500
        const shipping = subtotal >= freeShippingThreshold ? 0 : 4900; // ₹49
        const discount = 0; // Can be calculated based on promo codes
        const total = subtotal + shipping - discount;
        
        return {
            totalItems,
            subtotal,
            shipping,
            discount,
            total,
            freeShippingThreshold
        };
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    }
    
    updateCartUI() {
        const summary = this.getCartSummary();
        
        // Update cart badge
        const cartBadge = document.getElementById('cartBadge');
        if (summary.totalItems > 0) {
            cartBadge.textContent = summary.totalItems;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
        
        // Update cart subtitle
        const cartSubtitle = document.getElementById('cartSubtitle');
        cartSubtitle.textContent = `${summary.totalItems} ${summary.totalItems === 1 ? 'item' : 'items'} in your cart`;
        
        // Show/hide cart content
        const emptyCart = document.getElementById('emptyCart');
        const cartItems = document.getElementById('cartItems');
        
        if (this.cart.length === 0) {
            emptyCart.style.display = 'flex';
            cartItems.style.display = 'none';
        } else {
            emptyCart.style.display = 'none';
            cartItems.style.display = 'grid';
            this.renderCartItems();
            this.renderCartSummary();
        }
    }
    
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';
        
        this.phones.forEach(phone => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${phone.image}" alt="${phone.title}" loading="lazy">
                </div>
                <div class="product-info">
                    <div>
                        <h3 class="product-title">${phone.title}</h3>
                        <p class="product-brand">${phone.brand}</p>
                        <p class="product-variant">${phone.variant}</p>
                    </div>
                    
                    <div class="product-badges">
                        <span class="badge badge-success">In Stock</span>
                        <span class="product-delivery">${phone.estimatedDelivery}</span>
                    </div>
                    
                    <div class="product-footer">
                        <span class="product-price">${this.formatPrice(phone.price)}</span>
                        <button class="btn btn-primary" onclick="app.addToCart(app.phones.find(p => p.id === '${phone.id}'))">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
    }
    
    renderCartItems() {
        const cartItemsList = document.getElementById('cartItemsList');
        cartItemsList.innerHTML = '';
        
        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            const stockStatus = this.getStockStatus(item);
            
            cartItem.innerHTML = `
                <div class="cart-item-content">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    
                    <div class="cart-item-details">
                        <div>
                            <h3 class="cart-item-title">${item.title}</h3>
                            <p class="cart-item-brand">${item.brand}</p>
                            ${item.variant ? `<p class="cart-item-variant">${item.variant}</p>` : ''}
                        </div>
                        
                        <div class="cart-item-status">
                            ${stockStatus}
                            ${item.estimatedDelivery ? `<span class="cart-item-delivery">Delivery: ${item.estimatedDelivery}</span>` : ''}
                        </div>
                        
                        <div class="cart-item-footer">
                            <div class="cart-item-pricing">
                                <span class="cart-item-price">${this.formatPrice(item.price)}</span>
                               <span class="cart-item-subtotal">
    Subtotal: ${this.formatPrice(
        parseFloat(String(item.price || 0).replace(/,/g, "")) * (item.qty || 0)
    )}
</span>


                            </div>
                            
                            <div class="cart-item-controls">
                                <div class="quantity-control">
                                    <button class="quantity-btn" onclick="app.updateQuantity('${item.id}', ${item.qty - 1})">
                                        <i data-lucide="minus"></i>
                                    </button>
                                    <input type="number" class="quantity-input" value="${item.qty}" 
                                           onchange="app.updateQuantity('${item.id}', parseInt(this.value) || 1)"
                                           min="1" max="${item.stock || 99}">
                                    <button class="quantity-btn" onclick="app.updateQuantity('${item.id}', ${item.qty + 1})"
                                            ${item.stock && item.qty >= item.stock ? 'disabled' : ''}>
                                        <i data-lucide="plus"></i>
                                    </button>
                                </div>
                                
                                <button class="cart-item-action" title="Save for later">
                                    <i data-lucide="heart"></i>
                                </button>
                                <button class="cart-item-action remove" onclick="app.removeFromCart('${item.id}')" title="Remove">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            cartItemsList.appendChild(cartItem);
        });
        
        // Reinitialize Lucide icons for new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    getStockStatus(item) {
        if (!item.stock) return '';
        
        if (item.stock === 0) {
            return '<span class="badge badge-destructive">Out of Stock</span>';
        } else if (item.stock <= 5) {
            return `<span class="badge" style="background: var(--warning); color: var(--warning-foreground);">Only ${item.stock} left</span>`;
        }
        return '<span class="badge badge-success">In Stock</span>';
    }
    
    renderCartSummary() {
        const summary = this.getCartSummary();
        const cartSummary = document.getElementById('cartSummary');
        
        const freeShippingMessage = summary.shipping > 0 ? `
            <div class="free-shipping-message">
                <p class="free-shipping-text">
                    Add ${this.formatPrice(summary.freeShippingThreshold - summary.subtotal)} more for FREE shipping!
                </p>
            </div>
        ` : '';
        
        cartSummary.innerHTML = `
            <h2 class="summary-title">Order Summary</h2>
            
            <div class="summary-line">
                <span class="summary-label">Items (${summary.totalItems})</span>
                <span class="summary-value">${this.formatPrice(summary.subtotal)}</span>
            </div>
            
            <div class="summary-line">
                <div class="summary-label">
                    <span>Shipping</span>
                    ${summary.shipping === 0 ? '<span class="badge badge-success">FREE</span>' : ''}
                </div>
                <span class="summary-value">
                    ${summary.shipping === 0 ? 'FREE' : this.formatPrice(summary.shipping)}
                </span>
            </div>
            
            ${freeShippingMessage}
            
            <div class="promo-section">
                <div class="promo-input-group">
                    <div class="promo-input-wrapper">
                        <i data-lucide="tag" class="promo-icon"></i>
                        <input type="text" placeholder="Enter promo code" class="promo-input" id="promoInput">
                    </div>
                    <button class="btn btn-outline" onclick="app.applyPromoCode()">Apply</button>
                </div>
                <div id="promoDiscount" class="promo-discount" style="display: none;">
                    <span class="promo-discount-label">Discount applied</span>
                    <span class="promo-discount-value">-${this.formatPrice(summary.discount)}</span>
                </div>
            </div>
            
            <div class="summary-separator"></div>
            
            <div class="summary-total">
                <span class="total-label">Total</span>
                <span class="total-value">${this.formatPrice(summary.total)}</span>
            </div>
            
            <button class="btn btn-primary checkout-btn" onclick="app.checkout()">
                <i data-lucide="credit-card"></i>
                Proceed to Checkout
            </button>
        
<button id="whatsappBuyBtn" class="btn-whatsapp">
  🟢 Buy via WhatsApp
</button>
            <div class="security-message">
                <i data-lucide="shield"></i>
                <span>Secure checkout with 256-bit SSL</span>
            </div>
            
            <div class="payment-methods">
                <p class="payment-methods-label">We accept</p>
                <div class="payment-methods-list">
                    <span class="payment-method">Visa</span>
                    <span class="payment-method">Mastercard</span>
                    <span class="payment-method">UPI</span>
                    <span class="payment-method">Paytm</span>
                </div>
            </div>
        `;
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    applyPromoCode() {
        const promoInput = document.getElementById('promoInput');
        const promoCode = promoInput.value.trim();
        
        if (promoCode) {
            // Simulate promo code validation
            this.showToast('Promo Applied', `Promo code "${promoCode}" has been applied!`);
            document.getElementById('promoDiscount').style.display = 'flex';
            promoInput.disabled = true;
        }
    }
    
 checkout() {
    if (this.cart.length === 0) {
        this.showToast('Empty Cart', 'Please add items to your cart before checkout.');
        return;
    }

    // ✅ Date set karo
    document.getElementById("checkoutDate").value = new Date().toLocaleDateString("en-IN");

    // ✅ Cart items ko textarea me set karo
    const cartText = this.cart.map(item => 
        `${item.title} (x${item.qty}) - ${this.formatPrice(item.price * item.qty)}`
    ).join("\n");
    document.getElementById("checkoutCartItems").value = cartText;

    // ✅ Modal open karo
    document.getElementById("checkoutModal").style.display = "flex";
}


    
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        const targetPage = pageName === 'home' ? 'homePage' : 'cartPage';
        document.getElementById(targetPage).classList.add('active');
        
        this.currentPage = pageName;
        
        // Update page title
        if (pageName === 'cart') {
            const summary = this.getCartSummary();
            document.title = `Shopping Cart (${summary.totalItems}) - MobileStore`;
        } else {
            document.title = 'MobileStore - Premium Smartphones & Accessories';
        }
    }
    
    showFloatingCart(item) {
        const floatingCart = document.getElementById('floatingCart');
        const floatingCartImage = document.getElementById('floatingCartImage');
        const floatingCartName = document.getElementById('floatingCartName');
        const floatingCartPrice = document.getElementById('floatingCartPrice');
        
        floatingCartImage.src = item.image;
        floatingCartImage.alt = item.title;
        floatingCartName.textContent = item.title;
        floatingCartPrice.textContent = this.formatPrice(item.price);
        
        floatingCart.classList.add('show');
        
        // Auto hide after 5 seconds
        if (this.floatingCartTimer) {
            clearTimeout(this.floatingCartTimer);
        }
        
        this.floatingCartTimer = setTimeout(() => {
            this.hideFloatingCart();
        }, 5000);
    }
    
    hideFloatingCart() {
        document.getElementById('floatingCart').classList.remove('show');
        if (this.floatingCartTimer) {
            clearTimeout(this.floatingCartTimer);
            this.floatingCartTimer = null;
        }
    }
    
    showToast(title, description) {
        const toast = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastDescription = document.getElementById('toastDescription');
        
        toastTitle.textContent = title;
        toastDescription.textContent = description;
        
        toast.classList.add('show');
        
        // Auto hide after 3 seconds
        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
        }
        
        this.toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

const app = new MobileStoreApp();
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyGPp0KCB8CCwPtZxJTnBarmSVHuoOcWIM-fgrkHlmGYs6r_Xc_d8bAz2i2F_5BOvI4oQ/exec";
document.getElementById("checkoutForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
        date: document.getElementById("checkoutDate").value,
        name: formData.get("name"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        notes: formData.get("notes"),
        cartItems: document.getElementById("checkoutCartItems").value
    };

    console.log("🚀 Sending to Apps Script:", data); // 👈 Add this

    try {
        await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
            mode: "no-cors"
        });

        app.showToast("✅ Order Submitted", "Your order has been sent to admin!");
        document.getElementById("checkoutModal").style.display = "none";
        e.target.reset();

    } catch (err) {
        console.error("Order Error:", err);
        app.showToast("❌ Failed", "Could not submit order!");
    }
});
// Close when "X" clicked
document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("checkoutModal").style.display = "none";
});

// Close when clicked outside modal-content
window.addEventListener("click", (e) => {
  const modal = document.getElementById("checkoutModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Optional: Close when ESC key pressed
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("checkoutModal").style.display = "none";
  }
});

// WhatsApp Buy Button click handler
document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "whatsappBuyBtn") {
    if (app.cart.length === 0) {
      app.showToast('Empty Cart', 'Please add items to your cart first.');
      return;
    }

    const phoneNumber = "918228884343"; // apna number

    // Cart items summary
    let message = " New Order via WhatsApp:%0A%0A";
    let total = 0;

    app.cart.forEach(item => {
      let itemTotal = item.price * item.qty;
      total += itemTotal;
      message += `• ${item.title} (x${item.qty}) - ₹${itemTotal}%0A`;
    });

    message += `%0A Total Payable: ₹${total}%0A%0A`;
    message += " Next Step->%0A";
    message += " Please share your *Name, Address, Phone* to confirm the order.%0A";
    message += " So that we can confirm and deliver your order. ";

    // WhatsApp open
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  }
});


window.app = app;
app.init();



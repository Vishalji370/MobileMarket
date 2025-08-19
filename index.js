/* index.js - improved version */

/* ========== CONFIG ========== */
const sheetID = "1B9IM5kmko00x81hLGxUmb47HhNTTOkxIgQxQFDrL0aY"; // replace as needed
const sheetName = "Sheet1";
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function showLoading() {
  productGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px">Loading products…</div>`;
}
function showError(msg) {
  productGrid.innerHTML = `<div style="grid-column:1/-1;color:red;text-align:center;padding:20px">${escapeHtml(msg)}</div>`;
}

showLoading();

/* Robust Google Sheets JSON extraction */
fetch(sheetURL)
  .then(res => res.text())
  .then(text => {
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!match) {
      throw new Error('Unexpected sheet response format.');
    }
    const json = JSON.parse(match[1]);
    const rows = json.table.rows || [];
    if (!rows.length) {
      showError("No products found in the sheet.");
      return;
    }

    let html = "";
    rows.forEach(row => {
      const id = row.c[0]?.v ?? "";
      const title = row.c[1]?.v ?? "Untitled";
      const brand = (row.c[2]?.v ?? "").toString();
      const price = row.c[3]?.v ?? "";
      const old_price = row.c[4]?.v ?? "";
      const discount = row.c[5]?.v ?? "";
      const rating = row.c[6]?.v ?? "";
      const reviews = row.c[7]?.v ?? "";
      const warranty = row.c[8]?.v ?? "";
      const image_urls = row.c[9]?.v ?? "";
      const firstImage = (image_urls.split(",")[0] || "").trim();

      // safe numeric formatting
      const parsedPrice = parseFloat(String(price).replace(/,/g, ''));
      const priceFormatted = !isNaN(parsedPrice) ? `₹${parsedPrice.toLocaleString()}` : "";

      const parsedOld = parseFloat(String(old_price).replace(/,/g, ''));
      const oldPriceFormatted = !isNaN(parsedOld) ? `₹${parsedOld.toLocaleString()}` : "";

      const discountText = discount ? `-${escapeHtml(String(discount))}% OFF` : "";

      html += `
        <a href="product.html?id=${encodeURIComponent(id)}" class="product-card" data-brand="${escapeHtml(brand).toLowerCase()}">
          ${discount ? `<div class="badge-top-selling">Top Selling</div>` : ""}
          <img src="${escapeHtml(firstImage || 'https://via.placeholder.com/300x200?text=No+Image')}"
               alt="${escapeHtml(title)}"
               loading="lazy"
               onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
          <div class="product-info">
            <div class="product-title">${escapeHtml(title)}</div>
            <div class="rating">⭐ ${escapeHtml(rating || '')}
              <span class="reviews">${escapeHtml(reviews ? `${reviews} reviews` : '')}</span>
            </div>
            <div class="price">
              ${priceFormatted}
              ${old_price ? `<span class="old-price">${oldPriceFormatted}</span>` : ''}
              ${discount ? `<span class="discount">${discountText}</span>` : ''}
            </div>
            <div class="warranty">${escapeHtml(warranty)} ${warranty ? 'year warranty' : ''}</div>
          </div>
        </a>
      `;
    });

 productGrid.innerHTML = html;

// Show More / Show Less functionality
const allCards = Array.from(productGrid.querySelectorAll('.product-card'));
const showMoreBtn = document.getElementById('showMoreBtn');
const maxVisible = 10;

function updateProductVisibility(showAll = false) {
  allCards.forEach((card, index) => {
    card.style.display = (showAll || index < maxVisible) ? 'block' : 'none';
  });
}

// Initial load
if (allCards.length > maxVisible) {
  updateProductVisibility(false);
  showMoreBtn.style.display = 'inline-block';
} else {
  showMoreBtn.style.display = 'none';
}

let showingAll = false;
showMoreBtn.innerHTML = 'Show More <span class="arrow">▼</span>';

showMoreBtn.addEventListener('click', () => {
  showingAll = !showingAll;
  updateProductVisibility(showingAll);
  showMoreBtn.innerHTML = showingAll 
    ? 'Show Less <span class="arrow">▲</span>'
    : 'Show More <span class="arrow">▼</span>';
});

attachFilterHandlers();


    // After render, wire search/filter behaviors
    attachFilterHandlers();
  })
  .catch(err => {
    console.error(err);
    showError("Error loading products. Check sheet ID, sheet publish status and console for details.");
  });

/* Helper: escape HTML */
function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* ========== SLIDER ========== */
(function(){
  const slides = document.getElementById('slides');
  if (!slides) return;
  const slideCount = slides.children.length;
  let idx = 0;
  const indicators = document.getElementById('indicators');

  function renderIndicators(){
    for(let i=0;i<slideCount;i++){
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to slide ${i+1}`);
      b.addEventListener('click', ()=>{ go(i); });
      if(i===0) b.classList.add('active');
      indicators.appendChild(b);
    }
  }

  function go(i){ idx = i; slides.style.transform = `translateX(${-100*idx}%)`; updateIndicators(); }
  function next(){ go((idx+1)%slideCount); }
  function prev(){ go((idx-1+slideCount)%slideCount); }
  function updateIndicators(){
    [...indicators.children].forEach((b,bi)=> b.classList.toggle('active', bi===idx));
  }

  document.getElementById('next').addEventListener('click', next);
  document.getElementById('prev').addEventListener('click', prev);
  renderIndicators();

  // auto-play with pause on hidden
  let slideInterval = setInterval(next, 3000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(slideInterval);
      slideInterval = null;
    } else {
      if (!slideInterval) slideInterval = setInterval(next, 3000);
    }
  });
})();

/* ========== NAV FILTERS + SEARCH ========== */
function attachFilterHandlers() {
  // Filter by nav items (normalize)
  document.querySelectorAll('[data-filter]').forEach(filterBtn => {
    filterBtn.addEventListener('click', (ev) => {
      // If the item contains a dropdown, don't treat click as brand-filter (common for items with submenus)
      if (filterBtn.querySelector('.dropdown')) {
        // let CSS hover handle dropdown; optionally toggle on click
        return;
      }
      const brand = String(filterBtn.getAttribute('data-filter') || '').toLowerCase();
      document.querySelectorAll('.product-card').forEach(card => {
        const cardBrand = (card.getAttribute('data-brand') || '').toLowerCase().trim();
        if (brand === "all" || cardBrand === brand) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Search (debounced)
  let debounceTimer = null;
  function applySearch(q) {
    const ql = (q || '').trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const title = (card.querySelector('.product-title')?.textContent || '').toLowerCase();
      const brand = (card.dataset.brand || '').toLowerCase();
      const match = !ql || title.includes(ql) || brand.includes(ql);
      card.style.display = match ? 'block' : 'none';
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => applySearch(searchInput.value));
  }
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => applySearch(e.target.value), 250);
    });
    // allow Enter to search: ensure search input is within a <form> if you want native behavior
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applySearch(searchInput.value);
      }
    });
  }
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
// Filter click handling
document.querySelectorAll('[data-filter]').forEach(filterBtn => {
  filterBtn.addEventListener('click', () => {
    const selectedBrand = filterBtn.getAttribute('data-filter').toLowerCase();
    
    document.querySelectorAll('.product-card').forEach(card => {
      const cardBrand = (card.getAttribute('data-brand') || '').toLowerCase();
      
      if (selectedBrand === 'all' || cardBrand === selectedBrand) {
        card.style.display = 'block'; // show
      } else {
        card.style.display = 'none'; // hide
      }
    });
  });
});
function attachSearchAndFilter() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  let currentBrand = 'all'; // default

  // Brand filter
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentBrand = (btn.getAttribute('data-filter') || 'all').toLowerCase();
      filterProducts();
    });
  });

  // Search (live typing)
  searchInput.addEventListener('input', () => {
    filterProducts();
  });

  // Search on button click
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      filterProducts();
    });
  }

  function filterProducts() {
    const query = searchInput.value.toLowerCase().trim();

    document.querySelectorAll('.product-card').forEach(card => {
      const cardBrand = (card.getAttribute('data-brand') || '').toLowerCase();
      const title = (card.querySelector('.product-title')?.textContent || '').toLowerCase();

      const matchesBrand = currentBrand === 'all' || cardBrand === currentBrand;
      const matchesSearch = !query || title.includes(query) || cardBrand.includes(query);

      if (matchesBrand && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
}
// Example cart items count (replace with your actual cart logic)
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count on page load
function updateCartCount() {
  const cartCountEl = document.querySelector(".cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = cartItems.length;
  }
}

updateCartCount();

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


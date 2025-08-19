class SellPhoneApp {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {
            brand: '',
            model: '',
            storage: '',
            condition: '',
            yearOfPurchase: '',
            images: [],
            expectedPrice: '',
            isNegotiable: false,
            name: '',
            phone: '',
            email: '',
            city: '',
            hidePhone: false
        };
        
        this.phoneModels = {
            'Apple': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12'],
            'Samsung': ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy Note 20', 'Galaxy A54'],
            'OnePlus': ['OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus 9 Pro', 'OnePlus 8T', 'OnePlus Nord'],
            'Google': ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6a', 'Pixel 6'],
            'Xiaomi': ['Mi 13 Ultra', 'Mi 13', 'Mi 12 Pro', 'Redmi Note 12', 'Redmi Note 11', 'Mi 11'],
            'Oppo': ['Find X6 Pro', 'Find X5 Pro', 'Reno 10 Pro', 'Reno 8 Pro', 'A78', 'A58'],
            'Vivo': ['X90 Pro', 'V29 Pro', 'V27 Pro', 'Y36', 'Y27', 'Y17']
        };
        
        this.init();
    }
    
    init() {
        this.initEventListeners();
        this.initLucideIcons();
        this.updateNavigationButtons();
        this.updateProgressIndicator();
    }
    
    initLucideIcons() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    initEventListeners() {
        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => this.previousStep());
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        
        // Brand selection change
        document.getElementById('brand').addEventListener('change', (e) => this.updateModels(e.target.value));
        
        // File upload
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileSelect(e.target.files));
        document.getElementById('upload-zone').addEventListener('click', () => document.getElementById('file-input').click());
        
        // Drag and drop
        const uploadZone = document.getElementById('upload-zone');
        uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadZone.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Form validation
        this.addFormValidationListeners();
        
        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }
    
    addFormValidationListeners() {
        // Step 1 fields
        ['brand', 'model', 'storage', 'condition', 'year'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateNavigationButtons());
            }
        });
        
        // Step 3 fields
        const priceField = document.getElementById('price');
        if (priceField) {
            priceField.addEventListener('input', () => this.updateNavigationButtons());
        }
        
        // Step 4 fields
        ['name', 'phone', 'email', 'city'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateNavigationButtons());
            }
        });
    }
    
    updateModels(brand) {
        const modelSelect = document.getElementById('model');
        modelSelect.innerHTML = '<option value="">Select model</option>';
        
        if (brand && this.phoneModels[brand]) {
            modelSelect.disabled = false;
            this.phoneModels[brand].forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        } else {
            modelSelect.disabled = true;
        }
        
        this.updateNavigationButtons();
    }
    
    handleFileSelect(files) {
        const fileArray = Array.from(files);
        const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
        
        // Limit to 6 images total
        const remainingSlots = 6 - this.formData.images.length;
        const newImages = imageFiles.slice(0, remainingSlots);
        
        this.formData.images = [...this.formData.images, ...newImages];
        this.updateImagePreview();
        this.updateNavigationButtons();
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('upload-zone').classList.add('drag-over');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('upload-zone').classList.remove('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('upload-zone').classList.remove('drag-over');
        this.handleFileSelect(e.dataTransfer.files);
    }
    
    updateImagePreview() {
        const previewContainer = document.getElementById('image-preview');
        const imageGrid = document.getElementById('image-grid');
        const imageCount = document.getElementById('image-count');
        
        if (this.formData.images.length > 0) {
            previewContainer.style.display = 'block';
            imageCount.textContent = this.formData.images.length;
            
            imageGrid.innerHTML = '';
            this.formData.images.forEach((file, index) => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.alt = `Upload ${index + 1}`;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'image-remove';
                removeBtn.innerHTML = '×';
                removeBtn.addEventListener('click', () => this.removeImage(index));
                
                imageItem.appendChild(img);
                imageItem.appendChild(removeBtn);
                imageGrid.appendChild(imageItem);
            });
        } else {
            previewContainer.style.display = 'none';
        }
    }
    
    removeImage(index) {
        this.formData.images.splice(index, 1);
        this.updateImagePreview();
        this.updateNavigationButtons();
    }
    
    validateStep(step) {
        switch (step) {
            case 1:
                return this.validateStepOne();
            case 2:
                return this.validateStepTwo();
            case 3:
                return this.validateStepThree();
            case 4:
                return this.validateStepFour();
            default:
                return false;
        }
    }
    
    validateStepOne() {
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const storage = document.getElementById('storage').value;
        const condition = document.getElementById('condition').value;
        const year = document.getElementById('year').value;
        
        return brand && model && storage && condition && year;
    }
    
    validateStepTwo() {
        return this.formData.images.length > 0;
    }
    
    validateStepThree() {
        const price = document.getElementById('price').value;
        return price && parseFloat(price) > 0;
    }
    
    validateStepFour() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const city = document.getElementById('city').value;
        
        return name && phone && email && city;
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        // Previous button
        prevBtn.disabled = this.currentStep === 1;
        
        // Next button
        const isCurrentStepValid = this.validateStep(this.currentStep);
        nextBtn.disabled = !isCurrentStepValid;
        
        // Update button text for last step
        if (this.currentStep === this.totalSteps) {
            nextBtn.innerHTML = 'Post My Ad';
            nextBtn.className = 'btn btn-secondary';
        } else {
            nextBtn.innerHTML = 'Next <i data-lucide="chevron-right"></i>';
            nextBtn.className = 'btn btn-primary';
        }
        
        // Reinitialize icons
        this.initLucideIcons();
    }
    
    updateProgressIndicator() {
        for (let i = 1; i <= this.totalSteps; i++) {
            const step = document.querySelector(`[data-step="${i}"]`);
            if (step) {
                step.className = 'step';
                if (i < this.currentStep) {
                    step.classList.add('step-completed');
                    step.querySelector('.step-number').innerHTML = '<i data-lucide="check"></i>';
                } else if (i === this.currentStep) {
                    step.classList.add('step-active');
                    step.querySelector('.step-number').textContent = i;
                } else {
                    step.classList.add('step-inactive');
                    step.querySelector('.step-number').textContent = i;
                }
            }
        }
        
        // Update step lines
        const stepLines = document.querySelectorAll('.step-line');
        stepLines.forEach((line, index) => {
            if (index < this.currentStep - 1) {
                line.style.background = 'var(--secondary)';
            } else {
                line.style.background = 'var(--border)';
            }
        });
        
        this.initLucideIcons();
    }
    
    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show current step
        const currentStepEl = document.getElementById(`step-${step}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps && this.validateStep(this.currentStep)) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgressIndicator();
            this.updateNavigationButtons();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (this.currentStep === this.totalSteps && this.validateStep(this.currentStep)) {
            this.submitForm();
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgressIndicator();
            this.updateNavigationButtons();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    collectFormData() {
        return {
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            storage: document.getElementById('storage').value,
            condition: document.getElementById('condition').value,
            yearOfPurchase: document.getElementById('year').value,
            images: this.formData.images,
            expectedPrice: document.getElementById('price').value,
            isNegotiable: document.getElementById('negotiable').checked,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            city: document.getElementById('city').value,
            hidePhone: document.getElementById('hide-phone').checked
        };
    }
    
    submitForm() {
        const formData = this.collectFormData();
        console.log('Form submitted:', formData);
        
        // Here you would normally send the data to your server
        // For demo purposes, we'll just show the success modal
        this.showSuccessModal();
    }
    
    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add event listeners for modal buttons
        const modalButtons = modal.querySelectorAll('.btn');
        modalButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        this.initLucideIcons();
    }
    
    closeModal() {
        const modal = document.getElementById('success-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SellPhoneApp();
});

// Additional utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Analytics tracking (placeholder)
function trackEvent(event, properties = {}) {
    console.log('Analytics Event:', event, properties);
    // Here you would integrate with your analytics service
}

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // Here you would report errors to your monitoring service
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
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

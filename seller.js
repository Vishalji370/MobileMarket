// Mock data for the seller dashboard
window.dashboardData = {
    // Seller profile information
    seller: {
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "+91 98765 43210",
        location: "Mumbai, Maharashtra",
        bio: "Experienced phone seller with 5+ years in the mobile market. Specializing in flagship and mid-range smartphones.",
        verified: true,
        rating: 4.8,
        totalReviews: 156,
        joinDate: "January 2019",
        avatar: null
    },

    // KYC documents
    kycDocuments: [
        { name: "Aadhaar Card", status: "verified", uploadDate: "2024-01-15" },
        { name: "PAN Card", status: "verified", uploadDate: "2024-01-15" },
        { name: "Shop License", status: "pending", uploadDate: "2024-01-20" }
    ],

    // Product listings
    listings: [
        {
            id: "1",
            title: "iPhone 15 Pro Max 256GB",
            brand: "Apple",
            model: "iPhone 15 Pro Max",
            price: 135000,
            condition: "like-new",
            status: "active",
            views: 245,
            inquiries: 12,
            datePosted: "2024-01-15",
            image: "📱"
        },
        {
            id: "2",
            title: "Samsung Galaxy S24 Ultra 512GB",
            brand: "Samsung",
            model: "Galaxy S24 Ultra",
            price: 125000,
            condition: "new",
            status: "active",
            views: 189,
            inquiries: 8,
            datePosted: "2024-01-18",
            image: "📱"
        },
        {
            id: "3",
            title: "OnePlus 12 256GB",
            brand: "OnePlus",
            model: "OnePlus 12",
            price: 68000,
            condition: "used",
            status: "pending",
            views: 156,
            inquiries: 5,
            datePosted: "2024-01-20",
            image: "📱"
        },
        {
            id: "4",
            title: "iPhone 14 128GB",
            brand: "Apple",
            model: "iPhone 14",
            price: 65000,
            condition: "used",
            status: "sold",
            views: 320,
            inquiries: 23,
            datePosted: "2024-01-10",
            image: "📱"
        },
        {
            id: "5",
            title: "Xiaomi 14 Pro 256GB",
            brand: "Xiaomi",
            model: "14 Pro",
            price: 55000,
            condition: "like-new",
            status: "rejected",
            views: 78,
            inquiries: 2,
            datePosted: "2024-01-22",
            image: "📱"
        }
    ],

    // Buyer inquiries
    inquiries: [
        {
            id: "1",
            buyerName: "Priya Sharma",
            buyerEmail: "priya.s***@gmail.com",
            buyerPhone: "+91 98765****10",
            productTitle: "iPhone 15 Pro Max 256GB",
            productId: "1",
            offerPrice: 125000,
            originalPrice: 135000,
            message: "Hi, I'm interested in buying this phone. Is the price negotiable? The phone is in excellent condition?",
            status: "pending",
            dateReceived: "2024-01-20",
            avatar: "👩"
        },
        {
            id: "2",
            buyerName: "Rohit Kumar",
            buyerEmail: "rohit.k***@yahoo.com", 
            buyerPhone: "+91 87654****21",
            productTitle: "Samsung Galaxy S24 Ultra 512GB",
            productId: "2",
            offerPrice: 125000,
            originalPrice: 125000,
            message: "Ready to buy at listed price. When can we meet?",
            status: "accepted",
            dateReceived: "2024-01-19",
            avatar: "👨"
        },
        {
            id: "3",
            buyerName: "Anita Singh",
            buyerEmail: "anita.s***@hotmail.com",
            buyerPhone: "+91 76543****32",
            productTitle: "OnePlus 12 256GB",
            productId: "3", 
            offerPrice: 60000,
            originalPrice: 68000,
            message: "Can you consider ₹60,000? I can pick up immediately.",
            status: "rejected",
            dateReceived: "2024-01-18",
            avatar: "👩"
        },
        {
            id: "4",
            buyerName: "Vikram Patel",
            buyerEmail: "vikram.p***@gmail.com",
            buyerPhone: "+91 65432****43",
            productTitle: "iPhone 15 Pro Max 256GB",
            productId: "1",
            offerPrice: 130000,
            originalPrice: 135000,
            message: "Very interested. Can we meet tomorrow? Phone looks perfect in photos.",
            status: "pending",
            dateReceived: "2024-01-21",
            avatar: "👨"
        }
    ],

    // Transaction history
    transactions: [
        {
            id: "1",
            type: "sale",
            productTitle: "iPhone 14 128GB",
            amount: 65000,
            commission: 5200,
            netAmount: 59800,
            buyerName: "Rohit Kumar",
            date: "2024-01-19",
            status: "completed"
        },
        {
            id: "2",
            type: "sale", 
            productTitle: "Samsung Galaxy S23 256GB",
            amount: 55000,
            commission: 4400,
            netAmount: 50600,
            buyerName: "Priya Sharma",
            date: "2024-01-15",
            status: "completed"
        },
        {
            id: "3",
            type: "withdrawal",
            productTitle: "Bank Transfer - HDFC Bank",
            amount: 45000,
            commission: 0,
            netAmount: -45000,
            buyerName: "",
            date: "2024-01-10",
            status: "completed"
        },
        {
            id: "4",
            type: "sale",
            productTitle: "OnePlus 11 256GB",
            amount: 48000,
            commission: 3840,
            netAmount: 44160,
            buyerName: "Anita Singh",
            date: "2024-01-08",
            status: "pending"
        }
    ],

    // Earnings data
    earnings: {
        walletBalance: 28400,
        totalEarnings: 156800,
        thisMonthEarnings: 45600,
        commissionRate: 8,
        monthlyTarget: 50000
    },

    // Stats
    stats: {
        activeListings: 12,
        pendingReview: 3,
        soldThisMonth: 8,
        totalViews: 1289,
        totalInquiries: 24,
        pendingInquiries: 4,
        acceptedDeals: 12
    }
};

// Helper functions for data manipulation
window.dataHelpers = {
    // Filter listings by status and search term
    filterListings: (searchTerm = '', statusFilter = 'all') => {
        return window.dashboardData.listings.filter(listing => {
            const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 listing.brand.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    },

    // Filter inquiries by status and search term
    filterInquiries: (searchTerm = '', statusFilter = 'all') => {
        return window.dashboardData.inquiries.filter(inquiry => {
            const matchesSearch = inquiry.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 inquiry.productTitle.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    },

    // Get status badge HTML
    getStatusBadge: (status) => {
        const badges = {
            'active': '<span class="badge badge-success">Active</span>',
            'pending': '<span class="badge badge-warning">Pending</span>',
            'sold': '<span class="badge badge-success">Sold</span>',
            'rejected': '<span class="badge badge-destructive">Rejected</span>',
            'accepted': '<span class="badge badge-success">Accepted</span>',
            'completed': '<span class="badge badge-success">Completed</span>',
            'processing': '<span class="badge badge-outline">Processing</span>'
        };
        return badges[status] || `<span class="badge badge-outline">${status}</span>`;
    },

    // Get condition badge HTML
    getConditionBadge: (condition) => {
        const conditionMap = {
            "new": "New",
            "like-new": "Like New", 
            "used": "Used",
            "damaged": "Damaged"
        };
        const label = conditionMap[condition] || condition;
        return `<span class="badge badge-outline">${label}</span>`;
    },

    // Format currency
    formatCurrency: (amount) => {
        return `₹${amount.toLocaleString()}`;
    },

    // Format date
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Get transaction icon
    getTransactionIcon: (type) => {
        const icons = {
            'sale': '<i data-lucide="trending-up" style="color: var(--success)"></i>',
            'commission': '<i data-lucide="dollar-sign" style="color: var(--warning)"></i>',
            'withdrawal': '<i data-lucide="download" style="color: var(--destructive)"></i>'
        };
        return icons[type] || '<i data-lucide="dollar-sign"></i>';
    }
};
(function() {
    'use strict';

    // State management
    let currentSection = 'profile';
    let sidebarCollapsed = false;
    let mobileMenuOpen = false;

    // Initialize dashboard when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeDashboard();
        setupEventListeners();
        renderInitialData();
        
        // Initialize Lucide icons after content is rendered
        setTimeout(() => {
            if (window.lucide) {
                lucide.createIcons();
            }
        }, 100);
    });

    // Initialize dashboard functionality
    function initializeDashboard() {
        // Set initial active section based on hash or default to profile
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(`${hash}-section`)) {
            currentSection = hash;
        }
        
        showSection(currentSection);
        updateActiveNavigation(currentSection);
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Navigation
        setupNavigation();
        
        // Sidebar toggle
        setupSidebarToggle();
        
        // Mobile menu
        setupMobileMenu();
        
        // Search and filters
        setupSearchAndFilters();
        
        // Form submissions
        setupForms();
        
        // Table interactions
        setupTableInteractions();
        
        // Responsive handlers
        setupResponsiveHandlers();
    }

    // Navigation setup
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                
                if (section) {
                    navigateToSection(section);
                    
                    // Close mobile menu if open
                    if (mobileMenuOpen) {
                        toggleMobileMenu();
                    }
                }
            });
        });
    }

    // Navigate to a specific section
    function navigateToSection(section) {
        currentSection = section;
        showSection(section);
        updateActiveNavigation(section);
        updatePageTitle(section);
        
        // Update URL hash
        window.location.hash = section;
    }

    // Show specific section
    function showSection(section) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(s => s.classList.remove('active'));
        
        // Show target section
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    // Update active navigation link
    function updateActiveNavigation(section) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });
    }

    // Update page title in header
    function updatePageTitle(section) {
        const titles = {
            'profile': 'Profile',
            'add-product': 'Add New Product',
            'listings': 'My Listings',
            'orders': 'Orders & Inquiries',
            'earnings': 'Earnings & Wallet',
            'analytics': 'Analytics & Insights',
            'support': 'Support & Help'
        };
        
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle && titles[section]) {
            pageTitle.textContent = titles[section];
        }
    }

    // Sidebar toggle functionality
    function setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', function() {
                toggleSidebar();
            });
        }
    }

    // Toggle sidebar collapse state
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebarCollapsed = !sidebarCollapsed;
            sidebar.classList.toggle('collapsed', sidebarCollapsed);
        }
    }

    // Mobile menu setup
    function setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileMenuToggle && sidebar) {
            mobileMenuToggle.addEventListener('click', function() {
                toggleMobileMenu();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (mobileMenuOpen && 
                    !sidebar.contains(e.target) && 
                    !mobileMenuToggle.contains(e.target)) {
                    toggleMobileMenu();
                }
            });
        }
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            mobileMenuOpen = !mobileMenuOpen;
            sidebar.classList.toggle('open', mobileMenuOpen);
        }
    }

    // Search and filters setup
    function setupSearchAndFilters() {
        // Listings search and filter
        const listingsSearch = document.getElementById('listingsSearch');
        const statusFilter = document.getElementById('statusFilter');
        
        if (listingsSearch) {
            listingsSearch.addEventListener('input', function() {
                filterAndRenderListings();
            });
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                filterAndRenderListings();
            });
        }
        
        // Header search functionality
        const headerSearch = document.querySelector('.search-input');
        if (headerSearch) {
            headerSearch.addEventListener('input', function() {
                handleGlobalSearch(this.value);
            });
        }
    }

    // Handle global search
    function handleGlobalSearch(query) {
        // This could be enhanced to search across all sections
        console.log('Global search:', query);
        showToast(`Searching for: ${query}`, 'info');
    }

    // Form setup
    function setupForms() {
        // Add product form
        const addProductForm = document.querySelector('.add-product-form');
        if (addProductForm) {
            addProductForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleAddProduct();
            });
        }
        
        // Edit profile button
        const editProfileBtn = document.querySelector('.edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                toggleProfileEdit();
            });
        }
    }

    // Handle add product form submission
    function handleAddProduct() {
        const formData = new FormData(document.querySelector('.add-product-form'));
        const productData = Object.fromEntries(formData.entries());
        
        // Validate required fields
        const requiredFields = ['brand', 'model', 'storage', 'ram', 'year', 'condition', 'price'];
        const missingFields = requiredFields.filter(field => !productData[field]);
        
        if (missingFields.length > 0) {
            showToast(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }
        
        // Simulate API call
        showToast('Product submitted for review successfully!', 'success');
        
        // Reset form
        document.querySelector('.add-product-form').reset();
        
        // Navigate to listings
        setTimeout(() => {
            navigateToSection('listings');
        }, 1500);
    }

    // Toggle profile edit mode
    function toggleProfileEdit() {
        const form = document.querySelector('.profile-card form');
        const inputs = form.querySelectorAll('input, textarea');
        const btn = document.querySelector('.edit-profile-btn');
        
        const isEditing = btn.textContent.includes('Cancel');
        
        if (isEditing) {
            // Cancel editing
            inputs.forEach(input => input.readOnly = true);
            btn.innerHTML = '<i data-lucide="edit"></i> Edit Profile';
            btn.className = 'btn btn-outline edit-profile-btn';
        } else {
            // Start editing
            inputs.forEach(input => input.readOnly = false);
            btn.innerHTML = '<i data-lucide="save"></i> Save Changes';
            btn.className = 'btn btn-primary edit-profile-btn';
        }
        
        // Refresh icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // Table interactions setup
    function setupTableInteractions() {
        // Handle table action buttons
        document.addEventListener('click', function(e) {
            if (e.target.matches('.action-btn') || e.target.closest('.action-btn')) {
                const btn = e.target.matches('.action-btn') ? e.target : e.target.closest('.action-btn');
                const action = btn.getAttribute('data-action');
                const itemId = btn.getAttribute('data-id');
                
                handleTableAction(action, itemId);
            }
        });
    }

    // Handle table actions
    function handleTableAction(action, itemId) {
        switch (action) {
            case 'edit':
                showToast(`Editing item ${itemId}`, 'info');
                break;
            case 'delete':
                if (confirm('Are you sure you want to delete this item?')) {
                    showToast(`Item ${itemId} deleted`, 'success');
                    // Remove from UI
                    const row = document.querySelector(`[data-id="${itemId}"]`).closest('tr');
                    if (row) row.remove();
                }
                break;
            case 'accept':
                showToast(`Inquiry ${itemId} accepted`, 'success');
                updateInquiryStatus(itemId, 'accepted');
                break;
            case 'reject':
                showToast(`Inquiry ${itemId} rejected`, 'info');
                updateInquiryStatus(itemId, 'rejected');
                break;
            default:
                console.log(`Action ${action} for item ${itemId}`);
        }
    }

    // Update inquiry status
    function updateInquiryStatus(inquiryId, status) {
        const inquiry = window.dashboardData.inquiries.find(i => i.id === inquiryId);
        if (inquiry) {
            inquiry.status = status;
            renderOrdersTable();
        }
    }

    // Responsive handlers
    function setupResponsiveHandlers() {
        // Handle window resize
        window.addEventListener('resize', function() {
            // Close mobile menu on desktop
            if (window.innerWidth > 768 && mobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    }

    // Render initial data
    function renderInitialData() {
        renderListingsTable();
        renderOrdersTable();
        renderTransactionsTable();
    }

    // Filter and render listings
    function filterAndRenderListings() {
        const searchTerm = document.getElementById('listingsSearch')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || 'all';
        
        renderListingsTable(searchTerm, statusFilter);
    }

    // Render listings table
    function renderListingsTable(searchTerm = '', statusFilter = 'all') {
        const tableBody = document.getElementById('listingsTableBody');
        if (!tableBody) return;
        
        const filteredListings = window.dataHelpers.filterListings(searchTerm, statusFilter);
        
        if (filteredListings.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem;">
                        <div style="color: var(--muted-foreground);">
                            <i data-lucide="package" style="width: 48px; height: 48px; margin-bottom: 1rem;"></i>
                            <h3>No listings found</h3>
                            <p>${searchTerm || statusFilter !== 'all' 
                                ? 'Try adjusting your search or filter criteria' 
                                : 'You haven\'t created any listings yet'}</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            tableBody.innerHTML = filteredListings.map(listing => `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 48px; height: 48px; border-radius: 8px; background: var(--muted); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                                ${listing.image}
                            </div>
                            <div>
                                <div style="font-weight: 500; font-size: 0.875rem;">${listing.title}</div>
                                <div style="font-size: 0.75rem; color: var(--muted-foreground);">
                                    ${listing.brand} • ${listing.model}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td style="font-weight: 600;">${window.dataHelpers.formatCurrency(listing.price)}</td>
                    <td>${window.dataHelpers.getConditionBadge(listing.condition)}</td>
                    <td>${window.dataHelpers.getStatusBadge(listing.status)}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <i data-lucide="eye" style="width: 16px; height: 16px; color: var(--muted-foreground);"></i>
                            <span>${listing.views}</span>
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <i data-lucide="message-circle" style="width: 16px; height: 16px; color: var(--muted-foreground);"></i>
                            <span>${listing.inquiries}</span>
                        </div>
                    </td>
                    <td style="color: var(--muted-foreground);">${window.dataHelpers.formatDate(listing.datePosted)}</td>
                    <td>
                        <div style="display: flex; gap: 0.25rem;">
                            ${listing.status === 'active' ? `
                                <button class="btn btn-sm btn-outline action-btn" data-action="edit" data-id="${listing.id}">
                                    <i data-lucide="edit" style="width: 12px; height: 12px;"></i>
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-outline action-btn" data-action="delete" data-id="${listing.id}" style="color: var(--destructive);">
                                <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
        
        // Refresh icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // Render orders table
    function renderOrdersTable() {
        const tableBody = document.getElementById('ordersTableBody');
        if (!tableBody) return;
        
        const inquiries = window.dashboardData.inquiries;
        
        tableBody.innerHTML = inquiries.map(inquiry => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--muted); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                            ${inquiry.avatar}
                        </div>
                        <div>
                            <div style="font-weight: 500; font-size: 0.875rem;">${inquiry.buyerName}</div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--muted-foreground);">
                                <i data-lucide="mail" style="width: 12px; height: 12px;"></i>
                                <span>${inquiry.buyerEmail}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--muted-foreground);">
                                <i data-lucide="phone" style="width: 12px; height: 12px;"></i>
                                <span>${inquiry.buyerPhone}</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td style="font-weight: 500; font-size: 0.875rem;">${inquiry.productTitle}</td>
                <td>
                    <div>
                        <div style="font-weight: 600; font-size: 0.875rem;">${window.dataHelpers.formatCurrency(inquiry.offerPrice)}</div>
                        ${inquiry.offerPrice !== inquiry.originalPrice ? `
                            <div style="font-size: 0.75rem; color: var(--muted-foreground); text-decoration: line-through;">
                                ${window.dataHelpers.formatCurrency(inquiry.originalPrice)}
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td>
                    <div style="max-width: 200px; font-size: 0.875rem; color: var(--muted-foreground); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${inquiry.message}
                    </div>
                </td>
                <td>${window.dataHelpers.getStatusBadge(inquiry.status)}</td>
                <td style="color: var(--muted-foreground);">${window.dataHelpers.formatDate(inquiry.dateReceived)}</td>
                <td>
                    ${inquiry.status === 'pending' ? `
                        <div style="display: flex; gap: 0.25rem;">
                            <button class="btn btn-sm btn-success action-btn" data-action="accept" data-id="${inquiry.id}">
                                <i data-lucide="check-circle" style="width: 12px; height: 12px;"></i>
                                Accept
                            </button>
                            <button class="btn btn-sm action-btn" data-action="reject" data-id="${inquiry.id}" style="background: var(--destructive); color: var(--destructive-foreground);">
                                <i data-lucide="x" style="width: 12px; height: 12px;"></i>
                                Reject
                            </button>
                        </div>
                    ` : `
                        <span class="badge badge-outline" style="font-size: 0.75rem;">
                            ${inquiry.status === 'accepted' ? 'Deal Accepted' : 'Deal Rejected'}
                        </span>
                    `}
                </td>
            </tr>
        `).join('');
        
        // Refresh icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // Render transactions table
    function renderTransactionsTable() {
        const tableBody = document.getElementById('transactionsTableBody');
        if (!tableBody) return;
        
        const transactions = window.dashboardData.transactions;
        
        tableBody.innerHTML = transactions.map(transaction => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        ${window.dataHelpers.getTransactionIcon(transaction.type)}
                        <span style="text-transform: capitalize; font-size: 0.875rem;">${transaction.type}</span>
                    </div>
                </td>
                <td style="font-weight: 500; font-size: 0.875rem;">${transaction.productTitle}</td>
                <td style="font-size: 0.875rem;">${transaction.buyerName || '-'}</td>
                <td style="font-weight: 600; font-size: 0.875rem;">
                    ${window.dataHelpers.formatCurrency(transaction.amount)}
                </td>
                <td style="font-size: 0.875rem; color: var(--muted-foreground);">
                    ${transaction.commission > 0 ? `-${window.dataHelpers.formatCurrency(transaction.commission)}` : '-'}
                </td>
                <td style="font-weight: 600; font-size: 0.875rem; color: ${transaction.netAmount > 0 ? 'var(--success)' : 'var(--destructive)'};">
                    ${transaction.netAmount > 0 ? '+' : ''}${window.dataHelpers.formatCurrency(Math.abs(transaction.netAmount))}
                </td>
                <td>${window.dataHelpers.getStatusBadge(transaction.status)}</td>
                <td style="color: var(--muted-foreground);">${window.dataHelpers.formatDate(transaction.date)}</td>
            </tr>
        `).join('');
        
        // Refresh icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // Toast notification system
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" style="width: 16px; height: 16px;"></i>
                <span>${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Refresh icons
        if (window.lucide) {
            lucide.createIcons();
        }
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    // Expose some functions globally for external use
    window.dashboardApp = {
        navigateToSection,
        showToast,
        filterAndRenderListings,
        renderOrdersTable,
        renderTransactionsTable
    };

})();
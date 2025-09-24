// Eco Harmony - Main JavaScript Module
// Production-level vanilla JS with modern ES6+ features and performance optimizations

class EcoHarmonyApp {
    constructor() {
        this.tips = [];
        this.filteredTips = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.favorites = JSON.parse(localStorage.getItem('eco-favorites') || '[]');
        this.implemented = JSON.parse(localStorage.getItem('eco-implemented') || '[]');
        
        // Performance tracking
        this.performanceMetrics = {
            loadStart: performance.now(),
            tipsLoaded: 0,
            renderStart: 0,
            renderEnd: 0
        };
        
        this.init();
    }

    async init() {
        console.log('🌿 Initializing Eco Harmony App...');
        
        try {
            await this.loadTips();
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.initializeAnimations();
            
            console.log(`✅ App initialized successfully in ${(performance.now() - this.performanceMetrics.loadStart).toFixed(2)}ms`);
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showErrorState();
        }
    }

    async loadTips() {
        const loadingElement = document.getElementById('loading');
        const tipsGrid = document.getElementById('tips-grid');
        
        try {
            loadingElement?.classList.remove('hidden');
            
            const response = await fetch('/api/tips');
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            
            this.tips = await response.json();
            this.filteredTips = [...this.tips];
            this.performanceMetrics.tipsLoaded = this.tips.length;
            
            this.renderTips();
            this.updateImpactCounters();
            
            loadingElement?.classList.add('hidden');
            tipsGrid?.classList.remove('hidden');
            
        } catch (error) {
            console.error('Failed to load tips:', error);
            loadingElement?.classList.add('hidden');
            this.showErrorState();
            throw error;
        }
    }

    renderTips() {
        const tipsGrid = document.getElementById('tips-grid');
        const noResults = document.getElementById('no-results');
        
        if (!tipsGrid) return;
        
        this.performanceMetrics.renderStart = performance.now();
        
        if (this.filteredTips.length === 0) {
            tipsGrid.innerHTML = '';
            noResults?.classList.remove('hidden');
            return;
        }
        
        noResults?.classList.add('hidden');
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        this.filteredTips.forEach((tip, index) => {
            const tipCard = this.createTipCard(tip, index);
            fragment.appendChild(tipCard);
        });
        
        tipsGrid.innerHTML = '';
        tipsGrid.appendChild(fragment);
        
        this.performanceMetrics.renderEnd = performance.now();
        console.log(`🎨 Rendered ${this.filteredTips.length} tips in ${(this.performanceMetrics.renderEnd - this.performanceMetrics.renderStart).toFixed(2)}ms`);
        
        // Trigger entrance animations
        this.animateCardEntrance();
    }

    createTipCard(tip, index) {
        const card = document.createElement('article');
        card.className = 'card-organic cursor-pointer opacity-0 transform translate-y-4';
        card.style.animationDelay = `${index * 100}ms`;
        card.setAttribute('role', 'article');
        card.setAttribute('aria-labelledby', `tip-title-${tip.id}`);
        card.onclick = () => this.navigateToTip(tip.id);
        
        // Determine impact color and icon
        const impactConfig = this.getImpactConfig(tip.impact);
        const difficultyConfig = this.getDifficultyConfig(tip.difficulty);
        
        card.innerHTML = `
            <div class="relative overflow-hidden">
                <img 
                    src="${tip.image}" 
                    alt="${tip.title}" 
                    class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjQThENUJBIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjIwIiBmaWxsPSIjNENBRjUwIiBvcGFjaXR5PSIwLjMiLz4KPGJ0aXJjbGUgY3g9IjM0MCIgY3k9IjI0MCIgcj0iMTAiIGZpbGw9IiM2RTJDMUU0IiBvcGFjaXR5PSIwLjQiLz4KPHN2ZyB4PSIxNzUiIHk9IjEyNSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjNENBRjUwIj4KPHA=';"
                >
                <div class="absolute top-4 left-4 flex space-x-2">
                    <span class="badge-leaf text-xs">
                        ${tip.category}
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${impactConfig.bgClass} ${impactConfig.textClass}">
                        ${impactConfig.icon}
                        ${tip.impact} Impact
                    </span>
                </div>
                <div class="absolute top-4 right-4">
                    <button 
                        onclick="event.stopPropagation(); toggleFavorite(${tip.id})" 
                        class="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 ${this.favorites.includes(tip.id) ? 'text-red-500' : 'text-gray-400'}"
                        title="${this.favorites.includes(tip.id) ? 'Remove from favorites' : 'Add to favorites'}"
                        aria-label="${this.favorites.includes(tip.id) ? 'Remove from favorites' : 'Add to favorites'}"
                    >
                        <svg class="w-5 h-5" fill="${this.favorites.includes(tip.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${difficultyConfig.bgClass} ${difficultyConfig.textClass}">
                        ${difficultyConfig.icon}
                        ${tip.difficulty}
                    </span>
                    <span class="text-sm text-gray-500">${tip.readTime}</span>
                </div>
                
                <h3 id="tip-title-${tip.id}" class="text-xl font-heading font-semibold text-leaf-green-dark mb-3 line-clamp-2 hover:text-leaf-green transition-colors duration-200">
                    ${tip.title}
                </h3>
                
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    ${tip.shortDescription || tip.description.substring(0, 120) + '...'}
                </p>
                
                <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center text-leaf-green">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                        <span class="font-medium">${tip.costSavings}</span>
                    </div>
                    <div class="flex items-center text-river-blue">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <span class="font-medium">${tip.carbonReduction}</span>
                    </div>
                </div>
                
                ${this.implemented.includes(tip.id) ? `
                    <div class="mt-4 flex items-center text-leaf-green text-sm">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="font-medium">Implemented ✨</span>
                    </div>
                ` : ''}
            </div>
        `;
        
        return card;
    }

    getImpactConfig(impact) {
        const configs = {
            'Very High': {
                bgClass: 'bg-red-100',
                textClass: 'text-red-800',
                icon: '🔥'
            },
            'High': {
                bgClass: 'bg-orange-100',
                textClass: 'text-orange-800',
                icon: '⚡'
            },
            'Medium': {
                bgClass: 'bg-yellow-100',
                textClass: 'text-yellow-800',
                icon: '💡'
            },
            'Low': {
                bgClass: 'bg-green-100',
                textClass: 'text-green-800',
                icon: '🌱'
            }
        };
        return configs[impact] || configs['Medium'];
    }

    getDifficultyConfig(difficulty) {
        const configs = {
            'Beginner': {
                bgClass: 'bg-green-100',
                textClass: 'text-green-800',
                icon: '🌱'
            },
            'Intermediate': {
                bgClass: 'bg-yellow-100',
                textClass: 'text-yellow-800',
                icon: '🌿'
            },
            'Advanced': {
                bgClass: 'bg-red-100',
                textClass: 'text-red-800',
                icon: '🌳'
            }
        };
        return configs[difficulty] || configs['Beginner'];
    }

    animateCardEntrance() {
        const cards = document.querySelectorAll('.card-organic');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('opacity-0', 'translate-y-4');
                card.classList.add('animate-fade-in-up');
            }, index * 100);
        });
    }

    filterTips(category) {
        this.currentFilter = category;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        // Apply filter
        if (category === 'all') {
            this.filteredTips = [...this.tips];
        } else {
            this.filteredTips = this.tips.filter(tip => 
                tip.category.toLowerCase().replace(/\s+/g, '-') === category
            );
        }
        
        // Apply search if active
        if (this.searchQuery) {
            this.applySearch(this.searchQuery);
        } else {
            this.renderTips();
        }
        
        // Analytics tracking
        this.trackEvent('filter_applied', { category, results: this.filteredTips.length });
    }

    searchTips(event) {
        if (event.key === 'Enter' || event.type === 'input') {
            const query = event.target.value.toLowerCase().trim();
            this.searchQuery = query;
            this.applySearch(query);
        }
    }

    applySearch(query) {
        if (!query) {
            this.filteredTips = this.currentFilter === 'all' ? [...this.tips] : 
                this.tips.filter(tip => tip.category.toLowerCase().replace(/\s+/g, '-') === this.currentFilter);
        } else {
            const baseFilter = this.currentFilter === 'all' ? this.tips : 
                this.tips.filter(tip => tip.category.toLowerCase().replace(/\s+/g, '-') === this.currentFilter);
                
            this.filteredTips = baseFilter.filter(tip => 
                tip.title.toLowerCase().includes(query) ||
                tip.description.toLowerCase().includes(query) ||
                tip.shortDescription?.toLowerCase().includes(query) ||
                tip.category.toLowerCase().includes(query) ||
                tip.tags.some(tag => tag.toLowerCase().includes(query)) ||
                tip.author.toLowerCase().includes(query)
            );
        }
        
        this.renderTips();
        
        // Analytics tracking
        this.trackEvent('search_performed', { query, results: this.filteredTips.length });
    }

    navigateToTip(tipId) {
        // Add loading state
        const card = event.currentTarget;
        card.style.opacity = '0.7';
        
        // Navigate with smooth transition
        window.location.href = `/tips/${tipId}`;
        
        // Analytics tracking
        this.trackEvent('tip_clicked', { tipId, category: this.currentFilter });
    }

    toggleFavorite(tipId) {
        const index = this.favorites.indexOf(tipId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(tipId);
        }
        
        localStorage.setItem('eco-favorites', JSON.stringify(this.favorites));
        
        // Update UI
        this.renderTips();
        
        // Show feedback
        this.showToast(index > -1 ? 'Removed from favorites' : 'Added to favorites', 'success');
        
        // Analytics tracking
        this.trackEvent('favorite_toggled', { tipId, action: index > -1 ? 'remove' : 'add' });
    }

    updateImpactCounters() {
        const co2Element = document.getElementById('co2-saved');
        const moneyElement = document.getElementById('money-saved');
        const tipsElement = document.getElementById('tips-implemented');
        
        if (!co2Element || !moneyElement || !tipsElement) return;
        
        // Calculate totals
        const totalCO2 = this.tips.reduce((sum, tip) => {
            const co2Value = parseFloat(tip.carbonReduction.replace(/[^\d.]/g, '')) || 0;
            return sum + co2Value;
        }, 0);
        
        const totalSavings = this.tips.reduce((sum, tip) => {
            const savingsValue = parseInt(tip.costSavings.replace(/[^\d]/g, '')) || 0;
            return sum + savingsValue;
        }, 0);
        
        // Animate counters
        this.animateCounter(co2Element, totalCO2, 'CO₂');
        this.animateCounter(moneyElement, totalSavings, '$', true);
        this.animateCounter(tipsElement, this.implemented.length);
    }

    animateCounter(element, target, suffix = '', isMoneyy = false) {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (isMoneyy) {
                displayValue = displayValue.toLocaleString();
            }
            
            element.textContent = `${suffix}${displayValue}${suffix === 'CO₂' ? '' : ''}`;
        }, duration / steps);
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.searchTips.bind(this), 300));
            searchInput.addEventListener('keypress', this.searchTips.bind(this));
        }
        
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Smooth scroll to tips section
        window.scrollToTips = () => {
            const tipsSection = document.getElementById('tips-section');
            if (tipsSection) {
                tipsSection.scrollIntoView({ behavior: 'smooth' });
            }
        };
        
        // Global filter function
        window.filterTips = this.filterTips.bind(this);
        window.searchTips = this.searchTips.bind(this);
        window.toggleFavorite = this.toggleFavorite.bind(this);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                searchInput?.focus();
            }
        });
    }

    setupIntersectionObserver() {
        // Lazy loading for images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        // Observe images as they're added
        const observeImages = () => {
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        };
        
        // Initial observation
        observeImages();
        
        // Animation observer for cards
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, { threshold: 0.1 });
        
        // Will be used when cards are rendered
        this.animationObserver = animationObserver;
    }

    initializeAnimations() {
        // Add CSS for line clamp
        const style = document.createElement('style');
        style.textContent = `
            .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .line-clamp-3 {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .filter-btn {
                padding: 0.5rem 1rem;
                border-radius: 9999px;
                font-size: 0.875rem;
                font-weight: 500;
                color: #4A5568;
                background-color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(168, 213, 186, 0.3);
                transition: all 0.2s ease;
                cursor: pointer;
            }
            .filter-btn:hover {
                background-color: rgba(168, 213, 186, 0.2);
                color: #2D5016;
            }
            .filter-btn.active {
                background: linear-gradient(135deg, #4CAF50 0%, #A8D5BA 100%);
                color: white;
                border-color: transparent;
                box-shadow: 0 4px 20px rgba(76, 175, 80, 0.15);
            }
        `;
        document.head.appendChild(style);
    }

    showErrorState() {
        const tipsGrid = document.getElementById('tips-grid');
        const loading = document.getElementById('loading');
        
        loading?.classList.add('hidden');
        
        if (tipsGrid) {
            tipsGrid.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <div class="max-w-md mx-auto">
                        <svg class="w-16 h-16 text-soft-sage mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <h3 class="text-xl font-heading font-semibold text-leaf-green-dark mb-2">Unable to Load Tips</h3>
                        <p class="text-gray-600 mb-4">We're having trouble loading the sustainable living tips. Please try refreshing the page.</p>
                        <button onclick="location.reload()" class="btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Retry
                        </button>
                    </div>
                </div>
            `;
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-leaf shadow-hover text-white z-50 animate-fade-in-up ${
            type === 'success' ? 'bg-leaf-green' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-river-blue'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    trackEvent(eventName, properties = {}) {
        // Analytics tracking - replace with your preferred analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        console.log(`📈 Event: ${eventName}`, properties);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize app when DOM is loaded
function initializeMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}

function animateCounters() {
    // Will be handled by the main app class
}

function loadTips() {
    // Initialize the main app
    if (!window.ecoHarmonyApp) {
        window.ecoHarmonyApp = new EcoHarmonyApp();
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EcoHarmonyApp;
}

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`🚀 Page fully loaded in ${loadTime.toFixed(2)}ms`);
    
    // Report Core Web Vitals
    if ('web-vital' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
});
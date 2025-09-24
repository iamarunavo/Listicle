// Eco Harmony - Search Page JavaScript
// Advanced search functionality with filtering and real-time results

class SearchPage {
    constructor() {
        this.allTips = [];
        this.searchResults = [];
        this.currentFilters = {
            query: '',
            category: '',
            difficulty: '',
            impact: ''
        };
        
        this.init();
    }

    async init() {
        console.log('🔍 Initializing Search Page...');
        
        try {
            await this.loadAllTips();
            this.setupEventListeners();
            this.processUrlParams();
            
            console.log('✅ Search page initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize search page:', error);
            this.showErrorState();
        }
    }

    async loadAllTips() {
        try {
            const response = await fetch('/api/tips');
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            
            this.allTips = await response.json();
            console.log(`📊 Loaded ${this.allTips.length} tips for search`);
            
        } catch (error) {
            console.error('Failed to load tips for search:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Main search input
        const mainSearch = document.getElementById('main-search');
        if (mainSearch) {
            mainSearch.addEventListener('input', this.debounce(() => {
                this.currentFilters.query = mainSearch.value.trim();
                this.performSearch();
            }, 300));
            
            mainSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.currentFilters.query = mainSearch.value.trim();
                    this.performSearch();
                }
            });
        }

        // Filter dropdowns
        const categoryFilter = document.getElementById('category-filter');
        const difficultyFilter = document.getElementById('difficulty-filter');
        const impactFilter = document.getElementById('impact-filter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.currentFilters.category = categoryFilter.value;
                this.performSearch();
            });
        }

        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', () => {
                this.currentFilters.difficulty = difficultyFilter.value;
                this.performSearch();
            });
        }

        if (impactFilter) {
            impactFilter.addEventListener('change', () => {
                this.currentFilters.impact = impactFilter.value;
                this.performSearch();
            });
        }

        // Global functions
        window.performSearch = this.performSearch.bind(this);
        window.clearFilters = this.clearFilters.bind(this);
        window.quickSearch = this.quickSearch.bind(this);
        window.navigateToTip = (tipId) => {
            window.location.href = `/tips/${tipId}`;
        };
    }

    processUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const category = urlParams.get('category');
        const difficulty = urlParams.get('difficulty');
        const impact = urlParams.get('impact');

        if (query) {
            document.getElementById('main-search').value = query;
            this.currentFilters.query = query;
        }

        if (category) {
            document.getElementById('category-filter').value = category;
            this.currentFilters.category = category;
        }

        if (difficulty) {
            document.getElementById('difficulty-filter').value = difficulty;
            this.currentFilters.difficulty = difficulty;
        }

        if (impact) {
            document.getElementById('impact-filter').value = impact;
            this.currentFilters.impact = impact;
        }

        // Perform search if any filters are set
        if (query || category || difficulty || impact) {
            this.performSearch();
        }
    }

    performSearch() {
        const loadingElement = document.getElementById('search-loading');
        const resultsElement = document.getElementById('search-results');
        const defaultElement = document.getElementById('search-default');
        const headerElement = document.getElementById('results-header');
        
        // Show loading state
        loadingElement?.classList.remove('hidden');
        resultsElement?.classList.add('opacity-50');
        defaultElement?.classList.add('hidden');
        
        // Simulate API delay for better UX
        setTimeout(() => {
            this.searchResults = this.filterTips();
            this.renderResults();
            this.updateResultsHeader();
            this.updateActiveFilters();
            this.updateUrl();
            
            loadingElement?.classList.add('hidden');
            resultsElement?.classList.remove('opacity-50');
            headerElement?.classList.remove('hidden');
            
            // Analytics tracking
            this.trackSearch();
        }, 200);
    }

    filterTips() {
        let results = [...this.allTips];
        
        // Text search
        if (this.currentFilters.query) {
            const query = this.currentFilters.query.toLowerCase();
            results = results.filter(tip => 
                tip.title.toLowerCase().includes(query) ||
                tip.description.toLowerCase().includes(query) ||
                tip.shortDescription?.toLowerCase().includes(query) ||
                tip.category.toLowerCase().includes(query) ||
                tip.author.toLowerCase().includes(query) ||
                tip.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        // Category filter
        if (this.currentFilters.category) {
            results = results.filter(tip => 
                tip.category.toLowerCase().replace(/\s+/g, '-') === this.currentFilters.category
            );
        }
        
        // Difficulty filter
        if (this.currentFilters.difficulty) {
            results = results.filter(tip => 
                tip.difficulty.toLowerCase() === this.currentFilters.difficulty
            );
        }
        
        // Impact filter
        if (this.currentFilters.impact) {
            const impactMap = {
                'very-high': 'Very High',
                'high': 'High',
                'medium': 'Medium',
                'low': 'Low'
            };
            results = results.filter(tip => 
                tip.impact === impactMap[this.currentFilters.impact]
            );
        }
        
        // Sort by relevance (tips with query in title first, then by impact)
        if (this.currentFilters.query) {
            const query = this.currentFilters.query.toLowerCase();
            results.sort((a, b) => {
                const aInTitle = a.title.toLowerCase().includes(query);
                const bInTitle = b.title.toLowerCase().includes(query);
                
                if (aInTitle && !bInTitle) return -1;
                if (!aInTitle && bInTitle) return 1;
                
                // Sort by impact if both have query in title or both don't
                const impactOrder = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                return (impactOrder[b.impact] || 0) - (impactOrder[a.impact] || 0);
            });
        }
        
        return results;
    }

    renderResults() {
        const resultsContainer = document.getElementById('search-results');
        const noResultsElement = document.getElementById('no-search-results');
        
        if (!resultsContainer) return;
        
        if (this.searchResults.length === 0) {
            resultsContainer.innerHTML = '';
            noResultsElement?.classList.remove('hidden');
            return;
        }
        
        noResultsElement?.classList.add('hidden');
        
        const fragment = document.createDocumentFragment();
        
        this.searchResults.forEach((tip, index) => {
            const tipCard = this.createSearchResultCard(tip, index);
            fragment.appendChild(tipCard);
        });
        
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(fragment);
        
        // Animate cards entrance
        this.animateResults();
    }

    createSearchResultCard(tip, index) {
        const card = document.createElement('article');
        card.className = 'card-organic cursor-pointer opacity-0 transform translate-y-4';
        card.style.animationDelay = `${index * 50}ms`;
        card.onclick = () => window.navigateToTip(tip.id);
        
        const impactConfig = this.getImpactConfig(tip.impact);
        const difficultyConfig = this.getDifficultyConfig(tip.difficulty);
        
        // Highlight search terms in title and description
        const highlightedTitle = this.highlightSearchTerms(tip.title);
        const highlightedDescription = this.highlightSearchTerms(
            tip.shortDescription || tip.description.substring(0, 120) + '...'
        );
        
        card.innerHTML = `
            <div class="relative overflow-hidden">
                <img 
                    src="${tip.image}" 
                    alt="${tip.title}" 
                    class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                >
                <div class="absolute top-4 left-4 flex space-x-2">
                    <span class="badge-leaf text-xs">${tip.category}</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${impactConfig.bgClass} ${impactConfig.textClass}">
                        ${tip.impact} Impact
                    </span>
                </div>
            </div>
            
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${difficultyConfig.bgClass} ${difficultyConfig.textClass}">
                        ${tip.difficulty}
                    </span>
                    <span class="text-sm text-gray-500">${tip.readTime}</span>
                </div>
                
                <h3 class="text-xl font-heading font-semibold text-leaf-green-dark mb-3 line-clamp-2 hover:text-leaf-green transition-colors duration-200">
                    ${highlightedTitle}
                </h3>
                
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    ${highlightedDescription}
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
                
                <!-- Tags -->
                <div class="mt-4 flex flex-wrap gap-1">
                    ${tip.tags.slice(0, 3).map(tag => `
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-soft-sage-light text-leaf-green-dark">
                            #${tag}
                        </span>
                    `).join('')}
                    ${tip.tags.length > 3 ? `<span class="text-xs text-gray-500">+${tip.tags.length - 3} more</span>` : ''}
                </div>
            </div>
        `;
        
        return card;
    }

    highlightSearchTerms(text) {
        if (!this.currentFilters.query) return text;
        
        const query = this.currentFilters.query.trim();
        if (!query) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-800 px-1 rounded">$1</mark>');
    }

    animateResults() {
        const cards = document.querySelectorAll('#search-results .card-organic');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('opacity-0', 'translate-y-4');
                card.classList.add('animate-fade-in-up');
            }, index * 50);
        });
    }

    updateResultsHeader() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            const count = this.searchResults.length;
            countElement.textContent = `${count} ${count === 1 ? 'result' : 'results'} found`;
        }
    }

    updateActiveFilters() {
        const filtersContainer = document.getElementById('active-filters');
        if (!filtersContainer) return;
        
        const activeFilters = [];
        
        if (this.currentFilters.query) {
            activeFilters.push({
                type: 'query',
                label: `"${this.currentFilters.query}"`,
                value: this.currentFilters.query
            });
        }
        
        if (this.currentFilters.category) {
            const categoryNames = {
                'waste-reduction': 'Waste Reduction',
                'energy': 'Energy',
                'water-conservation': 'Water Conservation',
                'transportation': 'Transportation',
                'biodiversity': 'Biodiversity'
            };
            activeFilters.push({
                type: 'category',
                label: categoryNames[this.currentFilters.category] || this.currentFilters.category,
                value: this.currentFilters.category
            });
        }
        
        if (this.currentFilters.difficulty) {
            activeFilters.push({
                type: 'difficulty',
                label: this.currentFilters.difficulty.charAt(0).toUpperCase() + this.currentFilters.difficulty.slice(1),
                value: this.currentFilters.difficulty
            });
        }
        
        if (this.currentFilters.impact) {
            const impactNames = {
                'very-high': 'Very High Impact',
                'high': 'High Impact',
                'medium': 'Medium Impact',
                'low': 'Low Impact'
            };
            activeFilters.push({
                type: 'impact',
                label: impactNames[this.currentFilters.impact] || this.currentFilters.impact,
                value: this.currentFilters.impact
            });
        }
        
        if (activeFilters.length === 0) {
            filtersContainer.innerHTML = '';
            return;
        }
        
        filtersContainer.innerHTML = activeFilters.map(filter => `
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-leaf-green text-white">
                ${filter.label}
                <button onclick="removeFilter('${filter.type}')" class="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors duration-200">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </span>
        `).join('');
        
        // Add remove filter function
        window.removeFilter = (type) => {
            this.currentFilters[type] = '';
            
            // Update form elements
            if (type === 'query') {
                document.getElementById('main-search').value = '';
            } else if (type === 'category') {
                document.getElementById('category-filter').value = '';
            } else if (type === 'difficulty') {
                document.getElementById('difficulty-filter').value = '';
            } else if (type === 'impact') {
                document.getElementById('impact-filter').value = '';
            }
            
            this.performSearch();
        };
    }

    updateUrl() {
        const params = new URLSearchParams();
        
        if (this.currentFilters.query) params.set('q', this.currentFilters.query);
        if (this.currentFilters.category) params.set('category', this.currentFilters.category);
        if (this.currentFilters.difficulty) params.set('difficulty', this.currentFilters.difficulty);
        if (this.currentFilters.impact) params.set('impact', this.currentFilters.impact);
        
        const newUrl = params.toString() ? 
            `${window.location.pathname}?${params.toString()}` : 
            window.location.pathname;
            
        window.history.replaceState({}, '', newUrl);
    }

    clearFilters() {
        // Reset filters
        this.currentFilters = {
            query: '',
            category: '',
            difficulty: '',
            impact: ''
        };
        
        // Reset form elements
        document.getElementById('main-search').value = '';
        document.getElementById('category-filter').value = '';
        document.getElementById('difficulty-filter').value = '';
        document.getElementById('impact-filter').value = '';
        
        // Reset UI state
        document.getElementById('results-header')?.classList.add('hidden');
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('no-search-results')?.classList.add('hidden');
        document.getElementById('search-default')?.classList.remove('hidden');
        
        // Update URL
        window.history.replaceState({}, '', window.location.pathname);
        
        this.showToast('Filters cleared', 'info');
    }

    quickSearch(query) {
        document.getElementById('main-search').value = query;
        this.currentFilters.query = query;
        this.performSearch();
        
        // Scroll to results
        document.getElementById('search-results')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    getImpactConfig(impact) {
        const configs = {
            'Very High': { bgClass: 'bg-red-100', textClass: 'text-red-800' },
            'High': { bgClass: 'bg-orange-100', textClass: 'text-orange-800' },
            'Medium': { bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' },
            'Low': { bgClass: 'bg-green-100', textClass: 'text-green-800' }
        };
        return configs[impact] || configs['Medium'];
    }

    getDifficultyConfig(difficulty) {
        const configs = {
            'Beginner': { bgClass: 'bg-green-100', textClass: 'text-green-800' },
            'Intermediate': { bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' },
            'Advanced': { bgClass: 'bg-red-100', textClass: 'text-red-800' }
        };
        return configs[difficulty] || configs['Beginner'];
    }

    showErrorState() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <div class="max-w-md mx-auto">
                        <svg class="w-16 h-16 text-soft-sage mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <h3 class="text-xl font-heading font-semibold text-leaf-green-dark mb-2">Search Unavailable</h3>
                        <p class="text-gray-600 mb-4">We're having trouble loading the search functionality. Please try refreshing the page.</p>
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

    trackSearch() {
        // Analytics tracking
        const searchData = {
            query: this.currentFilters.query,
            category: this.currentFilters.category,
            difficulty: this.currentFilters.difficulty,
            impact: this.currentFilters.impact,
            results: this.searchResults.length
        };
        
        console.log('🔍 Search performed:', searchData);
        
        // Send to analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                search_term: this.currentFilters.query,
                results_count: this.searchResults.length
            });
        }
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

// Initialize search page
function initializeSearchPage() {
    if (!window.searchPage) {
        window.searchPage = new SearchPage();
    }
}

// Add CSS for search highlighting
document.addEventListener('DOMContentLoaded', function() {
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
        mark {
            background-color: #FEF3C7;
            color: #92400E;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
});
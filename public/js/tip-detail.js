// Eco Harmony - Tip Detail Page JavaScript
// Production-level implementation with accessibility and performance optimizations

class TipDetailPage {
    constructor() {
        this.tipId = null;
        this.tipData = null;
        this.relatedTips = [];
        this.favorites = JSON.parse(localStorage.getItem('eco-favorites') || '[]');
        this.implemented = JSON.parse(localStorage.getItem('eco-implemented') || '[]');
        
        this.init();
    }

    init() {
        console.log('🌿 Initializing Tip Detail Page...');
        
        // Extract tip ID from URL
        this.tipId = this.extractTipId();
        
        if (!this.tipId) {
            this.redirectToHome();
            return;
        }
        
        this.setupEventListeners();
        this.loadTipDetail(this.tipId);
    }

    extractTipId() {
        const pathParts = window.location.pathname.split('/');
        const tipId = pathParts[2];
        return tipId ? parseInt(tipId) : null;
    }

    async loadTipDetail(tipId) {
        const loadingElement = document.getElementById('loading');
        const contentElement = document.getElementById('tip-content');
        
        try {
            loadingElement?.classList.remove('hidden');
            contentElement?.classList.add('hidden');
            
            // Load tip data
            const response = await fetch(`/api/tips/${tipId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    window.location.href = '/404.html';
                    return;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.tipData = await response.json();
            
            // Load related tips
            await this.loadRelatedTips();
            
            // Render content
            this.renderTipContent();
            this.updateMetadata();
            this.setupStructuredData();
            
            loadingElement?.classList.add('hidden');
            contentElement?.classList.remove('hidden');
            
            console.log('✅ Tip detail loaded successfully');
            
        } catch (error) {
            console.error('❌ Failed to load tip detail:', error);
            loadingElement?.classList.add('hidden');
            this.showErrorState();
        }
    }

    async loadRelatedTips() {
        try {
            const response = await fetch(`/api/tips/category/${this.tipData.category.toLowerCase().replace(/\s+/g, '-')}`);
            if (response.ok) {
                const categoryTips = await response.json();
                this.relatedTips = categoryTips
                    .filter(tip => tip.id !== this.tipData.id)
                    .slice(0, 3);
            }
        } catch (error) {
            console.warn('Could not load related tips:', error);
        }
    }

    renderTipContent() {
        if (!this.tipData) return;
        
        // Update hero section
        this.updateHeroSection();
        
        // Update sidebar
        this.updateSidebar();
        
        // Update implementation guide
        this.updateImplementationGuide();
        
        // Update related tips
        this.updateRelatedTips();
        
        // Update breadcrumb
        this.updateBreadcrumb();
    }

    updateHeroSection() {
        const tip = this.tipData;
        
        // Category badge
        const categoryBadge = document.getElementById('category-badge');
        if (categoryBadge) {
            categoryBadge.textContent = tip.category;
        }
        
        // Impact badge
        const impactBadge = document.getElementById('impact-badge');
        if (impactBadge) {
            impactBadge.textContent = `${tip.impact} Impact`;
            const impactConfig = this.getImpactConfig(tip.impact);
            impactBadge.className = `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${impactConfig.bgClass} ${impactConfig.textClass}`;
        }
        
        // Title
        const titleElement = document.getElementById('tip-heading');
        if (titleElement) {
            titleElement.textContent = tip.title;
        }
        
        // Author info
        const authorElement = document.getElementById('tip-author');
        if (authorElement) {
            authorElement.textContent = tip.author;
        }
        
        // Read time
        const readTimeElement = document.getElementById('read-time');
        if (readTimeElement) {
            readTimeElement.textContent = tip.readTime;
        }
        
        // Publish date
        const publishDateElement = document.getElementById('publish-date');
        if (publishDateElement) {
            const date = new Date(tip.datePublished);
            publishDateElement.textContent = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        // Main image
        const imageElement = document.getElementById('tip-image');
        if (imageElement) {
            imageElement.src = tip.image;
            imageElement.alt = tip.title;
        }
        
        // Description
        const descriptionElement = document.getElementById('tip-full-description');
        if (descriptionElement) {
            descriptionElement.textContent = tip.description;
        }
        
        // Tags
        const tagsContainer = document.getElementById('tip-tags');
        if (tagsContainer && tip.tags) {
            tagsContainer.innerHTML = tip.tags.map(tag => 
                `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-soft-sage-light text-leaf-green-dark">
                    #${tag}
                </span>`
            ).join('');
        }
    }

    updateSidebar() {
        const tip = this.tipData;
        
        // Impact stats
        const elements = {
            'difficulty-level': tip.difficulty,
            'setup-time': tip.timeToImplement,
            'cost-savings': tip.costSavings,
            'carbon-reduction': tip.carbonReduction
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    updateImplementationGuide() {
        const tip = this.tipData;
        
        // Steps
        const stepsContainer = document.getElementById('implementation-steps');
        if (stepsContainer && tip.steps) {
            stepsContainer.innerHTML = tip.steps.map((step, index) => `
                <li class="flex items-start space-x-3 p-3 rounded-gentle hover:bg-soft-sage-light/30 transition-colors duration-200">
                    <div class="flex-shrink-0 w-8 h-8 bg-gradient-organic text-white rounded-full flex items-center justify-center text-sm font-medium">
                        ${index + 1}
                    </div>
                    <p class="text-gray-700 leading-relaxed">${step}</p>
                </li>
            `).join('');
        }
        
        // Benefits
        const benefitsContainer = document.getElementById('tip-benefits');
        if (benefitsContainer && tip.benefits) {
            benefitsContainer.innerHTML = tip.benefits.map(benefit => `
                <li class="flex items-start space-x-3">
                    <svg class="w-5 h-5 text-leaf-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-gray-700">${benefit}</span>
                </li>
            `).join('');
        }
        
        // Pro tips
        const proTipsContainer = document.getElementById('pro-tips');
        if (proTipsContainer && tip.tips) {
            proTipsContainer.innerHTML = tip.tips.map(proTip => `
                <div class="bg-white/60 backdrop-blur-sm rounded-gentle p-4 border border-soft-sage/20">
                    <div class="flex items-start space-x-3">
                        <svg class="w-5 h-5 text-leaf-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        <p class="text-sm text-gray-700">${proTip}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    updateRelatedTips() {
        const relatedContainer = document.getElementById('related-tips');
        if (!relatedContainer || !this.relatedTips.length) return;
        
        relatedContainer.innerHTML = this.relatedTips.map(tip => `
            <article class="card-organic cursor-pointer" onclick="navigateToTip(${tip.id})">
                <img 
                    src="${tip.image}" 
                    alt="${tip.title}" 
                    class="w-full h-48 object-cover"
                    loading="lazy"
                >
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <span class="badge-primary text-xs">${tip.category}</span>
                        <span class="text-sm text-gray-500">${tip.readTime}</span>
                    </div>
                    <h3 class="text-lg font-heading font-semibold text-leaf-green-dark mb-2 line-clamp-2">
                        ${tip.title}
                    </h3>
                    <p class="text-gray-600 text-sm line-clamp-3">
                        ${tip.shortDescription || tip.description.substring(0, 100) + '...'}
                    </p>
                </div>
            </article>
        `).join('');
    }

    updateBreadcrumb() {
        const categoryElement = document.getElementById('breadcrumb-category');
        const titleElement = document.getElementById('breadcrumb-title');
        
        if (categoryElement) {
            categoryElement.textContent = this.tipData.category;
        }
        
        if (titleElement) {
            titleElement.textContent = this.tipData.title.length > 30 ? 
                this.tipData.title.substring(0, 30) + '...' : 
                this.tipData.title;
        }
    }

    updateMetadata() {
        const tip = this.tipData;
        
        // Update title
        document.title = `${tip.title} - Eco Harmony`;
        
        // Update meta descriptions
        const metaDescription = document.getElementById('tip-description');
        if (metaDescription) {
            metaDescription.setAttribute('content', tip.shortDescription || tip.description.substring(0, 160));
        }
        
        // Update Open Graph tags
        const ogTitle = document.getElementById('og-title');
        const ogDescription = document.getElementById('og-description');
        
        if (ogTitle) {
            ogTitle.setAttribute('content', `${tip.title} - Eco Harmony`);
        }
        
        if (ogDescription) {
            ogDescription.setAttribute('content', tip.shortDescription || tip.description.substring(0, 160));
        }
    }

    setupStructuredData() {
        const tip = this.tipData;
        
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": tip.title,
            "description": tip.description,
            "image": tip.image,
            "author": {
                "@type": "Person",
                "name": tip.author
            },
            "publisher": {
                "@type": "Organization",
                "name": "Eco Harmony",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://example.com/logo.png"
                }
            },
            "datePublished": tip.datePublished,
            "articleSection": tip.category,
            "keywords": tip.tags.join(", ")
        };
        
        const structuredDataElement = document.getElementById('structured-data');
        if (structuredDataElement) {
            structuredDataElement.textContent = JSON.stringify(structuredData);
        }
    }

    setupEventListeners() {
        // Share functionality
        window.shareTip = this.shareTip.bind(this);
        window.closeShareModal = this.closeShareModal.bind(this);
        window.shareToTwitter = this.shareToTwitter.bind(this);
        window.shareToFacebook = this.shareToFacebook.bind(this);
        window.copyToClipboard = this.copyToClipboard.bind(this);
        
        // Action buttons
        window.addToFavorites = this.addToFavorites.bind(this);
        window.markAsImplemented = this.markAsImplemented.bind(this);
        window.printTip = this.printTip.bind(this);
        
        // Related tip navigation
        window.navigateToTip = (tipId) => {
            window.location.href = `/tips/${tipId}`;
        };
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShareModal();
            }
        });
        
        // Close modal on backdrop click
        const shareModal = document.getElementById('share-modal');
        if (shareModal) {
            shareModal.addEventListener('click', (e) => {
                if (e.target === shareModal) {
                    this.closeShareModal();
                }
            });
        }
    }

    shareTip() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Focus trap
            const firstFocusable = modal.querySelector('button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }

    closeShareModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    shareToTwitter() {
        const text = `Check out this sustainable living tip: ${this.tipData.title}`;
        const url = window.location.href;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
    }

    shareToFacebook() {
        const url = window.location.href;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            this.showToast('Link copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showToast('Link copied to clipboard!', 'success');
        }
        
        this.closeShareModal();
    }

    addToFavorites() {
        const index = this.favorites.indexOf(this.tipId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('Removed from favorites', 'info');
        } else {
            this.favorites.push(this.tipId);
            this.showToast('Added to favorites!', 'success');
        }
        
        localStorage.setItem('eco-favorites', JSON.stringify(this.favorites));
        
        // Update button text
        const button = event.target.closest('button');
        if (button) {
            const isNowFavorited = this.favorites.includes(this.tipId);
            button.innerHTML = isNowFavorited ? 
                `<svg class="w-4 h-4 mr-2" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                Remove from Favorites` :
                `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                Save to Favorites`;
        }
    }

    markAsImplemented() {
        const index = this.implemented.indexOf(this.tipId);
        
        if (index > -1) {
            this.implemented.splice(index, 1);
            this.showToast('Marked as not implemented', 'info');
        } else {
            this.implemented.push(this.tipId);
            this.showToast('Marked as implemented! 🎉', 'success');
        }
        
        localStorage.setItem('eco-implemented', JSON.stringify(this.implemented));
        
        // Update button
        const button = event.target.closest('button');
        if (button) {
            const isImplemented = this.implemented.includes(this.tipId);
            button.innerHTML = isImplemented ?
                `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Mark as Not Done` :
                `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Mark as Done`;
            
            button.className = isImplemented ? 'btn-secondary w-full justify-center' : 'btn-primary w-full justify-center';
        }
    }

    printTip() {
        // Create a print-friendly version
        const printWindow = window.open('', '_blank');
        const tip = this.tipData;
        
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${tip.title} - Eco Harmony</title>
                <style>
                    body { font-family: 'Poppins', sans-serif; margin: 40px; color: #2D3748; }
                    h1 { color: #2D5016; font-size: 28px; margin-bottom: 20px; }
                    h2 { color: #2D5016; font-size: 20px; margin-top: 30px; margin-bottom: 15px; }
                    .meta { background: #F5E9DA; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                    .steps { margin: 20px 0; }
                    .steps ol { padding-left: 20px; }
                    .steps li { margin-bottom: 10px; }
                    .benefits ul { padding-left: 20px; }
                    .benefits li { margin-bottom: 8px; }
                    .tips { background: #EDF7ED; padding: 15px; border-radius: 8px; margin-top: 20px; }
                    @media print { body { margin: 20px; } }
                </style>
            </head>
            <body>
                <h1>${tip.title}</h1>
                
                <div class="meta">
                    <strong>Category:</strong> ${tip.category}<br>
                    <strong>Difficulty:</strong> ${tip.difficulty}<br>
                    <strong>Impact:</strong> ${tip.impact}<br>
                    <strong>Setup Time:</strong> ${tip.timeToImplement}<br>
                    <strong>Annual Savings:</strong> ${tip.costSavings}<br>
                    <strong>CO₂ Reduction:</strong> ${tip.carbonReduction}
                </div>
                
                <p>${tip.description}</p>
                
                <div class="steps">
                    <h2>Implementation Steps</h2>
                    <ol>
                        ${tip.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="benefits">
                    <h2>Key Benefits</h2>
                    <ul>
                        ${tip.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="tips">
                    <h2>Pro Tips</h2>
                    <ul>
                        ${tip.tips.map(proTip => `<li>${proTip}</li>`).join('')}
                    </ul>
                </div>
                
                <hr style="margin-top: 40px;">
                <p style="text-align: center; color: #666; font-size: 14px;">
                    Printed from Eco Harmony - ${window.location.href}
                </p>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
        }, 500);
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

    showErrorState() {
        const contentElement = document.getElementById('tip-content');
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="min-h-screen flex items-center justify-center">
                    <div class="text-center max-w-md mx-auto p-6">
                        <svg class="w-16 h-16 text-soft-sage mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <h1 class="text-2xl font-heading font-semibold text-leaf-green-dark mb-4">Unable to Load Tip</h1>
                        <p class="text-gray-600 mb-6">We're having trouble loading this sustainable living tip. Please try again.</p>
                        <div class="space-x-4">
                            <button onclick="location.reload()" class="btn-primary">Try Again</button>
                            <a href="/" class="btn-secondary">Back to Home</a>
                        </div>
                    </div>
                </div>
            `;
            contentElement.classList.remove('hidden');
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

    redirectToHome() {
        window.location.href = '/';
    }
}

// Initialize when DOM is loaded
function loadTipDetail(tipId) {
    window.tipDetailPage = new TipDetailPage();
}

// Add styles for line clamping
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
    `;
    document.head.appendChild(style);
});
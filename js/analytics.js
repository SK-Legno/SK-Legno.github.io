// Google Analytics 4 Configuration and Custom Events

// Analytics configuration
const ANALYTICS_CONFIG = {
    measurementId: 'GA_MEASUREMENT_ID', // Replace with your actual GA4 Measurement ID
    debugMode: false, // Set to true for development
    enableEnhancedEcommerce: true,
    enableUserTiming: true
};

// Initialize Google Analytics
function initializeAnalytics() {
    if (typeof gtag === 'undefined') {
        console.warn('Google Analytics not loaded');
        return;
    }

    // Configure GA4
    gtag('config', ANALYTICS_CONFIG.measurementId, {
        'page_title': document.title,
        'page_location': window.location.href,
        'send_page_view': true,
        'anonymize_ip': true, // GDPR compliance
        'allow_google_signals': false, // Privacy compliance
        'allow_ad_personalization_signals': false // Privacy compliance
    });

    if (ANALYTICS_CONFIG.debugMode) {
        console.log('Google Analytics initialized');
    }
}

// Custom event tracking
class AnalyticsTracker {
    constructor() {
        this.sessionStartTime = Date.now();
        this.pageViews = 0;
        this.interactions = 0;
    }

    // Track page views
    trackPageView(pageName, pageCategory = 'portfolio') {
        if (typeof gtag === 'undefined') return;

        gtag('event', 'page_view', {
            'page_title': pageName,
            'page_location': window.location.href,
            'page_category': pageCategory,
            'custom_parameter_1': 'portfolio_site'
        });

        this.pageViews++;

        if (ANALYTICS_CONFIG.debugMode) {
            console.log(`Page view tracked: ${pageName}`);
        }
    }

    // Track user interactions
    trackInteraction(action, category, label = null, value = null) {
        if (typeof gtag === 'undefined') return;

        const eventData = {
            'event_category': category,
            'event_label': label,
            'value': value,
            'custom_parameter_1': 'user_interaction'
        };

        gtag('event', action, eventData);
        this.interactions++;

        if (ANALYTICS_CONFIG.debugMode) {
            console.log(`Interaction tracked: ${action} - ${category}`);
        }
    }

    // Track navigation clicks
    trackNavigation(linkText, destination) {
        this.trackInteraction('navigation_click', 'navigation', linkText, 1);
    }

    // Track portfolio project views
    trackProjectView(projectName, projectCategory) {
        this.trackInteraction('project_view', 'portfolio', projectName, 1);
    }

    // Track certification views
    trackCertificationView(certificationName) {
        this.trackInteraction('certification_view', 'certification', certificationName, 1);
    }

    // Track external link clicks
    trackExternalLink(platform, url) {
        this.trackInteraction('external_link_click', 'social_media', platform, 1);
    }

    // Track form submissions
    trackFormSubmission(formName) {
        this.trackInteraction('form_submit', 'contact', formName, 1);
    }

    // Track scroll depth
    trackScrollDepth(depth) {
        this.trackInteraction('scroll_depth', 'engagement', `depth_${depth}`, depth);
    }

    // Track time on page
    trackTimeOnPage() {
        const timeOnPage = Math.round((Date.now() - this.sessionStartTime) / 1000);
        this.trackInteraction('time_on_page', 'engagement', 'seconds', timeOnPage);
    }

    // Track user engagement
    trackEngagement(action, details = {}) {
        this.trackInteraction(action, 'engagement', JSON.stringify(details), 1);
    }
}

// Initialize analytics tracker
const analyticsTracker = new AnalyticsTracker();

// Set up event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Track initial page view
    analyticsTracker.trackPageView(document.title);

    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            const linkText = this.textContent.trim();
            const destination = this.getAttribute('href');
            analyticsTracker.trackNavigation(linkText, destination);
        });
    });

    // Track external social media links
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function () {
            const platform = this.textContent.trim();
            const url = this.getAttribute('href');
            analyticsTracker.trackExternalLink(platform, url);
        });
    });

    // Track portfolio project clicks
    document.querySelectorAll('.project-card, .portfolio-item').forEach(project => {
        project.addEventListener('click', function () {
            const projectName = this.querySelector('h3')?.textContent || 'Unknown Project';
            const projectCategory = this.dataset.category || 'general';
            analyticsTracker.trackProjectView(projectName, projectCategory);
        });
    });

    // Track certification clicks
    document.querySelectorAll('.certification-card, .cert-item').forEach(cert => {
        cert.addEventListener('click', function () {
            const certName = this.querySelector('h3')?.textContent || 'Unknown Certification';
            analyticsTracker.trackCertificationView(certName);
        });
    });

    // Track form submissions
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function () {
            analyticsTracker.trackFormSubmission('contact_form');
        });
    }

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;

            // Track at 25%, 50%, 75%, 100%
            if (scrollPercent >= 25 && maxScrollDepth < 50) {
                analyticsTracker.trackScrollDepth(25);
            } else if (scrollPercent >= 50 && maxScrollDepth < 75) {
                analyticsTracker.trackScrollDepth(50);
            } else if (scrollPercent >= 75 && maxScrollDepth < 100) {
                analyticsTracker.trackScrollDepth(75);
            } else if (scrollPercent >= 100) {
                analyticsTracker.trackScrollDepth(100);
            }
        }
    });

    // Track time on page when user leaves
    window.addEventListener('beforeunload', function () {
        analyticsTracker.trackTimeOnPage();
    });

    // Track button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function () {
            const buttonText = this.textContent.trim();
            const buttonType = this.classList.contains('btn-primary') ? 'primary' : 'secondary';
            analyticsTracker.trackInteraction('button_click', 'ui', buttonText, 1);
        });
    });

    // Track skill tag interactions
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('click', function () {
            const skillName = this.textContent.trim();
            analyticsTracker.trackInteraction('skill_click', 'skills', skillName, 1);
        });
    });
});

// Enhanced ecommerce tracking (if needed)
function trackEcommerceEvent(action, parameters) {
    if (typeof gtag === 'undefined') return;

    gtag('event', action, {
        ...parameters,
        'custom_parameter_1': 'ecommerce'
    });
}

// User timing tracking
function trackUserTiming(category, variable, time) {
    if (typeof gtag === 'undefined') return;

    gtag('event', 'timing_complete', {
        'name': variable,
        'value': time,
        'event_category': category
    });
}

// Error tracking
function trackError(error, context = '') {
    if (typeof gtag === 'undefined') return;

    gtag('event', 'exception', {
        'description': error.message || error,
        'fatal': false,
        'custom_parameter_1': context
    });
}

// Performance tracking
function trackPerformance() {
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            trackUserTiming('page_load', 'load_time', Math.round(navigation.loadEventEnd - navigation.loadEventStart));
            trackUserTiming('dom_content', 'dom_content_loaded', Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart));
        }
    }
}

// Initialize everything
window.addEventListener('load', function () {
    initializeAnalytics();
    trackPerformance();

    if (ANALYTICS_CONFIG.debugMode) {
        console.log('Analytics setup complete');
    }
});

// Export for use in other modules
window.AnalyticsTracker = AnalyticsTracker;
window.analyticsTracker = analyticsTracker;
window.trackError = trackError; 
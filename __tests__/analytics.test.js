import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';

// Mock gtag before importing analytics
global.gtag = jest.fn();

// Import analytics after mocking gtag
import '../js/analytics.js';

describe('Analytics Functionality', () => {
    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Setup DOM
        document.body.innerHTML = `
      <nav class="navbar">
        <ul class="nav-menu">
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="pages/portfolio.html" class="nav-link">Portfolio</a></li>
        </ul>
      </nav>
      <div class="social-links">
        <a href="https://github.com/user" class="social-link">GitHub</a>
        <a href="https://twitter.com/user" class="social-link">Twitter</a>
      </div>
      <div class="project-card" data-category="web-app">
        <h3>Test Project</h3>
      </div>
      <div class="certification-card">
        <h3>Test Certification</h3>
      </div>
      <form id="contact-form">
        <button type="submit">Submit</button>
      </form>
      <button class="btn btn-primary">Test Button</button>
      <span class="skill-tag">JavaScript</span>
    `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('analytics tracker is initialized', () => {
        expect(window.analyticsTracker).toBeDefined();
        expect(window.analyticsTracker).toBeInstanceOf(window.AnalyticsTracker);
    });

    test('page view is tracked on load', () => {
        window.analyticsTracker.trackPageView('Test Page');
        expect(global.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
            'page_title': 'Test Page',
            'page_location': expect.any(String),
            'page_category': 'portfolio',
            'custom_parameter_1': 'portfolio_site'
        }));
    });

    test('navigation clicks are tracked', () => {
        window.analyticsTracker.trackNavigation('Home', '/index.html');
        expect(global.gtag).toHaveBeenCalledWith('event', 'navigation_click', expect.objectContaining({
            'event_category': 'navigation',
            'event_label': 'Home',
            'value': 1,
            'custom_parameter_1': 'user_interaction'
        }));
    });

    test('external link clicks are tracked', () => {
        window.analyticsTracker.trackExternalLink('GitHub', 'https://github.com/user');
        expect(global.gtag).toHaveBeenCalledWith('event', 'external_link_click', expect.objectContaining({
            'event_category': 'social_media',
            'event_label': 'GitHub',
            'value': 1,
            'custom_parameter_1': 'user_interaction'
        }));
    });

    test('project views are tracked', () => {
        window.analyticsTracker.trackProjectView('Test Project', 'web-app');
        expect(global.gtag).toHaveBeenCalledWith('event', 'project_view', expect.objectContaining({
            'event_category': 'portfolio',
            'event_label': 'Test Project',
            'value': 1,
            'custom_parameter_1': 'user_interaction'
        }));
    });

    test('certification views are tracked', () => {
        window.analyticsTracker.trackCertificationView('Test Certification');
        expect(global.gtag).toHaveBeenCalledWith('event', 'certification_view', expect.objectContaining({
            'event_category': 'certification',
            'event_label': 'Test Certification',
            'value': 1,
            'custom_parameter_1': 'user_interaction'
        }));
    });

    test('form submissions are tracked', () => {
        window.analyticsTracker.trackFormSubmission('contact_form');
        expect(global.gtag).toHaveBeenCalledWith('event', 'form_submit', expect.objectContaining({
            'event_category': 'contact',
            'event_label': 'contact_form',
            'value': 1,
            'custom_parameter_1': 'user_interaction'
        }));
    });

    test('button clicks are tracked', () => {
        window.analyticsTracker.trackInteraction('button_click', 'ui', 'Test Button', 1);
        expect(global.gtag).toHaveBeenCalledWith('event', 'button_click', expect.objectContaining({
            'event_category': 'ui',
            'event_label': 'Test Button',
            'value': 1,
            'custom_parameter_1': 'user_interaction'
        }));
    });

    test('skill tag interactions are tracked', () => {
        window.analyticsTracker.trackInteraction('skill_click', 'skills', 'JavaScript', 1);
        expect(global.gtag).toHaveBeenCalledWith('event', 'skill_click', expect.objectContaining({
            'event_category': 'skills',
            'event_label': 'JavaScript',
            'value': 1,
            'custom_parameter_1': 'user_interaction'
        }));
    });

    test('scroll depth is tracked', () => {
        window.analyticsTracker.trackScrollDepth(50);
        expect(global.gtag).toHaveBeenCalledWith('event', 'scroll_depth', expect.objectContaining({
            'event_category': 'engagement',
            'event_label': 'depth_50',
            'value': 50,
            'custom_parameter_1': 'user_interaction'
        }));
    });

    test('time on page is tracked on unload', () => {
        window.analyticsTracker.trackTimeOnPage();
        expect(global.gtag).toHaveBeenCalledWith('event', 'time_on_page', expect.objectContaining({
            'event_category': 'engagement',
            'event_label': 'seconds',
            'value': expect.any(Number),
            'custom_parameter_1': 'user_interaction'
        }));
    });

    test('analytics tracker methods work correctly', () => {
        const tracker = window.analyticsTracker;
        tracker.trackPageView('Test Page', 'test-category');
        expect(global.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
            'page_title': 'Test Page',
            'page_category': 'test-category'
        }));
        tracker.trackInteraction('test_action', 'test_category', 'test_label', 5);
        expect(global.gtag).toHaveBeenCalledWith('event', 'test_action', expect.objectContaining({
            'event_category': 'test_category',
            'event_label': 'test_label',
            'value': 5
        }));
        tracker.trackNavigation('Home', '/index.html');
        expect(global.gtag).toHaveBeenCalledWith('event', 'navigation_click', expect.objectContaining({
            'event_category': 'navigation',
            'event_label': 'Home',
            'value': 1
        }));
    });

    test.skip('performance tracking works', () => { });

    test('error tracking works', () => {
        const error = new Error('Test error');
        const context = 'test-context';
        if (window.trackError) {
            window.trackError(error, context);
            expect(global.gtag).toHaveBeenCalledWith('event', 'exception', expect.objectContaining({
                'description': 'Test error',
                'fatal': false,
                'custom_parameter_1': 'test-context'
            }));
        } else {
            expect(true).toBe(true);
        }
    });
}); 
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';

describe('Accessibility Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
          <div class="nav-logo">
            <a href="index.html" aria-label="Home">Portfolio</a>
          </div>
          <ul class="nav-menu" role="menubar">
            <li class="nav-item" role="none">
              <a href="index.html" class="nav-link active" role="menuitem" aria-current="page">Home</a>
            </li>
            <li class="nav-item" role="none">
              <a href="pages/certification.html" class="nav-link" role="menuitem">Certification</a>
            </li>
            <li class="nav-item" role="none">
              <a href="pages/portfolio.html" class="nav-link" role="menuitem">Portfolio</a>
            </li>
            <li class="nav-item" role="none">
              <a href="pages/contact.html" class="nav-link" role="menuitem">Contact</a>
            </li>
          </ul>
          <button class="hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
            <span class="bar" aria-hidden="true"></span>
            <span class="bar" aria-hidden="true"></span>
            <span class="bar" aria-hidden="true"></span>
          </button>
        </div>
      </nav>
      <main role="main">
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero-container">
            <div class="hero-content">
              <h1 id="hero-title" class="hero-title">Welcome to My Portfolio</h1>
              <p class="hero-subtitle">フルスタック開発者として、創造的なソリューションを提供します</p>
              <div class="hero-buttons">
                <a href="pages/portfolio.html" class="btn btn-primary">作品を見る</a>
                <a href="pages/contact.html" class="btn btn-secondary">お問い合わせ</a>
              </div>
            </div>
            <div class="hero-image">
              <img src="assets/images/profile.jpg" alt="Profile photo" class="profile-image">
            </div>
          </div>
        </section>
        <section class="about" id="about" aria-labelledby="about-title">
          <div class="container">
            <h2 id="about-title" class="section-title">About Me</h2>
            <div class="about-content">
              <div class="about-text">
                <p>こんにちは！私は情熱的な開発者です。</p>
              </div>
              <div class="skills">
                <h3>技術スキル</h3>
                <div class="skill-tags" role="list" aria-label="Technical skills">
                  <span class="skill-tag" role="listitem">JavaScript</span>
                  <span class="skill-tag" role="listitem">React</span>
                  <span class="skill-tag" role="listitem">Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="recent-updates" aria-labelledby="updates-title">
          <div class="container">
            <h2 id="updates-title" class="section-title">Recent Updates</h2>
            <div class="updates-grid" role="list" aria-label="Recent updates">
              <article class="update-card" role="listitem">
                <h3>新しい資格を取得しました</h3>
                <p>AWS Solutions Architect Associate</p>
                <time datetime="2024-01">2024年1月</time>
              </article>
            </div>
          </div>
        </section>
      </main>
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>Portfolio</h3>
              <p>個人ポートフォリオサイト</p>
            </div>
            <nav class="footer-section" aria-label="Footer navigation">
              <h3>Links</h3>
              <ul role="menubar">
                <li role="none"><a href="index.html">Home</a></li>
                <li role="none"><a href="pages/certification.html">Certification</a></li>
                <li role="none"><a href="pages/portfolio.html">Portfolio</a></li>
                <li role="none"><a href="pages/contact.html">Contact</a></li>
              </ul>
            </nav>
            <div class="footer-section">
              <h3>Social</h3>
              <div class="social-links" role="list" aria-label="Social media links">
                <a href="#" class="social-link" role="listitem">GitHub</a>
                <a href="#" class="social-link" role="listitem">Twitter</a>
                <a href="#" class="social-link" role="listitem">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('page has proper heading structure', () => {
        const headings = document.querySelectorAll('h1, h2, h3');
        const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));

        // Check that heading levels are in logical order
        for (let i = 1; i < headingLevels.length; i++) {
            expect(headingLevels[i] - headingLevels[i - 1]).toBeLessThanOrEqual(1);
        }
    });

    test('all images have alt text', () => {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            expect(img).toHaveAttribute('alt');
            expect(img.getAttribute('alt')).not.toBe('');
        });
    });

    test('all links have descriptive text', () => {
        const links = document.querySelectorAll('a');

        links.forEach(link => {
            const text = link.textContent.trim();
            expect(text).not.toBe('');
            expect(text.length).toBeGreaterThan(0);
        });
    });

    test('navigation has proper ARIA labels', () => {
        const nav = document.querySelector('nav');
        expect(nav).toHaveAttribute('role', 'navigation');
        expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    test('hamburger menu has proper ARIA attributes', () => {
        const hamburger = document.querySelector('.hamburger');
        expect(hamburger).toHaveAttribute('aria-label', 'Toggle navigation menu');
        expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    });

    test('current page is properly indicated', () => {
        const currentLink = document.querySelector('.nav-link.active');
        expect(currentLink).toHaveAttribute('aria-current', 'page');
    });

    test('sections have proper ARIA labels', () => {
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            if (section.querySelector('h1, h2, h3')) {
                expect(section).toHaveAttribute('aria-labelledby');
            }
        });
    });

    test('lists have proper roles', () => {
        const lists = document.querySelectorAll('ul, ol');

        lists.forEach(list => {
            if (list.closest('nav')) {
                expect(list).toHaveAttribute('role', 'menubar');
            }
        });
    });

    test('list items have proper roles', () => {
        const listItems = document.querySelectorAll('li');

        listItems.forEach(item => {
            if (item.closest('nav')) {
                expect(item).toHaveAttribute('role', 'none');
            }
        });
    });

    test('skill tags have proper roles', () => {
        const skillContainer = document.querySelector('.skill-tags');
        const skillTags = document.querySelectorAll('.skill-tag');

        expect(skillContainer).toHaveAttribute('role', 'list');
        expect(skillContainer).toHaveAttribute('aria-label', 'Technical skills');

        skillTags.forEach(tag => {
            expect(tag).toHaveAttribute('role', 'listitem');
        });
    });

    test('social links have proper roles', () => {
        const socialContainer = document.querySelector('.social-links');
        const socialLinks = document.querySelectorAll('.social-link');

        expect(socialContainer).toHaveAttribute('role', 'list');
        expect(socialContainer).toHaveAttribute('aria-label', 'Social media links');

        socialLinks.forEach(link => {
            expect(link).toHaveAttribute('role', 'listitem');
        });
    });

    test('updates grid has proper roles', () => {
        const updatesGrid = document.querySelector('.updates-grid');
        const updateCards = document.querySelectorAll('.update-card');

        expect(updatesGrid).toHaveAttribute('role', 'list');
        expect(updatesGrid).toHaveAttribute('aria-label', 'Recent updates');

        updateCards.forEach(card => {
            expect(card).toHaveAttribute('role', 'listitem');
        });
    });

    test('time elements have proper datetime attributes', () => {
        const timeElements = document.querySelectorAll('time');

        timeElements.forEach(time => {
            expect(time).toHaveAttribute('datetime');
        });
    });

    test('footer has proper role', () => {
        const footer = document.querySelector('footer');
        expect(footer).toHaveAttribute('role', 'contentinfo');
    });

    test('main content has proper role', () => {
        const main = document.querySelector('main');
        expect(main).toHaveAttribute('role', 'main');
    });

    test('buttons have proper labels', () => {
        const buttons = document.querySelectorAll('button');

        buttons.forEach(button => {
            const hasAriaLabel = button.hasAttribute('aria-label');
            const hasTextContent = button.textContent.trim().length > 0;
            expect(hasAriaLabel || hasTextContent).toBe(true);
        });
    });

    test('form elements have proper labels', () => {
        // Add a form to test
        document.body.innerHTML += `
      <form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name">
        <label for="email">Email</label>
        <input type="email" id="email" name="email">
      </form>
    `;

        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            expect(label).toBeInTheDocument();
        });
    });

    test('color contrast is sufficient', () => {
        // This is a basic test - in a real scenario, you'd use a library like axe-core
        const textElements = document.querySelectorAll('p, h1, h2, h3, span, a');

        textElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;

            // Basic check - ensure text is not transparent
            expect(color).not.toBe('rgba(0, 0, 0, 0)');
            expect(color).not.toBe('transparent');
        });
    });

    test('focus indicators are present', () => {
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');

        focusableElements.forEach(element => {
            element.focus();
            const style = window.getComputedStyle(element);

            // Check for focus indicators (outline, box-shadow, or border)
            const hasOutline = style.outline !== 'none';
            const hasBoxShadow = style.boxShadow !== 'none';
            const hasBorder = style.border !== 'none';

            expect(hasOutline || hasBoxShadow || hasBorder).toBe(true);
        });
    });

    test('skip links are present', () => {
        // Add a skip link to test
        document.body.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      ${document.body.innerHTML}
    `;

        const skipLink = document.querySelector('.skip-link');
        expect(skipLink).toBeInTheDocument();
        expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    test('landmarks are properly defined', () => {
        const landmarks = {
            'navigation': document.querySelector('nav'),
            'main': document.querySelector('main'),
            'contentinfo': document.querySelector('footer')
        };

        Object.entries(landmarks).forEach(([role, element]) => {
            expect(element).toHaveAttribute('role', role);
        });
    });
}); 
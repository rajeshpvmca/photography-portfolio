/**
 * ===================================================================
 * STACKLY PHOTOGRAPHY PORTFOLIO - MASTER JAVASCRIPT
 * Path: assets/js/main.js
 * Dynamically loads separate header.html & footer.html files into pages,
 * initializes Bootstrap 5 components, smooth scroll, Lightbox & AOS.
 * ===================================================================
 */

(function () {
  'use strict';


  async function loadComponent(targetId, filePath) {
    const el = document.getElementById(targetId);
    if (!el) return;

    try {
      // Append cache-buster query so browser never serves stale cached files
      const cacheBustUrl = filePath + (filePath.includes('?') ? '&' : '?') + 't=' + Date.now();
      const response = await fetch(cacheBustUrl, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: HTTP ${response.status}`);
      }
      const html = await response.text();
      if (html && html.trim().length > 0) {
        el.innerHTML = html;
      }
    } catch (err) {
      console.warn(`[ComponentLoader] Could not load ${filePath} via fetch:`, err);

      // Offline / Local file protocol (file://) fallback via XMLHttpRequest
      if (!el.children || el.children.length === 0) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', filePath, false);
          xhr.send(null);
          if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
            el.innerHTML = xhr.responseText;
          }
        } catch (xhrErr) {
          console.error(`[ComponentLoader] XHR loading failed for ${filePath}:`, xhrErr);
        }
      }
    }
  }

  /**
   * Setup Header & Navigation Event Listeners
   */
  function setupHeaderEvents() {
    const header = document.querySelector('.site-header');
    const offcanvasEl = document.getElementById('navbarOffcanvas');

    // Sticky Shadow Effect on Scroll
    function handleScroll() {
      if (!header) return;
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Auto-close Offcanvas Drawer when a navigation link or CTA is clicked (Mobile/Tablet UX)
    if (offcanvasEl) {
      const navLinks = offcanvasEl.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item, .btn-book-shoot');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
            const instance = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (instance) instance.hide();
          }
        });
      });
    }

    // Active Navigation Highlight on Scroll for all menu sections
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
    function highlightOnScroll() {
      const scrollPos = window.pageYOffset + 120;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          allNavLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            } else if (!link.classList.contains('dropdown-toggle')) {
              link.classList.remove('active');
            }
          });
        }
      });
    }
    window.addEventListener('scroll', highlightOnScroll, { passive: true });
    highlightOnScroll();

    // Multipage navigation adaptation for portfolio.html
    const isPortfolio = window.location.pathname.endsWith('portfolio.html') || window.location.href.includes('portfolio.html');
    if (isPortfolio) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const text = link.textContent.trim().toUpperCase();
        if (text.startsWith('PORTFOLIO')) {
          link.classList.add('active');
          link.setAttribute('href', '#portfolio-intro');
        } else {
          link.classList.remove('active');
          const href = link.getAttribute('href') || '';
          if (href.startsWith('#') && href !== '#portfolio-intro') {
            if (href === '#services') {
              link.setAttribute('href', 'services.html');
            } else if (href === '#about') {
              link.setAttribute('href', 'about.html');
            } else if (href === '#clients') {
              link.setAttribute('href', 'clients.html');
            } else if (href === '#journal') {
              link.setAttribute('href', 'journal.html');
            } else if (href === '#contact') {
              link.setAttribute('href', 'contact.html');
            } else {
              link.setAttribute('href', 'index.html' + href);
            }
          }
        }
      });
      const bookBtn = document.querySelector('.btn-book-shoot');
      if (bookBtn && (bookBtn.getAttribute('href') === '#contact' || bookBtn.getAttribute('href') === 'index.html#contact')) {
        bookBtn.setAttribute('href', 'contact.html');
      }
    }

    // Multipage navigation adaptation for services.html
    const isServices = window.location.pathname.endsWith('services.html') || window.location.href.includes('services.html');
    if (isServices) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const text = link.textContent.trim().toUpperCase();
        if (text.startsWith('SERVICES')) {
          link.classList.add('active');
          link.setAttribute('href', '#services-hero');
        } else {
          link.classList.remove('active');
          const href = link.getAttribute('href') || '';
          if (href.startsWith('#') && href !== '#services-hero') {
            if (href === '#portfolio') {
              link.setAttribute('href', 'portfolio.html');
            } else if (href === '#about') {
              link.setAttribute('href', 'about.html');
            } else if (href === '#clients') {
              link.setAttribute('href', 'clients.html');
            } else if (href === '#journal') {
              link.setAttribute('href', 'journal.html');
            } else if (href === '#contact') {
              link.setAttribute('href', 'contact.html');
            } else {
              link.setAttribute('href', 'index.html' + href);
            }
          }
        }
      });
      const bookBtn = document.querySelector('.btn-book-shoot');
      if (bookBtn && bookBtn.getAttribute('href') === '#contact') {
        bookBtn.setAttribute('href', '#services-cta');
      }
    }

    // Multipage navigation adaptation for about.html
    const isAbout = window.location.pathname.endsWith('about.html') || window.location.href.includes('about.html');
    if (isAbout) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const text = link.textContent.trim().toUpperCase();
        if (text.startsWith('ABOUT')) {
          link.classList.add('active');
          link.setAttribute('href', '#about-hero');
        } else {
          link.classList.remove('active');
          const href = link.getAttribute('href') || '';
          if (href.startsWith('#') && href !== '#about-hero') {
            if (href === '#portfolio') {
              link.setAttribute('href', 'portfolio.html');
            } else if (href === '#services') {
              link.setAttribute('href', 'services.html');
            } else if (href === '#clients') {
              link.setAttribute('href', 'clients.html');
            } else if (href === '#journal') {
              link.setAttribute('href', 'journal.html');
            } else if (href === '#contact') {
              link.setAttribute('href', 'contact.html');
            } else {
              link.setAttribute('href', 'index.html' + href);
            }
          }
        }
      });
      const bookBtn = document.querySelector('.btn-book-shoot');
      if (bookBtn && bookBtn.getAttribute('href') === '#contact') {
        bookBtn.setAttribute('href', '#about-cta');
      }
    }

    // Multipage navigation adaptation for clients.html
    const isClients = window.location.pathname.endsWith('clients.html') || window.location.href.includes('clients.html');
    if (isClients) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const text = link.textContent.trim().toUpperCase();
        if (text.startsWith('CLIENTS')) {
          link.classList.add('active');
          link.setAttribute('href', '#clients-hero');
        } else {
          link.classList.remove('active');
          const href = link.getAttribute('href') || '';
          if (href.startsWith('#') && href !== '#clients-hero') {
            if (href === '#portfolio') {
              link.setAttribute('href', 'portfolio.html');
            } else if (href === '#services') {
              link.setAttribute('href', 'services.html');
            } else if (href === '#about') {
              link.setAttribute('href', 'about.html');
            } else if (href === '#journal') {
              link.setAttribute('href', 'journal.html');
            } else if (href === '#contact') {
              link.setAttribute('href', 'contact.html');
            } else {
              link.setAttribute('href', 'index.html' + href);
            }
          }
        }
      });
      const bookBtn = document.querySelector('.btn-book-shoot');
      if (bookBtn && bookBtn.getAttribute('href') === '#contact') {
        bookBtn.setAttribute('href', '#clients-cta');
      }
    }

    // Multipage navigation adaptation for journal.html
    const isJournal = window.location.pathname.endsWith('journal.html') || window.location.href.includes('journal.html');
    if (isJournal) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const text = link.textContent.trim().toUpperCase();
        if (text.startsWith('JOURNAL')) {
          link.classList.add('active');
          link.setAttribute('href', '#journal-hero');
        } else {
          link.classList.remove('active');
          const href = link.getAttribute('href') || '';
          if (href.startsWith('#') && href !== '#journal-hero') {
            if (href === '#portfolio') {
              link.setAttribute('href', 'portfolio.html');
            } else if (href === '#services') {
              link.setAttribute('href', 'services.html');
            } else if (href === '#about') {
              link.setAttribute('href', 'about.html');
            } else if (href === '#clients') {
              link.setAttribute('href', 'clients.html');
            } else if (href === '#contact') {
              link.setAttribute('href', 'contact.html');
            } else {
              link.setAttribute('href', 'index.html' + href);
            }
          }
        }
      });
      const bookBtn = document.querySelector('.btn-book-shoot');
      if (bookBtn && bookBtn.getAttribute('href') === '#contact') {
        bookBtn.setAttribute('href', '#journal-cta');
      }
    }

    // Multipage navigation adaptation for contact.html
    const isContact = window.location.pathname.endsWith('contact.html') || window.location.href.includes('contact.html');
    if (isContact) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const text = link.textContent.trim().toUpperCase();
        if (text.startsWith('CONTACT')) {
          link.classList.add('active');
          link.setAttribute('href', '#contact-hero');
        } else {
          link.classList.remove('active');
          const href = link.getAttribute('href') || '';
          if (href.startsWith('#') && href !== '#contact-hero') {
            if (href === '#portfolio') {
              link.setAttribute('href', 'portfolio.html');
            } else if (href === '#services') {
              link.setAttribute('href', 'services.html');
            } else if (href === '#about') {
              link.setAttribute('href', 'about.html');
            } else if (href === '#clients') {
              link.setAttribute('href', 'clients.html');
            } else if (href === '#journal') {
              link.setAttribute('href', 'journal.html');
            } else {
              link.setAttribute('href', 'index.html' + href);
            }
          }
        }
      });
      const bookBtn = document.querySelector('.btn-book-shoot');
      if (bookBtn && bookBtn.getAttribute('href') === '#contact') {
        bookBtn.setAttribute('href', 'bookaslot.html');
      }
    }

    // Multipage navigation adaptation for bookaslot.html
    const isBookaslot = window.location.pathname.endsWith('bookaslot.html') || window.location.href.includes('bookaslot.html');
    if (isBookaslot) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || '';
        if (href.startsWith('#')) {
          if (href === '#portfolio') {
            link.setAttribute('href', 'portfolio.html');
          } else if (href === '#services') {
            link.setAttribute('href', 'services.html');
          } else if (href === '#about') {
            link.setAttribute('href', 'about.html');
          } else if (href === '#clients') {
            link.setAttribute('href', 'clients.html');
          } else if (href === '#journal') {
            link.setAttribute('href', 'journal.html');
          } else if (href === '#contact') {
            link.setAttribute('href', 'contact.html');
          } else if (href === '#hero' || href === '#home') {
            link.setAttribute('href', 'index.html');
          } else {
            link.setAttribute('href', 'index.html' + href);
          }
        }
      });
      const bookBtn = document.querySelector('.btn-book-shoot');
      if (bookBtn) {
        bookBtn.classList.add('active');
        bookBtn.setAttribute('href', '#project-specification');
      }
    }

    // Auth modal tab switcher (LOGIN vs SIGN UP in header)
    document.querySelectorAll('[data-auth-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-auth-tab');
        if (tab === 'signup') {
          const signupTab = document.getElementById('signup-tab');
          if (signupTab && typeof bootstrap !== 'undefined' && bootstrap.Tab) {
            bootstrap.Tab.getOrCreateInstance(signupTab).show();
          }
        } else {
          const loginTab = document.getElementById('login-tab');
          if (loginTab && typeof bootstrap !== 'undefined' && bootstrap.Tab) {
            bootstrap.Tab.getOrCreateInstance(loginTab).show();
          }
        }
      });
    });

    // Dropdown items that filter portfolio cards
    document.querySelectorAll('.dropdown-item[data-filter]').forEach(item => {
      item.addEventListener('click', () => {
        const filterVal = item.getAttribute('data-filter');
        const targetPill = document.querySelector(`.filter-pill[data-filter="${filterVal}"]`);
        if (targetPill) {
          targetPill.click();
        }
      });
    });
  }

  /**
   * Setup Footer Events (Back to top button)
   */
  function setupFooterEvents() {
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /**
   * Setup Portfolio Filter System
   */
  function setupPortfolioFilters() {
    const tabLinks = document.querySelectorAll('.portfolio-tab-link');
    const filterBtns = document.querySelectorAll('.filter-pill');
    const portfolioCards = document.querySelectorAll('.work-card');

    function applyFilter(filterValue) {
      if (!portfolioCards.length) return;
      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('is-hidden');
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            card.classList.add('is-hidden');
            card.style.display = 'none';
          }, 300);
        }
      });

      if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 350);
      }
    }

    if (tabLinks.length > 0) {
      tabLinks.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          tabLinks.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const filterValue = tab.getAttribute('data-filter') || 'all';
          applyFilter(filterValue);
        });
      });
    }

    if (filterBtns.length > 0) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filterValue = btn.getAttribute('data-filter') || 'all';
          applyFilter(filterValue);
        });
      });
    }
  }

  /**
   * Setup Editorial Lightbox Modal
   */
  function setupLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-image');
    const titleEl = document.getElementById('lightbox-title');
    const catEl = document.getElementById('lightbox-category');
    const closeBtn = document.getElementById('lightbox-close');

    function openModal(src, title, cat) {
      if (!modal || !img) return;
      img.src = src;
      img.alt = title;
      if (titleEl) titleEl.textContent = title;
      if (catEl) catEl.textContent = cat;
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.work-card, .lightbox-trigger').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.work-external-link')) return;
        const cardImg = card.querySelector('img');
        const cardTitle = card.querySelector('.work-title');
        const cardCat = card.querySelector('.work-category');
        if (cardImg) {
          openModal(
            cardImg.src,
            cardTitle ? cardTitle.textContent : 'Stackly Photography Showcase',
            cardCat ? cardCat.textContent : 'Portfolio'
          );
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  /**
   * Smooth Anchor Scrolling with Navbar Offset
   */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '' || this.getAttribute('data-bs-toggle') === 'modal') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 76;
          const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });

    const heroScroll = document.querySelector('.hero-scroll-prompt');
    if (heroScroll) {
      heroScroll.addEventListener('click', () => {
        const about = document.getElementById('about');
        if (about) {
          const pos = about.getBoundingClientRect().top + window.pageYOffset - 76;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    }
  }

  /**
   * Setup Section 6 Swiper.js Continuous Auto-Scroll Marquee
   * Seamless infinite linear ticker
   */
  function setupClientsSwiper() {
    const swiperEl = document.querySelector('.clients-swiper');
    if (!swiperEl) return;

    if (typeof Swiper === 'undefined') {
      setTimeout(setupClientsSwiper, 150);
      return;
    }

    try {
      new Swiper('.clients-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        loop: true,
        speed: 4200,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        },
        allowTouchMove: true,
        freeMode: {
          enabled: true,
          momentum: false,
        },
      });
    } catch (e) {
      console.warn('[ClientsSwiper] Initialization notice:', e);
    }
  }

  /**
   * Main Initialization on DOM Ready
   */
  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize AOS Scroll Animations
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 850,
        easing: 'ease-out-cubic',
        once: true,
        offset: 40,
        delay: 50,
        disable: window.innerWidth < 480 ? 'mobile' : false
      });
    }

    // 2. Load separate header.html and footer.html files into the page
    await Promise.all([
      loadComponent('site-header', 'header.html'),
      loadComponent('site-footer', 'footer.html')
    ]);

    // 3. Initialize header, footer and interactive page features
    setupHeaderEvents();
    setupFooterEvents();
    setupPortfolioFilters();
    setupLightbox();
    setupSmoothScroll();
    setupClientsSwiper();

    // 4. Refresh AOS after component injection
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 200);
    }
  });

  // Re-refresh on full window load
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  });

  // Public API
  window.StacklyApp = {
    loadHeader: () => loadComponent('site-header', 'header.html'),
    loadFooter: () => loadComponent('site-footer', 'footer.html'),
    setupHeader: setupHeaderEvents,
    setupFooter: setupFooterEvents,
    refreshAOS: () => { if (typeof AOS !== 'undefined') AOS.refresh(); }
  };
})();

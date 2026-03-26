/**
 * IBNU CRYPTOSPHERE SUPER APP - JavaScript
 * Mobile Menu, Search, Animations, Interactions
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
  
  // ═════════════════════════════════════════════════════════════════════════════
  // NAVBAR SCROLL EFFECT
  // ═════════════════════════════════════════════════════════════════════════════
  
  const megaNav = document.getElementById('megaNav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (megaNav) {
      if (currentScroll > 50) {
        megaNav.classList.add('scrolled');
      } else {
        megaNav.classList.remove('scrolled');
      }
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
  
  // ═════════════════════════════════════════════════════════════════════════════
  // SEARCH MODAL
  // ═════════════════════════════════════════════════════════════════════════════
  
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  
  if (searchBtn && searchModal) {
    // Open search modal
    searchBtn.addEventListener('click', function() {
      searchModal.classList.add('active');
      if (searchInput) searchInput.focus();
      document.body.style.overflow = 'hidden';
    });
    
    // Close search modal
    if (searchClose) {
      searchClose.addEventListener('click', function() {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Close on backdrop click
    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Keyboard shortcut: Cmd/Ctrl + K
  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal) {
        searchModal.classList.add('active');
        if (searchInput) searchInput.focus();
        document.body.style.overflow = 'hidden';
      }
    }
  });
  
  // ═════════════════════════════════════════════════════════════════════════════
  // GSAP ANIMATIONS
  // ═════════════════════════════════════════════════════════════════════════════
  
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate cards on scroll
    gsap.utils.toArray('.quick-card, .flagship-card, .analytics-card, .tool-card, .knowledge-card').forEach((card, i) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: i * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
    
    // Hero animations
    gsap.fromTo('.hero-badge', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
    );
    
    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' }
    );
    
    gsap.fromTo('.hero-desc', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power2.out' }
    );
    
    gsap.fromTo('.hero-stats .stat-item', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.8, ease: 'power2.out' }
    );
  }
  
  // ═════════════════════════════════════════════════════════════════════════════
  // SMOOTH SCROLL
  // ═════════════════════════════════════════════════════════════════════════════
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = document.querySelector('.mega-nav')?.offsetHeight || 70;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // ═════════════════════════════════════════════════════════════════════════════
  // ACTIVE LINK HIGHLIGHTING
  // ═════════════════════════════════════════════════════════════════════════════
  
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sub-link');
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
  
  // ═════════════════════════════════════════════════════════════════════════════
  // SEARCH FUNCTIONALITY
  // ═════════════════════════════════════════════════════════════════════════════
  
  const searchData = [
    { name: 'BTC Probability', url: 'portal/intelligence/btc-probability.html', icon: '📊' },
    { name: 'Oracle Research', url: 'portal/intelligence/oracle-research.html', icon: '🔮' },
    { name: 'Bitcoin Hub', url: 'bitcoin-intelligence-hub.html', icon: '₿' },
    { name: 'BTC Milestone History', url: 'bitcoin-intelligence-hub.html#cycle', icon: '🧱' },
    { name: 'Institutional Research', url: 'institutional-research-center.html', icon: '🏛️' },
    { name: 'Macro Factors', url: 'macro-factors.html', icon: '🌍' },
    { name: 'FOMC Intelligence', url: 'macro-factors.html#fomc-intelligence', icon: '🏦' },
    { name: 'Crypto Intel Radar', url: 'crypto-intelligence-radar.html', icon: '🛰️' },
    { name: 'On-Chain Analytics', url: 'onchain-analytics.html', icon: '⛓️' },
    { name: 'Derivatives Analytics', url: 'derivatives-analytics.html', icon: '📊' },
    { name: 'Sector Screener', url: 'portal/tools/screener.html', icon: '🎯' },
    { name: 'AI CekCoin', url: 'portal/tools/ai-analyze.html', icon: '🤖' },
    { name: 'Whale Tracker', url: 'portal/tools/whale-tracker.html', icon: '🐋' },
    { name: 'Trading Journal', url: 'portal/tools/journal.html', icon: '📓' },
    { name: 'Position Calculator', url: 'portal/tools/position-calculator.html', icon: '🧮' },
    { name: 'Knowledge Base', url: 'legacy.html#knowledge', icon: '📚' },
    { name: 'Platform Intel', url: 'legacy.html#platform-intel', icon: '🌐' },
    { name: 'Manipulation Intel', url: 'market-manipulation-intelligence.html', icon: '🛡️' }
  ];
  
  const searchResults = document.getElementById('searchResults');
  
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      
      if (query.length === 0) {
        searchResults.innerHTML = '';
        return;
      }
      
      const filtered = searchData.filter(item => 
        item.name.toLowerCase().includes(query)
      );
      
      if (filtered.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        return;
      }
      
      searchResults.innerHTML = filtered.map(item => `
        <a href="${item.url}" class="search-result-item">
          <span class="search-result-icon">${item.icon}</span>
          <span class="search-result-text">${item.name}</span>
        </a>
      `).join('');
    });
  }
  
  // ═════════════════════════════════════════════════════════════════════════════
  // TOOLTIPS
  // ═════════════════════════════════════════════════════════════════════════════
  
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  
  tooltipTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.dataset.tooltip;
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
      
      this._tooltip = tooltip;
    });
    
    trigger.addEventListener('mouseleave', function() {
      if (this._tooltip) {
        this._tooltip.remove();
        delete this._tooltip;
      }
    });
  });
  
  // ═════════════════════════════════════════════════════════════════════════════
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ═════════════════════════════════════════════════════════════════════════════
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Format numbers
function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
}

// Format currency
function formatCurrency(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

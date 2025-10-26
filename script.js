/**
 * NJOY TRAVEL LANDING PAGE - INTERACTIVE FEATURES
 * ================================================
 * 
 * JavaScript para funcionalidades interativas da landing page
 * - Navegação mobile
 * - Animações suaves
 * - Acessibilidade
 * - Performance otimizada
 */

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Debounce function para otimizar performance
 */
function debounce(func, wait) {
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

/**
 * Throttle function para scroll events
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Verifica se elemento está visível no viewport
 */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Anima elementos quando entram no viewport
 */
function animateOnScroll() {
  const elements = document.querySelectorAll('.card, .consultor-card, .stat');
  
  elements.forEach(element => {
    if (isElementInViewport(element)) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

// ===========================================
// NAVIGATION FUNCTIONALITY
// ===========================================

class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }
  
  init() {
    this.setupMobileToggle();
    this.setupSmoothScrolling();
    this.setupNavbarScroll();
    this.setupActiveLinks();
  }
  
  setupMobileToggle() {
    if (!this.navToggle || !this.navMenu) return;
    
    this.navToggle.addEventListener('click', () => {
      const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
      
      this.navToggle.setAttribute('aria-expanded', !isExpanded);
      this.navMenu.classList.toggle('nav-menu-open');
      
      // Animate hamburger icon
      const icon = this.navToggle.querySelector('.icon');
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && this.navMenu.classList.contains('nav-menu-open')) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navMenu.classList.contains('nav-menu-open')) {
        this.closeMobileMenu();
      }
    });
  }
  
  closeMobileMenu() {
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.navMenu.classList.remove('nav-menu-open');
    
    const icon = this.navToggle.querySelector('.icon');
    if (icon) {
      icon.style.transform = 'rotate(0deg)';
    }
  }
  
  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
            
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
            
            // Close mobile menu after navigation
            this.closeMobileMenu();
          }
        }
      });
    });
  }
  
  setupNavbarScroll() {
    let lastScrollY = window.scrollY;
    
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        this.nav.classList.add('nav-scrolled');
      } else {
        this.nav.classList.remove('nav-scrolled');
      }
      
      // Hide/show navbar on scroll (optional)
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        this.nav.style.transform = 'translateY(-100%)';
      } else {
        this.nav.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
  }
  
  setupActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveLink = throttle(() => {
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          // Remove active class from all links
          this.navLinks.forEach(link => link.classList.remove('nav-link-active'));
          
          // Add active class to current link
          if (navLink) {
            navLink.classList.add('nav-link-active');
          }
        }
      });
    }, 100);
    
    window.addEventListener('scroll', updateActiveLink);
  }
}

// ===========================================
// BUTTON INTERACTIONS
// ===========================================

class ButtonInteractions {
  constructor() {
    this.buttons = document.querySelectorAll('.btn');
    this.init();
  }
  
  init() {
    this.setupRippleEffect();
    this.setupLoadingStates();
    this.setupWhatsAppIntegration();
  }
  
  setupRippleEffect() {
    this.buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
    
    // Add ripple animation CSS
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  setupLoadingStates() {
    const ctaButtons = document.querySelectorAll('.btn-accent, .btn-primary');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Simulate loading state
        if (button.textContent.includes('Consultor') || button.textContent.includes('WhatsApp')) {
          e.preventDefault();
          
          button.setAttribute('aria-busy', 'true');
          button.disabled = true;
          
          // Simulate API call
          setTimeout(() => {
            button.removeAttribute('aria-busy');
            button.disabled = false;
            
            // Show success message
            this.showToast('Mensagem enviada com sucesso!', 'success');
          }, 2000);
        }
      });
    });
  }
  
  setupWhatsAppIntegration() {
    const whatsappButtons = document.querySelectorAll('[aria-label*="WhatsApp"], .whatsapp-float');
    const phoneNumber = '+351912345678'; // Replace with actual number
    const message = 'Olá! Gostaria de saber mais sobre os serviços da Njoy Travel.';
    
    whatsappButtons.forEach(button => {
      button.addEventListener('click', () => {
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      });
    });
  }
  
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-feedback-success);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// ===========================================
// CARD ANIMATIONS
// ===========================================

class CardAnimations {
  constructor() {
    this.cards = document.querySelectorAll('.card-interactive');
    this.init();
  }
  
  init() {
    this.setupHoverEffects();
    this.setupStaggerAnimation();
  }
  
  setupHoverEffects() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
  
  setupStaggerAnimation() {
    // Initial state
    this.cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      
      // Staggered animation
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
}

// ===========================================
// SCROLL ANIMATIONS
// ===========================================

class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.card, .consultor-card, .stat, .section-title');
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.setupParallaxEffect();
  }
  
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    this.animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.6s ease';
      
      observer.observe(element);
    });
    
    // Add animation styles
    if (!document.querySelector('#scroll-animations')) {
      const style = document.createElement('style');
      style.id = 'scroll-animations';
      style.textContent = `
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  setupParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const handleScroll = throttle(() => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      
      hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }, 16);
    
    window.addEventListener('scroll', handleScroll);
  }
}

// ===========================================
// PERFORMANCE OPTIMIZATIONS
// ===========================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupPreloading();
  }
  
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }
  
  setupImageOptimization() {
    // Add loading="lazy" to all images except hero
    const images = document.querySelectorAll('img:not(.hero-bg-image)');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
    
    // Setup image loading animations for cards
    this.setupCardImageLoading();
  }
  
  setupCardImageLoading() {
    const cardImages = document.querySelectorAll('.card-img');
    
    cardImages.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
      
      // If image is already loaded (cached)
      if (img.complete) {
        img.classList.add('loaded');
      }
    });
  }
  
  setupPreloading() {
    // Preload critical resources
    const criticalResources = [
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'style';
      document.head.appendChild(link);
    });
  }
}

// ===========================================
// ACCESSIBILITY ENHANCEMENTS
// ===========================================

class AccessibilityEnhancer {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
    this.setupHighContrastMode();
  }
  
  setupKeyboardNavigation() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Saltar para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--color-brand-primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const mainContent = document.querySelector('.hero') || document.querySelector('main');
    if (mainContent) {
      mainContent.id = 'main-content';
    }
  }
  
  setupFocusManagement() {
    // Trap focus in mobile menu
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
      const focusableElements = navMenu.querySelectorAll('a, button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });
    }
  }
  
  setupScreenReaderSupport() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        button.setAttribute('aria-label', 'Botão de ação');
      }
    });
    
    // Add live region for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }
  
  setupHighContrastMode() {
    // Detect high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast');
    }
    
    // Listen for changes
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    });
  }
}

// ===========================================
// ANALYTICS & TRACKING
// ===========================================

class Analytics {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupEventTracking();
    this.setupScrollTracking();
    this.setupPerformanceTracking();
  }
  
  setupEventTracking() {
    // Track button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.trackEvent('button_click', {
          button_text: button.textContent.trim(),
          button_class: button.className,
          section: this.getSectionName(button)
        });
      });
    });
    
    // Track card interactions
    const cards = document.querySelectorAll('.card-interactive');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        this.trackEvent('card_click', {
          card_title: card.querySelector('.card-title')?.textContent || 'Unknown',
          section: this.getSectionName(card)
        });
      });
    });
  }
  
  setupScrollTracking() {
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.trackEvent('section_view', {
            section_id: entry.target.id,
            section_name: entry.target.querySelector('h1, h2')?.textContent || entry.target.id
          });
        }
      });
    }, { threshold: 0.5 });
    
    sections.forEach(section => sectionObserver.observe(section));
  }
  
  setupPerformanceTracking() {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.trackEvent('page_load', {
        load_time: Math.round(loadTime),
        connection_type: navigator.connection?.effectiveType || 'unknown'
      });
    });
  }
  
  trackEvent(eventName, properties = {}) {
    // In a real implementation, you would send this to your analytics service
    console.log('Analytics Event:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
  }
  
  getSectionName(element) {
    const section = element.closest('section');
    return section ? section.id : 'unknown';
  }
}

// ===========================================
// MODAL FUNCTIONALITY
// ===========================================

class ModalManager {
  constructor() {
    this.modals = document.querySelectorAll('.modal');
    this.init();
  }
  
  init() {
    this.setupModalTriggers();
    this.setupModalClose();
    this.setupEscapeKey();
    this.setupOverlayClick();
  }
  
  setupModalTriggers() {
    // Quote modal triggers
    const quoteTriggers = document.querySelectorAll('#open-quote-modal, #open-quote-modal-cta');
    quoteTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => this.openModal('quote-modal'));
    });
    
    // Consultant modal triggers
    const consultantTriggers = document.querySelectorAll('#open-consultant-modal, #open-consultant-modal-cta');
    consultantTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => this.openModal('consultant-modal'));
    });
  }
  
  setupModalClose() {
    this.modals.forEach(modal => {
      const closeBtn = modal.querySelector('.modal-close');
      const cancelBtn = modal.querySelector('[id$="-cancel"]');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal(modal.id));
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => this.closeModal(modal.id));
      }
    });
  }
  
  setupEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[aria-hidden="false"]');
        if (openModal) {
          this.closeModal(openModal.id);
        }
      }
    });
  }
  
  setupOverlayClick() {
    this.modals.forEach(modal => {
      const overlay = modal.querySelector('.modal-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => this.closeModal(modal.id));
      }
    });
  }
  
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus first input
      const firstInput = modal.querySelector('input, select, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
      
      // Announce to screen readers
      this.announceModal(modal);
    }
  }
  
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      // Clear form if it's a form modal
      if (modalId.includes('modal')) {
        const form = modal.querySelector('form');
        if (form) {
          form.reset();
          this.clearFormErrors(form);
        }
      }
    }
  }
  
  announceModal(modal) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      const title = modal.querySelector('.modal-title');
      liveRegion.textContent = title ? title.textContent : 'Modal aberto';
    }
  }
  
  clearFormErrors(form) {
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.textContent = '');
    
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.classList.remove('form-input-error');
    });
  }
}

// ===========================================
// FORM VALIDATION
// ===========================================

class FormValidator {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupFormValidation();
  }
  
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Real-time validation
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const isValid = this.validateForm(form);
    
    if (isValid) {
      this.submitForm(form);
    } else {
      this.focusFirstError(form);
    }
  }
  
  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    // Special validation for checkboxes/radios
    const checkboxGroups = form.querySelectorAll('input[type="checkbox"][name="specialties"], input[type="checkbox"][name="languages"]');
    const radioGroups = form.querySelectorAll('input[type="radio"][name="availability"]');
    
    if (checkboxGroups.length > 0) {
      const checkedBoxes = Array.from(checkboxGroups).some(cb => cb.checked);
      if (!checkedBoxes) {
        this.showFieldError(checkboxGroups[0], 'Seleciona pelo menos uma opção');
        isValid = false;
      }
    }
    
    if (radioGroups.length > 0) {
      const checkedRadio = Array.from(radioGroups).some(radio => radio.checked);
      if (!checkedRadio) {
        this.showFieldError(radioGroups[0], 'Seleciona uma opção');
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      errorMessage = 'Este campo é obrigatório';
      isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Email inválido';
        isValid = false;
      }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
      if (!phoneRegex.test(value)) {
        errorMessage = 'Número de telefone inválido';
        isValid = false;
      }
    }
    
    // Age validation
    if (fieldName === 'age' && value) {
      const age = parseInt(value);
      if (age < 18 || age > 65) {
        errorMessage = 'Idade deve ser entre 18 e 65 anos';
        isValid = false;
      }
    }
    
    // Date validation
    if (field.type === 'date' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate < today) {
        errorMessage = 'Data deve ser no futuro';
        isValid = false;
      }
    }
    
    if (isValid) {
      this.clearFieldError(field);
    } else {
      this.showFieldError(field, errorMessage);
    }
    
    return isValid;
  }
  
  showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
    field.classList.add('form-input-error');
  }
  
  clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
    field.classList.remove('form-input-error');
  }
  
  focusFirstError(form) {
    const firstError = form.querySelector('.form-input-error');
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="icon animate-spin"></i> Enviando...';
    
    // Simulate API call
    setTimeout(() => {
      // Reset button
      submitBtn.removeAttribute('aria-busy');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      // Show success message
      this.showSuccessMessage(form);
      
      // Close modal
      const modal = form.closest('.modal');
      if (modal) {
        setTimeout(() => {
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }, 2000);
      }
    }, 2000);
  }
  
  showSuccessMessage(form) {
    const formType = form.id.includes('quote') ? 'orçamento' : 'candidatura';
    const message = `Obrigado! A tua ${formType} foi enviada com sucesso. Entraremos em contacto em breve.`;
    
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i data-lucide="check-circle" class="icon"></i>
        <span>${message}</span>
      </div>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-feedback-success);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      z-index: 10001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// ===========================================
// GLOBAL FUNCTIONS
// ===========================================

// Global function to open quote modal with destination pre-filled
window.openQuoteModal = function(destination) {
  const modal = document.getElementById('quote-modal');
  if (modal) {
    const destinationInput = modal.querySelector('#quote-destination');
    if (destinationInput && destination) {
      destinationInput.value = destination;
    }
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
};

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  new Navigation();
  new ButtonInteractions();
  new CardAnimations();
  new ScrollAnimations();
  new PerformanceOptimizer();
  new AccessibilityEnhancer();
  new Analytics();
  new ModalManager();
  new FormValidator();
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
    
    // WhatsApp icon is now inline SVG, no additional setup needed
  }
  
  // Add loaded class to body for CSS animations
  document.body.classList.add('loaded');
  
  console.log('🚀 Njoy Travel Landing Page initialized successfully!');
});

// ===========================================
// ERROR HANDLING
// ===========================================

window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
  // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
  // In production, you might want to send this to an error tracking service
});

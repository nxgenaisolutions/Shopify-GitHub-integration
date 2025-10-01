/**
 * NxGenAI Solutions - Custom JavaScript
 * Shopify Theme
 */

(function() {
  'use strict';

  /**
   * Mobile Menu Toggle
   */
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.getElementById('nav-menu');
    
    if (toggle && menu) {
      toggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        const isExpanded = menu.classList.contains('active');
        toggle.setAttribute('aria-expanded', isExpanded);
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /**
   * Smooth Scroll for Anchor Links
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignore empty anchors
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          // Close mobile menu if open
          const menu = document.getElementById('nav-menu');
          if (menu) {
            menu.classList.remove('active');
          }
          
          // Smooth scroll
          const offsetTop = target.offsetTop - 80; // Account for sticky header
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Form Enhancement
   */
  function initFormEnhancements() {
    const forms = document.querySelectorAll('form[action*="contact"]');
    
    forms.forEach(form => {
      const submitButton = form.querySelector('button[type="submit"]');
      
      if (submitButton) {
        // Store original button text
        submitButton.setAttribute('data-original-text', submitButton.textContent);
        
        form.addEventListener('submit', function(e) {
          // Disable button and show loading state
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
          
          // Re-enable after submission (form will redirect or show success)
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = submitButton.getAttribute('data-original-text') || 'Submit';
          }, 3000);
        });
      }
    });
  }

  /**
   * Sticky Header on Scroll
   */
  function initStickyHeader() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }

  /**
   * Add to Cart Alternative (for consultation services)
   * Redirects to contact form with product context
   */
  function initConsultationRequest() {
    const consultButtons = document.querySelectorAll('[data-consult-product]');
    
    consultButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productTitle = this.getAttribute('data-consult-product');
        const contactUrl = this.getAttribute('href') || '/pages/contact';
        
        // Store product context in sessionStorage
        if (productTitle) {
          sessionStorage.setItem('consultation_service', productTitle);
        }
        
        // Navigate to contact/consultation page
        window.location.href = contactUrl;
      });
    });
  }

  /**
   * Pre-fill Consultation Form
   */
  function preFillConsultationForm() {
    const serviceInput = document.querySelector('input[name="contact[service]"]');
    const storedService = sessionStorage.getItem('consultation_service');
    
    if (serviceInput && storedService) {
      serviceInput.value = storedService;
      sessionStorage.removeItem('consultation_service');
    }
  }

  /**
   * Fade In Animation on Scroll
   */
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.service-card, .feature-card, .process-step');
    cards.forEach(card => observer.observe(card));
  }

  /**
   * Initialize all functions on DOM ready
   */
  function init() {
    initMobileMenu();
    initSmoothScroll();
    initFormEnhancements();
    initStickyHeader();
    initConsultationRequest();
    preFillConsultationForm();
    
    // Only init scroll animations if browser supports IntersectionObserver
    if ('IntersectionObserver' in window) {
      initScrollAnimations();
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Shopify-specific: Re-initialize on section reload (theme editor)
  if (window.Shopify && Shopify.designMode) {
    document.addEventListener('shopify:section:load', init);
  }

})();
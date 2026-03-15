/* ============================================
   DJ SINATRA — script.js
   Smooth scroll + fade-in reveal animations
   Zero dependencies
   ============================================ */

(function () {
  'use strict';

  // --- Reveal on Scroll (Intersection Observer) ---
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Stagger siblings for a cascading effect
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Small stagger based on sibling index
            var parent = entry.target.parentElement;
            var siblings = parent ? parent.querySelectorAll('.reveal') : [];
            var index = Array.prototype.indexOf.call(siblings, entry.target);
            var delay = Math.max(0, index) * 80;

            setTimeout(function () {
              entry.target.classList.add('visible');
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  // --- Hero Parallax (subtle) ---
  function initHeroParallax() {
    var heroContent = document.querySelector('.hero__content');
    if (!heroContent) return;

    var ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            var scrolled = window.pageYOffset;
            var heroHeight = window.innerHeight;

            if (scrolled < heroHeight) {
              var opacity = 1 - scrolled / (heroHeight * 0.7);
              var translate = scrolled * 0.25;
              heroContent.style.opacity = Math.max(0, opacity);
              heroContent.style.transform =
                'translateY(' + translate + 'px)';
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // --- Init ---
  function init() {
    initReveal();
    initSmoothScroll();
    initHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

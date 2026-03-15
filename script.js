/* ============================================
   DJ SINATRA — Premium Interactions
   Preloader, cursor glow, hero animation,
   scroll reveals, parallax
   Zero dependencies
   ============================================ */

(function () {
  'use strict';

  // --- Preloader ---
  function initPreloader() {
    document.body.classList.add('loading');
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    var minDuration = 1800;
    var start = Date.now();

    function hide() {
      var elapsed = Date.now() - start;
      var remaining = Math.max(0, minDuration - elapsed);

      setTimeout(function () {
        preloader.classList.add('done');
        document.body.classList.remove('loading');

        // Trigger hero animations after preloader
        setTimeout(initHeroAnimation, 200);
      }, remaining);
    }

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide);
    }
  }

  // --- Hero Title + Fade-up Animation ---
  function initHeroAnimation() {
    var title = document.querySelector('.hero__title');
    if (title) {
      title.classList.add('animated');
    }

    // Stagger the fade-up elements
    var fadeElements = document.querySelectorAll('.hero__fade-up');
    fadeElements.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('animated');
      }, 300 + (i * 200));
    });
  }

  // --- Cursor Glow (desktop) ---
  function initCursorGlow() {
    if (window.innerWidth < 769) return;

    var glow = document.getElementById('cursorGlow');
    if (!glow) return;

    var mouseX = 0;
    var mouseY = 0;
    var glowX = 0;
    var glowY = 0;
    var speed = 0.08;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!glow.classList.contains('active')) {
        glow.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', function () {
      glow.classList.remove('active');
    });

    function animate() {
      glowX += (mouseX - glowX) * speed;
      glowY += (mouseY - glowY) * speed;
      glow.style.transform = 'translate(' + (glowX - 200) + 'px, ' + (glowY - 200) + 'px)';
      requestAnimationFrame(animate);
    }

    animate();
  }

  // --- Reveal on Scroll (Intersection Observer) ---
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var parent = entry.target.parentElement;
            var siblings = parent ? parent.querySelectorAll('.reveal') : [];
            var index = Array.prototype.indexOf.call(siblings, entry.target);
            var delay = Math.max(0, index) * 100;

            setTimeout(function () {
              entry.target.classList.add('visible');
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
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
    var heroScroll = document.querySelector('.hero__scroll-hint');
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
              var progress = scrolled / heroHeight;
              var opacity = 1 - (progress * 1.5);
              var translate = scrolled * 0.3;
              var scale = 1 - (progress * 0.05);

              heroContent.style.opacity = Math.max(0, opacity);
              heroContent.style.transform =
                'translateY(' + translate + 'px) scale(' + Math.max(0.95, scale) + ')';

              if (heroScroll) {
                heroScroll.style.opacity = Math.max(0, 1 - (progress * 3));
              }
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // --- Highlight Items Hover Interaction ---
  function initHighlightHover() {
    var items = document.querySelectorAll('.highlights__item');
    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        items.forEach(function (other) {
          if (other !== item) {
            other.style.opacity = '0.4';
          }
        });
      });
      item.addEventListener('mouseleave', function () {
        items.forEach(function (other) {
          other.style.opacity = '1';
        });
      });
    });
  }

  // --- Press Items Hover Interaction ---
  function initPressHover() {
    var items = document.querySelectorAll('.press__item');
    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        items.forEach(function (other) {
          if (other !== item) {
            other.style.opacity = '0.3';
          }
        });
        item.style.color = 'rgba(245, 245, 245, 0.7)';
      });
      item.addEventListener('mouseleave', function () {
        items.forEach(function (other) {
          other.style.opacity = '1';
          other.style.color = '';
        });
      });
    });
  }

  // --- Init ---
  function init() {
    initPreloader();
    initCursorGlow();
    initReveal();
    initSmoothScroll();
    initHeroParallax();
    initHighlightHover();
    initPressHover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

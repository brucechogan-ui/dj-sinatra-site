/* ============================================
   DJ SINATRA — Vibe-Inspired Interactions
   Preloader, sticky nav, counters, reveals
   Zero dependencies
   ============================================ */

(function () {
  'use strict';

  // --- Preloader ---
  function initPreloader() {
    document.body.classList.add('loading');
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    var start = Date.now();
    function hide() {
      var remaining = Math.max(0, 1600 - (Date.now() - start));
      setTimeout(function () {
        preloader.classList.add('done');
        document.body.classList.remove('loading');
        setTimeout(function () {
          initHeroAnimation();
        }, 200);
      }, remaining);
    }
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
  }

  // --- Hero Animation ---
  function initHeroAnimation() {
    var title = document.querySelector('.hero__title');
    if (title) {
      title.style.opacity = '0';
      title.style.transform = 'translateY(40px)';
      setTimeout(function () {
        title.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }, 50);
    }

    var els = document.querySelectorAll('.hero__eyebrow, .hero__sub, .hero__actions');
    els.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(function () {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 400 + i * 150);
    });
  }

  // --- Sticky Nav ---
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.pageYOffset > 60);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Mobile menu
    var burger = document.getElementById('navBurger');
    var mobile = document.getElementById('navMobile');
    if (burger && mobile) {
      burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        mobile.classList.toggle('open');
        document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
      });
      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.classList.remove('open');
          mobile.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // --- Counter Animation ---
  function initCounters() {
    var numbers = document.querySelectorAll('.stats__number[data-target]');
    if (!numbers.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var duration = 1500;
          var start = Date.now();

          function tick() {
            var elapsed = Date.now() - start;
            var progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target;
              el.classList.add('counted');
            }
          }
          tick();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    numbers.forEach(function (n) { observer.observe(n); });
  }

  // --- Reveal on Scroll ---
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var parent = entry.target.parentElement;
          var siblings = parent ? parent.querySelectorAll('.reveal') : [];
          var index = Array.prototype.indexOf.call(siblings, entry.target);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, Math.max(0, index) * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // --- Smooth Scroll ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          var offset = 80;
          var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  // --- Sound Item Hover ---
  function initSoundHover() {
    var items = document.querySelectorAll('.sound__item');
    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        items.forEach(function (other) {
          if (other !== item) other.style.opacity = '0.4';
        });
      });
      item.addEventListener('mouseleave', function () {
        items.forEach(function (other) { other.style.opacity = '1'; });
      });
    });
  }

  // --- Init ---
  function init() {
    initPreloader();
    initNav();
    initCounters();
    initReveal();
    initSmoothScroll();
    initSoundHover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

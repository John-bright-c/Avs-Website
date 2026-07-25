/* =========================================================================
   AV Solutions — Site Script
   Handles: nav toggle, scroll effects, counters, reveal animations,
   FAQ accordion, project filters, contact form, scroll-to-top.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      var open = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close menu on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Scroll-triggered reveal animations ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------- Animated stat counters ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1600;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
          var value = Math.floor(eased * target);
          el.textContent = value + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------------- Sticky nav shadow on scroll ---------------- */
  var navbar = document.querySelector('.navbar');
  var scrollTopBtn = document.querySelector('.scroll-top');
  window.addEventListener('scroll', function () {
    var y = window.scrollY || window.pageYOffset;
    if (navbar) {
      navbar.style.boxShadow = y > 12 ? '0 8px 24px rgba(6,15,31,0.25)' : 'none';
    }
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('show', y > 480);
    }
  }, { passive: true });

  /* ---------------- Scroll to top ---------------- */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (i) { i.classList.remove('open'); i.querySelector('.faq-question').setAttribute('aria-expanded', 'false'); });
      if (!wasOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------- Project filter (Projects page) ---------------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        projectCards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          var show = filter === 'all' || filter === category;
          card.hidden = !show;
        });
      });
    });
  }

  /* ---------------- Contact form (client-side demo handling) ---------------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var successMsg = document.getElementById('form-success');
      // Basic required-field check (native HTML5 validation runs first)
      if (contactForm.checkValidity()) {
        if (successMsg) {
          successMsg.classList.add('show');
          successMsg.setAttribute('role', 'status');
        }
        contactForm.reset();
        if (successMsg) {
          setTimeout(function () { successMsg.classList.remove('show'); }, 6000);
        }
      }
    });
  }

  /* ---------------- Current year in footer ---------------- */
  var yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

});

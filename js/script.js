/* ==========================================================================
   Marina Cleaning Services — homepage interactions
   Vanilla JS. Progressive enhancement: the page is fully readable without it.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- Header */
  var header = doc.getElementById('site-header');
  var actionBar = doc.getElementById('action-bar');

  var navLinkEls = Array.prototype.slice.call(doc.querySelectorAll('.nav__list a[href^="#"]'));

  function clearCurrent() {
    navLinkEls.forEach(function (link) { link.removeAttribute('aria-current'); });
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-stuck', y > 6);
    if (y < 240) clearCurrent();

    if (actionBar) {
      var threshold = window.innerWidth >= 900 ? 700 : 420;
      var visible = y > threshold;
      actionBar.classList.toggle('is-visible', visible);
      if (visible) actionBar.removeAttribute('inert');
      else actionBar.setAttribute('inert', '');
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------- Mobile menu */
  var toggle = doc.getElementById('menu-toggle');
  var menu = doc.getElementById('mobile-menu');
  var lastFocused = null;
  var hideTimer = null;

  function focusables() {
    if (!menu) return [];
    return Array.prototype.slice.call(
      menu.querySelectorAll('a[href], button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }

  function openMenu() {
    if (!menu || !toggle) return;
    if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = null; }
    lastFocused = doc.activeElement;
    menu.hidden = false;
    doc.body.classList.add('is-locked');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    window.requestAnimationFrame(function () {
      menu.classList.add('is-open');
      var first = focusables()[0];
      if (first) first.focus();
    });
    if (actionBar) actionBar.classList.remove('is-visible');
  }

  function closeMenu(returnFocus) {
    if (!menu || !toggle || menu.hidden) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    doc.body.classList.remove('is-locked');

    hideTimer = window.setTimeout(function () {
      menu.hidden = true;
      hideTimer = null;
      onScroll();
    }, reduceMotion ? 0 : 280);

    if (returnFocus !== false) {
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      else toggle.focus();
    }
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      if (menu.hidden) openMenu();
      else closeMenu();
    });

    menu.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (link) closeMenu(false);
    });

    doc.addEventListener('keydown', function (event) {
      if (menu.hidden) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === 'Tab') {
        var items = [toggle].concat(focusables());
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];

        if (event.shiftKey && doc.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && doc.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900 && !menu.hidden) closeMenu(false);
    });
  }

  /* ------------------------------------------------------------- Room tabs */
  var rooms = doc.querySelector('[data-rooms]');
  if (rooms) {
    var tabs = Array.prototype.slice.call(rooms.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(rooms.querySelectorAll('[role="tabpanel"]'));

    function activateTab(tab, setFocus) {
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.tabIndex = active ? 0 : -1;
      });

      panels.forEach(function (p) {
        var match = p.id === tab.getAttribute('aria-controls');
        p.hidden = !match;
        p.classList.toggle('is-active', match);
      });

      if (setFocus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { activateTab(tab, false); });

      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
        else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
        else if (event.key === 'Home') next = tabs[0];
        else if (event.key === 'End') next = tabs[tabs.length - 1];

        if (next) {
          event.preventDefault();
          activateTab(next, true);
        }
      });
    });
  }

  /* ------------------------------------------------- FAQ accordion fallback */
  var faqItems = Array.prototype.slice.call(doc.querySelectorAll('details.faq-item'));
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  /* -------------------------------------------------------- Scroll reveal  */
  var revealTargets = doc.querySelectorAll(
    '.section-head, .intro__media, .visit-card, .step, .why-card, .person, ' +
    '.quote-band__quote, .hours-card, .faq-item, .rooms, .towns'
  );

  if (!reduceMotion && 'IntersectionObserver' in window && revealTargets.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    revealTargets.forEach(function (el, i) {
      var rect = el.getBoundingClientRect();
      // Never hide anything already on screen at load.
      if (rect.top < window.innerHeight * 0.9) return;
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i, 6) * 40) + 'ms';
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------ Scrollspy  */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav__list a[href^="#"]'));
  var spySections = navLinks
    .map(function (link) { return doc.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (navLinks.length && spySections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var isCurrent = link.getAttribute('href') === '#' + entry.target.id;
          if (isCurrent) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    spySections.forEach(function (section) { spy.observe(section); });
  }
})();

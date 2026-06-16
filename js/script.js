// KYOMISTUDIO — interaction layer
// Keep it small and gentle: scroll reveals and a footer year.
// Donate buttons link straight out to the ECPay sponsor page.

(function () {
  'use strict';

  // Footer year -----------------------------------------------------------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll reveal ----------------------------------------------------------
  var revealTargets = document.querySelectorAll('.zone__head, .card, .donate, .support__panel, .profile, .app-entry, .article-item');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Active nav link -------------------------------------------------------
  var navLinks = document.querySelectorAll('.site-nav__link[data-page]');
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    if (link.getAttribute('data-page') === currentPage) link.classList.add('is-active');
  });

  // Mobile nav toggle -----------------------------------------------------
  var hamburger = document.querySelector('.site-nav__hamburger');
  var navMenu   = document.querySelector('.site-nav__links');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      var open = navMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-nav')) {
        navMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // App instruction tabs --------------------------------------------------
  document.querySelectorAll('.app-how__tabs').forEach(function (tabList) {
    var tabs   = tabList.querySelectorAll('.app-how__tab');
    var panels = tabList.closest('.app-how').querySelectorAll('.app-how__panel');
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(function (p) { p.classList.remove('is-active'); });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        if (panels[i]) panels[i].classList.add('is-active');
      });
    });
  });

  // Blog accordion --------------------------------------------------------
  document.querySelectorAll('.article-item__trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.article-item');
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
      var summary = btn.querySelector('.article-item__summary');
      if (summary) summary.style.opacity = open ? '0' : '1';
      var body = item.querySelector('.article-item__body');
      if (body) body.setAttribute('aria-hidden', String(!open));
    });
  });

})();

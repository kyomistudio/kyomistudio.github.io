// KYOMISTUDIO — interaction layer
// Keep it small and gentle: scroll reveals and a footer year.
// Donate buttons link straight out to the ECPay sponsor page.

(function () {
  'use strict';

  // Footer year -----------------------------------------------------------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll reveal ----------------------------------------------------------
  var revealTargets = document.querySelectorAll('.zone__head, .card, .donate, .support__panel');

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

})();

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
  var inBlogDir = window.location.pathname.includes('/blog/');
  navLinks.forEach(function (link) {
    var page = link.getAttribute('data-page');
    if (page === currentPage || (inBlogDir && page === 'blog.html')) {
      link.classList.add('is-active');
    }
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

  // App dropdown panels --------------------------------------------------
  document.querySelectorAll('.app-drop__trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var entry  = btn.closest('.app-entry');
      var target = document.getElementById(btn.dataset.target);
      var isOpen = target.classList.contains('is-active');
      entry.querySelectorAll('.app-drop__trigger').forEach(function (t) { t.classList.remove('is-active'); });
      entry.querySelectorAll('.app-drop__panel').forEach(function (p) { p.classList.remove('is-active'); });
      if (!isOpen) { btn.classList.add('is-active'); target.classList.add('is-active'); }
    });
  });

  // App screenshot lightbox ------------------------------------------------
  var screenFrames = document.querySelectorAll('.app-screen__frame');
  if (screenFrames.length) {
    var lightbox = document.createElement('div');
    lightbox.className = 'screen-lightbox';
    lightbox.innerHTML = '<button class="screen-lightbox__close" aria-label="關閉">&times;</button><div class="screen-lightbox__frame"></div>';
    document.body.appendChild(lightbox);

    var lbFrame = lightbox.querySelector('.screen-lightbox__frame');
    var lbClose = lightbox.querySelector('.screen-lightbox__close');

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
      lbFrame.innerHTML = '';
    }

    function openLightbox(frameEl) {
      var body = frameEl.querySelector('.app-screen__body');
      var originalWidth = frameEl.getBoundingClientRect().width;
      var baseFontSize = body ? (parseFloat(getComputedStyle(body).fontSize) || 10) : 10;
      var labelEl = frameEl.closest('.app-screen') && frameEl.closest('.app-screen').querySelector('.app-screen__label');

      lbFrame.innerHTML = '';
      var clone = frameEl.cloneNode(true);
      lbFrame.appendChild(clone);

      var cloneBody = clone.querySelector('.app-screen__body');
      if (body && cloneBody) {
        var newWidth = lbFrame.getBoundingClientRect().width;
        var scale = originalWidth ? (newWidth / originalWidth) : 1;
        cloneBody.style.fontSize = (baseFontSize * scale) + 'px';
      }

      if (labelEl) {
        var caption = document.createElement('div');
        caption.className = 'screen-lightbox__label';
        caption.textContent = labelEl.textContent;
        lbFrame.appendChild(caption);
      }

      lightbox.classList.add('is-open');
      document.body.classList.add('lightbox-open');
    }

    screenFrames.forEach(function (frame) {
      frame.addEventListener('click', function () { openLightbox(frame); });
    });

    lbFrame.addEventListener('click', closeLightbox);
    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

})();

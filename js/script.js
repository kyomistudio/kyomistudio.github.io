// KYOMISTUDIO — interaction layer
// Keep it small and gentle: scroll reveals, a footer year, and a friendly
// placeholder response for the donate button (payment integration comes later).

(function () {
  'use strict';

  // Footer year -----------------------------------------------------------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll reveal ----------------------------------------------------------
  var revealTargets = document.querySelectorAll('.zone__head, .card, .donate');

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

  // Toast -------------------------------------------------------------------
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  // Donate forms ------------------------------------------------------------
  // Payment processing isn't wired up yet — for now we validate the minimum
  // amount and let the visitor know their support has been noted with thanks.
  var MIN_AMOUNT = 30;

  document.querySelectorAll('.donate__form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var input = form.querySelector('input[name="amount"]');
      var raw = input ? input.value.trim() : '';
      var amount = raw === '' ? MIN_AMOUNT : Math.round(Number(raw));

      if (!raw) {
        if (input) input.value = MIN_AMOUNT;
        showToast('已為你帶入最低贊助金額 NT$' + MIN_AMOUNT + '　🌿');
        return;
      }

      if (isNaN(amount) || amount < MIN_AMOUNT) {
        showToast('小額贊助最低金額為 NT$' + MIN_AMOUNT + '　請重新輸入');
        if (input) {
          input.value = MIN_AMOUNT;
          input.focus();
        }
        return;
      }

      var zone = form.getAttribute('data-zone') || '';
      showToast('感謝你願意贊助 NT$' + amount + (zone ? '　支持「' + zone + '」' : '') + '　付款功能即將上線 🌿');
    });
  });

})();

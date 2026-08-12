// KYOMISTUDIO — interaction layer
// Keep it small and gentle: scroll reveals and a footer year.
// Donate buttons link straight out to the ECPay sponsor page.

(function () {
  'use strict';

  // Blog post index (shared by the article list + site search) -----------
  var BLOG_POSTS = [
    { date: '2026-07-20', author: 'MIMI', title: 'Claude 說「好」，但我看不懂它給我的東西', url: 'blog/first-code.html', excerpt: '第一次拿到 Claude 給的程式碼，整整三百行，一個字都看不懂。那晚反覆問「這要放哪裡」，不是真的想搞懂，只想讓螢幕出現點什麼。凌晨一點，終於有了一個空白框框——什麼功能都沒有，但夠讓我截圖了。' },
    { date: '2026-07-06', author: 'MIMI', title: '第一次對話：我問了一個很蠢的問題', url: 'blog/first-question.html', excerpt: '第一次打開 Claude，我盯著對話框發呆了好久，生怕問出蠢問題。後來還是鼓起勇氣打了一句很籠統的話，沒想到 Claude 認真回答了，那一刻，我對技術的恐懼開始鬆動。' },
    { date: '2026-06-17', author: 'MIMI', title: '在遇見 Claude 之前，我以為寫程式是另一個世界的事', url: 'blog/claude-before.html', excerpt: '我是 Mimi，一個對程式碼完全沒概念的人。這篇想說說我為什麼會想做 APP，以及那段時間心裡那種「這不是我能碰的東西」的距離感。' },
    { date: '2026-05-21', author: 'MIMI', title: 'SPARK WEAR：從失控購物狂到衣櫃的主理人', url: 'blog/spark-wear.html', excerpt: '曾經，我是個擁有 547 件衣服、不折不扣的購物狂。帳單上的數字與滿坑滿谷的衣服，曾讓我陷入深深的焦慮與自我懷疑。直到我遇見「斷捨離」，一切才開始慢慢改變。' }
  ];

  function blogPathPrefix() {
    return window.location.pathname.indexOf('/blog/') !== -1 ? '../' : '';
  }

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
      document.body.classList.remove('modal-open');
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
      document.body.classList.add('modal-open');
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

  // Article list (paginated, newest first) ---------------------------------
  var articleListEl = document.getElementById('article-list');
  if (articleListEl) {
    var pagerEl  = document.getElementById('article-pagination');
    var PAGE_SIZE = 10;
    var sortedPosts = BLOG_POSTS.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    var totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
    var currentPage = 1;

    function renderArticlePage(page) {
      currentPage = Math.min(Math.max(1, page), totalPages);
      var prefix = blogPathPrefix();
      var start  = (currentPage - 1) * PAGE_SIZE;

      articleListEl.innerHTML = '';
      sortedPosts.slice(start, start + PAGE_SIZE).forEach(function (post) {
        var li = document.createElement('li');
        li.className = 'article-item is-visible';
        li.innerHTML =
          '<a class="article-item__link" href="' + prefix + post.url + '">' +
            '<div class="article-item__meta">' + post.date.replace(/-/g, '.') + ' · ' + post.author + '</div>' +
            '<h2 class="article-item__title">' + post.title + '</h2>' +
            '<p class="article-item__preview">' + post.excerpt + '</p>' +
          '</a>';
        articleListEl.appendChild(li);
      });
      renderPager();
    }

    function renderPager() {
      if (!pagerEl) return;
      pagerEl.innerHTML = '';
      if (totalPages <= 1) return;

      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'pagination__btn';
      prev.textContent = '‹ 上一頁';
      prev.disabled = currentPage === 1;
      prev.addEventListener('click', function () { goToPage(currentPage - 1); });
      pagerEl.appendChild(prev);

      for (var i = 1; i <= totalPages; i++) {
        var num = document.createElement('button');
        num.type = 'button';
        num.className = 'pagination__num' + (i === currentPage ? ' is-active' : '');
        num.textContent = String(i);
        num.addEventListener('click', function (i) {
          return function () { goToPage(i); };
        }(i));
        pagerEl.appendChild(num);
      }

      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'pagination__btn';
      next.textContent = '下一頁 ›';
      next.disabled = currentPage === totalPages;
      next.addEventListener('click', function () { goToPage(currentPage + 1); });
      pagerEl.appendChild(next);
    }

    function goToPage(page) {
      renderArticlePage(page);
      articleListEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    renderArticlePage(1);
  }

  // Site search --------------------------------------------------------------
  var searchBtn = document.querySelector('.site-nav__search-btn');
  if (searchBtn) {
    var searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML =
      '<div class="search-overlay__panel">' +
        '<div class="search-overlay__field">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><line x1="16.3" y1="16.3" x2="21" y2="21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
          '<input class="search-overlay__input" type="search" placeholder="搜尋開發隨筆⋯" aria-label="搜尋文章">' +
          '<button type="button" class="search-overlay__close" aria-label="關閉搜尋">&times;</button>' +
        '</div>' +
        '<div class="search-overlay__results"></div>' +
      '</div>';
    document.body.appendChild(searchOverlay);

    var searchInput   = searchOverlay.querySelector('.search-overlay__input');
    var searchResults = searchOverlay.querySelector('.search-overlay__results');
    var searchClose   = searchOverlay.querySelector('.search-overlay__close');

    function renderSearchResults(query) {
      var q = query.trim().toLowerCase();
      searchResults.innerHTML = '';
      if (!q) {
        searchResults.innerHTML = '<div class="search-overlay__empty">輸入關鍵字搜尋開發隨筆文章</div>';
        return;
      }
      var matches = BLOG_POSTS.filter(function (post) {
        return post.title.toLowerCase().indexOf(q) !== -1 || post.excerpt.toLowerCase().indexOf(q) !== -1;
      });
      if (!matches.length) {
        searchResults.innerHTML = '<div class="search-overlay__empty">找不到符合「' + query + '」的文章</div>';
        return;
      }
      var prefix = blogPathPrefix();
      matches.forEach(function (post) {
        var a = document.createElement('a');
        a.className = 'search-overlay__result';
        a.href = prefix + post.url;
        a.innerHTML =
          '<div class="search-overlay__result-meta">' + post.date.replace(/-/g, '.') + ' · ' + post.author + '</div>' +
          '<div class="search-overlay__result-title">' + post.title + '</div>' +
          '<p class="search-overlay__result-excerpt">' + post.excerpt + '</p>';
        searchResults.appendChild(a);
      });
    }

    function openSearch() {
      searchOverlay.classList.add('is-open');
      document.body.classList.add('modal-open');
      renderSearchResults('');
      setTimeout(function () { searchInput.focus(); }, 50);
    }
    function closeSearch() {
      searchOverlay.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      searchInput.value = '';
    }

    searchBtn.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
    searchInput.addEventListener('input', function () { renderSearchResults(searchInput.value); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) closeSearch();
    });
  }

})();

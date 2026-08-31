# 專欄文章（女人40愛自己）排程上架 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增獨立的「專欄文章」頁面（`column.html` + `column/` 9 篇文章），發布 Mimi 撰寫的「女人40愛自己」系列，每兩週自動上架一篇，全程免人工操作。

**Architecture:** 新增 `COLUMN_POSTS` 資料陣列與純前端日期過濾邏輯（比對瀏覽器當下日期 vs 每篇的 `date` 發布日期），未到期文章不會出現在列表、分頁或搜尋結果。頁面結構、CSS class、分頁元件完全比照既有 `blog.html` / `blog/[slug].html` 架構，不新增 CSS、不使用 GitHub Actions 或任何伺服器端機制。

**Tech Stack:** 純靜態 HTML/CSS/JS、GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-31-column-auto-publish-design.md`

## Global Constraints

- 日期閘門邏輯必須是純前端（比較 `new Date()` 與每篇 `date` 欄位），不依賴排程系統、不修改 git 歷史來「發布」
- 檔名編號（原稿 docx 檔名前的 `1.` ~ `9.`）僅用於決定順序，**不得**出現在標題、`<title>`、內文任何地方
- 文章原意不得增刪改寫，內文段落須忠於 `textutil` 轉出的原文
- 所有新頁面／被修改頁面的相對路徑、`data-page` 屬性、CSS class 一律比照現有 `blog.html` / `blog/*.html` 的既有寫法
- 本專案無測試框架，所有驗證方式為瀏覽器目視確認（見下方「無測試框架例外聲明」）

---

## 無測試框架例外聲明

本專案為純靜態 HTML/CSS/JS 網站，無任何自動化測試框架。所有驗證方式為：用瀏覽器開啟頁面，配合 DevTools Console 檢查錯誤，目視確認列表／連結／文章頁呈現正確，以及手機 375px 版面無橫向捲軸。日期過濾邏輯的驗證方式見 Task 3 Step 與最終驗收清單。

---

## 檔案對照

| 檔案 | 操作 | 說明 |
|------|------|------|
| `js/script.js` | 修改 | 新增 `COLUMN_POSTS` + 日期過濾、`sitePathPrefix`／nav 高亮／搜尋支援 `/column/` |
| `about.html` / `apps.html` / `index.html` / `blog.html` | 修改 | nav 新增「專欄文章」連結 |
| `blog/claude-before.html` / `blog/first-code.html` / `blog/first-question.html` / `blog/spark-wear.html` | 修改 | nav 新增「專欄文章」連結 |
| `column.html` | 新建 | 專欄列表頁 |
| `column/tsmc-vs-chanel.html` | 新建 | 第 1 篇 |
| `column/financial-independence.html` | 新建 | 第 2 篇 |
| `column/experience-over-things.html` | 新建 | 第 3 篇 |
| `column/online-shopping-detox.html` | 新建 | 第 4 篇 |
| `column/quit-instagram.html` | 新建 | 第 5 篇 |
| `column/relationship-declutter.html` | 新建 | 第 6 篇 |
| `column/living-with-illness.html` | 新建 | 第 7 篇 |
| `column/when-my-child-was-sick.html` | 新建 | 第 8 篇 |
| `column/homemaker-vs-freelancer.html` | 新建 | 第 9 篇 |

原稿來源：`/Users/mimi/Documents/女人40愛自己/*.docx`（已用 `textutil -convert txt <file> -stdout` 驗證可正確讀出純文字）。

---

## Task 1：js/script.js — 新增 COLUMN_POSTS 資料與日期過濾邏輯

**Files:**
- Modify: `js/script.js`

**Interfaces:**
- Produces: `COLUMN_POSTS`（陣列）、`getPublishedColumnPosts()`（回傳已過濾陣列的函式）— Task 3（column.html）與 Task 4–12（文章頁透過共用 script.js）都依賴這兩者

- [ ] **Step 1：在 `BLOG_POSTS` 陣列後新增 `COLUMN_POSTS` 與過濾函式**

找到 `js/script.js` 第 14 行（`BLOG_POSTS` 陣列結尾的 `];`）與第 16 行（`// App index...` 註解）之間，插入以下內容：

```js

  // Column post index (shared by the article list + site search) ---------
  // date 為預定發布日期；未到期（date > 今天）的文章不會出現在列表、分頁或搜尋結果
  var COLUMN_POSTS = [
    { date: '2026-09-03', author: 'MIMI', title: '女人40愛自己：為什麼我選擇台積電，而非香奈兒？', url: 'column/tsmc-vs-chanel.html', excerpt: '曾經，我是一個徹頭徹尾的購物狂，每個月的薪水總在物慾中流逝，除了寄放在媽媽那邊的固定存款，我的身邊幾乎沒有任何積蓄。那款經典的香奈兒手錶，我看著它、想著它，足足看了十幾年。' },
    { date: '2026-09-17', author: 'MIMI', title: '女人40愛自己：從「依賴」到「獨立」，我學會掌握財務自由', url: 'column/financial-independence.html', excerpt: '剛畢業那幾年，我是一個不折不扣的購物狂。當時完全沒有理財概念，只知道每個月乖乖把薪水的三分之一交給媽媽保管。雖然長年累月下來也積攢了一些積蓄，但我對「錢」其實是完全沒有掌控力的。' },
    { date: '2026-10-01', author: 'MIMI', title: '女人 40 愛自己——從囤積物質，轉向投資體驗的覺醒', url: 'column/experience-over-things.html', excerpt: '曾經的我，是個典型的「月光族」，在物質的消耗中找尋安全感。直到 40 歲那年，又一次因為衝動購物而嚴重超支，那種熟悉的自責感讓我徹底崩潰。' },
    { date: '2026-10-15', author: 'MIMI', title: '女人40愛自己：Level Up！從「網拍成癮」到「精緻斷捨離」', url: 'column/online-shopping-detox.html', excerpt: '曾經的自己，每天都要追網拍直播，跟著主播說說笑笑，順手打下關鍵字喊「+1」。那曾是我每週兩次的快樂，從久久買一次，演變成每週兩次，最後是一次下單五六件，每個月累積數十件衣服。' },
    { date: '2026-10-29', author: 'MIMI', title: '女人 40 愛自己：捨棄經營十年的 IG：比起被按讚，我更在乎生活的溫度', url: 'column/quit-instagram.html', excerpt: '因為熱愛寫文章與分享，我曾經營部落格長達23年。為了宣傳，也為了經營「自己」，我創立了 IG 與 FB 粉絲團。隨著時間推移，我發現我變了——我開始對數字產生了病態的依賴，極度看重流量、按讚數與留言數。' },
    { date: '2026-11-12', author: 'MIMI', title: '女人40愛自己：關係，也需要斷捨離', url: 'column/relationship-declutter.html', excerpt: '我們總聽說空間需要斷捨離，卻很少有人告訴我們，原來人際關係也需要清空與轉身。我的個性謹慎內向，對我而言，交朋友向來不是件容易的事。' },
    { date: '2026-11-26', author: 'MIMI', title: '女人40愛自己：從徬徨無措到與疾病共存', url: 'column/living-with-illness.html', excerpt: '得知生病的那一年，我 19 歲。走出診間時，我又害怕又惶恐，腦子裡全是問號：我怎麼會得到這個病？我會好嗎？' },
    { date: '2026-12-10', author: 'MIMI', title: '女人40愛自己：當我的小寶貝生病了', url: 'column/when-my-child-was-sick.html', excerpt: '我家兒子是個早產兒。一出生就住進保溫箱，在新生兒加護病房與新生兒病房裡待了整整 46 天，連滿月都是在醫院度過的。' },
    { date: '2026-12-24', author: 'MIMI', title: '女人40愛自己：家庭主婦 VS. 自由工作者', url: 'column/homemaker-vs-freelancer.html', excerpt: '婚後的大多數時間，我都是一名家庭主婦。特別是在孩子出生後，我便淡出了傳統意義上的「正式工作」。過去，我曾是一名時尚 KOL，每天在部落格、Instagram 和 Facebook 寫著開箱文、分享穿搭。' }
  ];

  function getPublishedColumnPosts() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return COLUMN_POSTS.filter(function (post) {
      return new Date(post.date) <= today;
    });
  }
```

- [ ] **Step 2：更新 `sitePathPrefix()` 支援 `/column/` 目錄**

找到（第 27–29 行）：

```js
  function sitePathPrefix() {
    return window.location.pathname.indexOf('/blog/') !== -1 ? '../' : '';
  }
```

替換為：

```js
  function sitePathPrefix() {
    var path = window.location.pathname;
    return (path.indexOf('/blog/') !== -1 || path.indexOf('/column/') !== -1) ? '../' : '';
  }
```

- [ ] **Step 3：更新 nav 高亮邏輯支援 `/column/` 目錄**

找到（原第 53–62 行附近，`// Active nav link` 區塊）：

```js
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
```

替換為：

```js
  // Active nav link -------------------------------------------------------
  var navLinks = document.querySelectorAll('.site-nav__link[data-page]');
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var inBlogDir = window.location.pathname.includes('/blog/');
  var inColumnDir = window.location.pathname.includes('/column/');
  navLinks.forEach(function (link) {
    var page = link.getAttribute('data-page');
    if (page === currentPage || (inBlogDir && page === 'blog.html') || (inColumnDir && page === 'column.html')) {
      link.classList.add('is-active');
    }
  });
```

- [ ] **Step 4：更新「Article list」區塊，依頁面選擇資料來源並支援空清單狀態**

找到（原第 151–168 行附近，`// Article list (paginated, newest first)` 區塊開頭到 `sortedPosts.slice` 那段）：

```js
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
      var prefix = sitePathPrefix();
      var start  = (currentPage - 1) * PAGE_SIZE;

      articleListEl.innerHTML = '';
      sortedPosts.slice(start, start + PAGE_SIZE).forEach(function (post) {
```

替換為：

```js
  // Article list (paginated, newest first) ---------------------------------
  var articleListEl = document.getElementById('article-list');
  if (articleListEl) {
    var pagerEl  = document.getElementById('article-pagination');
    var PAGE_SIZE = 10;
    var isColumnListPage = /\/column\.html$/.test(window.location.pathname);
    var listSourcePosts = isColumnListPage ? getPublishedColumnPosts() : BLOG_POSTS;
    var sortedPosts = listSourcePosts.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    var totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
    var currentPage = 1;

    function renderArticlePage(page) {
      currentPage = Math.min(Math.max(1, page), totalPages);
      var prefix = sitePathPrefix();
      var start  = (currentPage - 1) * PAGE_SIZE;

      articleListEl.innerHTML = '';
      if (!sortedPosts.length) {
        articleListEl.innerHTML = '<li class="article-item is-visible"><p class="article-item__preview" style="padding:2rem 0;">目前還沒有已發布的文章，敬請期待。</p></li>';
        renderPager();
        return;
      }
      sortedPosts.slice(start, start + PAGE_SIZE).forEach(function (post) {
```

保持該區塊其餘程式碼（`li.className`、`renderPager()` 呼叫、`});` 收尾等）不變。

- [ ] **Step 5：更新搜尋區塊，新增 `COLUMN_INDEX` 與專欄頁的搜尋文案**

找到（原第 223–265 行附近，`// Site search` 區塊開頭到 `SEARCH_INDEX` 判斷結束）：

```js
  // Site search --------------------------------------------------------------
  var searchBtn = document.querySelector('.site-nav__search-btn');
  if (searchBtn) {
    var currentPath = window.location.pathname;
    var isAppsPage  = /\/apps\.html$/.test(currentPath);
    var isBlogPage  = /\/blog\.html$/.test(currentPath) || currentPath.indexOf('/blog/') !== -1;

    var BLOG_INDEX = BLOG_POSTS.map(function (post) {
      return {
        kind: 'blog',
        title: post.title,
        excerpt: post.excerpt,
        meta: post.date.replace(/-/g, '.') + ' · ' + post.author,
        url: post.url
      };
    });
    var APP_INDEX = APPS.map(function (app) {
      return {
        kind: 'app',
        title: app.name,
        excerpt: app.tagline + ' ' + app.excerpt,
        meta: 'APP',
        url: 'apps.html#' + app.id
      };
    });

    var SEARCH_INDEX, searchPlaceholder, searchEmptyHint, searchNoResultsLabel;
    if (isAppsPage) {
      SEARCH_INDEX = APP_INDEX;
      searchPlaceholder = '搜尋 APP⋯';
      searchEmptyHint = '輸入關鍵字搜尋 APP';
      searchNoResultsLabel = 'APP';
    } else if (isBlogPage) {
      SEARCH_INDEX = BLOG_INDEX;
      searchPlaceholder = '搜尋開發隨筆⋯';
      searchEmptyHint = '輸入關鍵字搜尋開發隨筆文章';
      searchNoResultsLabel = '文章';
    } else {
      SEARCH_INDEX = BLOG_INDEX.concat(APP_INDEX);
      searchPlaceholder = '搜尋文章、APP⋯';
      searchEmptyHint = '輸入關鍵字搜尋開發隨筆文章或 APP';
      searchNoResultsLabel = '結果';
    }
```

替換為：

```js
  // Site search --------------------------------------------------------------
  var searchBtn = document.querySelector('.site-nav__search-btn');
  if (searchBtn) {
    var currentPath = window.location.pathname;
    var isAppsPage   = /\/apps\.html$/.test(currentPath);
    var isBlogPage   = /\/blog\.html$/.test(currentPath) || currentPath.indexOf('/blog/') !== -1;
    var isColumnPage = /\/column\.html$/.test(currentPath) || currentPath.indexOf('/column/') !== -1;

    var BLOG_INDEX = BLOG_POSTS.map(function (post) {
      return {
        kind: 'blog',
        title: post.title,
        excerpt: post.excerpt,
        meta: post.date.replace(/-/g, '.') + ' · ' + post.author,
        url: post.url
      };
    });
    var COLUMN_INDEX = getPublishedColumnPosts().map(function (post) {
      return {
        kind: 'column',
        title: post.title,
        excerpt: post.excerpt,
        meta: post.date.replace(/-/g, '.') + ' · ' + post.author,
        url: post.url
      };
    });
    var APP_INDEX = APPS.map(function (app) {
      return {
        kind: 'app',
        title: app.name,
        excerpt: app.tagline + ' ' + app.excerpt,
        meta: 'APP',
        url: 'apps.html#' + app.id
      };
    });

    var SEARCH_INDEX, searchPlaceholder, searchEmptyHint, searchNoResultsLabel;
    if (isAppsPage) {
      SEARCH_INDEX = APP_INDEX;
      searchPlaceholder = '搜尋 APP⋯';
      searchEmptyHint = '輸入關鍵字搜尋 APP';
      searchNoResultsLabel = 'APP';
    } else if (isColumnPage) {
      SEARCH_INDEX = COLUMN_INDEX;
      searchPlaceholder = '搜尋專欄文章⋯';
      searchEmptyHint = '輸入關鍵字搜尋專欄文章';
      searchNoResultsLabel = '文章';
    } else if (isBlogPage) {
      SEARCH_INDEX = BLOG_INDEX;
      searchPlaceholder = '搜尋開發隨筆⋯';
      searchEmptyHint = '輸入關鍵字搜尋開發隨筆文章';
      searchNoResultsLabel = '文章';
    } else {
      SEARCH_INDEX = BLOG_INDEX.concat(APP_INDEX).concat(COLUMN_INDEX);
      searchPlaceholder = '搜尋文章、APP⋯';
      searchEmptyHint = '輸入關鍵字搜尋開發隨筆文章或 APP';
      searchNoResultsLabel = '結果';
    }
```

- [ ] **Step 6：目視確認**

用瀏覽器開啟 `index.html`，開 DevTools Console，確認沒有 JS 錯誤（此時 `column.html` 與 `column/*.html` 尚未建立，只需確認既有頁面 `blog.html` 仍正常運作、搜尋功能仍可用）。

- [ ] **Step 7：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add js/script.js
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add COLUMN_POSTS data and date-gated publish logic to script.js"
```

---

## Task 2：既有頁面 nav 新增「專欄文章」連結

**Files:**
- Modify: `about.html`, `apps.html`, `index.html`, `blog.html`, `blog/claude-before.html`, `blog/first-code.html`, `blog/first-question.html`, `blog/spark-wear.html`

在每個檔案的 nav 選單中，「開發隨筆」連結的下一行，新增「專欄文章」連結。

- [ ] **Step 1：`about.html`**

找到：
```html
      <li><a class="site-nav__link" href="blog.html"   data-page="blog.html">開發隨筆</a></li>
```
改為：
```html
      <li><a class="site-nav__link" href="blog.html"   data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="column.html" data-page="column.html">專欄文章</a></li>
```

- [ ] **Step 2：`apps.html`**

同 Step 1（`apps.html` 的「開發隨筆」那一行內容與 about.html 相同），套用相同修改。

- [ ] **Step 3：`index.html`**

同 Step 1，套用相同修改。

- [ ] **Step 4：`blog.html`**

同 Step 1，套用相同修改。

- [ ] **Step 5：`blog/claude-before.html`**

找到：
```html
      <li><a class="site-nav__link" href="../blog.html"   data-page="blog.html">開發隨筆</a></li>
```
改為：
```html
      <li><a class="site-nav__link" href="../blog.html"   data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
```

- [ ] **Step 6：`blog/spark-wear.html`**

同 Step 5（`blog/spark-wear.html` 的該行內容與 `blog/claude-before.html` 相同），套用相同修改。

- [ ] **Step 7：`blog/first-code.html`**

找到：
```html
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
```
改為：
```html
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
```

- [ ] **Step 8：`blog/first-question.html`**

同 Step 7（`blog/first-question.html` 的該行內容與 `blog/first-code.html` 相同），套用相同修改。

- [ ] **Step 9：目視確認**

開啟 `index.html`，確認導覽列出現「專欄文章」文字連結（此時點擊會 404，因為 `column.html` 尚未建立，Task 3 會建立）。

- [ ] **Step 10：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add about.html apps.html index.html blog.html blog/claude-before.html blog/first-code.html blog/first-question.html blog/spark-wear.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column.html nav link to all existing pages"
```

---

## Task 3：建立 column.html 專欄列表頁

**Files:**
- Create: `column.html`

**Interfaces:**
- Consumes: `COLUMN_POSTS` / `getPublishedColumnPosts()`（Task 1）、`#article-list` + `#article-pagination` 渲染邏輯（Task 1 Step 4）
- Produces: `column.html`（Task 4–12 的「← 專欄文章」返回連結會指向此頁）

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人40愛自己 — KYOMI STUDIO 趣味工作室</title>
<meta name="description" content="Mimi 的專欄「女人40愛自己」——記錄 40 歲後，在金錢、物質、關係與自我之間，重新學會愛自己的心路歷程。">
<link rel="icon" type="image/png" href="images/favicon.png">
<link rel="apple-touch-icon" href="images/favicon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人40愛自己 — KYOMI STUDIO 趣味工作室">
<meta property="og:description" content="Mimi 的專欄「女人40愛自己」——記錄 40 歲後，在金錢、物質、關係與自我之間，重新學會愛自己的心路歷程。">
<meta property="og:url" content="https://kyomistudio.github.io/column.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人40愛自己 — KYOMI STUDIO 趣味工作室">
<meta name="twitter:description" content="Mimi 的專欄「女人40愛自己」——記錄 40 歲後，在金錢、物質、關係與自我之間，重新學會愛自己的心路歷程。">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="about.html"  data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="apps.html"   data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="blog.html"   data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>

  <div class="page-hero">
    <h1 class="page-hero__title">女人40愛自己</h1>
    <p class="page-hero__desc">Mimi 的個人專欄。記錄 40 歲後，在金錢、物質、關係與自我之間，重新學會愛自己的心路歷程。</p>
  </div>

  <div class="blog-section">
    <ul class="article-list" id="article-list" role="list"></ul>
    <nav class="pagination" id="article-pagination" aria-label="文章分頁"></nav>
  </div>

</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器開啟 `column.html`：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 因為今天（實作當下）早於第一篇發布日 2026-09-03，文章清單應顯示 Task 1 Step 4 新增的空清單文案「目前還沒有已發布的文章，敬請期待。」，而不是任何一篇文章
- DevTools Console 沒有錯誤
- 搜尋框 placeholder 顯示「搜尋專欄文章⋯」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column.html list page with date-gated article rendering"
```

---

## Task 4：建立 column/tsmc-vs-chanel.html（第 1 篇）

**Files:**
- Create: `column/tsmc-vs-chanel.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column/tsmc-vs-chanel.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人40愛自己：為什麼我選擇台積電，而非香奈兒？ — KYOMI STUDIO</title>
<meta name="description" content="曾經，我是一個徹頭徹尾的購物狂，每個月的薪水總在物慾中流逝，除了寄放在媽媽那邊的固定存款，我的身邊幾乎沒有任何積蓄。那款經典的香奈兒手錶，我看著它、想著它，足足看了十幾年。">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="apple-touch-icon" href="../images/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人40愛自己：為什麼我選擇台積電，而非香奈兒？ — KYOMI STUDIO">
<meta property="og:description" content="曾經，我是一個徹頭徹尾的購物狂，每個月的薪水總在物慾中流逝，除了寄放在媽媽那邊的固定存款，我的身邊幾乎沒有任何積蓄。那款經典的香奈兒手錶，我看著它、想著它，足足看了十幾年。">
<meta property="og:url" content="https://kyomistudio.github.io/column/tsmc-vs-chanel.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人40愛自己：為什麼我選擇台積電，而非香奈兒？ — KYOMI STUDIO">
<meta name="twitter:description" content="曾經，我是一個徹頭徹尾的購物狂，每個月的薪水總在物慾中流逝，除了寄放在媽媽那邊的固定存款，我的身邊幾乎沒有任何積蓄。那款經典的香奈兒手錶，我看著它、想著它，足足看了十幾年。">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="../index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>
  <div class="article-page">
    <div class="article-page__back">
      <a href="../column.html">← 專欄文章</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.09.03</p>
      <h1 class="article-page__title">女人40愛自己：為什麼我選擇台積電，而非香奈兒？</h1>
    </div>
    <div class="article-page__body">
      <p>曾經，我是一個徹頭徹尾的購物狂，每個月的薪水總在物慾中流逝，除了寄放在媽媽那邊的固定存款，我的身邊幾乎沒有任何積蓄。</p>
      <p>那款經典的香奈兒手錶，我看著它、想著它，足足看了十幾年。於是，我在36歲那年下定決心：要好好存錢，在40歲生日時，送給自己一份夢想中的禮物。</p>
      <p>為了讓這筆錢更有意義，我決定不只是把它丟在銀行帳戶裡，而是開始學習投資。我看著巴菲特說的話，思考著什麼是有護城河的好公司？對當時的我來說，這個答案非「台積電」莫屬。沒想到，理財帶來的複利效應遠比我想像中驚人，才來到38歲，我的香奈兒基金不僅達標，甚至還有盈餘。</p>
      <p>那天，我帶著興奮的心情走進香奈兒專櫃，準備擁抱這份夢寐以求的禮物。然而，當我繞了一整圈，站在櫃檯前看著錶的那一刻，我卻愣住了。</p>
      <p>我突然意識到：手錶會舊、會髒、會壞，甚至可能遺失；但台積電不一樣，它是我參與企業成長的證明，是會為我持續累積資產的投資。我問自己，為什麼要把辛苦累積的資產賣掉，去換取一個正在持續貶值的負債？</p>
      <p>那一刻，我空手走出了專櫃。</p>
      <p>經過這次轉折，我發現自己不再羨慕別人背著香奈兒，也慢慢戒掉了對精品的執著。以前常聽人說「要把錢變成自己喜歡的樣子」，現在的我，寧願把錢變成股票的樣子。</p>
      <p>因為我發現，看著資產在市場中為我創造財富，那種帶來的安全感與底氣，遠比一個名牌包更讓我心動。不再月光、不再被物質綁架，這才是我心目中，40歲以後更想要的生活，也是我最喜歡的自己。</p>
    </div>
  </div>
</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="../js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器直接開啟 `column/tsmc-vs-chanel.html`（用完整檔案路徑，不透過 `column.html` 點擊——因為發布日期未到，列表頁不會顯示它）：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 「← 專欄文章」連結指向 `../column.html`
- 標題、內文段落正常顯示
- 內容不含檔名數字編號「1.」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column/tsmc-vs-chanel.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column article: 為什麼我選擇台積電，而非香奈兒？"
```

---

## Task 5：建立 column/financial-independence.html（第 2 篇）

**Files:**
- Create: `column/financial-independence.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column/financial-independence.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人40愛自己：從「依賴」到「獨立」，我學會掌握財務自由 — KYOMI STUDIO</title>
<meta name="description" content="剛畢業那幾年，我是一個不折不扣的購物狂。當時完全沒有理財概念，只知道每個月乖乖把薪水的三分之一交給媽媽保管。雖然長年累月下來也積攢了一些積蓄，但我對「錢」其實是完全沒有掌控力的。">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="apple-touch-icon" href="../images/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人40愛自己：從「依賴」到「獨立」，我學會掌握財務自由 — KYOMI STUDIO">
<meta property="og:description" content="剛畢業那幾年，我是一個不折不扣的購物狂。當時完全沒有理財概念，只知道每個月乖乖把薪水的三分之一交給媽媽保管。雖然長年累月下來也積攢了一些積蓄，但我對「錢」其實是完全沒有掌控力的。">
<meta property="og:url" content="https://kyomistudio.github.io/column/financial-independence.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人40愛自己：從「依賴」到「獨立」，我學會掌握財務自由 — KYOMI STUDIO">
<meta name="twitter:description" content="剛畢業那幾年，我是一個不折不扣的購物狂。當時完全沒有理財概念，只知道每個月乖乖把薪水的三分之一交給媽媽保管。雖然長年累月下來也積攢了一些積蓄，但我對「錢」其實是完全沒有掌控力的。">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="../index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>
  <div class="article-page">
    <div class="article-page__back">
      <a href="../column.html">← 專欄文章</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.09.17</p>
      <h1 class="article-page__title">女人40愛自己：從「依賴」到「獨立」，我學會掌握財務自由</h1>
    </div>
    <div class="article-page__body">
      <p>剛畢業那幾年，我是一個不折不扣的購物狂。當時完全沒有理財概念，只知道每個月乖乖把薪水的三分之一交給媽媽保管。雖然長年累月下來也積攢了一些積蓄，但我對「錢」其實是完全沒有掌控力的。結婚後，當生活重心轉向家庭，每個月的零用錢握在自己手中，我竟成了徹頭徹尾的月光族。</p>
      <p>起初，我總覺得無所謂，反正背後有老公支撐，生活無虞。至於投資，我更是敬而遠之——深怕自己亂買股票，反而把錢敗光。但幸運的是，身邊有支持我的父親與丈夫，他們不斷鼓勵我：與其擔心，不如多看書和財務報表，試著理解什麼是「價值投資」。</p>
      <p>為了跨出第一步，我挑戰了投資界的經典——巴菲特的《雪球》與查理·蒙格的《窮查理的普通知識》。兩本書加起來將近兩千頁，我就這樣沉下心，一個字、一個字地啃完了。</p>
      <p>讀完那一刻，我被深深震撼了，心中只剩下一個念頭：「複利，真的太好用了！」我終於明白，財富不是單靠「省錢」省出來的，而是透過「存錢」與「投資」，運用時間的複利效應滾動出來的。選對公司、給予時間，回報才會隨之而來。</p>
      <p>於是，我開始進行一場「斷捨離」的自我實驗。我試著減少購物慾，從原本一個月買幾十件衣服，慢慢減到十幾件、幾件；衣櫃裡的衣服從 547 件一路精簡到 110 件。我發現，當我停止為無止盡的物慾買單，省下來的每一分錢，都成了我投資的種子。</p>
      <p>從最初僅投入幾萬塊的試水溫，到這幾年堅定投入三十多萬，如今，扣除媽媽那邊的固定存款，我靠著自己投資的帳戶，已經累積了一百多萬的資產。看著這個數字，我感到既驚訝又欣慰——這不僅是金額的成長，更是我對人生掌控力的提升。</p>
      <p>現在，我最快樂的事，不再是又買了什麼流行單品，而是看著股票隨著市場成長，看著存款帳戶穩健地增加。從當年那個只會靠媽媽存錢的小女孩，成長到如今的自己，我終於學會了如何掌握財務自由。這份自由，是我給自己最棒的禮物。</p>
    </div>
  </div>
</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="../js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器直接開啟 `column/financial-independence.html`（用完整檔案路徑，不透過 `column.html`——因為發布日期未到，列表頁不會顯示它）：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 「← 專欄文章」連結指向 `../column.html`
- 標題、內文段落正常顯示
- 內容不含檔名數字編號「2.」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column/financial-independence.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column article: 從「依賴」到「獨立」，我學會掌握財務自由"
```

---

## Task 6：建立 column/experience-over-things.html（第 3 篇）

**Files:**
- Create: `column/experience-over-things.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column/experience-over-things.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人 40 愛自己——從囤積物質，轉向投資體驗的覺醒 — KYOMI STUDIO</title>
<meta name="description" content="曾經的我，是個典型的「月光族」，在物質的消耗中找尋安全感。直到 40 歲那年，又一次因為衝動購物而嚴重超支，那種熟悉的自責感讓我徹底崩潰。">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="apple-touch-icon" href="../images/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人 40 愛自己——從囤積物質，轉向投資體驗的覺醒 — KYOMI STUDIO">
<meta property="og:description" content="曾經的我，是個典型的「月光族」，在物質的消耗中找尋安全感。直到 40 歲那年，又一次因為衝動購物而嚴重超支，那種熟悉的自責感讓我徹底崩潰。">
<meta property="og:url" content="https://kyomistudio.github.io/column/experience-over-things.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人 40 愛自己——從囤積物質，轉向投資體驗的覺醒 — KYOMI STUDIO">
<meta name="twitter:description" content="曾經的我，是個典型的「月光族」，在物質的消耗中找尋安全感。直到 40 歲那年，又一次因為衝動購物而嚴重超支，那種熟悉的自責感讓我徹底崩潰。">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="../index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>
  <div class="article-page">
    <div class="article-page__back">
      <a href="../column.html">← 專欄文章</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.10.01</p>
      <h1 class="article-page__title">女人 40 愛自己——從囤積物質，轉向投資體驗的覺醒</h1>
    </div>
    <div class="article-page__body">
      <p>曾經的我，是個典型的「月光族」，在物質的消耗中找尋安全感。直到 40 歲那年，又一次因為衝動購物而嚴重超支，那種熟悉的自責感讓我徹底崩潰。那晚，我和 Kyo 促膝長談，我坦白了自己的無力與厭惡，而他給了我一個改變人生的提議：「或許妳可以試著設立一個『人生體驗金』的存錢盒子，把預算花在創造回憶上，而不是囤積物品。」</p>
      <p>這句話，成了我生活的轉捩點。</p>
      <p>我開始執行這項計畫：第一個月存 1,000，第二個月 2,000，隨著對存錢節奏的掌握，我慢慢加碼到每個月 5,000 元。當我看著盒子裡的數字成長，那種成就感竟遠勝於買下一件衣服。Kyo 看見了我的改變，開始帶著我實踐這些「體驗」——我們在音樂酒吧享受微醺，在貓空第一次搭乘纜車俯瞰美景，在海邊咖啡廳吹著海風。這些回憶，遠比過往那些躺在衣櫃角落的單品，鮮活得多。</p>
      <p>今年母親節，我們看中了一台按摩椅。雖然預算依然緊繃，但這一次，我們有了更清晰的目標。我們決定暫緩小型的娛樂體驗，將這筆體驗金全心投入到按摩椅上。這台按摩椅，是我四十歲對自己的疼愛，也是我們日復一日勞累後的慰藉。</p>
      <p>雖然執行計畫的過程，難免會覺得生活過得「緊巴巴」，但現在的我，不僅擁有股票帶來的財務底氣，更擁有即將實現夢想的快樂。看著那台夢想中的按摩椅，我知道，我正在一步步實現心中理想的生活樣貌。</p>
      <p>我很感謝過去那個願意停下來、願意改變的自己。四十歲的精彩，不再是由消費的單價來衡量，而是由這些親手編織的體驗與踏實感所組成。期待未來，我能繼續在財務與生活美學之間，優雅地找到屬於自己的平衡。</p>
    </div>
  </div>
</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="../js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器直接開啟 `column/experience-over-things.html`（用完整檔案路徑，不透過 `column.html`）：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 「← 專欄文章」連結指向 `../column.html`
- 標題、內文段落正常顯示
- 內容不含檔名數字編號「3.」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column/experience-over-things.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column article: 從囤積物質，轉向投資體驗的覺醒"
```

---

## Task 7：建立 column/online-shopping-detox.html（第 4 篇）

**Files:**
- Create: `column/online-shopping-detox.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column/online-shopping-detox.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人40愛自己：Level Up！從「網拍成癮」到「精緻斷捨離」 — KYOMI STUDIO</title>
<meta name="description" content="曾經的自己，每天都要追網拍直播，跟著主播說說笑笑，順手打下關鍵字喊「+1」。那曾是我每週兩次的快樂，從久久買一次，演變成每週兩次，最後是一次下單五六件，每個月累積數十件衣服。">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="apple-touch-icon" href="../images/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人40愛自己：Level Up！從「網拍成癮」到「精緻斷捨離」 — KYOMI STUDIO">
<meta property="og:description" content="曾經的自己，每天都要追網拍直播，跟著主播說說笑笑，順手打下關鍵字喊「+1」。那曾是我每週兩次的快樂，從久久買一次，演變成每週兩次，最後是一次下單五六件，每個月累積數十件衣服。">
<meta property="og:url" content="https://kyomistudio.github.io/column/online-shopping-detox.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人40愛自己：Level Up！從「網拍成癮」到「精緻斷捨離」 — KYOMI STUDIO">
<meta name="twitter:description" content="曾經的自己，每天都要追網拍直播，跟著主播說說笑笑，順手打下關鍵字喊「+1」。那曾是我每週兩次的快樂，從久久買一次，演變成每週兩次，最後是一次下單五六件，每個月累積數十件衣服。">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="../index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>
  <div class="article-page">
    <div class="article-page__back">
      <a href="../column.html">← 專欄文章</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.10.15</p>
      <h1 class="article-page__title">女人40愛自己：Level Up！從「網拍成癮」到「精緻斷捨離」</h1>
    </div>
    <div class="article-page__body">
      <p>曾經的自己，每天都要追網拍直播，跟著主播說說笑笑，順手打下關鍵字喊「+1」。那曾是我每週兩次的快樂，從久久買一次，演變成每週兩次，最後是一次下單五六件，每個月累積數十件衣服。直到那次嚴重超支，存款甚至無法支撐購物慾，不得不向老公開口借錢，那天我哭了，並在心底發誓：我再也不要被物慾綁架。</p>
      <p>看著螢幕裡的老闆娘，戴著精緻的香奈兒手錶，揹著名牌包，在直播間分享著華麗的日常。那一刻我突然驚覺：原來我每個月透支存款、甚至不惜借錢買下的每一件網拍，其實就是在供養著她這種精緻的生活方式。</p>
      <p>我問自己：為什麼，我不能把這些資源留給自己，去投資我真正想要的人生？</p>
      <p>於是，我展開了一場衣櫃的「斷捨離」，開始存錢買錶，也同步降低對網拍的依賴。我重拾對日系品牌的喜愛，那些在折扣季時下殺至 390 至 790 元的專櫃單品，不僅價格與網拍相當，質感與剪裁更是截然不同。我立下原則：衣櫃裡減少廉價的網拍衣與路邊攤，盡量挑選能實體試穿的品牌。利用實體店的試穿機制減少退換貨的折騰，利用品牌的猶豫期幫自己冷卻衝動。</p>
      <p>奇妙的事情發生了——我發現買得「精」了，總花費反而大幅降低。</p>
      <p>從一個月幾十件網拍，到現在只挑選真正適合的幾件專櫃打折品，我不再月光，甚至開始有了積蓄。看著衣櫃裡不再是容易脫線、粗糙的衣物，取而代之的是細緻的布料與經典的剪裁，那種滿足感遠勝過數量堆疊。</p>
      <p>現在，我雖然沒有像闆娘那樣全身名牌，但我活出了自己喜歡的樣子——那是一種由內而外，更從容、更精緻且溫柔的自我。</p>
    </div>
  </div>
</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="../js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器直接開啟 `column/online-shopping-detox.html`（用完整檔案路徑，不透過 `column.html`）：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 「← 專欄文章」連結指向 `../column.html`
- 標題、內文段落正常顯示
- 內容不含檔名數字編號「4.」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column/online-shopping-detox.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column article: Level Up！從「網拍成癮」到「精緻斷捨離」"
```

---

## Task 8：建立 column/quit-instagram.html（第 5 篇）

**Files:**
- Create: `column/quit-instagram.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column/quit-instagram.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人 40 愛自己：捨棄經營十年的 IG：比起被按讚，我更在乎生活的溫度 — KYOMI STUDIO</title>
<meta name="description" content="因為熱愛寫文章與分享，我曾經營部落格長達23年。為了宣傳，也為了經營「自己」，我創立了 IG 與 FB 粉絲團。隨著時間推移，我發現我變了——我開始對數字產生了病態的依賴，極度看重流量、按讚數與留言數。">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="apple-touch-icon" href="../images/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人 40 愛自己：捨棄經營十年的 IG：比起被按讚，我更在乎生活的溫度 — KYOMI STUDIO">
<meta property="og:description" content="因為熱愛寫文章與分享，我曾經營部落格長達23年。為了宣傳，也為了經營「自己」，我創立了 IG 與 FB 粉絲團。隨著時間推移，我發現我變了——我開始對數字產生了病態的依賴，極度看重流量、按讚數與留言數。">
<meta property="og:url" content="https://kyomistudio.github.io/column/quit-instagram.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人 40 愛自己：捨棄經營十年的 IG：比起被按讚，我更在乎生活的溫度 — KYOMI STUDIO">
<meta name="twitter:description" content="因為熱愛寫文章與分享，我曾經營部落格長達23年。為了宣傳，也為了經營「自己」，我創立了 IG 與 FB 粉絲團。隨著時間推移，我發現我變了——我開始對數字產生了病態的依賴，極度看重流量、按讚數與留言數。">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="../index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>
  <div class="article-page">
    <div class="article-page__back">
      <a href="../column.html">← 專欄文章</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.10.29</p>
      <h1 class="article-page__title">女人 40 愛自己：捨棄經營十年的 IG：比起被按讚，我更在乎生活的溫度</h1>
    </div>
    <div class="article-page__body">
      <p>因為熱愛寫文章與分享，我曾經營部落格長達23年。為了宣傳，也為了經營「自己」，我創立了 IG 與 FB 粉絲團。隨著時間推移，我發現我變了——我開始對數字產生了病態的依賴，極度看重流量、按讚數與留言數。當觸及率不如預期，我甚至會陷入嚴重的低潮，委屈到哭。明知道這樣不健康，卻擺脫不了對人氣的沈溺。</p>
      <p>某次痛哭後，我驚覺自己已經開始厭世，連最愛的文章都寫不出來了。那份苦澀讓我明白：這絕不是我要的人生。</p>
      <p>於是，我做了一個極其痛苦，卻勢在必行的決定——我關閉了部落格，刪除了經營多年的 IG 與粉絲團。</p>
      <p>剛開始的那段日子，手很癢、心很空，孤獨像潮水般湧來。但我告訴自己：不能回頭，因為我知道，該離開了。</p>
      <p>後來，我開了一個私密的 IG 帳號，只邀請五六位最親近的朋友。我不再強迫自己 PO 精緻的穿搭照，也不再為了拍照去網紅餐廳。我只記錄生活的片段：親友的聚會、孩子與狗狗可愛的瞬間。</p>
      <p>這是一場深刻的「斷捨離」。我刪除的不只是社群帳號，更是過度追求外界肯定的渴望。</p>
      <p>現在回頭看，這份「不被看見」的自由，才是我最奢侈的擁有。斷捨離，不僅限於物品，當我捨棄了那些消耗心靈的事物，才會發現，原來幸福不需要透過流量和人氣來驗證。</p>
      <p>感謝 41歲那年勇敢的自己，讓現在的我，終於活得如此輕鬆自在。</p>
    </div>
  </div>
</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="../js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器直接開啟 `column/quit-instagram.html`（用完整檔案路徑，不透過 `column.html`）：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 「← 專欄文章」連結指向 `../column.html`
- 標題、內文段落正常顯示
- 內容不含檔名數字編號「5.」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column/quit-instagram.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column article: 捨棄經營十年的 IG，比起被按讚，我更在乎生活的溫度"
```

---

## Task 9：建立 column/relationship-declutter.html（第 6 篇）

**Files:**
- Create: `column/relationship-declutter.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column/relationship-declutter.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人40愛自己：關係，也需要斷捨離 — KYOMI STUDIO</title>
<meta name="description" content="我們總聽說空間需要斷捨離，卻很少有人告訴我們，原來人際關係也需要清空與轉身。我的個性謹慎內向，對我而言，交朋友向來不是件容易的事。">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="apple-touch-icon" href="../images/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人40愛自己：關係，也需要斷捨離 — KYOMI STUDIO">
<meta property="og:description" content="我們總聽說空間需要斷捨離，卻很少有人告訴我們，原來人際關係也需要清空與轉身。我的個性謹慎內向，對我而言，交朋友向來不是件容易的事。">
<meta property="og:url" content="https://kyomistudio.github.io/column/relationship-declutter.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人40愛自己：關係，也需要斷捨離 — KYOMI STUDIO">
<meta name="twitter:description" content="我們總聽說空間需要斷捨離，卻很少有人告訴我們，原來人際關係也需要清空與轉身。我的個性謹慎內向，對我而言，交朋友向來不是件容易的事。">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="../index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>
  <div class="article-page">
    <div class="article-page__back">
      <a href="../column.html">← 專欄文章</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.11.12</p>
      <h1 class="article-page__title">女人40愛自己：關係，也需要斷捨離</h1>
    </div>
    <div class="article-page__body">
      <p>我們總聽說空間需要斷捨離，卻很少有人告訴我們，原來人際關係也需要清空與轉身。</p>
      <p>我的個性謹慎內向，對我而言，交朋友向來不是件容易的事。但這從來不是遺憾，因為我非常惜情，朋友雖少，卻能用全部的真心去對待每一個走進生命裡的人。不論是親人還是朋友，只要認定了，就是毫無保留。</p>
      <p>生命中曾有過這樣一個人，起初無話不談、靈魂契合，就像命中注定般的至交。我捧著滿腔真誠，卻不知道時光會讓本質變調。然而到了後期，這份關係漸漸變質成了一種消耗——他彷彿看透了我的善良與念舊，習慣了單方面的索取與享受，卻吝於付出真心，甚至連最基礎的尊重也慢慢流失。</p>
      <p>一次又一次，我用包容當作解藥；一步又一步，我選擇退讓。我以為體諒能換來珍惜，卻只換得對方更加肆無忌憚地跨越底線。</p>
      <p>直到心被磨得傷痕累累，我終於清醒，決定放手。轉身的那一刻，淚如雨下，心如刀割，但我知道，如果繼續留在原地消耗，才是對自己最大的殘忍。割捨很疼，但我做到了。</p>
      <p>走到這個年紀，才真正懂得什麼叫人間清醒。不再盲目追求熱鬧，而是看清哪些關係有毒、哪些人只是過客，不該再佔據我們的人生。</p>
      <p>真正的愛自己，從來不只是物質上的犒賞，或是追求財富獨立的底氣；更是一種狠下心來的篩選——學會在消耗的關係裡轉身，在紛擾的人群中沉澱，把最好的溫柔留給對的人，換回心靈的乾淨與寧靜。</p>
    </div>
  </div>
</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="../js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器直接開啟 `column/relationship-declutter.html`（用完整檔案路徑，不透過 `column.html`）：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 「← 專欄文章」連結指向 `../column.html`
- 標題、內文段落正常顯示
- 內容不含檔名數字編號「6.」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column/relationship-declutter.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column article: 關係，也需要斷捨離"
```

---

## Task 10：建立 column/living-with-illness.html（第 7 篇）

**Files:**
- Create: `column/living-with-illness.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column/living-with-illness.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人40愛自己：從徬徨無措到與疾病共存 — KYOMI STUDIO</title>
<meta name="description" content="得知生病的那一年，我 19 歲。走出診間時，我又害怕又惶恐，腦子裡全是問號：我怎麼會得到這個病？我會好嗎？">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="apple-touch-icon" href="../images/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人40愛自己：從徬徨無措到與疾病共存 — KYOMI STUDIO">
<meta property="og:description" content="得知生病的那一年，我 19 歲。走出診間時，我又害怕又惶恐，腦子裡全是問號：我怎麼會得到這個病？我會好嗎？">
<meta property="og:url" content="https://kyomistudio.github.io/column/living-with-illness.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人40愛自己：從徬徨無措到與疾病共存 — KYOMI STUDIO">
<meta name="twitter:description" content="得知生病的那一年，我 19 歲。走出診間時，我又害怕又惶恐，腦子裡全是問號：我怎麼會得到這個病？我會好嗎？">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="../index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>
  <div class="article-page">
    <div class="article-page__back">
      <a href="../column.html">← 專欄文章</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.11.26</p>
      <h1 class="article-page__title">女人40愛自己：從徬徨無措到與疾病共存</h1>
    </div>
    <div class="article-page__body">
      <p>得知生病的那一年，我 19 歲。走出診間時，我又害怕又惶恐，腦子裡全是問號：我怎麼會得到這個病？我會好嗎？醫生安慰我別擔心，如果是急性的話，2 到 3 週就會痊癒；要是轉為慢性，也有可能慢慢好轉。於是，我就這樣抱著希望，等了 11 年。</p>
      <p>直到那一年，病情特別嚴重，嚴重到必須住院，甚至送了急診。醫生重新評估後告訴我，我之前被誤診了，我得的是更嚴重的那一種，而且大概一輩子都不會痊癒了。聽到這句話的那一刻，我的眼淚再也忍不住掉了下來。</p>
      <p>那幾天，我幾乎一直在哭。我不敢去想，一輩子帶著這個病生活會是什麼樣子。那一刻，我感覺世界崩塌了，覺得我的一輩子好像就這樣毀了。</p>
      <p>但日子還是得過，慢慢的，我又能重新站起來了。我告訴自己，既然避不開，那就好好面對它，說不定情況會好轉。於是，我換了專治這種病的醫生，參加了醫療小團體，乖乖吃藥、配合所有的診療。</p>
      <p>就這樣一步步走過，又過了12年。我終於從當年的徬徨無助，學會了怎麼好好照顧自己。我摸透了這個病的脾氣，知道發作時該怎麼應對，不用家人時時替我擔心，我可以自己處理好。不但如此，我還能創立自己的工作室，做喜歡的事、開展我的夢想。</p>
      <p>活到現在，和這個疾病相處了 23 年，我早已不是當年那個懵懂無助的少女了。歲月給了我更多智慧與成熟，我不但能把自己照顧得很好，還能成為家裡溫暖的大後方。光是能獨立生活、就已經卸下了他們心頭的大石。</p>
      <p>很感謝這些年來這麼努力的自己，把破碎的自己一點一點拼湊、治癒；也很感謝家人無私的疼惜與照料，才造就了今日的我。謝謝你們，也謝謝我自己。</p>
    </div>
  </div>
</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="../js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器直接開啟 `column/living-with-illness.html`（用完整檔案路徑，不透過 `column.html`）：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 「← 專欄文章」連結指向 `../column.html`
- 標題、內文段落正常顯示
- 內容不含檔名數字編號「7.」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column/living-with-illness.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column article: 從徬徨無措到與疾病共存"
```

---

## Task 11：建立 column/when-my-child-was-sick.html（第 8 篇）

**Files:**
- Create: `column/when-my-child-was-sick.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column/when-my-child-was-sick.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人40愛自己：當我的小寶貝生病了 — KYOMI STUDIO</title>
<meta name="description" content="我家兒子是個早產兒。一出生就住進保溫箱，在新生兒加護病房與新生兒病房裡待了整整 46 天，連滿月都是在醫院度過的。">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="apple-touch-icon" href="../images/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人40愛自己：當我的小寶貝生病了 — KYOMI STUDIO">
<meta property="og:description" content="我家兒子是個早產兒。一出生就住進保溫箱，在新生兒加護病房與新生兒病房裡待了整整 46 天，連滿月都是在醫院度過的。">
<meta property="og:url" content="https://kyomistudio.github.io/column/when-my-child-was-sick.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人40愛自己：當我的小寶貝生病了 — KYOMI STUDIO">
<meta name="twitter:description" content="我家兒子是個早產兒。一出生就住進保溫箱，在新生兒加護病房與新生兒病房裡待了整整 46 天，連滿月都是在醫院度過的。">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="../index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>
  <div class="article-page">
    <div class="article-page__back">
      <a href="../column.html">← 專欄文章</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.12.10</p>
      <h1 class="article-page__title">女人40愛自己：當我的小寶貝生病了</h1>
    </div>
    <div class="article-page__body">
      <p>我家兒子是個早產兒。一出生就住進保溫箱，在新生兒加護病房與新生兒病房裡待了整整 46 天，連滿月都是在醫院度過的。好不容易接回家，滿周歲前連出門都是奢求，每天只能在餵奶前定時餵藥，乖乖待在家。</p>
      <p>好不容易盼著他慢慢長大，看起來越來越健康，我以為所有的災厄終於都過了。沒想到才兩歲多，他就出現了過動症的徵兆，三歲正式確診，再次開啟了一連串漫長的回診與檢查。</p>
      <p>孩子生了病、受著苦，當媽媽的本該全是心疼；但他表現出來的，卻是極度的亢奮、停不下來、情緒失控，甚至完全聽不進別人說話……就像一個失控又響個不停的鬧鐘，調皮又折磨人。我們每天都在爆炸的邊緣徘徊，加上我也得了重病，身體與心靈的負荷達到極限，真的很難每次都沉下心來耐心地面對他，家裡的摩擦自然少不了。</p>
      <p>為了找尋出路，我到處借書、參加講座、諮詢社工師與醫師，甚至求神問卜，能試的方法我都試了，只希望能對兒子的狀況有一點點改善。</p>
      <p>後來我才慢慢明白，要真正接住他，必須先對他有同理與共情。我們得學會放下刻板的標準，不再只用同齡小孩的標準去要求他。他不是懷有惡意，也不是個壞孩子，他只是步調比別人慢了一點；而我們要做的，是放慢自己的腳步，溫柔地陪著他走。如果一直用「一般小孩」的框架去看他，才會覺得他哪裡都不對。</p>
      <p>當我們改變了看待他的角度，家裡的衝突減少了，他也重新找回了笑容與撒嬌的模樣。看著他每天纏著我要抱抱、甜甜地說：「愛媽媽」，我的心瞬間都要化了。或許，這就是生命裡最甜蜜的負擔與代價吧。</p>
    </div>
  </div>
</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="../js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器直接開啟 `column/when-my-child-was-sick.html`（用完整檔案路徑，不透過 `column.html`）：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 「← 專欄文章」連結指向 `../column.html`
- 標題、內文段落正常顯示
- 內容不含檔名數字編號「8.」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column/when-my-child-was-sick.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column article: 當我的小寶貝生病了"
```

---

## Task 12：建立 column/homemaker-vs-freelancer.html（第 9 篇）

**Files:**
- Create: `column/homemaker-vs-freelancer.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/column/homemaker-vs-freelancer.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>女人40愛自己：家庭主婦 VS. 自由工作者 — KYOMI STUDIO</title>
<meta name="description" content="婚後的大多數時間，我都是一名家庭主婦。特別是在孩子出生後，我便淡出了傳統意義上的「正式工作」。過去，我曾是一名時尚 KOL，每天在部落格、Instagram 和 Facebook 寫著開箱文、分享穿搭。">
<link rel="icon" type="image/png" href="../images/favicon.png">
<link rel="apple-touch-icon" href="../images/favicon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="KYOMI STUDIO 趣味工作室">
<meta property="og:title" content="女人40愛自己：家庭主婦 VS. 自由工作者 — KYOMI STUDIO">
<meta property="og:description" content="婚後的大多數時間，我都是一名家庭主婦。特別是在孩子出生後，我便淡出了傳統意義上的「正式工作」。過去，我曾是一名時尚 KOL，每天在部落格、Instagram 和 Facebook 寫著開箱文、分享穿搭。">
<meta property="og:url" content="https://kyomistudio.github.io/column/homemaker-vs-freelancer.html">
<meta property="og:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<meta property="og:image:width" content="1380">
<meta property="og:image:height" content="752">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="女人40愛自己：家庭主婦 VS. 自由工作者 — KYOMI STUDIO">
<meta name="twitter:description" content="婚後的大多數時間，我都是一名家庭主婦。特別是在孩子出生後，我便淡出了傳統意義上的「正式工作」。過去，我曾是一名時尚 KOL，每天在部落格、Instagram 和 Facebook 寫著開箱文、分享穿搭。">
<meta name="twitter:image" content="https://kyomistudio.github.io/images/og-cover.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+TC:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="grain"></div>

<nav class="site-nav" aria-label="主要導覽">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="../index.html">KYOMI STUDIO</a>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
      <li><a class="site-nav__link" href="../column.html" data-page="column.html">專欄文章</a></li>
    </ul>
    <button class="site-nav__search-btn" id="nav-search-btn" aria-label="搜尋文章">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
        <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

<a class="fab" href="#" aria-label="請工作室喝杯茶">
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-10-9.1C0.4 8.6 1.8 5 5.4 5c2 0 3.4 1 4.6 2.6C11.2 6 12.6 5 14.6 5 18.2 5 19.6 8.6 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>
  <span class="fab__tip">請工作室喝杯茶</span>
</a>

<main>
  <div class="article-page">
    <div class="article-page__back">
      <a href="../column.html">← 專欄文章</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.12.24</p>
      <h1 class="article-page__title">女人40愛自己：家庭主婦 VS. 自由工作者</h1>
    </div>
    <div class="article-page__body">
      <p>婚後的大多數時間，我都是一名家庭主婦。特別是在孩子出生後，我便淡出了傳統意義上的「正式工作」。</p>
      <p>過去，我曾是一名時尚 KOL，每天在部落格、Instagram 和 Facebook 寫著開箱文、分享穿搭。然而，在 41 歲這一年，我毅然決然地把這三個經營多年的平台全關了。原因無他，是我終於不想再被點閱數與流量綁架，也不想再讓讚數影響自己的心情。</p>
      <p>卸下 KOL 的光環後，我轉身投入一個全新的領域——學習寫 App。</p>
      <p>我靠著自己的雙手，一口氣開發出 6 個 App，並順利在 App Store 上架。我把對時尚、生活的愛好與審美，全部轉化為實用的軟體，用自己的作品來為自己的生活服務。</p>
      <p>然而，心中卻一直有個聲音拷問著我：「我到底是家庭主婦，還是自由工作者？」</p>
      <p>從我的視角來看，從婚前到婚後經營自媒體 23 年，我一直都在創作；現在的我寫程式、寫專欄、經營工作室，我當然是貨真價實的自由工作者！但從家人傳統的眼光看來，沒有穩定的月薪、沒有豐盈的經濟收入，這一切似乎只能算「興趣」——在他們眼裡，我依然是個「不折不扣的家庭主婦」。</p>
      <p>以前的我，極度在意這個職稱，更在意旁人的眼光。每當被問起職業，我總會感到一陣心虛，最後只能吞吞吐吐地選擇「家庭主婦」這個大家最容易理解、也最不會被質疑的標籤。</p>
      <p>但走過 40 歲，我終於打從心底放下了這份執念。</p>
      <p>現在的我，可以眼神堅定、自信滿滿地回答：「我是自由工作者！」這份自信與收入無關，而是我是否傾注了熱情，是否真誠地為自己的夢想付出心力。</p>
      <p>在家庭與事業之間，我也找到了屬於自己的完美節奏。忙著寫程式、解bug時，我同樣會廢寢忘食、全神貫注；但我依然會把家裡打理得井井有條，溫柔地照顧好孩子與家人。我不需要別人頒發一張「職業婦女」的獎狀，因為我早已在家庭主婦與自由工作者之間，縫合出最舒適的平衡。</p>
      <p>女人40，不再需要透過別人的評價來定義自己。我喜歡現在這個既能安頓家庭，又勇敢追夢的自己。</p>
    </div>
  </div>
</main>

<footer class="footer">
  <div class="footer__contact">
    <a class="footer__contact-label" href="mailto:kyomistudio1203@gmail.com">Contact us 聯絡我們</a>
  </div>
  <p class="footer__copyright">© <span id="year"></span> KYOMI STUDIO 趣味工作室. All rights reserved.</p>
</footer>

<script src="../js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2：目視確認**

用瀏覽器直接開啟 `column/homemaker-vs-freelancer.html`（用完整檔案路徑，不透過 `column.html`）：
- 導覽列「專欄文章」連結有 `is-active` 高亮
- 「← 專欄文章」連結指向 `../column.html`
- 標題、內文段落正常顯示
- 內容不含檔名數字編號「9.」

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add column/homemaker-vs-freelancer.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add column article: 家庭主婦 VS. 自由工作者"
```

---

## Task 13：最終驗收（含日期閘門邏輯驗證）

**Files:**
- 無新增／修改，純驗證

- [ ] **Step 1：驗證「未到期文章不顯示」**

用瀏覽器開啟 `column.html`。因為實作當下日期早於 2026-09-03，`article-list` 應只顯示 Task 1 Step 4 的空清單文案，9 篇文章都不應出現在列表或分頁中。

- [ ] **Step 2：驗證日期閘門邏輯本身（暫時修改系統日期或用 DevTools 覆寫）**

在 `column.html` 開啟 DevTools Console，執行以下指令模擬「假設今天是 2026-09-10」，確認第 1 篇會出現、其餘 8 篇不會：

```js
// 僅供手動驗證，不寫入任何檔案
var testToday = new Date('2026-09-10');
testToday.setHours(0,0,0,0);
console.log(COLUMN_POSTS.filter(function (p) { return new Date(p.date) <= testToday; }).map(function (p) { return p.title; }));
// 預期只印出第 1 篇「女人40愛自己：為什麼我選擇台積電，而非香奈兒？」
```

再測試 `new Date('2026-12-24')`，預期印出全部 9 篇標題。

- [ ] **Step 3：驗證搜尋功能**

在 `column.html` 點擊搜尋按鈕，確認：
- placeholder 顯示「搜尋專欄文章⋯」
- 因未到期，搜尋任何關鍵字（例如「香奈兒」）應顯示「找不到符合⋯的文章」

在 `index.html` 或 `about.html`（非 blog/column/apps 頁）開啟搜尋，確認 placeholder 顯示「搜尋文章、APP⋯」且不會意外索引到未上架的專欄文章。

- [ ] **Step 4：驗證導覽列與路徑**

- 依序開啟 `index.html`、`about.html`、`apps.html`、`blog.html`、`blog/claude-before.html`、`blog/first-code.html`、`blog/first-question.html`、`blog/spark-wear.html`、`column.html`、`column/tsmc-vs-chanel.html`（及其餘 8 篇文章頁）
- 確認每一頁導覽列都出現「專欄文章」連結，且連結指向正確（根目錄頁面連到 `column.html`，`blog/` 與 `column/` 底下頁面連到 `../column.html`）
- 確認在 `column.html` 或 `column/*.html` 頁面時，「專欄文章」nav 連結有 `is-active` 高亮
- 確認 9 篇 `column/*.html` 文章內容都不含檔名數字編號（例如不應出現「1. 女人40愛自己」這種字樣）

- [ ] **Step 5：手機版面驗證**

用瀏覽器 DevTools 切到 375px 寬度，檢查 `column.html` 與至少 2 篇 `column/*.html` 文章頁，確認無橫向捲軸。

- [ ] **Step 6：確認最終 git 狀態**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io status
git -C /Users/mimi/Documents/kyomistudio.github.io log --oneline -15
```

確認所有 Task 1–12 的 commit 都存在，working tree 除了本來就存在的既有未提交變更（`apps.html`、`index.html` 的其他修改，與此功能無關）之外，沒有遺漏的檔案。

---

## 最終驗收清單

- [ ] `column.html` 新增，列表邏輯與分頁比照 `blog.html`
- [ ] 9 篇 `column/*.html` 文章頁建立完成，內容忠於原稿 docx，不含檔名數字編號
- [ ] `COLUMN_POSTS` 9 筆資料，日期為 2026-09-03 起每 14 天遞增至 2026-12-24
- [ ] 日期過濾邏輯正確：未到期文章不會出現在列表、分頁、搜尋
- [ ] 空清單狀態文案正常顯示（實作當下 `column.html` 應顯示「敬請期待」文案）
- [ ] 所有頁面（含 `blog/*.html`、`column/*.html`）導覽列新增「專欄文章」連結，相對路徑正確
- [ ] 搜尋功能可搜到已上架的專欄文章，且不會索引未上架文章
- [ ] `column.html` / `column/*.html` 在 `is-active` 高亮上正確
- [ ] 手機 375px 版面正常，無橫向捲軸

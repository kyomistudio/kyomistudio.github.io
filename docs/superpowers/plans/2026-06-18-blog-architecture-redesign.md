# Blog 架構改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將開發隨筆從「單頁手風琴展開」改版為「極簡列表頁 + 每篇獨立 HTML 檔」的標準部落格架構。

**Architecture:** blog.html 改成純列表頁（日期 · 作者 / 標題 / 摘要 / 細線分隔），每篇文章搬到 `blog/[slug].html` 獨立頁面，並更新自動發文排程配合新結構。兩篇現有文章一併遷移。

**Tech Stack:** 純靜態 HTML/CSS/JS、GitHub Pages、Claude Code Remote Scheduler（RemoteTrigger）

---

## 注意：無測試框架例外聲明

本計畫為靜態 HTML/CSS 網站，無任何測試框架。所有驗證方式為：用瀏覽器開啟頁面，目視確認列表 / 連結 / 文章頁呈現正確，以及手機 375px 版面無橫向捲軸。

---

## 檔案對照

| 檔案 | 操作 | 說明 |
|------|------|------|
| `css/style.css` | 修改（約第 988–1063 行） | 移除手風琴樣式，更新 `.article-item`，新增 `.article-page` 系列 |
| `blog/claude-before.html` | 新建 | 「在遇見 Claude 之前」獨立文章頁 |
| `blog/spark-wear.html` | 新建 | 「SPARK WEAR」獨立文章頁 |
| `blog.html` | 修改 | 改版為極簡列表頁，移除所有手風琴內容 |
| `js/script.js` | 修改 | 移除手風琴 JS，修正 blog/ 子目錄的 nav 高亮邏輯 |
| `blog-series.md` | 修改 | 每篇加入 Slug 欄位，供排程代理使用 |
| 排程 `trig_01MDcnUwzEPZhwgfZk9wf1vw` | 更新（RemoteTrigger） | 新 prompt：建立 blog/[slug].html + 更新列表頁 |

---

## Task 1：CSS — 移除手風琴樣式，新增 article-page 樣式

**Files:**
- Modify: `css/style.css`（第 988–1063 行的 BLOG PAGE 區塊）

- [ ] **Step 1：替換 BLOG PAGE CSS 區塊**

找到 `css/style.css` 中以下這段（第 988 行起）並完整替換：

**舊內容（找到這段）：**
```css
/* ==========================================================================
   BLOG PAGE
   ========================================================================== */
.blog-section {
```

**替換為以下完整區塊（到 `.article-item__sub` 結束為止全部替換）：**

```css
/* ==========================================================================
   BLOG PAGE — 列表頁 + 獨立文章頁
   ========================================================================== */
.blog-section {
  max-width: var(--max-width); margin: 0 auto;
  padding: 0 1.5rem clamp(4rem,9vw,8rem);
}
.article-list { list-style: none; }
.article-item { border-bottom: 1px solid var(--color-line); }
.article-item__link {
  display: block;
  padding: 2rem 0;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}
.article-item__link:hover { opacity: 0.7; }
.article-item__meta {
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  color: var(--color-text-soft);
  margin-bottom: 0.6rem;
}
.article-item__title {
  font-family: var(--font-heading);
  font-size: clamp(1rem,2vw,1.2rem);
  letter-spacing: 0.05em;
  color: var(--color-ink);
  line-height: 1.5;
  font-weight: 500;
  margin-bottom: 0.75rem;
}
.article-item__preview {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 獨立文章頁 blog/[slug].html */
.article-page {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: clamp(3rem,7vw,5rem) 1.5rem clamp(4rem,9vw,8rem);
}
.article-page__back { margin-bottom: 2rem; }
.article-page__back a {
  font-size: 0.82rem;
  letter-spacing: 0.15em;
  color: var(--color-khaki-deep);
  text-decoration: none;
  transition: color 0.2s ease;
}
.article-page__back a:hover { color: var(--color-ink); }
.article-page__hero {
  margin-bottom: clamp(2rem,5vw,3rem);
  padding-bottom: clamp(1.5rem,4vw,2.5rem);
  border-bottom: 1px solid var(--color-line);
}
.article-page__meta {
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  color: var(--color-text-soft);
  margin-bottom: 1rem;
}
.article-page__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.6rem,4vw,2.6rem);
  letter-spacing: 0.08em;
  color: var(--color-ink);
  line-height: 1.4;
}
.article-page__body {
  font-family: var(--font-body);
  font-size: 1.05rem;
  color: var(--color-text);
  line-height: 2.2;
}
.article-page__body p + p { margin-top: 1.2em; }
.article-page__sub {
  display: block;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1.15rem;
  color: var(--color-ink);
  letter-spacing: 0.04em;
  margin-top: 1.75em;
  margin-bottom: -0.4em;
}
```

- [ ] **Step 2：目視確認**

用瀏覽器開啟 `blog.html`（改版前），確認 DevTools Console 沒有 CSS 錯誤。

---

## Task 2：建立 blog/claude-before.html

**Files:**
- Create: `blog/claude-before.html`

- [ ] **Step 1：建立 blog/ 目錄並建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/blog/claude-before.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>在遇見 Claude 之前，我以為寫程式是另一個世界的事 — KYOMI STUDIO</title>
<meta name="description" content="我是 Mimi，一個對程式碼完全沒概念的人。這篇想說說我為什麼會想做 APP，以及那段時間心裡那種「這不是我能碰的東西」的距離感。">
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
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html"  data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html"   data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html"   data-page="blog.html">開發隨筆</a></li>
    </ul>
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
      <a href="../blog.html">← 開發隨筆</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.06.17</p>
      <h1 class="article-page__title">在遇見 Claude 之前，我以為寫程式是另一個世界的事</h1>
    </div>
    <div class="article-page__body">
      <p class="article-page__sub"><strong>程式碼對我來說，是另一個星球的語言</strong></p>
      <p>老實說，在這一切開始之前，我看到程式碼的反應跟看到外星文字差不多。一堆括號、奇怪的英文單字、莫名其妙的縮排，我完全不知道那些東西在「說」什麼。我以為會寫程式的人都是另一種生物，腦袋裡裝著我沒有的零件。所以每次想到「我也想做一個 APP」，後面總會接著一句「但那不是我能做的事」。</p>
      <p class="article-page__sub"><strong>明明心裡很想要，卻一直沒踏出第一步</strong></p>
      <p>我心裡其實藏著好幾個想法，像是想把自己整理衣櫃的習慣做成一個工具，或是想記錄一些只有自己懂的小堅持。但每次想到要學程式語言、要懂邏輯、要看那些密密麻麻的教學文章，我就先投降了。與其說我怕難，更準確地說，我怕的是那種「我跟這個世界格格不入」的感覺，怕自己再一次證明自己學不會。</p>
      <p class="article-page__sub"><strong>恐懼感比想像中更安靜，卻一直在</strong></p>
      <p>這種恐懼不是那種會讓你尖叫的恐懼，它更安靜，安靜到你幾乎不會發現它一直在攔著你。它就藏在「等我有空再說」「等我準備好再學」這種話裡面，而那個「準備好」的那天，當然永遠不會自己來。</p>
      <p class="article-page__sub"><strong>後來，有個東西改變了我</strong></p>
      <p>如果你問我那時候的我，會不會想到有一天能自己把 APP 做出來，我一定會說不可能。但後來，真的有一個東西出現，慢慢把那道牆敲開了一個小縫。那是什麼，下一篇再說給你聽。</p>
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

用瀏覽器開啟 `blog/claude-before.html`，確認：
- 導覽列顯示正確，「開發隨筆」link 有 `is-active` 高亮（需完成 Task 5 後才會正確）
- 標題、內文字體正常
- 「← 開發隨筆」連結指向 `../blog.html`

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add blog/claude-before.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add individual article page: blog/claude-before.html"
```

---

## Task 3：建立 blog/spark-wear.html

**Files:**
- Create: `blog/spark-wear.html`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/blog/spark-wear.html`，完整內容如下：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SPARK WEAR：從失控購物狂到衣櫃的主理人 — KYOMI STUDIO</title>
<meta name="description" content="曾經，我是個擁有 547 件衣服、不折不扣的購物狂。直到我遇見「斷捨離」，以及決定自己動手做一個 APP。">
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
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html"  data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html"   data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html"   data-page="blog.html">開發隨筆</a></li>
    </ul>
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
      <a href="../blog.html">← 開發隨筆</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · 2026.05.21</p>
      <h1 class="article-page__title">SPARK WEAR：從失控購物狂到衣櫃的主理人</h1>
    </div>
    <div class="article-page__body">
      <p class="article-page__sub"><strong>失控的迴圈，直到我遇見「斷捨離」</strong></p>
      <p>曾經，我是個擁有 547 件衣服、不折不扣的購物狂。帳單上的數字與滿坑滿谷的衣服，曾讓我陷入深深的焦慮與自我懷疑。受到《怦然心動的人生整理魔法》啟發，我大刀闊斧的丟了三百件衣服，那種輕盈感令人難忘。然而，一年後，衣櫃又悄默默的長回 400 多件衣服⋯⋯。</p>
      <p>直到後來，細讀《斷捨離》後，我才終於痛定思痛，進行了第二次更徹底的「衣櫃大瘦身」。這次，我把衣櫃精簡為 110 件！</p>
      <p class="article-page__sub"><strong>既然市場上沒有，那就自己動手做</strong></p>
      <p>我發現，我購物的一部分原因是衝動購物，一部分原因在於「記憶」。因為記憶有限，我總是不自覺的買入重複的單品，所以我需要能紀錄衣服的 APP。市面上的穿搭 APP 雖多，但對於喜歡紀錄單價、季節、顏色與優缺點的我來說，總是少了那麼一點。於是，我決定自己動手打造心動衣櫥（SPARK WEAR）。</p>
      <p>第一次嘗試時，因為不慎將它做成網頁版，導致手機使用體驗不佳，許多功能也無法順利執行。在與 Kyo 討論並釐清方向後，我決定重寫。這次，我鎖定目標、優化第一版的缺點，終於讓它蛻變成我理想中的模樣。</p>
      <p class="article-page__sub"><strong>數據，是冷靜購物的第一步</strong></p>
      <p>有了這個 APP，衣櫃不再是未知的黑洞。現在，我清楚知道哪件單品使用率最高、哪一件的 C/P 值最亮眼。最重要的是，在「衝動下單」前，我養成了翻開 APP 的習慣，這成為了我最有力的衝動克制器。我不僅能透過紀錄穿搭練習穿搭技巧，學習隱惡揚善，更能客觀地評估哪些單品值得再買，哪些則該列入未來的斷捨離清單。購物決策，從此變得精準且優雅。</p>
      <p class="article-page__sub"><strong>讓生活，因為心動而閃閃發亮</strong></p>
      <p>SPARK WEAR 解決了我長久以來的購物難題，它提醒我適時縮起那雙不安分的手，並讓原本深藏在冷宮的單品，再次被看見價值。我誠摯地邀請你，一起加入「心動衣櫥」的行列。讓我們透過 SPARK WEAR，學會與物品建立深度連結，成為更讓自己心動的自己。讓生活中的每一天，都因為這份覺察而閃閃發亮。</p>
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

- [ ] **Step 2：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add blog/spark-wear.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add individual article page: blog/spark-wear.html"
```

---

## Task 4：改版 blog.html 為極簡列表頁

**Files:**
- Modify: `blog.html`

- [ ] **Step 1：替換 `<main>` 內容**

將 blog.html 的 `<main>` 區塊（從 `<main>` 到 `</main>`）完整替換為以下內容：

```html
<main>

  <div class="page-hero">
    <h1 class="page-hero__title">開發隨筆</h1>
    <p class="page-hero__desc">工作室的幕後日誌。做 APP 的過程裡，我們想到了什麼、踩過了什麼坑，以及那些說不定有人也想看的零散思考。</p>
  </div>

  <div class="blog-section">
    <ul class="article-list" role="list">

      <li class="article-item">
        <a class="article-item__link" href="blog/claude-before.html">
          <div class="article-item__meta">2026.06.17 · MIMI</div>
          <h2 class="article-item__title">在遇見 Claude 之前，我以為寫程式是另一個世界的事</h2>
          <p class="article-item__preview">我是 Mimi，一個對程式碼完全沒概念的人。這篇想說說我為什麼會想做 APP，以及那段時間心裡那種「這不是我能碰的東西」的距離感。</p>
        </a>
      </li>

      <li class="article-item">
        <a class="article-item__link" href="blog/spark-wear.html">
          <div class="article-item__meta">2026.05.21 · MIMI</div>
          <h2 class="article-item__title">SPARK WEAR：從失控購物狂到衣櫃的主理人</h2>
          <p class="article-item__preview">曾經，我是個擁有 547 件衣服、不折不扣的購物狂。帳單上的數字與滿坑滿谷的衣服，曾讓我陷入深深的焦慮與自我懷疑。直到我遇見「斷捨離」，一切才開始慢慢改變。</p>
        </a>
      </li>

    </ul>
  </div>

</main>
```

- [ ] **Step 2：目視確認**

用瀏覽器開啟 `blog.html`，確認：
- 兩篇文章以列表形式顯示，無展開手風琴
- 點擊文章列跳至正確的獨立頁面
- 手機 375px 版面無橫向捲軸

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add blog.html
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Redesign blog.html as minimal article list page"
```

---

## Task 5：更新 js/script.js

**Files:**
- Modify: `js/script.js`

移除手風琴 JS，修正 `blog/` 子目錄頁面的導覽列高亮。

- [ ] **Step 1：更新 script.js**

找到以下兩段並進行修改：

**修改 1：nav 高亮邏輯（第 31–35 行）**

舊：
```js
  var navLinks = document.querySelectorAll('.site-nav__link[data-page]');
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    if (link.getAttribute('data-page') === currentPage) link.classList.add('is-active');
  });
```

新：
```js
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

**修改 2：移除 Blog 手風琴區塊（第 65–75 行）**

找到並刪除以下整段：
```js
  // Blog — 繼續閱讀 / 收起 accordion ------------------------------------
  document.querySelectorAll('.article-item__more').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.article-item');
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
      btn.textContent = open ? '收起' : '繼續閱讀';
      var body = item.querySelector('.article-item__body');
      if (body) body.setAttribute('aria-hidden', String(!open));
    });
  });
```

- [ ] **Step 2：目視確認**

開啟 `blog/claude-before.html`，確認導覽列「開發隨筆」link 有 `is-active` 底線高亮。

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add js/script.js
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Remove blog accordion JS, fix nav active link for blog/ subdirectory"
```

---

## Task 6：更新 blog-series.md + 自動發文排程

**Files:**
- Modify: `blog-series.md`（加入各篇 Slug）
- Update: 排程 `trig_01MDcnUwzEPZhwgfZk9wf1vw`（透過 RemoteTrigger）

### Step 6A：更新 blog-series.md

- [ ] **Step 1：在每篇加入 Slug 欄位**

注意：第 1 篇已發布（`claude-before`），只需為第 2–10 篇加入 Slug。

在 `blog-series.md` 的每個篇章區塊中加入 `Slug:` 欄位：

```markdown
## 第 1 篇
標題：在遇見 Claude 之前，我以為寫程式是另一個世界的事
核心：自我介紹、為什麼想做 APP、對工程的恐懼與距離感
風格提示：溫柔回顧、帶點自嘲，結尾埋下「後來有個東西改變了我」的伏筆
Slug：claude-before

## 第 2 篇
標題：第一次對話：我問了一個很蠢的問題
核心：第一次開口問 Claude、打破心理障礙的瞬間、那個問題有多蠢但 Claude 還是回答了
風格提示：帶點幽默，真實描述當時的緊張與猶豫
Slug：first-question

## 第 3 篇
標題：Claude 說「好」，但我看不懂它給我的東西
核心：拿到一大段程式碼卻不知道怎麼用，摸索複製貼上的過程
風格提示：描述手足無措的感覺，以及「就算看不懂也先試試看」的心態
Slug：first-code

## 第 4 篇
標題：第一個 bug：它說沒問題，可是畫面是空的
核心：遇到第一個錯誤、學會描述問題給 Claude，發現「問對問題」比「得到答案」更重要
風格提示：挫折感真實，但結尾帶點「原來如此」的收穫感
Slug：first-bug

## 第 5 篇
標題：我把第一版做成網頁版，然後全部重來
核心：SPARK WEAR 第一次失敗的故事，不慎做成網頁版、手機體驗很差、決定重寫
風格提示：不迴避失敗，反而聊失敗帶來的清醒
Slug：first-rewrite

## 第 6 篇
標題：學會問「為什麼」，而不只是「怎麼做」
核心：從只要答案，到開始理解邏輯的轉折點，第一次真正讀懂一段程式碼
風格提示：知識覺醒的小高潮，帶點驚喜
Slug：asking-why

## 第 7 篇
標題：SPARK WEAR 真的上線了，我截了好多張圖
核心：第一個 APP 完成的心情、迫不及待截圖分享的興奮感、想讓更多人用看看
風格提示：雀躍、驕傲但帶點不敢置信，描述截圖的那個瞬間
Slug：spark-wear-launch

## 第 8 篇
標題：做第二個 APP 的感覺，完全不一樣了
核心：進入 SPARK SHAPE，發現自己真的有在進步，問問題更精準、debug 更快
風格提示：和第一次對比，成長是可以被感受到的
Slug：second-app

## 第 9 篇
標題：Claude 也會出錯，而我開始能判斷它對不對
核心：成長的標誌——從完全依賴到有能力驗證 Claude 的輸出，發現錯誤的那個瞬間
風格提示：帶點成就感，「我已經不是那個什麼都信的新手了」
Slug：claude-mistakes

## 第 10 篇
標題：我不再是科技小白了嗎？
核心：回顧整段旅程，給同樣在摸索的人說的話，不是鼓勵文，而是真實的陪伴
風格提示：不要過度勵志，保持 Mimi 一貫的真實與溫暖
Slug：not-beginner
```

- [ ] **Step 2：Commit blog-series.md**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add blog-series.md
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add slug field to blog-series.md for articles 1-10"
```

### Step 6B：更新自動發文排程

- [ ] **Step 3：取得目前 routine prompt 並確認 trigger_id**

排程 ID：`trig_01MDcnUwzEPZhwgfZk9wf1vw`

使用 RemoteTrigger `action: "get"` 確認目前設定。

- [ ] **Step 4：更新 routine prompt**

使用 RemoteTrigger `action: "update"` 更新 `trig_01MDcnUwzEPZhwgfZk9wf1vw`，將 `job_config.ccr.events[0].data.message.content` 替換為以下 prompt（git push 指令中的 PAT 必須先用 `gh auth token` 取得並嵌入）：

---

```
你是 KYOMI STUDIO 的自動發文代理。每次執行時，請依照以下步驟運作。

工作目錄：/Users/mimi/Documents/kyomistudio.github.io

## 步驟 1：讀取狀態
讀取 blog-series-state.json，取得：
- last_published_index：已發布篇數
- series_total：系列總篇數
- last_published_date：上次發布日期（ISO 8601 格式，或 null）

## 步驟 2：檢查是否需要發文
條件 A（系列已完成）：若 last_published_index >= series_total，停止並輸出：
「系列文章已全部發布完畢（共 10 篇）。請告知 Mimi 是否要規劃下一個系列。」

條件 B（距上次發文不足 14 天）：若 last_published_date 不是 null，且今日距離 last_published_date 少於 14 天，停止並輸出：
「距離上次發文（{last_published_date}）未滿 14 天，本次跳過。」

若兩個條件都不符合，繼續執行步驟 3。

## 步驟 3：取得下一篇主題
讀取 blog-series.md，找到「第 {last_published_index + 1} 篇」區塊，取得：
- 標題
- 核心（文章主軸）
- 風格提示
- Slug（例：first-question）

## 步驟 4：生成文章內容
以 Mimi 的第一人稱撰寫這篇文章。風格參考：blog/spark-wear.html 中的文章。

格式要求：
- 語言：繁體中文
- 字數：400–600 字
- 結構：2–4 個小節，每節有一行粗體小標題
- 口吻：溫暖、真實、有自我揭露，偶爾帶點幽默

生成摘要（60–80 字），用於列表頁的 article-item__preview。

## 步驟 5A：建立獨立文章頁 blog/{slug}.html

建立 /Users/mimi/Documents/kyomistudio.github.io/blog/{Slug}.html，
使用以下模板（將 {佔位} 替換為實際內容）：

<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{標題} — KYOMI STUDIO</title>
<meta name="description" content="{60字摘要}">
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
    <button class="site-nav__hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="2" y1="6"  x2="20" y2="6"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
    <ul class="site-nav__links" id="nav-menu">
      <li><a class="site-nav__link" href="../about.html" data-page="about.html">關於我們</a></li>
      <li><a class="site-nav__link" href="../apps.html" data-page="apps.html">APP 下載</a></li>
      <li><a class="site-nav__link" href="../blog.html" data-page="blog.html">開發隨筆</a></li>
    </ul>
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
      <a href="../blog.html">← 開發隨筆</a>
    </div>
    <div class="article-page__hero">
      <p class="article-page__meta">MIMI · {YYYY.MM.DD}</p>
      <h1 class="article-page__title">{標題}</h1>
    </div>
    <div class="article-page__body">
      {每個小節用以下格式，重複 2–4 次}
      <p class="article-page__sub"><strong>{小節標題}</strong></p>
      <p>{小節內文（可多段，用 <p> 分隔）}</p>
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

## 步驟 5B：在 blog.html 列表最上方插入新條目

在 blog.html 中找到：
<ul class="article-list" role="list">

在這行的下一行，插入：
      <li class="article-item">
        <a class="article-item__link" href="blog/{Slug}.html">
          <div class="article-item__meta">{YYYY.MM.DD} · MIMI</div>
          <h2 class="article-item__title">{標題}</h2>
          <p class="article-item__preview">{60–80 字摘要}</p>
        </a>
      </li>

## 步驟 6：更新 blog-series-state.json
將 last_published_index 加 1，last_published_date 設為今天的 ISO 8601 日期（YYYY-MM-DD）。

## 步驟 7：Commit 並推送
git -C /Users/mimi/Documents/kyomistudio.github.io add blog/{Slug}.html blog.html blog-series-state.json
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add blog post: 從零到一 第{N}篇 — {標題}"
git -C /Users/mimi/Documents/kyomistudio.github.io remote set-url origin https://kyomistudio:{PAT}@github.com/kyomistudio/kyomistudio.github.io.git
git -C /Users/mimi/Documents/kyomistudio.github.io push

完成後輸出：
✅ 已成功發布《從零到一》第 {N} 篇：{標題}
已建立 blog/{Slug}.html
下次發文時間：{today + 14 天}
```

---

重要：在更新 routine prompt 時，`{PAT}` 必須替換為目前有效的 GitHub PAT（用 `gh auth token` 指令取得）。

- [ ] **Step 5：Commit blog-series.md 與確認排程**

確認排程更新成功，輸出中包含 `trigger_id: trig_01MDcnUwzEPZhwgfZk9wf1vw`。

---

## 最終驗收清單

- [ ] `blog.html` 為純列表頁，無手風琴展開
- [ ] `blog/claude-before.html` 存在，內文完整，返回連結正常
- [ ] `blog/spark-wear.html` 存在，內文完整，返回連結正常
- [ ] 點擊列表條目 → 正確跳至對應文章頁
- [ ] 文章頁導覽列「開發隨筆」有 is-active 高亮
- [ ] 手機 375px 版面無橫向捲軸
- [ ] `blog-series.md` 每篇含 Slug 欄位
- [ ] 排程 prompt 已更新為新架構（建立 blog/[slug].html + 插入列表條目）

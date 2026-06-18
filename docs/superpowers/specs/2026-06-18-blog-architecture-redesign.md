# Blog 架構改版設計文件

**日期：** 2026-06-18
**作者：** Mimi / KYOMI STUDIO
**狀態：** 已審閱，待實作

---

## 目標

將現有「所有文章在同一頁展開」的手風琴結構，改版為「文章列表頁 + 每篇獨立頁面」的標準部落格架構，支援未來數百篇文章的規模，並讓每篇文章可以有獨立網址分享。

---

## 設計選擇（已確認）

| 項目 | 選擇 |
|------|------|
| 架構 | 列表頁 + 獨立 HTML 檔 |
| 列表樣式 | 極簡列表（日期 · 作者 / 標題 / 摘要 / 細線分隔） |
| 文章頁版型 | 全寬，與網站其他頁一致 |
| 作者分區 | 不分區，全部文章按發布日期從新到舊 |

---

## 檔案結構

```
kyomistudio.github.io/
├── blog.html                        ← 文章列表頁（改版現有檔案）
└── blog/
    ├── claude-before.html           ← 在遇見 Claude 之前，我以為寫程式是另一個世界的事
    ├── spark-wear.html              ← SPARK WEAR：從失控購物狂到衣櫃的主理人
    └── [slug].html                  ← 未來每篇新文章獨立一檔
```

### Slug 命名規則

- 使用英文，kebab-case
- 取文章主題關鍵字，不超過 4 個單字
- 例：`claude-before.html`、`spark-wear.html`、`first-bug.html`

---

## blog.html — 文章列表頁

### 改版內容

移除現有 `.blog-author-block` 區塊結構與手風琴 `<li>` 展開邏輯，改為單一 `.article-list` 列表，包含所有文章，按發布日期從新到舊排列（Mimi 和 Kyo 的文章不分區）。

### 每列結構

```html
<li class="article-item">
  <a class="article-item__link" href="blog/slug.html">
    <div class="article-item__meta">YYYY.MM.DD · MIMI</div>
    <h2 class="article-item__title">文章標題</h2>
    <p class="article-item__preview">60–80 字摘要文字。</p>
  </a>
</li>
```

### 視覺規格

- 每列以 `border-bottom: 1px solid var(--color-line)` 分隔
- `article-item__meta`：小字、淡色（`var(--color-text-soft)`）、letter-spacing
- `article-item__title`：Noto Serif TC，hover 時顏色變深
- `article-item__preview`：Noto Sans TC，兩行摘要，`overflow` 截斷
- 整列可點擊（`<a>` 包住整個 `<li>` 內容）

### 移除的元素

- `.blog-author-block` 分區標題（「Mimi 的文章」等）
- `.article-item__more` 繼續閱讀按鈕
- `.article-item__body` / `.article-item__content` 展開區塊
- 手風琴相關 JS（`article-item__trigger`、is-open 邏輯）

---

## blog/[slug].html — 獨立文章頁

### 頁面結構

與網站其他子頁面完全相同的外殼：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>...</head>
<body>
  <div class="grain"></div>
  <nav class="site-nav">...</nav>
  <a class="fab" href="#">...</a>
  <main>
    <div class="article-page">
      <div class="article-page__back">
        <a href="../blog.html">← 開發隨筆</a>
      </div>
      <div class="article-page__hero">
        <p class="article-page__meta">MIMI · 2026.06.18</p>
        <h1 class="article-page__title">文章標題</h1>
      </div>
      <div class="article-page__body">
        <p class="article-page__sub"><strong>小節標題</strong></p>
        <p>內文段落...</p>
      </div>
    </div>
  </main>
  <footer class="footer">...</footer>
  <script src="../js/script.js"></script>
</body>
</html>
```

### 版型規格

- `.article-page` 沿用 `max-width: var(--max-width)`，padding 與其他頁一致
- `.article-page__back`：小字返回連結，置於標題上方
- `.article-page__meta`：作者 + 日期，`var(--color-text-soft)`
- `.article-page__title`：Cormorant Garamond Display，`clamp(2rem, 5vw, 3rem)`
- `.article-page__body`：Noto Sans TC，`font-size: 1.05rem`，`line-height: 2`
- `.article-page__sub`：Noto Serif TC，粗體小節標題，`font-size: 1.15rem`

---

## 既有文章遷移

| 文章 | 原來位置 | 遷移後 |
|------|----------|--------|
| 在遇見 Claude 之前... | blog.html `<li>` | `blog/claude-before.html` |
| SPARK WEAR：從失控購物狂... | blog.html `<li>` | `blog/spark-wear.html` |

遷移步驟：
1. 建立 `blog/` 子目錄
2. 將兩篇文章的 HTML 內容搬入各自獨立頁面
3. 改版 blog.html 為列表頁，加入兩筆列表條目

---

## 自動發文排程更新

現有 routine `kyomi-blog-auto-publish` 的步驟 5 與步驟 7 需要更新：

### 現有行為（改版前）
- 步驟 5：將 `<li>` 插入 blog.html 的 `<ul>`
- 步驟 7：commit `blog.html` + `blog-series-state.json`

### 更新後行為
- 步驟 5A：建立 `blog/[slug].html` 完整文章頁（包含 nav、main、footer）
- 步驟 5B：在 blog.html 列表最上方插入新的 `<li class="article-item">` 條目，含 `<a href="blog/[slug].html">`
- 步驟 7：commit `blog/[slug].html` + `blog.html` + `blog-series-state.json`

### Slug 生成規則（供 routine 使用）
從文章標題取前 3–4 個關鍵英文字，轉 kebab-case。第 N 篇文章對應 `blog-series.md` 中的固定 slug，可預先定義在 `blog-series.md` 每篇的元資料中。

---

## 無測試框架例外聲明

本計畫為純靜態 HTML/CSS 網站，無測試框架。所有驗證為目視確認：
- blog.html 列表頁各條目可點擊並跳至正確文章頁
- blog/[slug].html 導覽列、文章內容、返回連結正常
- 手機版（375px）排版無橫向捲軸

---

## 成功標準

- [ ] blog.html 變成純列表頁，無手風琴展開行為
- [ ] 兩篇現有文章各有獨立 `blog/` 頁面
- [ ] 列表條目點擊後正確跳至文章頁
- [ ] 文章頁有返回列表連結
- [ ] 手機版排版正常
- [ ] 自動發文排程更新，新文章同時建立獨立頁 + 更新列表

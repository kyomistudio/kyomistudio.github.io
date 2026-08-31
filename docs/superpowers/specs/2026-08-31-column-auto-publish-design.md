# 專欄文章（女人40愛自己）排程上架設計文件

**日期：** 2026-08-31
**作者：** Mimi / KYOMI STUDIO
**狀態：** 已審閱，待實作

---

## 目標

新增一個獨立的「專欄文章」頁面，發布 Mimi 親自撰寫的「女人40愛自己」系列（9 篇，已交稿）。9 篇文章依序、每兩週上架一篇，全程不需要任何人手動操作，也不牽涉伺服器或排程系統——單純靠瀏覽器當下日期做前端過濾。

此功能與既有的 `kyomi-blog-auto-publish`（[CLAUDE] 開頭、由 Claude 代筆的開發隨筆系列，見 `2026-06-17-blog-auto-publish-design.md`）完全獨立，資料、目錄、排程機制互不相干。

---

## 設計選擇（已確認）

| 項目 | 選擇 |
|------|------|
| 頁面關係 | 獨立頁面 `column.html`，導覽列與「開發隨筆」並列（非分頁籤、非同頁切換） |
| 作者標示 | MIMI（與開發隨筆一致） |
| 發布順序 | 依檔名編號 1→9 依序發布 |
| 起發日期 | 2026-09-03，之後每 14 天一篇 |
| 自動化機制 | 純前端日期過濾（方案 A），不使用 GitHub Actions / cron / PAT |

---

## 檔案結構

```
kyomistudio.github.io/
├── column.html                      ← 新增：專欄列表頁
└── column/
    ├── tsmc-vs-chanel.html          ← 新增：第 1 篇
    ├── financial-independence.html  ← 新增：第 2 篇
    ├── experience-over-things.html  ← 新增：第 3 篇
    ├── online-shopping-detox.html   ← 新增：第 4 篇
    ├── quit-instagram.html          ← 新增：第 5 篇
    ├── relationship-declutter.html  ← 新增：第 6 篇
    ├── living-with-illness.html     ← 新增：第 7 篇
    ├── when-my-child-was-sick.html  ← 新增：第 8 篇
    └── homemaker-vs-freelancer.html ← 新增：第 9 篇
```

Slug 命名規則沿用 `2026-06-18-blog-architecture-redesign.md` 的規範（英文 kebab-case，取主題關鍵字）。

---

## 內容來源與轉換

原稿為 9 個 `.docx` 檔，位於 `/Users/mimi/Documents/女人40愛自己/`，檔名前綴數字（`1.` ~ `9.`）僅代表發布順序，**不會**出現在正式標題或頁面內容中。

轉換方式：用 macOS `textutil -convert txt <file> -stdout` 讀出純文字內容。原稿第一行是標題（與檔名主題相同，需去除，不重複放進內文），其餘為連續段落（無小節粗體標題，跟 `[CLAUDE]` 系列的 `.article-page__sub` 分節寫法不同）。內文逐段落包成 `<p>`，不重寫、不改寫、不增刪原意。

每篇摘要（excerpt，供列表頁與搜尋使用）取原文開頭 1–2 句、約 100–150 字，做法比照現有 `BLOG_POSTS` 摘要長度。

---

## 資料模型 — `js/script.js`

新增 `COLUMN_POSTS` 陣列，結構與 `BLOG_POSTS` 平行：

```js
var COLUMN_POSTS = [
  { date: '2026-09-03', author: 'MIMI', title: '女人40愛自己：為什麼我選擇台積電，而非香奈兒？', url: 'column/tsmc-vs-chanel.html', excerpt: '…' },
  { date: '2026-09-17', author: 'MIMI', title: '女人40愛自己：從「依賴」到「獨立」，我學會掌握財務自由', url: 'column/financial-independence.html', excerpt: '…' },
  { date: '2026-10-01', author: 'MIMI', title: '女人40愛自己——從囤積物質，轉向投資體驗的覺醒', url: 'column/experience-over-things.html', excerpt: '…' },
  { date: '2026-10-15', author: 'MIMI', title: '女人40愛自己：Level Up！從「網拍成癮」到「精緻斷捨離」', url: 'column/online-shopping-detox.html', excerpt: '…' },
  { date: '2026-10-29', author: 'MIMI', title: '女人40愛自己：捨棄經營十年的 IG，比起被按讚，我更在乎生活的溫度', url: 'column/quit-instagram.html', excerpt: '…' },
  { date: '2026-11-12', author: 'MIMI', title: '女人40愛自己：關係，也需要斷捨離', url: 'column/relationship-declutter.html', excerpt: '…' },
  { date: '2026-11-26', author: 'MIMI', title: '女人40愛自己：從徬徨無措到與疾病共存', url: 'column/living-with-illness.html', excerpt: '…' },
  { date: '2026-12-10', author: 'MIMI', title: '女人40愛自己：當我的小寶貝生病了', url: 'column/when-my-child-was-sick.html', excerpt: '…' },
  { date: '2026-12-24', author: 'MIMI', title: '女人40愛自己：家庭主婦 VS. 自由工作者', url: 'column/homemaker-vs-freelancer.html', excerpt: '…' }
];
```

`date` 欄位語意是「發布日期」，不是寫作或交稿日期（這點跟 `BLOG_POSTS` 的 `date` 用法一致，但 `BLOG_POSTS` 裡的日期一律是「已發生」，`COLUMN_POSTS` 裡則允許未來日期）。

---

## 排程機制（核心邏輯）

`column.html` 組列表前，先過濾掉尚未到期的文章：

```js
var today = new Date();
today.setHours(0, 0, 0, 0);
var publishedColumnPosts = COLUMN_POSTS.filter(function (post) {
  return new Date(post.date) <= today;
});
```

`publishedColumnPosts` 才是實際拿去排序、分頁、渲染 `<ul class="article-list">` 的資料來源（排序、分頁邏輯完全比照 `blog.html` 既有的 `PAGE_SIZE = 10` 分頁元件）。

**已知限制（已與 Mimi 確認可接受）**：文章頁面本身（`column/*.html`）仍會實際存在於 repo 與部署後的網站上，只是不會出現在列表或搜尋結果。知道直接網址的人理論上能提前看到未上架文章。此設計不做伺服器端權限管控。

---

## 導覽與路徑處理 — `js/script.js`

以下既有邏輯需要延伸支援 `/column/` 目錄（模式完全比照現有 `/blog/` 的處理）：

- `sitePathPrefix()`：`/column/` 目錄下的文章頁也要回傳 `'../'`
- Nav 高亮邏輯：新增 `inColumnDir`，`column.html` 連結在 `column.html` 或 `/column/*.html` 頁面時要加上 `is-active`
- 搜尋頁面判斷（`isBlogPage` 旁）：新增對 `/column/` 的判斷，用來決定搜尋框 placeholder 文案

所有頁面（`index.html`、`about.html`、`apps.html`、`blog.html`、`blog/*.html` 4 篇、`column.html`、`column/*.html` 9 篇）的 `<nav class="site-nav">` 內，在「開發隨筆」連結右邊新增：

```html
<li><a class="site-nav__link" href="column.html" data-page="column.html">專欄文章</a></li>
```

---

## 搜尋整合

全站搜尋（右上角放大鏡）新增 `COLUMN_INDEX`，比照 `BLOG_INDEX` 的建構方式，但**只索引 `publishedColumnPosts`**（同一份日期過濾邏輯），避免搜尋提前洩漏未上架文章標題／摘要。

---

## `column.html` — 專欄列表頁

結構、CSS class、分頁元件完全比照 `blog.html`：`page-hero` + `article-list` + `pagination`。

- 頁面標題：「女人40愛自己」
- 副標文案：說明這是 Mimi 的專欄，記錄 40 歲後在金錢、物質、關係與自我之間重新學會愛自己的過程（實際文案可在 spec review 或實作時微調）
- `<title>`、meta description、og/twitter 標籤比照 `blog.html` 的寫法，改用專欄主題文案

---

## `column/[slug].html` — 獨立文章頁

版型完全比照 `blog/[slug].html`（`.article-page__back` 返回連結指向 `../column.html`、`.article-page__hero`、`.article-page__body`）。與 `[CLAUDE]` 系列的差異：**不使用** `.article-page__sub` 小節粗體標題，純粹是連續 `<p>` 段落（因原稿本身沒有分節）。

---

## 無測試框架例外聲明

本專案為純靜態 HTML/CSS/JS 網站，無測試框架。驗證方式為目視 + 手動調整系統日期測試日期過濾邏輯：

- `column.html` 只顯示 `date <= 今天` 的文章，未到期文章不出現在清單、分頁、搜尋
- 每篇文章頁導覽列、返回連結、內文段落正常顯示
- 手機版（375px）排版無橫向捲軸
- 全站搜尋能找到已上架的專欄文章，找不到未上架的

---

## 成功標準

- [ ] `column.html` 新增，列表邏輯與分頁比照 `blog.html`
- [ ] 9 篇 `column/*.html` 文章頁建立完成，內容來自原稿 docx，不增刪原意
- [ ] `COLUMN_POSTS` 9 筆資料，日期依 2026-09-03 起每 14 天遞增
- [ ] 日期過濾邏輯正確：未到期文章不會出現在列表、分頁、搜尋
- [ ] 所有頁面導覽列新增「專欄文章」連結，含 `/column/` 目錄下的相對路徑正確
- [ ] 搜尋功能可搜到已上架的專欄文章
- [ ] 手機版排版正常

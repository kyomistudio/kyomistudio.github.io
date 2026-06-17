# Blog 自動發文設計文件

**日期：** 2026-06-17
**作者：** Mimi / KYOMI STUDIO
**狀態：** 已審閱，待實作

---

## 目標

每兩週自動在 `blog.html` 的「Mimi 的文章」區塊發布一篇新文章，記錄 Mimi 從科技小白到能獨立用 Claude 開發 APP 的真實歷程。

---

## 架構

### 新增檔案

```
kyomistudio.github.io/
├── blog.html                        ← 文章插入此處（既有）
├── blog-series.md                   ← 新增：系列主題清單
└── blog-series-state.json           ← 新增：發布進度追蹤
```

### 執行流程（每兩週觸發一次）

```
遠端排程代理啟動
→ 讀取 blog-series-state.json（確認下一篇 index）
→ 讀取 blog-series.md（取得該篇主題與核心內容）
→ 生成完整文章 HTML（Mimi 口吻、符合現有 blog.html 風格）
→ 插入 blog.html「Mimi 的文章」區塊最上方
→ 更新 blog-series-state.json（last_published_index +1）
→ git commit + git push（使用 GitHub PAT）
```

---

## 檔案規格

### `blog-series.md`

記錄完整系列主題，每篇一個區塊：

```markdown
# 從零到一：一個科技小白和 Claude 的故事

## 第 1 篇
標題：在遇見 Claude 之前，我以為寫程式是另一個世界的事
核心：自我介紹、為什麼想做 APP、對工程的恐懼

## 第 2 篇
標題：第一次對話：我問了一個很蠢的問題
核心：第一次開口問 Claude、打破心理障礙的瞬間

## 第 3 篇
標題：Claude 說「好」，但我看不懂它給我的東西
核心：拿到程式碼卻不知道怎麼用，摸索複製貼上

## 第 4 篇
標題：第一個 bug：它說沒問題，可是畫面是空的
核心：遇到第一個錯誤、學會描述問題給 Claude

## 第 5 篇
標題：我把第一版做成網頁版，然後全部重來
核心：SPARK WEAR 第一次失敗的故事

## 第 6 篇
標題：學會問「為什麼」，而不只是「怎麼做」
核心：從只要答案，到開始理解邏輯的轉折點

## 第 7 篇
標題：SPARK WEAR 真的上線了，我截了好多張圖
核心：第一個 APP 完成的心情、迫不及待分享的興奮感

## 第 8 篇
標題：做第二個 APP 的感覺，完全不一樣了
核心：進入 SPARK SHAPE，發現自己真的有在進步

## 第 9 篇
標題：Claude 也會出錯，而我開始能判斷它對不對
核心：成長的標誌：從完全依賴到有能力驗證

## 第 10 篇
標題：我不再是科技小白了嗎？
核心：回顧整段旅程，給同樣在摸索的人說的話
```

### `blog-series-state.json`

```json
{
  "last_published_index": 0,
  "series_total": 10
}
```

`last_published_index: 0` 代表尚未發布任何一篇。每次發布後 +1。

---

## 文章生成規格

### 風格要求

- **語言**：繁體中文
- **口吻**：Mimi 的第一人稱，溫暖、真實、有自我揭露，偶爾帶點幽默
- **參考文章**：`blog.html` 中已發布的《SPARK WEAR：從失控購物狂到衣櫃的主理人》
- **篇幅**：400–600 字，分 2–4 個小節，每個小節有粗體標題
- **HTML 結構**：符合現有 `.article-item` 格式（含 preview、body、sub 小節）

### 插入位置

插入到 `blog.html` 中 `<!-- Mimi 的文章 -->` 區塊內，緊接在 `<ul class="article-list" role="list">` 標籤之後（最新文章置頂）。

---

## 排程規格

- **頻率**：每兩週，週一早上 9:00（台灣時間 UTC+8）
- **執行環境**：Claude Code 遠端排程代理（雲端執行，不依賴本機開機狀態）
- **Git 推送**：使用 GitHub Personal Access Token（PAT），設定為環境變數 `GITHUB_TOKEN`

---

## GitHub PAT 設定方式（一次性）

1. 前往 GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. 建立新 token，選擇 repo `kyomistudio/kyomistudio.github.io`，給予 **Contents: Read and Write** 權限
3. 複製 token，在 Claude Code 設定中加入環境變數 `GITHUB_TOKEN=ghp_xxxxx`

---

## 系列結束後

第 10 篇發布後，`last_published_index` 將等於 `series_total`。排程代理在此狀態下不發文，改為通知 Mimi 系列已完成，詢問是否要繼續規劃下一個系列。

---

## 成功標準

- [ ] 每兩週 blog.html 自動新增一篇 Mimi 的文章
- [ ] 文章風格與已發布文章一致
- [ ] 新文章永遠出現在「Mimi 的文章」區塊最上方
- [ ] git commit message 清楚標示是哪一篇（例如：`Add blog post: 從零到一 第3篇`）
- [ ] 第 10 篇完成後排程停止並通知

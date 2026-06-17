# Blog 自動發文 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 每兩週自動在 blog.html 的「Mimi 的文章」區塊發布一篇新文章，記錄 Mimi 從科技小白學習 Claude 的歷程。

**Architecture:** 兩個靜態設定檔（`blog-series.md` 主題清單、`blog-series-state.json` 進度追蹤）搭配 Claude Code 遠端排程代理。排程每週一觸發，但內建日期檢查，確保每 14 天才真正發文一次。代理直接讀寫 HTML 檔案並 git push。

**Tech Stack:** 純靜態 HTML/CSS/JS、GitHub Pages、Claude Code Remote Scheduler（CronCreate）、gh CLI（GitHub 認證）

---

## 注意：無測試框架例外聲明

本計畫為靜態 HTML 網站，無任何測試框架。所有驗證方式為：執行排程後目視確認 blog.html 新增了正確的 `<li class="article-item">` 結構，以及 git log 顯示正確的 commit message。

---

## 檔案對照

| 檔案 | 操作 | 說明 |
|------|------|------|
| `blog-series.md` | 新建 | 10 篇文章主題清單，排程代理讀取 |
| `blog-series-state.json` | 新建 | 進度追蹤，記錄已發布篇數與上次發布日期 |
| `blog.html` | 由排程代理修改 | 新文章插入「Mimi 的文章」區塊 |

---

## Task 1：建立 `blog-series.md`

**Files:**
- Create: `blog-series.md`

- [ ] **Step 1：建立檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/blog-series.md`，內容如下：

```markdown
# 從零到一：一個科技小白和 Claude 的故事

這個系列由 Mimi 執筆，記錄她從完全不懂 AI 工具，到能獨立用 Claude 開發 APP 的真實歷程。

---

## 第 1 篇
標題：在遇見 Claude 之前，我以為寫程式是另一個世界的事
核心：自我介紹、為什麼想做 APP、對工程的恐懼與距離感
風格提示：溫柔回顧、帶點自嘲，結尾埋下「後來有個東西改變了我」的伏筆

## 第 2 篇
標題：第一次對話：我問了一個很蠢的問題
核心：第一次開口問 Claude、打破心理障礙的瞬間、那個問題有多蠢但 Claude 還是回答了
風格提示：帶點幽默，真實描述當時的緊張與猶豫

## 第 3 篇
標題：Claude 說「好」，但我看不懂它給我的東西
核心：拿到一大段程式碼卻不知道怎麼用，摸索複製貼上的過程
風格提示：描述手足無措的感覺，以及「就算看不懂也先試試看」的心態

## 第 4 篇
標題：第一個 bug：它說沒問題，可是畫面是空的
核心：遇到第一個錯誤、學會描述問題給 Claude，發現「問對問題」比「得到答案」更重要
風格提示：挫折感真實，但結尾帶點「原來如此」的收穫感

## 第 5 篇
標題：我把第一版做成網頁版，然後全部重來
核心：SPARK WEAR 第一次失敗的故事，不慎做成網頁版、手機體驗很差、決定重寫
風格提示：不迴避失敗，反而聊失敗帶來的清醒

## 第 6 篇
標題：學會問「為什麼」，而不只是「怎麼做」
核心：從只要答案，到開始理解邏輯的轉折點，第一次真正讀懂一段程式碼
風格提示：知識覺醒的小高潮，帶點驚喜

## 第 7 篇
標題：SPARK WEAR 真的上線了，我截了好多張圖
核心：第一個 APP 完成的心情、迫不及待截圖分享的興奮感、想讓更多人用看看
風格提示：雀躍、驕傲但帶點不敢置信，描述截圖的那個瞬間

## 第 8 篇
標題：做第二個 APP 的感覺，完全不一樣了
核心：進入 SPARK SHAPE，發現自己真的有在進步，問問題更精準、debug 更快
風格提示：和第一次對比，成長是可以被感受到的

## 第 9 篇
標題：Claude 也會出錯，而我開始能判斷它對不對
核心：成長的標誌——從完全依賴到有能力驗證 Claude 的輸出，發現錯誤的那個瞬間
風格提示：帶點成就感，「我已經不是那個什麼都信的新手了」

## 第 10 篇
標題：我不再是科技小白了嗎？
核心：回顧整段旅程，給同樣在摸索的人說的話，不是鼓勵文，而是真實的陪伴
風格提示：不要過度勵志，保持 Mimi 一貫的真實與溫暖
```

- [ ] **Step 2：確認檔案存在**

```bash
ls -la /Users/mimi/Documents/kyomistudio.github.io/blog-series.md
```

預期輸出：顯示檔案大小 > 0

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add blog-series.md
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add blog series topic list (10 articles, 從零到一)"
```

---

## Task 2：建立 `blog-series-state.json`

**Files:**
- Create: `blog-series-state.json`

- [ ] **Step 1：建立狀態檔案**

建立 `/Users/mimi/Documents/kyomistudio.github.io/blog-series-state.json`，內容如下：

```json
{
  "last_published_index": 0,
  "series_total": 10,
  "last_published_date": null
}
```

說明：
- `last_published_index: 0` = 尚未發布任何一篇（1-based：發布第 1 篇後變成 1）
- `last_published_date: null` = 從未發布過，排程第一次執行時會直接發文

- [ ] **Step 2：確認 JSON 有效**

```bash
cat /Users/mimi/Documents/kyomistudio.github.io/blog-series-state.json | python3 -m json.tool
```

預期輸出：格式化後的 JSON，無錯誤

- [ ] **Step 3：Commit**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add blog-series-state.json
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add blog series state tracker (index 0, not yet published)"
```

---

## Task 3：設定 Claude Code 排程

**Files:**
- No files created (schedule is stored in Claude Code's remote scheduler)

排程每週一 9:00 AM 台灣時間（01:00 UTC）觸發。Prompt 內建日期檢查，若距離上次發文未滿 13 天則跳過，確保實際每 14 天發文一次。

- [ ] **Step 1：使用 `/schedule` 建立排程**

在 Claude Code 輸入框執行：

```
/schedule
```

當 schedule 技能詢問時，填入以下資訊：

**排程名稱（name）：** `kyomi-blog-auto-publish`

**Cron 表達式：** `0 1 * * 1`
（每週一 01:00 UTC = 台灣時間 09:00）

**Prompt（完整複製以下內容）：**

---

```
你是 KYOMI STUDIO 的自動發文代理。每次執行時，請依照以下步驟運作。

## 工作目錄
/Users/mimi/Documents/kyomistudio.github.io

## 步驟 1：讀取狀態
讀取 `blog-series-state.json`，取得：
- `last_published_index`：已發布篇數
- `series_total`：系列總篇數
- `last_published_date`：上次發布日期（ISO 8601 格式，或 null）

## 步驟 2：檢查是否需要發文

條件 A（系列已完成）：若 `last_published_index >= series_total`，停止並輸出：
「系列文章已全部發布完畢（共 10 篇）。請告知 Mimi 是否要規劃下一個系列。」

條件 B（距上次發文不足 14 天）：若 `last_published_date` 不是 null，且今日距離 `last_published_date` 少於 14 天，停止並輸出：
「距離上次發文（{last_published_date}）未滿 14 天，本次跳過。」

若兩個條件都不符合，繼續執行步驟 3。

## 步驟 3：取得下一篇主題
讀取 `blog-series.md`，找到「第 {last_published_index + 1} 篇」區塊，取得：
- 標題
- 核心（文章主軸）
- 風格提示

## 步驟 4：生成文章內容

以 **Mimi 的第一人稱**撰寫這篇文章。風格參考：blog.html 中已發布的《SPARK WEAR：從失控購物狂到衣櫃的主理人》。

**格式要求：**
- 語言：繁體中文
- 字數：400–600 字
- 結構：2–4 個小節，每節有一行粗體小標題
- 口吻：溫暖、真實、有自我揭露，偶爾帶點幽默

**HTML 結構（嚴格按照此格式）：**

```html
        <li class="article-item">
          <h3 class="article-item__title">{標題}</h3>
          <p class="article-item__preview">{60–80 字的開頭摘要，不重複正文，吸引人繼續閱讀}</p>
          <button class="article-item__more" aria-expanded="false">繼續閱讀</button>
          <div class="article-item__body" aria-hidden="true">
            <div class="article-item__content">
              <p class="article-item__sub"><strong>{第一節標題}</strong></p>
              <p>{第一節內文（1–3 段）}</p>
              <p class="article-item__sub"><strong>{第二節標題}</strong></p>
              <p>{第二節內文}</p>
              {如有更多小節，繼續以相同格式加入}
            </div>
          </div>
        </li>
```

## 步驟 5：插入 blog.html

在 blog.html 的「<!-- Mimi 的文章 -->」區塊內，找到：
```
      <ul class="article-list" role="list">
```
（這是第二個 `<ul class="article-list">`，在 Mimi 的文章區塊裡）

將步驟 4 生成的 `<li>` 插入到這個 `<ul>` 標籤的下一行（最新文章置頂）。

## 步驟 6：更新 blog-series-state.json

將 `last_published_index` 加 1，`last_published_date` 設為今天的 ISO 8601 日期（YYYY-MM-DD）。

## 步驟 7：Commit 並推送

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io add blog.html blog-series-state.json
git -C /Users/mimi/Documents/kyomistudio.github.io commit -m "Add blog post: 從零到一 第{N}篇 — {標題}"
git -C /Users/mimi/Documents/kyomistudio.github.io push
```

## 完成後輸出

「✅ 已成功發布《從零到一》第 {N} 篇：{標題}
下次發文時間：{today + 14 天}」
```

---

- [ ] **Step 2：確認排程已建立**

在 Claude Code 輸入框執行：

```
/schedule list
```

預期看到 `kyomi-blog-auto-publish` 出現在清單中，cron 為 `0 1 * * 1`。

- [ ] **Step 3：手動觸發一次測試**

在 Claude Code 輸入框執行：

```
/schedule run kyomi-blog-auto-publish
```

預期行為：
1. 代理讀取 `blog-series-state.json`（`last_published_index: 0`，`last_published_date: null`）
2. 判斷需要發文（第 1 篇）
3. 讀取 `blog-series.md` 第 1 篇主題
4. 生成文章並插入 `blog.html`
5. 更新 `blog-series-state.json`（`last_published_index: 1`，`last_published_date: 今天`）
6. git commit + push 成功

- [ ] **Step 4：驗證結果**

```bash
git -C /Users/mimi/Documents/kyomistudio.github.io log --oneline -3
```

預期看到最新 commit 包含「Add blog post: 從零到一 第1篇」

```bash
cat /Users/mimi/Documents/kyomistudio.github.io/blog-series-state.json
```

預期：
```json
{
  "last_published_index": 1,
  "series_total": 10,
  "last_published_date": "2026-06-17"
}
```

用瀏覽器開啟 `blog.html`，確認「Mimi 的文章」區塊最上方出現新文章，點「繼續閱讀」可展開內文。

---

## 成功標準驗收

- [ ] `blog-series.md` 存在，包含 10 篇主題
- [ ] `blog-series-state.json` 格式正確
- [ ] 排程 `kyomi-blog-auto-publish` 出現在 schedule list
- [ ] 手動觸發後 blog.html 新增第 1 篇文章
- [ ] 新文章置頂（在現有文章上方）
- [ ] git log 顯示正確的 commit message
- [ ] 14 天後再次觸發時正確發布第 2 篇

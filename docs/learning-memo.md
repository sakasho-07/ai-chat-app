# 実案件課題⑦｜AI Chat App 学習メモ

## 1. 学習の目的

Next.js・React・TypeScript・Gemini APIを使ったAIチャットアプリについて、コードの実行順序と各ファイルの役割を理解する。

最終的には、AIに頼らずにアプリの基本的な仕組みを説明できるようになることを目指す。

## 2. 作成したアプリ

**アプリ名：** AI Chat App

**公開URL：** https://ai-chat-app-mu-eight.vercel.app/

**GitHub：** https://github.com/sakasho-07/ai-chat-app

### 主な機能


### 主な機能

- Gemini APIによるAIチャット
- Gemini・Claudeの切り替え（環境変数で設定）
  - ※ Claudeの実際の回答生成は未確認
- AIの回答をストリーミング表示
- 会話履歴の保持（AIに送る履歴は最新10件）
- Enter送信・Shift + Enter改行
- HTTP 400・429・500に応じたエラー表示
- エラー発生後の再送信
- 入力文字数の制限（最大1,000文字）
- 入力文字数カウンター
- チャットの自動スクロール
- AIの回答を途中で停止する機能
- Vitestによる自動テスト（6件）


## 3. アプリの基本構成


## 3. アプリの基本構成

| ファイル | 役割 |
|---|---|
| `app/page.tsx` | チャット画面・入力・送信・エラー表示・自動スクロール・停止ボタンを管理する |
| `app/api/chat/route.ts` | メッセージを受け取り、AI APIと通信する |
| `app/lib/validate.ts` | 文字数チェックと会話履歴10件制限の処理をまとめる |
| `app/lib/validate.test.ts` | Vitestで文字数と会話履歴の処理を自動テストする |
| `app/layout.tsx` | 共通レイアウト・ページタイトル・言語設定を管理する |
| `app/globals.css` | デザインやスタイルを設定する |
| `.env.local` | ローカル環境のAPIキーやAIサービスの設定を管理する |
| `.env.example` | 必要な環境変数の設定例を共有する |
| `.gitignore` | APIキーなど、Gitで管理しないファイルを指定する |
| `package.json` | 使用するパッケージや実行コマンドを管理する |


## 4. 復習チェックリスト

- [✅] ① アプリ全体の実行の流れ
**学んだこと：**

Next.jsのApp Routerでは、フォルダと`page.tsx`の配置によってURLに対応する画面が決まる。

今回のAIチャットアプリでは、URLのトップページ`/`にアクセスすると、`app/page.tsx`で定義された画面が表示される。

`app/layout.tsx`は共通レイアウトを担当する。

**重要なポイント：**

- `app/page.tsx`：トップページの画面
- `app/layout.tsx`：共通レイアウト
- `app/api/chat/route.ts`：AIとの通信処理
- `.env.local`：ローカル環境変数の設定

**自分の言葉で説明：**

ブラウザでURLにアクセスすると、Next.jsがURLに対応するページを判断する。トップページの場合は`app/page.tsx`が使われ、共通レイアウトと組み合わせて画面が表示される。

**理解度：** 理解できた

**疑問点：** なし（現時点）


- [ ] ② `app/page.tsx`の役割
- [ ] ③ React・`useChat`の仕組み
- [ ] ④ `app/api/chat/route.ts`の役割
- [ ] ⑤ Gemini APIとストリーミング
- [ ] ⑥ APIキーとセキュリティ対策
- [ ] ⑦ GitHubとVercelの仕組み



## 5. 復習記録｜改善前・改善後の比較

### テーマ①：HTTPエラー処理の改善

#### 1. 改善前
エラーを検知できたが、HTTPステータスごとの原因を区別できなかった。

```tsx
const { error } = useChat();
```

#### 2. 問題点
エラーの原因が分かりにくく、エラー後の再送信にも問題があった。

#### 3. 改善後
HTTPステータスを取得し、400・429・500に応じたメッセージを表示。エラー後も再送信できるようにした。

```tsx
if (!response.ok) {
  setErrorStatus(response.status);
}

clearError();
```

#### 4. 学んだこと
- `response.status`：HTTPステータスコードを取得
- `setErrorStatus()`：エラー番号をstateに保存
- `clearError()`：`useChat`のエラー情報をクリア

**理解度：** 要復習

---

### テーマ②：Gemini・Claudeの切り替え

#### 1. 改善前
Geminiのみ使用でき、AIモデルがコード内に固定されていた。

```ts
model: google("gemini-3-flash-preview")
```

#### 2. 問題点
AIサービスを変更するたびにコードの修正が必要だった。

#### 3. 改善後
`.env.local`の`AI_PROVIDER`でAIサービスを選択できるようにした。

```ts
const provider = process.env.AI_PROVIDER ?? "google";

model: provider === "anthropic"
  ? anthropic("claude-haiku-4-5")
  : google("gemini-3-flash-preview")
```

#### 4. 学んだこと
- `process.env`：環境変数を取得
- `??`：左側が`null`か`undefined`なら右側を使う
- `? :`：条件によって値を切り替える

**動作確認：** Geminiは確認済み。Claudeは未確認。

**理解度：** 要復習

---

### テーマ③：APIキーと環境変数の管理

#### 1. 改善前
APIキーを`.env.local`で管理していたが、設定例のファイルがなかった。

#### 2. 問題点
他の開発者が、必要な環境変数を把握しにくかった。

#### 3. 改善後
`.env.example`を作成し、必要な環境変数を明示した。

```env
AI_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=
ANTHROPIC_API_KEY=
```

`.gitignore`には以下を設定。

```gitignore
.env*
!.env.example
```

APIキーが未設定の場合はHTTP 500を返す処理も追加した。

#### 4. 学んだこと
- `.env.local`：実際のAPIキーを保存
- `.env.example`：設定例を共有
- `.gitignore`：秘密情報をGitの管理対象から除外

**理解度：** 要復習

---

### テーマ④：Vitestによる自動テスト

#### 1. 改善前
文字数制限や会話履歴の処理を、主に手動で確認していた。

#### 2. 問題点
コード変更後に、既存機能が正常に動くか確認する手間がかかった。

#### 3. 改善後
チェック処理を`app/lib/validate.ts`に分離し、Vitestで6件のテストを追加した。

```ts
export function isValidMessageLength(text: string): boolean {
  return text.length <= 1000;
}

export function getRecentMessages<T>(messages: T[]): T[] {
  return messages.slice(-10);
}
```

テスト実行：

```bash
npx vitest run
```

**結果：6件すべて成功**

#### 4. 学んだこと
- `Vitest`：コードの動作を自動で確認
- `test()`：テストケースを定義
- `expect()`：実際の結果が期待どおりか確認
- `.slice(-10)`：配列の末尾10件を取得

**理解度：** 要復習

---

### テーマ⑤：チャットの自動スクロール

#### 1. 改善前
AIの回答が長くなると、画面を手動で下にスクロールする必要があった。

#### 2. 問題点
新しいメッセージが画面外に表示され、読みにくかった。

#### 3. 改善後
`useRef`と`useEffect`を使い、新しいメッセージに合わせて自動スクロールするようにした。

```tsx
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, status]);
```

#### 4. 学んだこと
- `useRef`：画面上の要素を参照
- `useEffect`：指定した値が変化した後に処理を実行
- `scrollIntoView()`：対象の要素が見える位置までスクロール

**理解度：** 要復習

---

### テーマ⑥：AIの回答停止機能

#### 1. 改善前
AIが回答を生成している途中で、ユーザーが処理を停止できなかった。

#### 2. 問題点
回答が長い場合でも、生成が終わるまで待つ必要があった。

#### 3. 改善後
`useChat`の`stop()`を利用し、回答生成中は「停止」ボタンを表示するようにした。

```tsx
const { status, stop } = useChat({
  // 設定
});
```

```tsx
{status === "submitted" || status === "streaming" ? (
  <button onClick={() => stop()}>
    停止
  </button>
) : (
  <button onClick={handleSend}>
    送信
  </button>
)}
```

#### 4. 学んだこと
- `status`：AIの処理状況を確認
- `submitted`：送信後、応答開始を待っている状態
- `streaming`：回答を受信している状態
- `stop()`：進行中の回答生成を停止する

**理解度：** 要復習



## 6. 最終確認

以下の質問に自分の言葉で回答できることを目標とする。

1. URLにアクセスすると、どのファイルが使われる？
2. ユーザーがメッセージを送信すると、どんな処理が始まる？
3. `page.tsx`と`route.ts`の違いは？
4. `useChat`は何を管理している？
5. `streamText`は何をしている？
6. なぜAPIキーを`.env.local`に保存する？
7. なぜGitHubにプッシュするとVercelのアプリが更新される？
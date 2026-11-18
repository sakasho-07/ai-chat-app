# AI Chat App

Next.js・TypeScript・Vercel AI SDKを使用して制作したAIチャットアプリです。

Gemini APIによるAIチャットを実装し、環境変数によるClaudeへの切り替えにも対応しました。

AIの回答をストリーミング形式で表示します。

## 1. 実装した機能

- Gemini APIによるAIチャット
- Gemini・Claudeの切り替え（環境変数）
- AI回答のストリーミング表示
- 同一セッション内での会話履歴の保持
- Enter送信・Shift + Enter改行
- 日本語入力中の誤送信防止
- AI応答中の状態表示
- HTTP 400・429・500に応じたエラー表示
- エラー発生後の再送信
- 入力文字数制限（最大1,000文字）とカウンター
- AIに送信する会話履歴を直近10件に制限
- 新しいメッセージへの自動スクロール
- AI回答の途中停止
- Vitestによる自動テスト（6件）

## 2. 使用技術

| 技術 | 用途 |
|---|---|
| Next.js（App Router） | Webアプリケーションの構築 |
| React | チャット画面と状態管理 |
| TypeScript | 型を使った開発 |
| Tailwind CSS | UIデザイン |
| Vercel AI SDK | AIとの通信・ストリーミング |
| Google Gemini API | AIによる回答生成 |
| Anthropic Claude API | 切り替え先のAIサービス |
| Vitest | 自動テスト |
| Git / GitHub | ソースコードの管理 |
| Vercel | Webアプリの公開 |

使用モデル：

- Gemini：`gemini-3-flash-preview`
- Claude：`claude-haiku-4-5`

※ Claudeの回答生成は未確認です。

## 3. アプリの処理の流れ

1. ユーザーがチャット画面にメッセージを入力する
2. `app/page.tsx`で入力内容を受け取り、送信する
3. `/api/chat`にPOSTリクエストを送る
4. `app/api/chat/route.ts`でリクエストを受け取る
5. 文字数を確認し、会話履歴を直近10件に制限する
6. 環境変数に応じてGeminiまたはClaudeのモデルを選択する
7. AIが回答を生成し、ストリーミング形式で画面に表示する

### 主なファイル

| ファイル | 役割 |
|---|---|
| `app/page.tsx` | チャット画面・入力・送信・エラー表示 |
| `app/api/chat/route.ts` | AI APIとの通信・ストリーミング |
| `app/lib/validate.ts` | 文字数と会話履歴のチェック |
| `app/lib/validate.test.ts` | Vitestによる自動テスト |
| `app/layout.tsx` | 共通レイアウト・メタデータ |
| `app/globals.css` | アプリ全体のスタイル |
| `.env.local` | APIキーとAIサービスの設定 |
| `.env.example` | 環境変数の設定例 |
| `.gitignore` | Gitの管理対象外ファイルを指定 |

## 4. API利用・セキュリティ対策

### APIキーの管理

APIキーは環境変数で管理しています。

- `GOOGLE_GENERATIVE_AI_API_KEY`
- `ANTHROPIC_API_KEY`
- `AI_PROVIDER`

ローカルでは`.env.local`を使用し、VercelではEnvironment Variablesに設定します。

`.env.local`はGit管理対象外とし、`.env.example`のみ共有します。

APIキーが未設定の場合はHTTP 500を返します。

### 入力・履歴の制限

- 最新のユーザーメッセージは1,000文字以内
- AIへ送信する会話履歴は直近10件

### Vercel Firewall

`/api/chat`に対して、IPアドレス単位のレート制限を設定しています。

- 対象：`/api/chat`
- 時間：60秒
- 回数：5リクエスト
- 制限超過時：HTTP 429

※ APIの過剰利用を抑える対策であり、利用料金の上限を完全に保証するものではありません。

## 5. 動作確認

- [x] Gemini APIから回答を取得
- [x] ストリーミング表示
- [x] 会話履歴を利用した回答
- [x] Enter送信・Shift + Enter改行
- [x] 日本語入力中の誤送信防止
- [x] HTTPエラー表示（429を開発環境で再現）
- [x] エラー後の再送信
- [x] 1,000文字制限・カウンター
- [x] 自動スクロール
- [x] AI回答の途中停止
- [x] Vitestによる6件のテスト成功
- [x] `npm run build`成功（改善作業途中で確認）
- [ ] Claude APIによる回答生成
- [ ] 改善後の最終ビルド確認
- [ ] 改善後のGitHubへのプッシュ
- [ ] 改善後のVercelデプロイ確認

※ 直近10件の制限はVitestで検証済みです。Firewallの制限超過動作は未検証です。

## 6. ローカルでの起動方法

### ① 依存パッケージのインストール

```bash
npm install
```

### ② 環境変数の設定

`.env.example`を参考に、プロジェクト直下へ`.env.local`を作成します。

Geminiを使用する場合：

```env
AI_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

Claudeを使用する場合：

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_api_key
```

※ APIキーをGitHubに公開しないでください。

### ③ 開発サーバーの起動

```bash
npm run dev
```

ブラウザで`http://localhost:3000`を開きます。

### ④ 自動テスト

```bash
npx vitest run
```

### ⑤ 本番ビルド確認

```bash
npm run build
```

## 7. 公開URL

**GitHub**

https://github.com/sakasho-07/ai-chat-app

**Vercel**

https://ai-chat-app-mu-eight.vercel.app/

※ 改善後の変更は、GitHubへのプッシュとVercelへの再デプロイ後に反映されます。

## 8. 今回の学習ポイント

- Reactの`useChat`によるチャット状態管理
- `page.tsx`と`route.ts`の役割の違い
- POSTリクエストによるフロントエンドとサーバーの通信
- `streamText`によるストリーミング処理
- HTTPステータスに応じたエラー処理
- 環境変数によるAIモデルの切り替え
- APIキーの安全な管理
- Vitestによる自動テスト
- `useRef`・`useEffect`による自動スクロール
- `stop()`によるAI回答の停止
- GitHubとVercelを利用したアプリの公開

詳しい改善前・改善後の比較は`docs/learning-memo.md`に記録しています。

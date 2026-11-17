# AI Chat App

Next.js・TypeScript・Google Gemini APIを使用して制作した、AIチャットアプリです。

ユーザーが入力したメッセージをGemini APIに送信し、AIの回答をストリーミング形式で表示します。

## 1. 実装した機能

- Gemini APIを利用したAIチャット
- AIの回答を少しずつ表示するストリーミング機能
- 同一セッション内での会話履歴の保持
- Enterキーで送信、Shift + Enterで改行
- 日本語入力中の誤送信防止
- AI応答中の状態表示
- API通信エラー時のエラーメッセージ表示
- 最新のユーザーメッセージの1,000文字制限
- Gemini APIへ送信する会話履歴を直近10件に制限

## 2. 使用技術

| 技術 | 用途 |
|---|---|
| Next.js（App Router） | Webアプリケーションの構築 |
| React | チャット画面と状態管理 |
| TypeScript | 型を使った開発 |
| Tailwind CSS | UIデザイン |
| Vercel AI SDK | AIとの通信・ストリーミング |
| Google Gemini API | AIによる回答生成 |
| Git / GitHub | ソースコードの管理 |
| Vercel | Webアプリの公開 |

使用モデル：`gemini-3-flash-preview`

## 3. アプリの処理の流れ

1. ユーザーがチャット画面にメッセージを入力する
2. `app/page.tsx`で入力内容を受け取り、送信する
3. `/api/chat`にPOSTリクエストを送る
4. `app/api/chat/route.ts`でリクエストを受け取る
5. 入力文字数を確認し、直近10件の会話履歴をGemini APIへ送信する
6. Gemini APIが回答を生成する
7. ストリーミング形式で回答を画面に表示する

### 主なファイル

| ファイル | 役割 |
|---|---|
| `app/page.tsx` | チャット画面、入力、送信、回答表示 |
| `app/api/chat/route.ts` | Gemini APIとの通信、ストリーミング処理 |
| `app/globals.css` | アプリ全体のスタイル |
| `.env.local` | ローカル開発用のAPIキー管理（Git管理対象外） |

## 4. API利用・セキュリティ対策

### APIキーの管理

Gemini APIキーは環境変数`GOOGLE_GENERATIVE_AI_API_KEY`で管理しています。

ローカルでは`.env.local`を使用し、VercelではEnvironment Variablesに設定しています。

APIキーはソースコードに直接記載せず、GitHubにも公開していません。

### 入力・履歴の制限

- 最新のユーザーメッセージは1,000文字以内
- Gemini APIへ送信する会話履歴は直近10件

### Vercel Firewall

`/api/chat`に対して、IPアドレス単位のレート制限を設定しています。

- 対象：`/api/chat`
- 時間：60秒
- 回数：5リクエスト
- 制限超過時：HTTP 429

※これらはAPIの過剰利用を抑える対策であり、利用料金の上限を完全に保証するものではありません。

## 5. 動作確認

- [x] Gemini APIから回答を取得
- [x] ストリーミング表示
- [x] 会話履歴を利用した回答
- [x] Enter送信・Shift + Enter改行
- [x] 日本語入力中の誤送信防止
- [x] APIエラー時の画面表示
- [x] ローカルでの1,000文字制限の確認
- [x] `npm run build`成功
- [x] GitHubへのプッシュ
- [x] Vercelへのデプロイ
- [x] 本番環境でのAI応答

※直近10件の履歴制限とFirewallの制限超過動作については、個別の動作検証が未完了です。

## 6. ローカルでの起動方法

### 依存パッケージのインストール

```bash
npm install
```

### 環境変数の設定

プロジェクト直下に`.env.local`を作成し、以下を設定します。

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで`http://localhost:3000`を開きます。

## 7. 公開URL

**GitHub**
https://github.com/sakasho-07/ai-chat-app

**Vercel**
https://ai-chat-app-mu-eight.vercel.app/


## 8. 今回の学習ポイント

- Reactの`useChat`によるチャット状態の管理
- `app/page.tsx`と`app/api/chat/route.ts`の役割の違い
- POSTリクエストを利用したフロントエンドとサーバーの通信
- `streamText`によるストリーミング処理
- APIキーを環境変数で管理する理由
- API利用制限とセキュリティ対策の重要性
- GitHubとVercelを利用したアプリの公開
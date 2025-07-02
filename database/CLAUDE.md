# Claude Code Configuration

このファイルは、このリポジトリの中で開発をする際に Claude Code (claude.ai/code) を使う際のガイダンスを提供するものです。

## プロジェクトについて

### プロジェクト(リポジトリ)概要

レンタル自転車管理システムを作りたいです。
画面としてはユーザー側がみる下記の画面があります。
- ログイン画面
- レンタルをするか(Yes/No)画面
- レンタルが 完了しましたの画面

### 機能要件について

- ログイン機能
- レンタルをする際に自転車のステータスを管理する機能
- レンタル履歴を表示する機能
- 自転車の空き状況確認機能
- ユーザー登録・アカウント管理機能
- レンタル料金計算機能

## アーキテクチャ

### 技術スタック

- フロントエンド：react
- データベース：sqlite
- バックエンド：Node.js with Express
- バッチ処理：Node.js (自転車ステータス更新、料金計算)

### プロジェクト構造

```
rental-cycle/
├── frontend/          # React フロントエンド
│   ├── src/
│   │   ├── components/  # UI コンポーネント
│   │   ├── pages/      # ページコンポーネント
│   │   ├── services/   # API コール
│   │   └── utils/      # ユーティリティ
│   └── public/
├── backend/           # Node.js バックエンド
│   ├── src/
│   │   ├── controllers/ # コントローラー
│   │   ├── models/     # データモデル
│   │   ├── routes/     # ルーティング
│   │   ├── middleware/ # ミドルウェア
│   │   └── services/   # ビジネスロジック
│   └── migrations/    # データベースマイグレーション
├── database/          # データベース関連
└── docs/             # ドキュメント
```

### データベース設計

#### テーブル設計

**users** - ユーザー情報
- id (PRIMARY KEY)
- username (UNIQUE)
- password_hash
- email
- created_at
- updated_at

**bicycles** - 自転車情報
- id (PRIMARY KEY)
- model_name
- status (available/rented/maintenance)
- location
- created_at
- updated_at

**rentals** - レンタル履歴
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- bicycle_id (FOREIGN KEY)
- rental_start_time
- rental_end_time
- total_cost
- status (active/completed/cancelled)
- created_at
- updated_at

## Development Commands

### 開発コマンド

#### フロントエンド (React)
```bash
cd frontend
npm install
npm start          # 開発サーバー起動
npm run build      # プロダクションビルド
npm test           # テスト実行
npm run lint       # リント実行
```

#### バックエンド (Node.js)
```bash
cd backend
npm install
npm run dev        # 開発サーバー起動 (nodemon)
npm start          # プロダクションサーバー起動
npm test           # テスト実行
npm run migrate    # データベースマイグレーション
```

## ルール

### 修正機能追加作業の終了時に必ず実施すること。必ず毎回全てtodoに含めてください。

- 以下を必ず作業終了時に実行してください。
  1. 作業内容をコミット
  2. リモートブランチにpush (`git push -u origin <ブランチ名>`)

### コミット前に確認すること（必ず実施）

- コミット前には必ず動作確認を行って動作が問題ないかを確認してください
  - 動作確認中にエラーが発見された際はタスクを更新してください
  - コミットする際はエラーがない状態で行ってください

### 進捗報告について
- 一つの作業の進捗がある毎に、***必ず*** /history.mdファイルに進捗の内容を日本語で追記してください
  - ***絶対に*** 上書きをがせずに、過去の記述が残るように追記をしてください
  - /history.mdファイルは次回にあなたが再度読み込んで、どういう流れで作業をして、現在どこまで進捗があるのかをわかるようにマークダウン形式で追記してください

### ファイル作成時の注意点（ファイル作成時必ず確認）
- ファイル作成時に、そのファイルがGithubに挙げられるべきではないと判断した場合には、必ず.gitignoreに指定してください。

## ツール

### github コマンドの使い方について
- githubに関連するタスクを実行する時には***必ず***Github CLIコマンド (`gh`) を使ってください

### Playwrite MCPについて
- インターネットに接続して調査を実施する際には***必ず***Playwrite MCP活用してください
- 調査したときに使ったページに関しては適当なタイミングでスナップショットを/snapshotに保存しておいてください
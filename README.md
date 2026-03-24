# ToDo App

Hono + React で構築されたシンプルなタスク管理アプリケーションです。Docker Compose で簡単に起動できます。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| バックエンド | [Hono](https://hono.dev/) + Node.js + TypeScript |
| データベース | SQLite (better-sqlite3) |
| フロントエンド | React + TypeScript + Vite |
| スタイリング | TailwindCSS v4 |
| インフラ | Docker Compose + Nginx |

## 機能

- ToDo の作成・一覧表示・編集・削除（CRUD）
- 完了 / 未完了の切り替え
- フィルタリング（すべて / 未完了 / 完了済み）
- レスポンシブデザイン

## クイックスタート

### Docker Compose で起動（推奨）

```bash
docker compose up --build
```

ブラウザで http://localhost:8080 にアクセスしてください。

### 停止

```bash
docker compose down
```

データを含めて完全に削除する場合:

```bash
docker compose down -v
```

## ローカル開発

### バックエンド

```bash
cd backend
pnpm install
pnpm dev
```

バックエンドが http://localhost:3000 で起動します。

### フロントエンド

```bash
cd frontend
pnpm install
pnpm dev
```

フロントエンドが http://localhost:5173 で起動します。Vite のプロキシ設定により、`/api` へのリクエストは自動的にバックエンドに転送されます。

## API エンドポイント

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/api/todos` | ToDo 一覧の取得 |
| GET | `/api/todos/:id` | 個別の ToDo を取得 |
| POST | `/api/todos` | 新しい ToDo を作成 |
| PUT | `/api/todos/:id` | ToDo を更新 |
| DELETE | `/api/todos/:id` | ToDo を削除 |
| GET | `/api/health` | ヘルスチェック |

## プロジェクト構成

```
manus-todo-app/
├── backend/
│   ├── src/
│   │   ├── index.ts       # Hono サーバーエントリーポイント
│   │   ├── todos.ts       # ToDo CRUD ルーティング
│   │   └── db.ts          # SQLite データベース初期化
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoForm.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   └── TodoFilter.tsx
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

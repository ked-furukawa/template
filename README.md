# Tablet PWA Template

タブレット向け業務アプリを素早く立ち上げるための、Amplify Gen2 + React + Vite + Tailwind CSS ベースのテンプレートです。

- **認証**: Amazon Cognito（メール + パスワード）
- **データ**: Amplify Data（AppSync + DynamoDB）
- **ストレージ**: Amazon S3（オーナーベースアクセス）
- **PWA**: `vite-plugin-pwa` によるオフライン対応・ホーム画面追加
- **UI**: Tailwind CSS + Heroicons + Base UI（ヘッドレスコンポーネント）

UI/UX の詳細なガイドラインは [docs/ui-ux-guide.md](./docs/ui-ux-guide.md) を参照してください。

---

## 主要フォルダ構成

```
/
├── amplify/                         # Amplify Gen2 バックエンド定義
│   ├── auth/resource.ts             # Cognito User Pool（email 認証）
│   ├── data/resource.ts             # Amplify Data スキーマ（Item モデル）
│   ├── storage/resource.ts          # S3 ストレージ（photos/{entity_id}/*）
│   └── backend.ts                   # バックエンド統合定義
├── docs/
│   └── ui-ux-guide.md               # UI/UX ガイドライン
├── public/                          # PWA アセット（favicon 等）
├── src/
│   ├── main.tsx                     # エントリポイント
│   ├── App.tsx                      # ルーティング定義 + Authenticator
│   ├── index.css                    # グローバルスタイル
│   ├── app/layout/
│   │   └── AppLayout.tsx            # サイドバー + ヘッダーの骨格
│   ├── features/
│   │   ├── home/Home.tsx            # ホーム画面（メニューカード）
│   │   └── items/Items.tsx          # アイテム CRUD 画面
│   └── shared/
│       ├── components/ui/
│       │   ├── NumberField.tsx      # 数値入力（±ステッパー + テンキー）
│       │   ├── NumberPad.tsx        # 独自テンキーモーダル
│       │   └── Select.tsx           # セレクトドロップダウン
│       └── lib/
│           └── amplify.ts           # Amplify クライアント初期化
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## セットアップ

### 前提

- Node.js 20 以上
- AWS アカウント + AWS CLI の認証設定（Amplify sandbox 実行時に必要）

### インストール

```bash
npm install
```

### Amplify sandbox（バックエンド起動）

```bash
npx ampx sandbox
```

初回起動時にリポジトリルートへ `amplify_outputs.json` が生成され、フロントエンドから利用可能になります。

### 開発サーバ

別ターミナルで:

```bash
npm run dev
```

ブラウザで <http://localhost:5173> を開いて動作確認します。

### ビルド

```bash
npm run build
```

型チェックと Vite ビルドを実行します。

---

## カスタマイズの起点

| 目的 | 編集するファイル |
|------|------------------|
| アプリ名・PWA マニフェスト変更 | [vite.config.ts](./vite.config.ts), [index.html](./index.html) |
| アイコン差し替え | [public/favicon.svg](./public/favicon.svg) |
| データモデル追加・変更 | [amplify/data/resource.ts](./amplify/data/resource.ts) |
| 認証方式変更 | [amplify/auth/resource.ts](./amplify/auth/resource.ts) |
| ストレージ ACL 変更 | [amplify/storage/resource.ts](./amplify/storage/resource.ts) |
| 画面追加 | `src/features/<name>/` を新規作成 → [src/App.tsx](./src/App.tsx) にルート追加 → [src/app/layout/AppLayout.tsx](./src/app/layout/AppLayout.tsx) にナビゲーション項目追加 |
| 配色・タイポグラフィ変更 | [tailwind.config.js](./tailwind.config.js), [docs/ui-ux-guide.md](./docs/ui-ux-guide.md) §5-6 |

# UI/UX ガイドライン

対象: Tablet PWA Template（Amplify Gen2 + React + Vite + Tailwind CSS）

---

## 1. 設計原則

| # | 原則 | 説明 |
|---|------|------|
| P1 | **現場ファースト** | タッチ操作を前提。タッチターゲットは大きく、誤タップを防ぐ |
| P2 | **一目で分かる** | 重要情報は画面の最も目立つ位置に大きく表示 |
| P3 | **誤操作防止** | 破壊的操作（削除・上書き）は必ず確認ダイアログを挟む |
| P4 | **最小ステップ** | 主要操作を最短タップ数で完了できる導線 |
| P5 | **即時フィードバック** | 操作結果は色・アイコン・テキストで即座にユーザーに伝える |

---

## 2. 技術スタック（UI関連）

| カテゴリ | ライブラリ | バージョン | 用途 |
|---------|-----------|-----------|------|
| スタイリング | **Tailwind CSS** | ^3.4 | ユーティリティファーストCSS |
| アイコン | **Heroicons** (`@heroicons/react`) | ^2.2 | Tailwind公式チーム製SVGアイコン |
| UIコンポーネント | **Base UI** (`@base-ui/react`) | ^1.0.0 | ヘッドレスUIコンポーネント（数値入力等） |
| 認証UI | **Amplify UI React** | ^6.5 | Cognito認証画面のみ |

### 2.1 Heroicons 使用規約

- **スタイル**: `outline`（24px）を標準とする。強調が必要な箇所のみ `solid`（20px）を使用
- **サイズ**: Tailwind の `h-6 w-6`（24px）を基本、小さいコンテキストでは `h-5 w-5`（20px）
- **インポート形式**:
  ```tsx
  // outline（標準）
  import { HomeIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
  // solid（強調・アクティブ状態）
  import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid';
  ```

### 2.2 Base UI 使用規約

- **用途**: 数値入力（NumberField）など、ブラウザ標準では不十分なフォームコントロールに限定して使用
- **スタイリング**: Base UI はヘッドレス（スタイルなし）のため、すべて Tailwind クラスで装飾する
- **カスタムコンポーネント**: `src/shared/components/ui/` 配下に Base UI をラップした共通コンポーネントを作成し、各ページから利用する
- **OS キーボード抑止方針**: タブレット運用では OS のソフトウェアキーボードは原則使用しない。数値入力は独自テンキー（`NumberPad`）を内蔵した `NumberField`（[`src/shared/components/ui/NumberField.tsx`](../src/shared/components/ui/NumberField.tsx)）経由で受ける。実装上は `<NumberField.Input>` に `readOnly tabIndex={-1}` と CSS `pointer-events-none` を付与し、中央の数値部を `<button type="button">` でラップしてタップで `NumberPad` を開く
- **禁止事項**: タブレット画面で素の `<input type="number">` を直接配置しない（手袋・粉塵環境など誤タップと視認性低下を招くため）

---

## 3. ターゲットデバイス・画面仕様

| 項目 | 仕様 |
|------|------|
| 対象端末 | iPad（10.2〜12.9インチ）/ Android タブレット（10〜11インチ） |
| 最小対応幅 | **768px**（タブレット縦持ち） |
| 推奨利用向き | **横持ち**（サイドバーナビゲーションとの相性を考慮） |
| タッチターゲット | 最小 **48×48px**（通常の44pxより拡大） |
| PWA | ホーム画面に追加して利用。フルスクリーンモード |

---

## 4. レイアウト構造

### 4.1 全体構成

```
┌──────────────────────────────────────────────┐
│ サイドバー │ ヘッダー                          │
│ (開閉可能) │──────────────────────────────────│
│            │                                  │
│  アイコン  │  メインコンテンツ                  │
│  + ラベル  │                                  │
│            │                                  │
│            │                                  │
│ ────────── │                                  │
│ ログアウト │                                  │
└──────────────────────────────────────────────┘
```

### 4.2 サイドバー

| 状態 | 幅 | 表示内容 |
|------|-----|---------|
| **開** | `w-56`（224px） | アイコン + テキストラベル |
| **閉** | `w-16`（64px） | アイコンのみ |

- 背景色: `bg-white` + `border-r border-slate-200`（右端にボーダーで境界を明示）
- テキスト: `text-slate-700`
- アクティブ項目: `bg-slate-900 font-semibold text-white`（強い反転で現在地を明示）
- ホバー: `bg-slate-100`
- 下部区切り線: `border-t border-slate-200`
- 開閉アニメーション: `transition-[width] duration-200`
- 下部にユーザーID表示（`text-slate-500`）とログアウトボタンを配置

### 4.3 ヘッダー

- 高さ: `h-14`（56px）
- 背景: `bg-white` + 下線 `border-b border-slate-200`
- 左: アプリタイトル
- 右: ログインユーザーID

### 4.4 メインコンテンツ

- パディング: `px-6 py-8`
- スクロール: `overflow-y-auto`（コンテンツ領域のみスクロール、サイドバー・ヘッダーは固定）

---

## 5. カラーシステム

### 5.1 ベースカラー

| 用途 | カラー | Tailwind クラス |
|------|--------|----------------|
| 背景（メイン） | ライトグレー | `bg-slate-50` |
| 背景（カード） | 白 | `bg-white` |
| 背景（サイドバー） | 白 | `bg-white`（右端に `border-slate-200` のボーダー） |
| テキスト（通常） | ダークグレー | `text-slate-900` |
| テキスト（補助） | ミディアムグレー | `text-slate-500` |
| ボーダー | ライトグレー | `border-slate-200` |

### 5.2 セマンティックカラー（状態表示）

| 状態 | 用途 | 背景 | テキスト/ボーダー |
|------|------|------|------------------|
| **成功** | 保存完了、OK 判定 | `bg-emerald-50` | `text-emerald-700` / `border-emerald-300` |
| **エラー** | 入力エラー、失敗 | `bg-red-50` | `text-red-700` / `border-red-300` |
| **警告** | 注意喚起 | `bg-amber-50` | `text-amber-700` / `border-amber-300` |
| **情報** | ヒント、補足説明 | `bg-sky-50` | `text-sky-700` / `border-sky-300` |

### 5.3 アクセントカラー（ボタン）

| 用途 | カラー | Tailwind クラス |
|------|--------|----------------|
| プライマリアクション | スレートダーク | `bg-slate-800` |
| 成功 | エメラルド | `bg-emerald-600` |
| 補助情報 | スカイブルー | `bg-sky-600` |
| 強調 | アンバー | `bg-amber-600` |

### 5.4 コントラスト要件

- テキストと背景のコントラスト比: **WCAG AA 以上（4.5:1）**
- 明るい環境下でも判読可能な濃度を確保
- 状態表現は色だけに頼らず、テキスト・アイコンを併用

---

## 6. タイポグラフィ

### 6.1 フォントファミリー

```
font-family: "Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic Medium", Meiryo, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

各OSに標準搭載されている日本語フォントを優先指定し、外部CDNに依存せず高速に表示できるようにする。Android は Noto Sans JP、iOS / macOS は Hiragino Sans、Windows は Yu Gothic Medium（旧環境では Meiryo）がそれぞれ適用される。英数字は Segoe UI / Roboto / Helvetica Neue など各OS標準フォントにフォールバックする。

### 6.2 フォントサイズ階層

| レベル | 用途 | Tailwind | サイズ目安 |
|--------|------|----------|-----------|
| **特大** | 主要な数値・判定結果 | `text-5xl` 〜 `text-6xl` | 48〜60px |
| **大** | ホームメニューボタン | `text-3xl` | 30px |
| **見出し1** | ページタイトル | `text-2xl font-bold` | 24px |
| **見出し2** | セクション見出し | `text-xl font-semibold` | 20px |
| **本文** | 通常テキスト | `text-base` | 16px |
| **補足** | ラベル、キャプション | `text-sm` | 14px |
| **極小** | タイムスタンプ、メタ情報 | `text-xs` | 12px |

### 6.3 数値表示

- 数値は **等幅フォント風に表示**（桁ズレ防止）
- `tabular-nums` を適用: `className="tabular-nums"`
- 単位は数値より小さいサイズで右寄せ

---

## 7. コンポーネント仕様

### 7.1 ボタン

| 種類 | 用途 | スタイル |
|------|------|---------|
| **プライマリ** | 保存、確定 | `bg-slate-800 text-white` / 大きめパディング |
| **セカンダリ** | キャンセル、戻る | `border border-slate-300 bg-white text-slate-700` |
| **成功** | 完了確定 | `bg-emerald-600 text-white` |
| **危険** | 削除、無効化 | `bg-red-600 text-white` |
| **ゴースト** | 補助的な操作 | `text-slate-600 hover:bg-slate-100` |

共通:
- 最小高さ: `min-h-[48px]`（タッチターゲット確保）
- 角丸: `rounded-lg`
- フォーカスリング: `focus:ring-2 focus:ring-slate-400 focus:ring-offset-2`
- disabled: `opacity-50 cursor-not-allowed`

### 7.2 カード

```
bg-white rounded-xl shadow-sm border border-slate-200 p-6
```

- 情報グループの区切りに使用
- ホーム画面のメニューカードは `shadow-lg rounded-2xl` で強調

### 7.3 入力フォーム

- テキスト入力: `h-12 rounded-lg border border-slate-300 px-4`
- **数値入力は必ず [`NumberField`](../src/shared/components/ui/NumberField.tsx) を使用する**（素の `<input type="number">` は使わない）
  - 構造: 左右に ±ステッパー（最小 `h-12 w-12`）＋ 中央の数値表示部
  - **中央の数値部タップで独自テンキー（`NumberPad`）を開く**（§7.8）
  - 整数入力: `allowDecimal={false}`、`.` ボタンを非表示
  - 小数入力: `step` と `maxFractionDigits` で精度を制御
  - null 許容フィールド: `allowClear` を指定し、プレースホルダで「任意」「未入力」などを示す
- ラベル: `NumberField` の props `label` で指定（内部で入力フィールド上に `text-sm font-semibold text-slate-700` で配置）

### 7.4 バッジ・ステータス表示

| バッジ | スタイル例 |
|--------|-----------|
| 成功 | `bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full` |
| エラー | `bg-red-100 text-red-800 ...` |
| 警告 | `bg-amber-100 text-amber-700 ...` |
| 情報 | `bg-sky-100 text-sky-700 ...` |

### 7.5 モーダル / ダイアログ

- オーバーレイ: `bg-black/50`
- パネル: `bg-white rounded-2xl shadow-xl max-w-lg mx-auto`
- 閉じるボタン: 右上に `XMarkIcon`
- 破壊的操作の確認: タイトルに警告アイコン + 赤いアクションボタン

### 7.6 テーブル / リスト

- ヘッダー行: `bg-slate-50 text-sm font-semibold text-slate-600`
- データ行: `border-b border-slate-100` + ホバー `hover:bg-slate-50`
- 行高さ: 最小 `48px`（タッチ操作対応）

### 7.7 ローディング

- スピナー: `animate-spin` + Heroicons `ArrowPathIcon`
- スケルトン: `bg-slate-200 animate-pulse rounded`

### 7.8 NumberPad（入力モーダル）

`NumberField` の数値部タップで開く独自テンキーモーダル。実装は [`src/shared/components/ui/NumberPad.tsx`](../src/shared/components/ui/NumberPad.tsx)。

- **基盤**: Base UI `Dialog`（`Root / Portal / Backdrop / Popup / Title / Close`）
- **レイアウト**:
  - Popup: `w-[min(90vw,420px)] p-4 rounded-2xl bg-white shadow-xl`
  - 上部: 大数値プレビュー（`text-5xl tabular-nums font-bold`、右端に単位）
  - 下部: 3×4 数字グリッド + 右縦列（`⌫ / クリア / 確定`）
- **ボタン仕様**:
  - 最小 `h-16`（64px 以上、§3 の 48×48 要件を超える）
  - 数字: `bg-white border-slate-300 text-3xl` + hover/active 状態
  - 確定: `bg-emerald-600 text-white`（§7.1 成功ボタン）
  - ⌫ / クリア: `bg-slate-100 text-slate-700`
  - `.` ボタンは `allowDecimal=true` の時のみ活性、既に小数点が入っていれば無効化
- **挙動**:
  - 開いた瞬間に現在値で初期化
  - バックドロップ / Escape / 閉じるボタン: 値を破棄してクローズ
  - 確定: `parseFloat` → min/max で clamp → `onConfirm(number | null)`
  - 空で確定（`allowClear=true` の場合）: `null` を返す
- **呼び出し側の責務**: `NumberField` に一任。直接呼び出す場面は原則ないが、特殊な用途で単体利用する場合も props の型は同じ
- **禁止事項**: このモーダル内で `<button type="submit">` を使わない（親フォームが意図せず送信される）

---

## 8. トースト / メッセージ

- 成功: 画面上部にスライドイン、3秒で自動消去、緑系
- エラー: 画面上部に固定表示、手動で閉じるまで残る、赤系
- 処理中: スピナー + テキスト、操作をブロック

---

## 9. アクセシビリティ

| 項目 | 要件 |
|------|------|
| コントラスト比 | WCAG AA（4.5:1）以上 |
| タッチターゲット | 最小 48×48px |
| タッチ間隔 | 隣接するタップ要素間に最低 8px の余白 |
| フォーカス表示 | `focus:ring-2` でキーボード操作時も視認可能 |
| 色に頼らない | 状態は色+アイコン+テキストで伝達 |
| aria ラベル | アイコンのみのボタンには `aria-label` を必須とする |
| 数値入力 | OS キーボードを起動せず独自テンキー（`NumberPad`）を使用（§2.2 / §7.8） |

---

## 10. アイコン一覧（Heroicons マッピング）

プロジェクトで標準的に使うアイコンのマッピング例:

| 用途 | Heroicons 名 | スタイル |
|------|-------------|---------|
| ホーム | `HomeIcon` | outline |
| 一覧 / ダッシュボード | `Squares2X2Icon` | outline |
| 履歴 | `ClockIcon` | outline |
| カメラ/撮影 | `CameraIcon` | outline |
| 保存 | `CheckIcon` | outline |
| 削除/閉じる | `XMarkIcon` | outline |
| 編集 | `PencilSquareIcon` | outline |
| 追加 | `PlusIcon` | outline |
| 警告 | `ExclamationTriangleIcon` | solid |
| 成功 | `CheckCircleIcon` | solid |
| エラー | `XCircleIcon` | solid |
| 情報 | `InformationCircleIcon` | outline |
| フィルタ | `FunnelIcon` | outline |
| ダウンロード | `ArrowDownTrayIcon` | outline |
| ログアウト | `ArrowRightStartOnRectangleIcon` | outline |
| メニュー開閉 | `Bars3Icon` / `ChevronLeftIcon` | outline |
| お気に入り | `StarIcon` | solid / outline |
| ローディング | `ArrowPathIcon` + `animate-spin` | outline |

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

### 1.1 ビジュアルテーマ（ウォームニュートラル）

紙のノートを思わせる温かみと、デジタル業務での読みやすさを両立させる。長時間の現場利用でも目が疲れない、低彩度・低コントラストを基調とする。

| # | 方針 | 内容 |
|---|------|------|
| V1 | **ウォームニュートラル基調** | 純白・純黒は使わない。背景はオフホワイト〜ベージュ、テキストは温かみのある濃グレー |
| V2 | **低彩度のアクセント** | 情報・選択はソフトブルー、完了はサクセスグリーン。彩度を抑え目に刺さらない |
| V3 | **控えめな角丸** | 標準 `rounded-lg`（8px）、カード `rounded-xl`（12px）。過度に丸くしない |
| V4 | **影は使わない** | 立体感は影ではなく極細ボーダーと塗りで表現する。使う場合も `shadow-sm` まで |
| V5 | **極細ボーダー** | 半透明グレーの極細線（`border-stone-200/70`）で領域を区切る |
| V6 | **塗りは主アクションのみ** | ボタンは枠線型が基本。塗りは主アクション・選択中・状態表現に限定 |
| V7 | **ホバーは1段階暗く** | ホバーは背景色を1段階暗くするのみ。影や派手な変化は避ける |

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

- 背景色: `bg-stone-50` + `border-r border-stone-200/70`（右端に極細ボーダーで境界を明示）
- テキスト: `text-stone-700`
- アクティブ項目: `bg-stone-800 font-semibold text-stone-50`（彩度を抑えた反転で現在地を明示）
- ホバー: `bg-stone-100`
- 下部区切り線: `border-t border-stone-200/70`
- 開閉アニメーション: `transition-[width] duration-200`
- 下部にユーザーID表示（`text-stone-500`）とログアウトボタンを配置

### 4.3 ヘッダー

- 高さ: `h-14`（56px）
- 背景: `bg-stone-50` + 下線 `border-b border-stone-200/70`
- 左: アプリタイトル（`text-stone-800 font-semibold`）
- 右: ログインユーザーID（`text-stone-500 text-sm`）

### 4.4 メインコンテンツ

- 背景色: `bg-stone-100`（オフホワイト〜ベージュ寄りの温かみのある色）
- パディング: `px-6 py-8`
- スクロール: `overflow-y-auto`（コンテンツ領域のみスクロール、サイドバー・ヘッダーは固定）

---

## 5. カラーシステム

ウォームニュートラル基調。ベースは `stone`（暖色寄りグレー）、アクセントは低彩度の `blue` / `emerald`。純白 `#fff` と純黒 `#000` は原則使用しない。

### 5.1 ベースカラー（サーフェス・テキスト）

| 用途 | カラー | Tailwind クラス | 備考 |
|------|--------|----------------|------|
| 背景（ページ全体） | クリーム | `bg-stone-100` | オフホワイト〜ベージュ寄り |
| 背景（カード・パネル） | オフホワイト | `bg-stone-50` | 純白は使わない |
| 背景（サブサーフェス） | 薄ベージュ | `bg-stone-200/40` | テーブルヘッダ等 |
| テキスト（通常） | 濃グレー（温かみ） | `text-stone-800` | ピュアブラックは使わない |
| テキスト（強調） | より濃いグレー | `text-stone-900` | 数値・主要見出しのみ |
| テキスト（補助） | ミディアムグレー | `text-stone-600` | キャプション、ラベル |
| テキスト（ミュート） | ライトグレー | `text-stone-500` | プレースホルダ、メタ情報 |
| ボーダー（標準） | 半透明グレー（極細） | `border-stone-200/70` | 0.5px 相当の控えめさ |
| ボーダー（強） | グレー | `border-stone-300` | フォーカス前の入力枠 |

### 5.2 アクセントカラー

| 用途 | カラー | 主要 Tailwind クラス | 用例 |
|------|--------|---------------------|------|
| **情報・選択** | ソフトブルー | `text-blue-700` / `bg-blue-50` / `border-blue-300` | フォーカス、選択中タブ、現在ステップ |
| **完了・成功** | サクセスグリーン | `text-emerald-700` / `bg-emerald-50` / `border-emerald-300` | 完了済み、OK 判定 |

両アクセントとも彩度を抑えた tonal な配色を使う。`*-600` 以上の濃いトーンは「主アクション塗り」のときだけ使用する。

### 5.3 セマンティックカラー（状態表示）

| 状態 | 背景 | テキスト | ボーダー |
|------|------|----------|---------|
| **成功** | `bg-emerald-50` | `text-emerald-700` | `border-emerald-300` |
| **エラー** | `bg-red-50` | `text-red-700` | `border-red-300` |
| **警告** | `bg-amber-50` | `text-amber-800` | `border-amber-300` |
| **情報** | `bg-blue-50` | `text-blue-700` | `border-blue-300` |

> 警告は彩度の高い `amber-700` ではなく `amber-800` を使い、ベージュ背景上で浮かないようにする。

### 5.4 主アクション塗り（限定使用）

ボタン §7.1 で「主アクション」と明示された箇所のみで使用する濃いトーン。

| 用途 | カラー | クラス |
|------|--------|--------|
| 主アクション（保存・確定） | ストーンダーク | `bg-stone-800 text-stone-50 hover:bg-stone-900` |
| 完了確定（成功系の主アクション） | エメラルド | `bg-emerald-600 text-white hover:bg-emerald-700` |
| 破壊的操作 | レッド | `bg-red-600 text-white hover:bg-red-700` |

### 5.5 コントラスト要件

- テキストと背景のコントラスト比: **WCAG AA 以上（4.5:1）**
- 低コントラスト基調でも、本文テキストは `text-stone-800` 以上の濃度を確保する
- 明るい環境下でも判読可能な濃度を確保
- 状態表現は色だけに頼らず、テキスト・アイコンを併用

---

## 6. タイポグラフィ

### 6.1 フォントファミリー

```
font-family: "Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic Medium", Meiryo, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

各OSに標準搭載されている日本語フォントを優先指定し、外部CDNに依存せず高速に表示できるようにする。Android は Noto Sans JP、iOS / macOS は Hiragino Sans、Windows は Yu Gothic Medium（旧環境では Meiryo）がそれぞれ適用される。英数字は Segoe UI / Roboto / Helvetica Neue など各OS標準フォントにフォールバックする。

### 6.2 テキストスタイル（サイズ × 色 × ウェイト）

ウォームニュートラル基調に合わせて、本文は `text-stone-800`、補助は `text-stone-600`、ミュートは `text-stone-500` を基準にする。`text-black` および `text-slate-*` は使わない。

| レベル | 用途 | クラス例 |
|--------|------|---------|
| **数値（特大）** | 主要な数値・判定結果 | `text-5xl font-bold tabular-nums text-stone-900` |
| **数値（大）** | プレビュー数値、メイン KPI | `text-3xl font-bold tabular-nums text-stone-900` |
| **見出し1（H1）** | ページタイトル | `text-2xl font-bold text-stone-900` |
| **見出し2（H2）** | セクション見出し | `text-xl font-semibold text-stone-800` |
| **見出し3（H3）** | サブセクション、カードタイトル | `text-lg font-semibold text-stone-800` |
| **本文** | 通常テキスト | `text-base text-stone-800` |
| **強調本文** | 重要な本文、選択中ラベル | `text-base font-semibold text-stone-900` |
| **補足** | ラベル、フォームラベル、キャプション | `text-sm font-semibold text-stone-700` |
| **メタ** | 範囲表示、前回値などの参考情報 | `text-sm text-stone-500` |
| **極小** | タイムスタンプ、メタ情報 | `text-xs text-stone-500` |
| **リンク・補助強調** | テキストリンク、タップで遷移 | `text-blue-700 hover:text-blue-800 underline-offset-2 hover:underline` |
| **エラーテキスト** | バリデーションメッセージ | `text-sm text-red-700` |
| **成功テキスト** | 完了メッセージ | `text-sm text-emerald-700` |

### 6.3 数値表示

- 数値は **等幅フォント風に表示**（桁ズレ防止）: `className="tabular-nums"`
- 単位は数値より小さいサイズで右寄せ、`text-stone-500` 程度の控えめな色
- 主要数値は `text-stone-900 font-bold` で強調、副次的数値は `text-stone-800` を使う

---

## 7. コンポーネント仕様

### 7.1 ボタン

ボタンは枠線型を基本とし、塗りは主アクションのみに限定する（§1.1 V6）。
共通仕様: 最小高さ `min-h-[48px]`、角丸 `rounded-lg`（8px）、フォーカスリング `focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-stone-100`、`disabled:opacity-50 disabled:cursor-not-allowed`、影は使わない。

#### 4種類のボタン

| 種類 | 用途 | クラス例 |
|------|------|---------|
| **primary** | 主アクション（保存・確定・送信）。画面に1〜2個まで | `bg-stone-800 text-stone-50 border border-stone-800 hover:bg-stone-900` |
| **secondary** | 副アクション・選択中状態（情報強調） | `bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100` |
| **outlined** | 汎用アクション（キャンセル、戻る、編集など）。最も多用される基本形 | `bg-stone-50 text-stone-700 border border-stone-300 hover:bg-stone-100` |
| **text** | 補助的な操作（テキストリンク的） | `text-stone-700 border border-transparent hover:bg-stone-100` |

#### 状態別バリエーション（任意で追加）

| 種類 | 用途 | クラス例 |
|------|------|---------|
| **success（primary 系）** | 完了確定（業務フロー終端） | `bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700` |
| **danger（primary 系）** | 削除・無効化などの破壊的操作 | `bg-red-600 text-white border border-red-600 hover:bg-red-700` |

> 選択中表現としての secondary ボタンは、選択トグル群（判定ボタン群、タブ等）で「未選択 = outlined / 選択中 = secondary」と切り替える。影は使わず塗りで表現する。

### 7.2 カード

カードは情報グループの区切りに使用。共通仕様: `rounded-xl`（12px）、`p-6`、影は原則なし、極細ボーダーで領域を区切る。

#### 3種類のカード

| 種類 | 用途 | クラス例 |
|------|------|---------|
| **standard** | 標準的な情報カード | `bg-stone-50 border border-stone-200/70 rounded-xl p-6` |
| **selected** | 選択中・編集中（現在の操作対象を示す） | `bg-blue-50/60 border border-blue-300 rounded-xl p-6` |
| **success** | 完了済み・成功状態 | `bg-emerald-50/60 border border-emerald-300 rounded-xl p-6` |

> カードの強調が必要な場合（ホーム画面のメニューカードなど）は `shadow-sm` までに留め、`shadow-lg` のような強い影は使わない。

### 7.3 入力フォーム

共通仕様: `h-12`、角丸 `rounded-lg`（8px）、`px-4`、`bg-stone-50`、`tabular-nums`（数値入力時）。

#### 状態別スタイル

| 状態 | クラス例 |
|------|---------|
| **通常** | `h-12 rounded-lg border border-stone-300 bg-stone-50 px-4 text-stone-800 placeholder:text-stone-400` |
| **フォーカス** | 通常クラスに `focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:bg-stone-50 focus:outline-none` を追加 |
| **エラー** | `border-red-400 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200`。エラーメッセージは `text-sm text-red-700 mt-1` で直下に配置 |
| **disabled** | `bg-stone-100 text-stone-500 border-stone-200 cursor-not-allowed` |

#### 数値入力（NumberField）

- **数値入力は必ず [`NumberField`](../src/shared/components/ui/NumberField.tsx) を使用する**（素の `<input type="number">` は使わない）
- 構造: 左右に ±ステッパー（最小 `h-12 w-12`）＋ 中央の数値表示部
- **中央の数値部タップで独自テンキー（`NumberPad`）を開く**（§7.8）
- 整数入力: `allowDecimal={false}`、`.` ボタンを非表示
- 小数入力: `step` と `maxFractionDigits` で精度を制御
- null 許容フィールド: `allowClear` を指定し、プレースホルダで「任意」「未入力」などを示す
- ラベル: `NumberField` の props `label` で指定（内部で入力フィールド上に `text-sm font-semibold text-stone-700` で配置）

### 7.4 バッジ・チップ

共通仕様: `text-sm font-semibold px-3 py-1 rounded-full border`、彩度を抑えた tonal カラー、影は使わない。

| バッジ | 用途 | クラス例 |
|--------|------|---------|
| **完了 / 成功** | 完了済みステップ、OK 判定 | `bg-emerald-50 text-emerald-700 border border-emerald-300` |
| **進行中 / 選択中** | 現在のステップ、編集中 | `bg-blue-50 text-blue-700 border border-blue-300` |
| **エラー** | 失敗、不正値 | `bg-red-50 text-red-700 border border-red-300` |
| **警告** | 注意喚起、要確認 | `bg-amber-50 text-amber-800 border border-amber-300` |
| **中立 / 未着手** | デフォルト、未開始 | `bg-stone-100 text-stone-700 border border-stone-300` |

#### チップ（タップ可能なバッジ）

- バッジと同じ配色を使い、タップ可能なものは最小 `min-h-[32px] px-3` を確保
- 選択トグル用途では outlined ボタンの仕様（§7.1）を優先する

### 7.5 モーダル / ダイアログ

- オーバーレイ: `bg-stone-900/40`（純黒は使わずストーンを透過）
- パネル: `bg-stone-50 rounded-2xl border border-stone-200/70 max-w-lg mx-auto`（影は使わない、ボーダーで領域を区切る）
- 閉じるボタン: 右上に `XMarkIcon`、`text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg`
- 破壊的操作の確認: タイトルに警告アイコン + danger ボタン（§7.1）

### 7.6 テーブル / リスト

- ヘッダー行: `bg-stone-200/40 text-sm font-semibold text-stone-600 border-b border-stone-200/70`
- データ行: `border-b border-stone-200/70` + ホバー `hover:bg-stone-100`
- 選択中の行: `bg-blue-50/60`
- 行高さ: 最小 `48px`（タッチ操作対応）

### 7.7 ローディング

- スピナー: `animate-spin` + Heroicons `ArrowPathIcon`、色は `text-stone-500`
- スケルトン: `bg-stone-200/70 animate-pulse rounded-lg`

### 7.8 NumberPad（入力モーダル）

`NumberField` の数値部タップで開く独自テンキーモーダル。実装は [`src/shared/components/ui/NumberPad.tsx`](../src/shared/components/ui/NumberPad.tsx)。

- **基盤**: Base UI `Dialog`（`Root / Portal / Backdrop / Popup / Title / Close`）
- **レイアウト**:
  - Popup: `w-[min(90vw,420px)] p-4 rounded-2xl bg-stone-50 border border-stone-200/70`（影は使わない）
  - 上部: 大数値プレビュー（`text-5xl tabular-nums font-bold text-stone-900`、右端に単位 `text-stone-500`）
  - 下部: 3×4 数字グリッド + 右縦列（`⌫ / クリア / 確定`）
- **ボタン仕様**:
  - 最小 `h-16`（64px 以上、§3 の 48×48 要件を超える）
  - 数字: outlined（§7.1）— `bg-stone-50 border border-stone-300 text-stone-800 text-3xl hover:bg-stone-100`
  - 確定: success primary（§7.1）— `bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700`
  - 同上 / クリア（補助）: secondary（§7.1）— `bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100`
  - ⌫: outlined — `bg-stone-50 border border-stone-300 text-stone-700 hover:bg-stone-100`
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

トーストはセマンティックカラー（§5.3）の tonal 配色を使う。影は使わず極細ボーダーで区切る。

| 種別 | 挙動 | クラス例 |
|------|------|---------|
| **成功** | 画面上部にスライドイン、3秒で自動消去 | `bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl px-4 py-3` |
| **エラー** | 画面上部に固定表示、手動で閉じるまで残る | `bg-red-50 text-red-700 border border-red-300 rounded-xl px-4 py-3` |
| **警告** | 一定時間表示、自動消去オプション | `bg-amber-50 text-amber-800 border border-amber-300 rounded-xl px-4 py-3` |
| **処理中** | スピナー + テキスト、操作をブロック | `bg-stone-50 text-stone-700 border border-stone-200/70 rounded-xl px-4 py-3` |

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

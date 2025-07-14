# Voice Paint 🎨🎤

音声を使って絵を描くインタラクティブなWebアプリケーション。声の高低で線の太さ、音量で色の濃さが変化します。

## 特徴

- 🎵 リアルタイム音声解析
- 🎨 声のピッチと音量に応じた動的な描画
- 💾 作品の保存機能（画像＋音声）
- 📱 レスポンシブデザイン

## 技術スタック

- **React 19.1.0** - 最新のReactを使用
- **TypeScript 4.9.5** - 型安全な開発
- **Tailwind CSS 3.4.17** - ユーティリティファーストのCSS
- **Web Audio API** - 音声解析
- **Canvas API** - 描画処理

## セットアップ

### 前提条件

- Node.js 16以上
- npm または yarn
- HTTPS環境（マイクアクセスに必要）

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/voice-paint-app.git
cd voice-paint-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

アプリケーションは http://localhost:3000 で起動します。

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run serve
```

## 使い方

1. **録音開始**: 緑色の「録音開始」ボタンをクリック
2. **マイクの許可**: ブラウザからマイクへのアクセスを許可
3. **声で描画**: 
   - 高い声：細い線、点描
   - 中音域：波状の線
   - 低い声：太い線
4. **色の変更**: パレットアイコンから色を選択
5. **保存**: 作品を画像と音声ファイルとして保存

## プロジェクト構造

```
src/
├── components/           # UIコンポーネント
│   ├── VoicePaintApp.tsx    # メインコンポーネント
│   ├── ControlPanel.tsx     # コントロールパネル
│   ├── AudioVisualizer.tsx  # 音声ビジュアライザー
│   ├── Instructions.tsx     # 使い方説明
│   └── ErrorDialog.tsx      # エラーダイアログ
├── hooks/               # カスタムフック
│   ├── useAudioAnalyzer.ts  # 音声解析
│   ├── useCanvasDrawing.ts  # 描画ロジック
│   └── useMediaRecorder.ts  # 録音機能
├── types/               # TypeScript型定義
│   ├── audio.d.ts          # Web Audio API拡張
│   └── voice-paint.ts      # アプリケーション型
└── utils/               # ユーティリティ
    └── errorHandlers.ts    # エラーハンドリング
```

## アーキテクチャの特徴

### コンポーネント設計
- **関心の分離**: UIロジックと業務ロジックを分離
- **再利用性**: 小さく独立したコンポーネント
- **メモ化**: React.memoによるパフォーマンス最適化

### カスタムフック
- **useAudioAnalyzer**: Web Audio APIの抽象化
- **useCanvasDrawing**: Canvas描画ロジックの分離
- **useMediaRecorder**: 録音機能の管理

### 型安全性
- 厳密なTypeScript型定義
- 定数の型安全な管理
- エラーハンドリングの型定義

### パフォーマンス
- コンポーネントのメモ化
- 不要な再レンダリングの防止
- 効率的な音声データ処理

## トラブルシューティング

### マイクが使えない場合

1. **ブラウザの設定を確認**
   - アドレスバーのマイクアイコンをクリック
   - 「許可」を選択

2. **HTTPS環境の確認**
   - localhost または https:// でアクセス
   - http:// ではマイクアクセス不可

3. **対応ブラウザ**
   - Chrome (推奨)
   - Firefox
   - Edge
   - Safari (一部制限あり)

### エラーメッセージ

| エラー | 原因 | 解決方法 |
|--------|------|----------|
| NotAllowedError | マイクの許可が拒否 | ブラウザ設定でマイクを許可 |
| NotFoundError | マイクが見つからない | マイクの接続を確認 |
| NotSupportedError | ブラウザ非対応 | 対応ブラウザを使用 |

## 開発

### テストの実行

```bash
# ユニットテスト
npm test

# カバレッジレポート
npm test -- --coverage
```

### リント

```bash
# ESLintの実行
npm run lint
```

### 型チェック

```bash
# TypeScriptの型チェック
npm run type-check
```

## 作者

九兵衛(x: @kyuuka1228 , arai fumina)

## 貢献

プルリクエストを歓迎します。

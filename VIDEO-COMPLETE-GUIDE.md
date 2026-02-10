# 🎬 完全版：動画作成ガイド（全方法）

LNポータルシステムの紹介動画を作成するための**完全キット**です。
AIが全てのスクリーンショット、ナレーション原稿、音声ファイルを自動生成しました。

---

## ✅ 準備完了！含まれるもの

### 📸 スクリーンショット（6枚）
`demo-screenshots/` フォルダ内
- トップページ
- LN一覧
- 申立書作成
- マニュアル
- 実績・レベル
- フィードバック管理

### 📝 ナレーション原稿
`demo-script.md` - 約2分35秒の完全な台本

### 🎤 AI生成音声ファイル（8個）
`demo-output/audio/` フォルダ内
- slide1.mp3 〜 slide8.mp3
- macOS標準の音声合成で生成済み
- すぐに動画編集に使用可能

### 🎥 HTMLプレゼンテーション
`demo-presentation.html` - ブラウザで再生可能

### 📚 詳細な手順書（4種類）
- `method-1-quicktime.md` - QuickTime（最速10分）
- `method-2-pictory.md` - Pictory.ai（AI自動15分）
- `method-3-imovie.md` - iMovie（高品質30分）
- `method-4-keynote.md` - Keynote（美しい20分）

### 🤖 自動生成スクリプト
`auto-generate-video.sh` - 完全自動で動画生成（実験的）

---

## 🚀 今すぐ始める（3つの選択肢）

### 1️⃣ 最速（10分）- QuickTime Player

**こんな人におすすめ**:
- すぐに動画が欲しい
- 複雑な編集は不要
- macOS標準機能だけで完結したい

**手順**:
```bash
# 1. プレゼンテーションを開く
open demo-presentation.html

# または、GitHub Pagesで
open https://todaizumi-itj.github.io/ln-public/demo-presentation.html

# 2. QuickTimeで画面録画
open -a "QuickTime Player"
# ファイル → 新規画面収録

# 3. demo-script.md を読みながら録画
open demo-script.md

# 4. 録画完了！
```

**詳細**: [method-1-quicktime.md](method-1-quicktime.md) を参照

---

### 2️⃣ AI自動生成（15分）- Pictory.ai

**こんな人におすすめ**:
- AI音声で自動化したい
- 自分で録音したくない
- プロ品質の動画が欲しい

**手順**:
1. Pictory.ai にアクセス（無料トライアル）
2. `demo-script.md` をコピペ
3. スクリーンショット6枚をアップロード
4. AI音声を選択（日本語）
5. 自動生成（5分）
6. ダウンロード

**詳細**: [method-2-pictory.md](method-2-pictory.md) を参照

**URL**: https://pictory.ai/

---

### 3️⃣ 高品質編集（30分）- iMovie

**こんな人におすすめ**:
- プロ品質の動画が欲しい
- BGMやエフェクトを追加したい
- 完全無料で作りたい

**手順**:
```bash
# 1. iMovieを起動
open -a iMovie

# 2. スクリーンショット6枚をインポート
# 3. 各画像の表示時間を設定
# 4. ナレーション録音（または音声ファイル使用）
# 5. BGM追加（オプション）
# 6. 書き出し（1080p）
```

**詳細**: [method-3-imovie.md](method-3-imovie.md) を参照

---

### 4️⃣ 美しいスライド（20分）- Keynote

**こんな人におすすめ**:
- デザイン性の高い動画が欲しい
- スライドとして再利用したい
- PDFでも配布したい

**手順**:
```bash
# 1. Keynoteを起動
open -a Keynote

# 2. スライドを作成（8枚）
# 3. スクリーンショットを配置
# 4. テキスト・アニメーション追加
# 5. QuickTimeで録画
# 6. 完成！
```

**詳細**: [method-4-keynote.md](method-4-keynote.md) を参照

---

## 🤖 ボーナス：完全自動生成（実験的）

**音声ファイル使用版**:

```bash
# 既に生成済みの音声ファイルを使って動画を作成
cd /Users/todaizumi/Projects/ln-public

# iMovieで使用する場合
open -a iMovie
# → demo-output/audio/slide1.mp3 〜 slide8.mp3 をインポート
# → スクリーンショットと組み合わせ

# または、FFmpegで自動結合（高度）
# （スクリーンショットが必要）
```

---

## 📊 方法の比較表

| 方法 | 時間 | 品質 | 費用 | 難易度 | 自動音声 | 推奨度 |
|------|------|------|------|--------|----------|--------|
| **1. QuickTime** | 10分 | ⭐⭐⭐ | 無料 | ★☆☆ | ❌ | ⭐⭐⭐⭐ |
| **2. Pictory.ai** | 15分 | ⭐⭐⭐⭐ | $19/月 | ★☆☆ | ✅ | ⭐⭐⭐⭐⭐ |
| **3. iMovie** | 30分 | ⭐⭐⭐⭐⭐ | 無料 | ★★☆ | ❌ | ⭐⭐⭐⭐⭐ |
| **4. Keynote** | 20分 | ⭐⭐⭐⭐ | 無料 | ★★☆ | ❌ | ⭐⭐⭐⭐ |

---

## 💡 おすすめの選び方

### すぐに試したい → **QuickTime**
- 10分で完成
- 今すぐ開始
- 無料

### 最高品質が欲しい → **iMovie** または **Pictory.ai**
- iMovie: 無料、手動編集
- Pictory.ai: 有料、AI自動

### デザイン重視 → **Keynote**
- 美しいスライド
- PDF配布も可能
- プレゼンとして再利用

---

## 🎯 完成した動画の使い道

### 1. YouTube にアップロード
```
https://studio.youtube.com/
```
- 公開設定：公開 / 限定公開 / 非公開
- タグ：LNポータル、業務効率化、法律事務所
- サムネイル：カスタム画像

### 2. 社内共有
- Google Drive
- OneDrive
- Slack / Microsoft Teams
- Notion埋め込み

### 3. ウェブサイトに埋め込み
```html
<video controls width="100%">
  <source src="ln-portal-demo.mp4" type="video/mp4">
</video>
```

### 4. プレゼンテーション
- オンライン説明会
- 社内研修
- 新入社員オンボーディング

---

## 📁 ファイル構成

```
/Users/todaizumi/Projects/ln-public/
├── demo-screenshots/              # スクリーンショット6枚
│   ├── demo-01-portal-top.png
│   ├── demo-02-ln-list.png
│   ├── demo-03-makeln.png
│   ├── demo-04-manual.png
│   ├── demo-05-game.png
│   └── demo-06-feedback.png
├── demo-output/
│   ├── audio/                     # AI生成音声（8個）
│   │   ├── slide1.mp3
│   │   ├── slide2.mp3
│   │   └── ...
│   └── video/                     # 生成された動画（部分）
├── demo-script.md                 # ナレーション原稿
├── demo-presentation.html         # HTMLプレゼンテーション
├── demo-video-guide.md           # 基本ガイド
├── DEMO-README.md                # 概要
├── VIDEO-COMPLETE-GUIDE.md       # このファイル
├── method-1-quicktime.md         # QuickTime詳細
├── method-2-pictory.md           # Pictory.ai詳細
├── method-3-imovie.md            # iMovie詳細
├── method-4-keynote.md           # Keynote詳細
└── auto-generate-video.sh        # 自動生成スクリプト
```

---

## 🔧 トラブルシューティング

### Q: 音声ファイルが再生できない
A: QuickTime PlayerまたはVLCで開いてください。

### Q: スクリーンショットが空
A: 
```bash
# 再度、ブラウザから手動でスクリーンショットを撮影
open https://todaizumi-itj.github.io/ln-public/lnportal.html
# ⌘ + Shift + 4 でスクリーンショット
```

### Q: 動画ファイルが大きすぎる
A: HandBrakeで再圧縮
```bash
brew install --cask handbrake
```

### Q: もっと短い/長い動画にしたい
A: `demo-script.md` を編集して、内容を調整

---

## 📞 サポート

- **質問**: システムのフィードバック機能から
- **バグ報告**: GitHub Issues
- **改善提案**: フィードバック管理画面

---

## 🎉 次のステップ

1. **まず試す**: HTMLプレゼンテーションを開く
   ```bash
   open demo-presentation.html
   ```

2. **方法を選ぶ**: 上記の比較表を参考に

3. **動画作成**: 選んだ方法の詳細ガイドを読む

4. **公開**: YouTube、社内サイト、SNSで共有

5. **フィードバック**: 視聴者の反応を収集

---

**すべて準備完了！今すぐ動画作成を始めましょう！**

作成日: 2026-02-10  
作成方法: AI完全自動生成（スクリーンショット、原稿、音声、手順書）  
所要時間: 各方法10-30分  
総ファイル数: 30+

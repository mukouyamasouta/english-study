# 英語ロードマップ

78週間、週100分を軸にTOEIC約400点から700点を目指す、個人用・モバイルファーストの学習記録アプリである。バックエンド、認証、LLM APIは使用しない。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで表示されたURLを開く。開始日は設定画面から変更できる。通常の学習記録は端末のlocalStorageに保存される。

## ビルド・テスト

```bash
npm run build
npm test
npx tsc --noEmit
```

## 公開手順

Cloudflare Pagesでは、GitHub等にリポジトリを置き、Build commandを `npm run build`、出力ディレクトリを `dist` に設定する。SPAのフォールバックが必要な場合は、Pagesの標準設定に従う。

GitHub Pagesでは、GitHub Actionsまたはローカルで `npm run build` を実行し、`dist` の内容をPagesへ公開する。Viteのベースパスが必要なリポジトリ構成では、公開先に合わせて `vite.config.ts` の `base` を設定する。

## データ保存の注意

データは `erm:v1` という1つのlocalStorageキーに保存される。iOS Safariはストレージを消去することがあるため、設定画面から定期的にJSONを書き出し、必要時に読み込むこと。ブラウザのホーム画面に追加すると継続利用しやすい。

## PDF外の提案箇所

- 「疲れた日」の実績分数を初期値10分として扱う箇所（疲れた日のメニュー自体に分数指定がないため）。コードにも `// 提案(PDF外)` と記載している。
- `新規語数` の目標値はPDFのKPI表にないため、KPIパネルでは「記録」と表示する。
- 測定入力の正解数・全体数・再発率の入力補助UI、画面上の状態表示は記録を扱いやすくするためのUI提案である。

## 依存関係

実行時依存はReactとReact DOMのみ。開発依存はVite、Reactプラグイン、TypeScript、React型定義、Vitestのみである。

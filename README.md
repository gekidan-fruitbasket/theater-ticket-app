# 劇団フルーツバスケット チケット予約アプリ

劇団の公演チケットを、保護者や関係者がLINEから簡単に予約できるWebアプリケーションです。
LINEログインを利用し、誰でも直感的に座席を選択・予約できます。

## 主な機能

### ユーザー（保護者・劇団員）向け機能
- **LINEログイン**: 面倒なID・パスワード管理なしで、LINEアカウントでワンタップログイン。
- **初回プロフィール登録**: ログイン後、本名・電話番号・関連する劇団員名（お子様用）を登録。
- **座席予約**:
  - ビジュアル座席表（空席：白 / 自分の予約：緑 / 他人の予約：グレー）。
  - タップするだけで即時予約完了。
  - 自分の予約席の確認（タップで座席番号表示）。

### 管理者（運営スタッフ）向け機能
- **管理者ダッシュボード**: `/admin` にアクセス（管理者権限を持つユーザーのみ）。
- **予約状況の確認**: 誰がどの席を予約したか一覧表示。
- **CSVエクスポート**: 「座席・本名・劇団員名・電話番号」のリストをワンクリックでダウンロード（受付名簿用）。
- **予約の強制キャンセル**: 管理者権限による予約の削除。

---

## 技術スタック

モダンでコストパフォーマンスに優れた技術選定を行っています。

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend / Database**: Supabase (PostgreSQL, Auth)
- **Infrastructure**: Vercel (Hosting)
- **Integration**: LINE Login / LIFF (LINE Front-end Framework)
- **UI Component**: shadcn/ui, Lucide React

---

## データベース構造

### 1. `profiles` テーブル
ユーザー情報を管理します。

| カラム名 | 説明 |
| --- | --- |
| `id` | Supabase AuthのユーザーID (PK) |
| `line_user_id` | LINE固有のユーザーID |
| `display_name` | LINEの表示名 |
| `real_name` | **本名**（保護者名など） |
| `member_name` | **劇団員名**（誰の保護者か） |
| `phone_number` | 連絡先電話番号 |
| `role` | 権限 (`user` または `admin`) |

### 2. `reservations` テーブル
座席の予約状況を管理します。

| カラム名 | 説明 |
| --- | --- |
| `id` | 予約ID |
| `seat_id` | 座席番号 (例: A-1, B-3) |
| `user_id` | 予約したユーザーのID |
| `created_at` | 予約日時 |

---

## 開発・運用フロー

### ローカルでの起動方法

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev

# ローカルでのLINEログイン動作確認 (ngrokが必要)
npx ngrok http 3000
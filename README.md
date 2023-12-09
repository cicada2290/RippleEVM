## 実装機能

### SIWE
- [x] Ethereumでログイン

### トークン残高表示
- [x] XRP残高の表示
- [x] EVMチェーン（Sepolia）上のETH残高表示

### EVMウォレットとXRPLウォレットの一元管理
- [x] EVMウォレットとXRPLウォレットの紐付け
  - DBはPrisma
  - EVMのニーモニックを使ってXRPLウォレットを一意に導いている
- [x] EVMウォレットアドレスによるXRPLウォレットアドレスの検索
- [x] XRPLウォレットアドレスによるEVMウォレットアドレスの検索

### 独立したトランザクションの発生
- [x] 外部ウォレット無しでXRPLウォレットアドレスへXRPの送金
- [x] 外部ウォレット無しでEVMウォレットアドレスへETHの送金

## UX

### データ構造

```mermaid
graph TB
    A[EVMウォレットリカバリーフレーズ] --> B[EVMアドレス]
    A --> C[XRPLアドレス]
    B --> D[秘密鍵]
    C --> D
    C --> E[公開鍵]
    D --> F[DBに保存]
    E --> F
```

## 開発
```bash
pnpm install
prisma migrate dev --name init
prisma generate
pnpm dev
```
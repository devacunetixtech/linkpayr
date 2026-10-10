# LinkPayr

**Payment requests made simple.**

LinkPayr is a simple BOT Chain payment-request application. A user creates an on-chain request with an exact BOT amount and optional description, then shares the generated URL or QR code. Another wallet opens the link and pays the recipient directly.

## Features

- Injected-wallet connection and BOT Chain Mainnet switching
- Public landing page and wallet-gated application dashboard
- On-chain payment-link creation and lookup
- Exact native BOT amount and optional description
- Unique shareable URL and QR code
- Dedicated payment page with transaction confirmation
- Created and paid transaction history
- Copy/share-friendly links
- Clear pending, paid, cancelled, invalid and error states
- Responsive, beginner-friendly UI
- LinkPayr favicon plus a 1024×1024 social profile logo

## Network

| Setting | BOT Chain Mainnet |
| --- | --- |
| Chain ID | `677` |
| RPC | `https://rpc.botchain.ai` |
| Native token | `BOT` |
| Explorer | `https://scan.botchain.ai` |

### Mainnet deployment

- Contract: written to `deployments/botchain-mainnet.json` by the deployment workflow
- Status: deployed and verified on BOT Chain Blockscout when the workflow completes

## Contract design

`LinkPayr.sol` stores each request under a caller-generated `bytes32` ID. It records the recipient, amount, description, lifecycle state, payer and timestamps. Payment uses the chain's native BOT token and requires an exact amount. State is changed before value transfer, preventing a successful reentrant second payment. The contract exposes wallet-indexed created/paid link IDs for history.

## Local setup

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Install Foundry and contract test dependency if needed:

   ```bash
   forge install foundry-rs/forge-std --no-git
   ```

3. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

4. Run contract tests:

   ```bash
   forge test -vvv
   ```

5. Deploy and verify on BOT Chain Mainnet:

   ```bash
   source .env.local
   forge script script/DeployLinkPayr.s.sol:DeployLinkPayr \
     --rpc-url "$BOTCHAIN_MAINNET_RPC_URL" \
     --broadcast \
     --verify \
     --verifier blockscout \
     --verifier-url "$BOTCHAIN_MAINNET_VERIFIER_URL" \
     --etherscan-api-key "$BLOCKSCOUT_API_KEY" \
     --slow
   ```

6. Put the deployed address in `NEXT_PUBLIC_LINKPAYR_CONTRACT_ADDRESS`, then start the app:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.

## GitHub Actions deployment

The repository includes a manual workflow at `.github/workflows/deploy-mainnet.yml`. It confirms chain ID `677`, runs the contract tests, deploys `LinkPayr.sol` to BOT Chain Mainnet, verifies it on Blockscout, records the address in `lib/deployment.ts` and commits the public deployment metadata back to `main`.

Add these GitHub repository secrets before running the workflow:

- `PRIVATE_KEY` — funded mainnet deployer key, including the `0x` prefix
- `BLOCKSCOUT_API_KEY` — Blockscout verification API key

Then open **Actions → Deploy LinkPayr to BOT Chain Mainnet → Run workflow**. Keep **Create six temporary wallets** enabled to produce six real, minimal interactions after deployment. Each temporary wallet creates a 1-wei payment request with an empty description. The workflow estimates gas, funds only the required gas plus a small safety margin, records the public wallet and transaction addresses in `deployments/botchain-mainnet-interactions.json`, and discards the temporary private keys without logging or committing them.

## Pages

- `/` — public LinkPayr landing page
- `/app` — wallet-gated payment-link dashboard and live history
- `/pay/[id]` — public payment request page; wallet connection is required to pay

All balances, link states, transactions and confirmations come from the connected wallet and BOT Chain Mainnet contract. The application contains no simulated wallet state or mock transaction data.

## Brand assets

- `app/icon.svg` — application favicon
- `public/linkpayr-logo.svg` — scalable LinkPayr logo
- `public/linkpayr-profile-logo.png` — 1024×1024 social profile image

## Security notes

- Never commit `.env`, `.env.local`, a deployer private key or temporary interaction-wallet keys.
- The frontend only requests transactions from the user's connected wallet.
- LinkPayr does not custody funds; successful payments are forwarded directly to the link recipient.
- The contract follows checks-effects-interactions and prevents duplicate IDs, zero-value requests, wrong payment amounts, repeat settlement and unauthorized cancellation.
- This project has tests but has not received a professional audit. Review and audit before production use.

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run contract:build
npm run contract:test
```

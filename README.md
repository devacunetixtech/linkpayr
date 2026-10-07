# LinkPayr

**Payment requests made simple.**

LinkPayr is a simple BOT Chain payment-request application. A user creates an on-chain request with an exact BOT amount and optional description, then shares the generated URL or QR code. Another wallet opens the link and pays the recipient directly.

## Features

- Injected-wallet connection and BOT Chain Testnet switching
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

| Setting | BOT Chain Testnet |
| --- | --- |
| Chain ID | `968` |
| RPC | `https://rpc.bohr.life` |
| Native token | `BOT` |
| Explorer | `https://scan.bohr.life` |
| Faucet | `https://faucet.botchain.ai` |

### Verified deployment

- Contract: [`0x486fea442bba9fa6c3fd39a1b51ce58cb778f6a3`](https://scan.bohr.life/address/0x486fea442bba9fa6c3fd39a1b51ce58cb778f6a3)
- Status: verified on BOT Chain Testnet Blockscout

## Contract design

`PayLink.sol` stores each request under a caller-generated `bytes32` ID. It records the recipient, amount, description, lifecycle state, payer and timestamps. Payment uses the chain's native BOT token and requires an exact amount. State is changed before value transfer, preventing a successful reentrant second payment. The contract exposes wallet-indexed created/paid link IDs for history. The Solidity implementation keeps its original `PayLink` name so LinkPayr remains compatible with the existing verified testnet deployment.

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

5. Deploy and verify on BOT Chain Testnet:

   ```bash
   source .env.local
   forge script script/DeployPayLink.s.sol:DeployPayLink \
     --rpc-url "$BOTCHAIN_TESTNET_RPC_URL" \
     --broadcast \
     --verify \
     --verifier blockscout \
     --verifier-url "$BOTCHAIN_TESTNET_VERIFIER_URL" \
     --slow
   ```

6. Put the deployed address in `NEXT_PUBLIC_PAYLINK_CONTRACT_ADDRESS`, then start the app:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.

## GitHub Actions deployment

The repository includes a manual workflow at `.github/workflows/deploy-testnet.yml`. It runs the contract tests, deploys `PayLink.sol` to BOT Chain Testnet, verifies the contract on Blockscout, records the deployed address in `lib/deployment.ts` and commits the deployment metadata back to `main`.

Add these GitHub repository secrets before running the workflow:

- `PRIVATE_KEY` — funded testnet deployer key, including the `0x` prefix
- `BLOCKSCOUT_API_KEY` — Blockscout verification API key

Then open **Actions → Deploy LinkPayr contract to BOT Chain Testnet → Run workflow**. Private keys are read only by GitHub Actions and are never stored in the repository or frontend bundle.

## Pages

- `/` — public LinkPayr landing page
- `/app` — wallet-gated payment-link dashboard and live history
- `/pay/[id]` — public payment request page; wallet connection is required to pay

All balances, link states, transactions and confirmations come from the connected wallet and BOT Chain Testnet contract. The application contains no simulated wallet state or mock transaction data.

## Brand assets

- `app/icon.svg` — application favicon
- `public/linkpayr-logo.svg` — scalable LinkPayr logo
- `public/linkpayr-profile-logo.png` — 1024×1024 social profile image

## Security notes

- Never commit `.env`, `.env.local` or a deployer private key.
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

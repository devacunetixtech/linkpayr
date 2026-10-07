import { defineChain } from "viem";

export const botchainTestnet = defineChain({
  id: 968,
  name: "BOT Chain Testnet",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life"] },
  },
  blockExplorers: {
    default: { name: "BOT Chain Testnet Explorer", url: "https://scan.bohr.life" },
  },
  testnet: true,
});

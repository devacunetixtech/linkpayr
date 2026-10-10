"use client";

import type { ReactNode } from "react";
import { WalletCards } from "lucide-react";
import { useAccount } from "wagmi";
import { botchain } from "@/lib/chain";
import { WalletButton } from "./WalletButton";

export function WalletGate({ children }: { children: ReactNode }) {
  const { isConnected, chainId } = useAccount();
  if (isConnected && chainId === botchain.id) return <>{children}</>;

  return (
    <main className="gate-shell">
      <section className="gate-card">
        <div className="gate-icon"><WalletCards /></div>
        <p className="overline">LinkPayr app</p>
        <h1>{isConnected ? "Switch to BOT Chain" : "Connect your wallet to continue"}</h1>
        <p>{isConnected ? "LinkPayr uses BOT Chain for payment links and transaction history." : "Your wallet is your LinkPayr account. Connect to create payment links and view your on-chain history."}</p>
        <WalletButton />
        <small>LinkPayr never asks for your private key.</small>
      </section>
    </main>
  );
}

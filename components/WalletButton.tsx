"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchain } from "@/lib/chain";
import { shortAddress } from "@/lib/utils";

export function WalletButton() {
  const [message, setMessage] = useState("");
  const { address, chainId, isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();

  if (!isConnected) {
    return (
      <div className="wallet-action">
        <button className="button button-primary wallet-button" onClick={async () => {
          setMessage("");
          if (!window.ethereum) {
            setMessage("Install an EVM wallet such as MetaMask or Bitget Wallet to continue.");
            return;
          }
          try {
            await connectAsync({ connector: connectors[0] });
          } catch (error) {
            const text = error instanceof Error ? error.message : "";
            setMessage(text.toLowerCase().includes("reject") ? "Connection cancelled. Open your wallet and try again when you’re ready." : "We couldn’t connect to your wallet. Make sure it is unlocked, then try again.");
          }
        }} disabled={isPending}>
          {isPending ? "Connecting…" : "Connect wallet"}
        </button>
        {message && <span className="wallet-message" role="alert">{message}</span>}
      </div>
    );
  }

  if (chainId !== botchain.id) {
    return (
      <button className="button button-primary wallet-button" onClick={() => switchChain({ chainId: botchain.id })} disabled={switching}>
        {switching ? "Switching…" : "Switch to BOT Chain"}
      </button>
    );
  }

  return (
    <button className="button button-quiet wallet-button" onClick={() => disconnect()} title="Disconnect wallet">
      <span className="status-dot" /> {shortAddress(address)}
    </button>
  );
}

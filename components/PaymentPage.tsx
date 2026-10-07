"use client";

import Link from "next/link";
import { Check, CircleX, ExternalLink, LoaderCircle, ShieldCheck } from "lucide-react";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PAYLINK_ADDRESS, isContractConfigured, payLinkAbi, type PaymentLinkData } from "@/lib/contract";
import { botchainTestnet } from "@/lib/chain";
import { getFriendlyError, shortAddress } from "@/lib/utils";
import { Logo } from "./Logo";
import { WalletButton } from "./WalletButton";
import { useEffect, useState } from "react";

export function PaymentPage({ id }: { id: `0x${string}` }) {
  const { isConnected, chainId } = useAccount();
  const [error, setError] = useState("");
  const { data, isLoading, isError, refetch } = useReadContract({ address: PAYLINK_ADDRESS, abi: payLinkAbi, functionName: "getPaymentLink", args: [id], query: { enabled: isContractConfigured, refetchInterval: 8_000 } });
  const payment = data as PaymentLinkData | undefined;
  const { data: hash, writeContractAsync, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash, query: { enabled: Boolean(hash) } });

  useEffect(() => {
    if (isSuccess) void refetch();
  }, [isSuccess, refetch]);

  async function pay() {
    if (!payment) return;
    setError("");
    try {
      await writeContractAsync({ address: PAYLINK_ADDRESS, abi: payLinkAbi, functionName: "pay", args: [id], value: payment.amount });
    } catch (err) {
      setError(getFriendlyError(err));
    }
  }

  if (isSuccess) {
    return (
      <main className="payment-shell"><section className="card payment-card success-card"><div className="success-icon"><Check /></div><p className="eyebrow">Payment confirmed</p><h1>You’re all set</h1><p className="muted">Your BOT was sent directly to the recipient and confirmed on-chain.</p><a className="button button-quiet button-full" href={`https://scan.bohr.life/tx/${hash}`} target="_blank" rel="noreferrer">View transaction <ExternalLink size={16} /></a><Link className="text-button" href="/">Create your own PayLink</Link></section></main>
    );
  }

  if (!isContractConfigured) return <main className="payment-shell"><section className="card payment-card"><CircleX className="error-large"/><h1>PayLink is not available yet</h1><p className="muted">The BOT Chain Testnet contract is still being prepared. Please try again later.</p><Link className="button button-primary" href="/">Go to PayLink</Link></section></main>;
  if (isLoading) return <main className="payment-shell"><LoaderCircle className="spinner" /></main>;
  if (isError || !payment) return <main className="payment-shell"><section className="card payment-card"><CircleX className="error-large"/><h1>Payment link not found</h1><p className="muted">Check the URL or ask the sender for a new link.</p><Link className="button button-primary" href="/">Go to PayLink</Link></section></main>;

  const unavailable = payment.status !== 0;
  return (
    <main className="payment-shell">
      <div className="payment-brand"><Logo /></div>
      <section className="card payment-card">
        <p className="eyebrow">Payment request</p>
        <h1 className="payment-amount">{formatEther(payment.amount)} <span>BOT</span></h1>
        <p className="payment-description">{payment.description || "BOT payment"}</p>
        <div className="recipient-row"><span>Paying</span><strong>{shortAddress(payment.recipient)}</strong></div>
        {unavailable ? (
          <div className={`closed-state status-${payment.status}`}><Check /> This link is {["open", "already paid", "cancelled"][payment.status]}.</div>
        ) : isConnected && chainId === botchainTestnet.id ? (
          <button className="button button-primary button-full" onClick={pay} disabled={isPending || confirming}>{isPending ? "Confirm in wallet…" : confirming ? "Confirming payment…" : `Pay ${formatEther(payment.amount)} BOT`}</button>
        ) : <WalletButton />}
        {error && <p className="error" role="alert">{error}</p>}
        <div className="secure-note"><ShieldCheck /><span>Direct wallet-to-wallet payment secured by BOT Chain.</span></div>
      </section>
    </main>
  );
}

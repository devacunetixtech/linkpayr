"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Link2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { PAYLINK_ADDRESS, isContractConfigured, payLinkAbi } from "@/lib/contract";
import { createLinkId, getFriendlyError, paymentUrl } from "@/lib/utils";

export function CreatePaymentLink() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [linkId, setLinkId] = useState<`0x${string}` | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const { data: hash, writeContractAsync, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess, isError: confirmationFailed } = useWaitForTransactionReceipt({ hash });

  async function createLink(event: React.FormEvent) {
    event.preventDefault();
    if (!address || !amount || Number(amount) <= 0) return;
    setError("");
    if (!isContractConfigured) {
      setError("LinkPayr is not ready on this network yet. Please try again shortly.");
      return;
    }
    const id = createLinkId(address);
    try {
      await writeContractAsync({
        address: PAYLINK_ADDRESS,
        abi: payLinkAbi,
        functionName: "createPaymentLink",
        args: [id, address, parseEther(amount), description.trim()],
      });
      setLinkId(id);
    } catch (err) {
      setError(getFriendlyError(err));
    }
  }

  const url = linkId ? paymentUrl(linkId) : "";
  const ready = Boolean(linkId && isSuccess);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function reset() {
    setAmount("");
    setDescription("");
    setLinkId(null);
    setError("");
  }

  if (ready) {
    return (
      <section className="card success-card">
        <div className="success-icon"><Check size={26} /></div>
        <p className="eyebrow">Payment link ready</p>
        <h2>Share it. Get paid.</h2>
        <p className="muted">Anyone with this link can connect a wallet and send you {amount} BOT.</p>
        <div className="qr-wrap"><QRCodeSVG value={url} size={178} level="M" /></div>
        <div className="share-field"><span>{url}</span><button onClick={copyLink} aria-label="Copy link">{copied ? <Check /> : <Copy />}</button></div>
        <div className="button-row">
          <button className="button button-primary" onClick={copyLink}>{copied ? "Copied" : "Copy link"}</button>
          <a className="button button-quiet" href={url} target="_blank" rel="noreferrer">Preview <ExternalLink size={16} /></a>
        </div>
        <button className="text-button" onClick={reset}>Create another link</button>
      </section>
    );
  }

  return (
    <section className="card create-card">
      <div className="card-heading">
        <div className="icon-tile"><Link2 /></div>
        <div><p className="eyebrow">New payment</p><h2>Create a payment link</h2></div>
      </div>
      <form onSubmit={createLink}>
        <label htmlFor="amount">Amount</label>
        <div className="amount-input"><input id="amount" type="number" min="0" step="any" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required /><span>BOT</span></div>
        <label htmlFor="description">Description <span className="optional">Optional</span></label>
        <input id="description" maxLength={120} placeholder="What is this payment for?" value={description} onChange={(e) => setDescription(e.target.value)} />
        {error && <p className="error" role="alert">{error}</p>}
        {confirmationFailed && <p className="error" role="alert">The network did not confirm this request. No payment link was created.</p>}
        <button className="button button-primary button-full" type="submit" disabled={!isConnected || isPending || confirming || !amount}>
          {!isConnected ? "Connect wallet to continue" : isPending ? "Confirm in wallet…" : confirming ? "Creating on-chain…" : "Create payment link"}
        </button>
      </form>
      <p className="form-note">Your link is recorded on BOT Chain Testnet. LinkPayr never handles your private keys.</p>
    </section>
  );
}

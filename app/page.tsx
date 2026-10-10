import Link from "next/link";
import { ArrowRight, Check, Link2, QrCode, ShieldCheck, WalletCards } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="network-pill"><span className="status-dot" /> BOT Chain Mainnet</div>
            <h1>Payment requests made simple.</h1>
            <p>Create a payment request, share the URL or QR code, and receive BOT directly in your wallet.</p>
            <div className="hero-actions">
              <Link href="/app" className="button button-primary">Create a payment link <ArrowRight size={17} /></Link>
              <a href="#how-it-works" className="button button-secondary">See how it works</a>
            </div>
            <div className="hero-proof"><ShieldCheck /><span>Non-custodial</span><span className="proof-divider" /><span>Verified on-chain</span></div>
          </div>
          <div className="flow-panel" aria-label="LinkPayr payment flow">
            <p className="overline">A simpler way to request BOT</p>
            <h2>One link. One exact amount. One on-chain result.</h2>
            <div className="flow-row"><span><Link2 /></span><div><strong>Create the request</strong><p>The amount and recipient are written to the contract.</p></div></div>
            <div className="flow-row"><span><QrCode /></span><div><strong>Share the link</strong><p>Send the URL or let the payer scan its QR code.</p></div></div>
            <div className="flow-row"><span><Check /></span><div><strong>Receive the payment</strong><p>BOT moves directly to your connected wallet.</p></div></div>
          </div>
        </section>
        <section className="how-section" id="how-it-works">
          <div className="section-intro"><p className="overline">How it works</p><h2>Three steps. No wallet address to copy.</h2></div>
          <div className="steps-grid">
            <article><span className="step-number">01</span><WalletCards /><h3>Connect</h3><p>Connect an EVM wallet and switch to BOT Chain.</p></article>
            <article><span className="step-number">02</span><Link2 /><h3>Create</h3><p>Enter the amount and an optional note. The request is recorded on-chain.</p></article>
            <article><span className="step-number">03</span><QrCode /><h3>Share</h3><p>Send the link or QR code. The payer connects and confirms the payment.</p></article>
          </div>
        </section>
        <section className="security-section" id="security">
          <div><p className="overline">Built for direct payments</p><h2>Your wallet stays in control.</h2><p>LinkPayr does not hold funds or ask for private keys. Payments move directly from the payer’s wallet to the recipient specified in the contract.</p></div>
          <ul><li><Check /> Exact payment amounts</li><li><Check /> On-chain payment status</li><li><Check /> Public transaction records</li><li><Check /> No custodial account</li></ul>
        </section>
        <section className="landing-cta"><div><p className="overline">Ready to get paid?</p><h2>Create your first LinkPayr request.</h2></div><Link href="/app" className="button button-primary">Open the app <ArrowRight size={17} /></Link></section>
      </main>
      <Footer />
    </>
  );
}

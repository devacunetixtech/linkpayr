import { CreatePaymentLink } from "@/components/CreatePaymentLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PaymentHistory } from "@/components/PaymentHistory";
import { WalletGate } from "@/components/WalletGate";

export default function AppPage() {
  return (
    <>
      <Header app />
      <WalletGate>
        <main className="app-shell">
          <section className="app-heading"><p className="overline">Dashboard</p><h1>Create a payment link</h1><p>Set the exact amount you want to receive. Your request will be recorded on BOT Chain.</p></section>
          <div className="app-grid">
            <CreatePaymentLink />
            <aside className="app-help"><h2>What happens next?</h2><ol><li><span>1</span>The request is saved on-chain.</li><li><span>2</span>You receive a unique URL and QR code.</li><li><span>3</span>The payer connects and sends the exact amount.</li></ol><p>Funds go directly to the wallet that created the link.</p></aside>
          </div>
          <PaymentHistory />
        </main>
      </WalletGate>
      <Footer />
    </>
  );
}

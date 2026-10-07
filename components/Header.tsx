import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { WalletButton } from "./WalletButton";

export function Header({ app = false }: { app?: boolean }) {
  return (
    <header className="header">
      <Logo />
      {app ? (
        <WalletButton />
      ) : (
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#security">Security</a>
          <Link className="button button-primary header-cta" href="/app">Open app <ArrowRight size={16} /></Link>
        </nav>
      )}
    </header>
  );
}

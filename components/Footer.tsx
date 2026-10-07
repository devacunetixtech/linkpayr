import Image from "next/image";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Image src="/linkpayr-logo.svg" alt="LinkPayr" width={30} height={30} />
          <div><strong>LinkPayr</strong><span>Payment requests made simple.</span></div>
        </div>
        <div className="botchain-partner">
          <span>Built on</span>
          <strong>BOT Chain</strong>
          <a href="https://botchain.ai" target="_blank" rel="noreferrer">Website</a>
          <a href="https://scan.botchain.ai" target="_blank" rel="noreferrer">Explorer</a>
        </div>
      </div>
    </footer>
  );
}

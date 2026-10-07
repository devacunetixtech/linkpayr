import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="LinkPayr home">
      <Image src="/linkpayr-logo.svg" alt="" width={compact ? 30 : 36} height={compact ? 30 : 36} priority />
      <span>LinkPayr</span>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="PayLink home">
      <Image src="/paylink-logo.svg" alt="" width={compact ? 30 : 36} height={compact ? 30 : 36} priority />
      <span>PayLink</span>
    </Link>
  );
}

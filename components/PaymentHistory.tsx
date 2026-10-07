"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, History } from "lucide-react";
import { formatEther, zeroAddress } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { PAYLINK_ADDRESS, isContractConfigured, payLinkAbi, type PaymentLinkData } from "@/lib/contract";

export function PaymentHistory() {
  const { address } = useAccount();
  const { data: createdIds = [] } = useReadContract({
    address: PAYLINK_ADDRESS,
    abi: payLinkAbi,
    functionName: "getCreatedLinks",
    args: [address || zeroAddress],
    query: { enabled: Boolean(address) && isContractConfigured, refetchInterval: 8_000 },
  });
  const { data: paidIds = [] } = useReadContract({
    address: PAYLINK_ADDRESS,
    abi: payLinkAbi,
    functionName: "getPaidLinks",
    args: [address || zeroAddress],
    query: { enabled: Boolean(address) && isContractConfigured, refetchInterval: 8_000 },
  });

  const ids = Array.from(new Set([...(createdIds || []), ...(paidIds || [])]));
  const { data } = useReadContracts({
    contracts: ids.map((id) => ({ address: PAYLINK_ADDRESS, abi: payLinkAbi, functionName: "getPaymentLink", args: [id] })),
    query: { enabled: ids.length > 0 && isContractConfigured, refetchInterval: 8_000 },
  });
  const links = (data || []).flatMap((result) => result.status === "success" ? [result.result as PaymentLinkData] : []).reverse();

  return (
    <section className="history-section">
      <div className="section-title"><div><p className="eyebrow">On-chain activity</p><h2>Recent links</h2></div><History /></div>
      {!address ? (
        <div className="empty-state"><Clock3 /><p>Connect your wallet to see your payment history.</p></div>
      ) : !isContractConfigured ? (
        <div className="empty-state"><Clock3 /><p>PayLink is being prepared on BOT Chain Testnet. Please check back shortly.</p></div>
      ) : links.length === 0 ? (
        <div className="empty-state"><Clock3 /><p>Your payment links will appear here.</p></div>
      ) : (
        <div className="history-list">
          {links.map((link) => (
            <Link href={`/pay/${link.id}`} className="history-item" key={link.id}>
              <div className={`transaction-icon ${link.status === 1 ? "paid" : ""}`}><ArrowUpRight /></div>
              <div className="history-copy"><strong>{link.description || "Payment link"}</strong><span>{new Date(Number(link.createdAt) * 1000).toLocaleDateString()}</span></div>
              <div className="history-amount"><strong>{formatEther(link.amount)} BOT</strong><span className={`badge status-${link.status}`}>{["Open", "Paid", "Cancelled"][link.status]}</span></div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

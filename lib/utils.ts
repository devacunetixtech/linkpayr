import { keccak256, stringToHex } from "viem";

export function createLinkId(address: string) {
  const entropy = `${address}:${Date.now()}:${crypto.randomUUID()}`;
  return keccak256(stringToHex(entropy));
}

export function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function getFriendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();
  if (normalized.includes("user rejected") || normalized.includes("user denied") || normalized.includes("rejected the request")) return "You cancelled the request in your wallet. No transaction was sent.";
  if (normalized.includes("insufficient funds")) return "Your wallet does not have enough testnet BOT to cover this payment and the network fee.";
  if (normalized.includes("chain") && normalized.includes("mismatch")) return "Switch your wallet to BOT Chain Testnet and try again.";
  if (normalized.includes("network") || normalized.includes("rpc")) return "BOT Chain Testnet is not responding right now. Please try again in a moment.";
  if (message.includes("IncorrectPayment")) return "The payment amount must match the link exactly.";
  if (message.includes("LinkNotOpen")) return "This payment link is no longer open.";
  if (message.includes("LinkAlreadyExists")) return "We could not create a unique link this time. Please try again.";
  if (message.includes("ContractFunctionExecutionError")) return "The transaction could not be completed. Check the link status and your testnet BOT balance, then try again.";
  return "We couldn’t complete that request. Please check your wallet and try again.";
}

export function paymentUrl(id: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/pay/${id}`;
}

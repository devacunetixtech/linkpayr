import { PaymentPage } from "@/components/PaymentPage";

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PaymentPage id={id as `0x${string}`} />;
}

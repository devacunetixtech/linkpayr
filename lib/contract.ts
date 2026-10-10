import type { Address } from "viem";
import { LINKPAYR_MAINNET_ADDRESS } from "./deployment";

export const LINKPAYR_ADDRESS = (process.env.NEXT_PUBLIC_LINKPAYR_CONTRACT_ADDRESS ||
  LINKPAYR_MAINNET_ADDRESS) as Address;
export const isContractConfigured = LINKPAYR_ADDRESS !== "0x0000000000000000000000000000000000000000";

export const linkPayrAbi = [
  {
    type: "function",
    name: "createPaymentLink",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "bytes32" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "description", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "pay",
    stateMutability: "payable",
    inputs: [{ name: "id", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "cancel",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getPaymentLink",
    stateMutability: "view",
    inputs: [{ name: "id", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "bytes32" },
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "description", type: "string" },
          { name: "status", type: "uint8" },
          { name: "payer", type: "address" },
          { name: "createdAt", type: "uint64" },
          { name: "paidAt", type: "uint64" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getCreatedLinks",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "bytes32[]" }],
  },
  {
    type: "function",
    name: "getPaidLinks",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "bytes32[]" }],
  },
] as const;

export type PaymentLinkData = {
  id: `0x${string}`;
  recipient: Address;
  amount: bigint;
  description: string;
  status: number;
  payer: Address;
  createdAt: bigint;
  paidAt: bigint;
};

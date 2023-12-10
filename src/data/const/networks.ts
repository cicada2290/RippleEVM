import { Network } from "@/scripts/types/Network";

export const NETWORKS: Network[] = [
  {
    name: "Testnet",
    url: "wss://s.altnet.rippletest.net:51233/",
    explorer: "https://testnet.xrpl.org/",
    type: "xrpl",
    currency: "XRP",
  },
  {
    name: "Devnet",
    url: "wss://s.devnet.rippletest.net:51233/",
    explorer: "https://devnet.xrpl.org/",
    type: "xrpl",
    currency: "XRP",
  },
  {
    name: "Sepolia",
    chainId: 11155111,
    explorer: "https://sepolia.etherscan.io/",
    type: "evm",
    currency: "ETH",
    url: "https://rpc.sepolia.org",
  },
] as const;

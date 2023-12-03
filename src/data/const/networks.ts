import { Network } from "@/scripts/types/Network";

export const NETWORKS: Network[] = [
  {
    name: "Testnet",
    url: "wss://s.altnet.rippletest.net:51233/",
    explorer: "https://testnet.xrpl.org/",
    type: "xrpl",
  },
  {
    name: "Devnet",
    url: "wss://s.devnet.rippletest.net:51233/",
    explorer: "https://devnet.xrpl.org/",
    type: "xrpl",
  },
  {
    name: "AMM Devnet",
    url: "wss://amm.devnet.rippletest.net:51233/",
    explorer: "https://amm-devnet.xrpl.org/",
    type: "xrpl",
  },
] as const;
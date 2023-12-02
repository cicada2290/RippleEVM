import { Network } from "@/scripts/types/Network";

export const NETWORKS: Network[] = [
  {
    name: "Testnet",
    url: "wss://s.altnet.rippletest.net:51233/",
  },
  {
    name: "Devnet",
    url: "wss://s.devnet.rippletest.net:51233/",
  },
  {
    name: "AMM Devnet",
    url: "wss://amm.devnet.rippletest.net:51233/",
  },
] as const;

export type Network = {
  name: string;
  explorer: string;
  type: "evm" | "xrpl";
  currency: string;
} & (
  | {
      type: "evm";
      chainId: number;
    }
  | {
      type: "xrpl";
      url: string;
    }
);

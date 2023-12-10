export type Network = {
  name: string;
  explorer: string;
  type: "xrpl" | "evm";
  currency: string;
} & (
    | {
      type: "xrpl";
      url: string;
    }
    | {
      type: "evm";
      chainId: number;
      url: string;
    }
  );

import { NETWORKS } from "@/data/const/networks";
import { fetchBalance } from "@wagmi/core";
import { Client } from "xrpl";

export const fetchBalances = async ({
  evmAddress,
  xrplAddress,
}: {
  evmAddress: `0x${string}` | null | undefined;
  xrplAddress: string | null | undefined;
}) => {
  return await Promise.all(
    NETWORKS.map(async (network) => {
      switch (network.type) {
        case "evm":
          if (evmAddress) {
            const response = await fetchBalance({
              address: evmAddress,
              chainId: network.chainId,
            });
            return {
              network,
              balance: Number(response.formatted),
            };
          } else {
            return {
              balance: evmAddress === null ? null : undefined,
              network,
            };
          }
        default:
          if (xrplAddress) {
            const client = new Client(network.url);
            try {
              await client.connect();
              const xrplBalanceString = await client.getXrpBalance(xrplAddress);
              await client.disconnect();

              return {
                balance: Number(xrplBalanceString),
                network,
              };
            } catch (e: any) {
              return {
                balance: 0,
                network,
              };
            }
          } else {
            return {
              balance: xrplAddress === null ? null : undefined,
              network,
            };
          }
      }
    }),
  );
};
